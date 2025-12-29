// Authentication utilities

export interface User {
    id: number;
    email: string;
    role: 'BUYER' | 'SELLER';
    date_joined: string;
}

export interface AuthTokens {
    access: string;
    refresh: string;
}

export interface AuthResponse {
    user: User;
    tokens: AuthTokens;
}

// Save authentication data to localStorage
export const saveAuth = (authData: AuthResponse): void => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('access_token', authData.tokens.access);
        localStorage.setItem('refresh_token', authData.tokens.refresh);
        localStorage.setItem('user', JSON.stringify(authData.user));
    }
};

// Get user from localStorage
export const getStoredUser = (): User | null => {
    if (typeof window !== 'undefined') {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                return JSON.parse(userStr);
            } catch {
                return null;
            }
        }
    }
    return null;
};

// Get access token
export const getAccessToken = (): string | null => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('access_token');
    }
    return null;
};

// Get refresh token
export const getRefreshToken = (): string | null => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('refresh_token');
    }
    return null;
};

// Clear authentication data
export const clearAuth = (): void => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
    }
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
    return !!getAccessToken();
};

// Check if user is a seller
export const isSeller = (): boolean => {
    const user = getStoredUser();
    return user?.role === 'SELLER';
};

// Check if user is a buyer
export const isBuyer = (): boolean => {
    const user = getStoredUser();
    return user?.role === 'BUYER';
};
