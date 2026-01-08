import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://metal.ajoo.me';

// Create axios instance
export const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get token from localStorage
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error:any) => {
    return Promise.reject(error);
  }
);

// Response interceptor for token refresh and unwrapping data
apiClient.interceptors.response.use(
  (response: any) => {
    // Unwrap the data from backend response structure
    // Backend returns: { success: true, data: {...}, errors: null }
    // We want to return just the data part
    if (response.data && response.data.data !== undefined) {
      response.data = response.data.data;
    }
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // If 401 and we haven't retried yet, try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refresh_token') : null;

        if (refreshToken) {
          // Call refresh token endpoint
          const response = await axios.post(`${API_BASE_URL}/api/auth/token/refresh/`, {
            refresh: refreshToken,
          });

          const { access } = response.data.data || response.data;

          // Save new access token
          if (typeof window !== 'undefined') {
            localStorage.setItem('access_token', access);
          }

          // Retry original request with new token
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${access}`;
          }

          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, clear tokens and redirect to login
        if (typeof window !== 'undefined') {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('user');
          window.location.href = '/auth';
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Helper to handle API errors
export interface ApiError {
  code: string;
  message: string;
  details?: Array<{ field: string; message: string }>;
}

export const handleApiError = (error: unknown): ApiError => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ success?: boolean; errors?: any; message?: string; error?: ApiError; data?: any }>;

    if (axiosError.response?.data?.error) {
      return axiosError.response.data.error;
    }

    if (axiosError.response?.status === 401) {
      return {
        code: 'UNAUTHORIZED',
        message: 'Authentication required. Please log in.',
      };
    }

    if (axiosError.response?.status === 403) {
      return {
        code: 'FORBIDDEN',
        message: 'You do not have permission to perform this action.',
      };
    }

    if (axiosError.response?.status === 404) {
      return {
        code: 'NOT_FOUND',
        message: 'The requested resource was not found.',
      };
    }

    if (axiosError.response?.status === 500) {
      return {
        code: 'SERVER_ERROR',
        message: 'A server error occurred. Please try again later.',
      };
    }

    return {
      code: 'UNKNOWN_ERROR',
      message: axiosError.message || 'An unexpected error occurred.',
    };
  }

  return {
    code: 'UNKNOWN_ERROR',
    message: 'An unexpected error occurred.',
  };
};

export default apiClient;
