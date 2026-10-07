import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

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
  (error: unknown) => {
    return Promise.reject(error);
  }
);

// Response interceptor for token refresh and unwrapping data
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Unwrap the data from backend response structure
    // Backend returns: { success: true, message, data: {...}, errors: null }
    // We want to return just the data part
    if (response.data && response.data.data !== undefined) {
      response.data = response.data.data;
    }
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // If 401 and we haven't retried yet, try to refresh token
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
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
          window.location.href = '/signin';
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Helper to handle API errors
export interface ApiErrorDetail {
  field: string;
  message: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: ApiErrorDetail[];
}

/**
 * Shape of the backend error envelope:
 * { success: false, message, data: null, errors: { code, details: [{field, message}] } }
 */
interface ErrorEnvelope {
  success?: boolean;
  message?: string;
  errors?: {
    code?: string;
    details?: ApiErrorDetail[];
  } | null;
}

const STATUS_FALLBACKS: Record<number, ApiError> = {
  401: { code: 'UNAUTHORIZED', message: 'Authentication required. Please log in.' },
  403: { code: 'FORBIDDEN', message: 'You do not have permission to perform this action.' },
  404: { code: 'NOT_FOUND', message: 'The requested resource was not found.' },
  500: { code: 'SERVER_ERROR', message: 'A server error occurred. Please try again later.' },
};

export const handleApiError = (error: unknown): ApiError => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ErrorEnvelope>;
    const body = axiosError.response?.data;
    const status = axiosError.response?.status;

    const details = Array.isArray(body?.errors?.details) ? body?.errors?.details : undefined;
    const code = body?.errors?.code || (status && STATUS_FALLBACKS[status]?.code) || 'UNKNOWN_ERROR';

    // Prefer the backend's own message; fall back to the first field error,
    // then to a status-based generic message.
    let message = typeof body?.message === 'string' && body.message.trim() ? body.message : '';
    if (!message && details && details.length > 0) {
      message = details.map((d) => (d.field ? `${d.field}: ${d.message}` : d.message)).join(' ');
    }
    if (!message && status && STATUS_FALLBACKS[status]) {
      message = STATUS_FALLBACKS[status].message;
    }
    if (!message) {
      message = axiosError.message || 'An unexpected error occurred.';
    }

    return { code, message, details };
  }

  if (error instanceof Error && error.message) {
    return { code: 'UNKNOWN_ERROR', message: error.message };
  }

  return {
    code: 'UNKNOWN_ERROR',
    message: 'An unexpected error occurred.',
  };
};

/** Convenience: just the human-readable message, with an optional fallback. */
export const getErrorMessage = (error: unknown, fallback?: string): string => {
  const parsed = handleApiError(error);
  if (parsed.code === 'UNKNOWN_ERROR' && fallback) {
    return parsed.message === 'An unexpected error occurred.' ? fallback : parsed.message;
  }
  return parsed.message || fallback || 'An unexpected error occurred.';
};

/** The backend's error code (e.g. BUYER_NOT_VERIFIED), if any. */
export const getErrorCode = (error: unknown): string | undefined => {
  if (axios.isAxiosError(error)) {
    const body = (error as AxiosError<ErrorEnvelope>).response?.data;
    return body?.errors?.code ?? undefined;
  }
  return undefined;
};

/** Field-level errors keyed by field name, for inline form display. */
export const getFieldErrors = (error: unknown): Record<string, string> => {
  const { details } = handleApiError(error);
  if (!details) return {};
  return details.reduce<Record<string, string>>((acc, d) => {
    if (d.field) acc[d.field] = d.message;
    return acc;
  }, {});
};

export default apiClient;
