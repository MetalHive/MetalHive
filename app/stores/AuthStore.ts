import { create } from 'zustand';
import { User, AuthResponse } from '../lib/api/auth';
import authService, { LoginCredentials, SellerRegistrationData, BuyerRegistrationData } from '../lib/api/services/authService';

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;

    // Actions
    login: (credentials: LoginCredentials) => Promise<void>;
    registerSeller: (data: SellerRegistrationData) => Promise<void>;
    registerBuyer: (data: BuyerRegistrationData) => Promise<void>;
    logout: () => void;
    setUser: (user: User | null) => void;
    clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,

    login: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null });
        try {
            const authData: AuthResponse = await authService.login(credentials);
            set({
                user: authData.user,
                isAuthenticated: true,
                isLoading: false,
                error: null
            });
        } catch (error: any) {
            set({
                error: error.response?.data?.error?.message || 'Login failed',
                isLoading: false,
                isAuthenticated: false
            });
            throw error;
        }
    },

    registerSeller: async (data: SellerRegistrationData) => {
        set({ isLoading: true, error: null });
        try {
            console.log('[AuthStore] Starting seller registration...');
            const authData: AuthResponse = await authService.registerSeller(data);
            console.log('[AuthStore] Registration successful, received:', authData);

            set({
                user: authData.user,
                isAuthenticated: true,
                isLoading: false,
                error: null
            });
            console.log('[AuthStore] State updated successfully');
        } catch (error: any) {
            console.error('[AuthStore] Registration error:', error);
            console.error('[AuthStore] Error response:', error.response);

            const errorMessage = error.response?.data?.error?.message
                || error.response?.data?.message
                || error.message
                || 'Registration failed';

            set({
                error: errorMessage,
                isLoading: false,
                isAuthenticated: false
            });
            throw error;
        }
    },

    registerBuyer: async (data: BuyerRegistrationData) => {
        set({ isLoading: true, error: null });
        try {
            const authData: AuthResponse = await authService.registerBuyer(data);
            set({
                user: authData.user,
                isAuthenticated: true,
                isLoading: false,
                error: null
            });
        } catch (error: any) {
            set({
                error: error.response?.data?.error?.message || 'Registration failed',
                isLoading: false,
                isAuthenticated: false
            });
            throw error;
        }
    },

    logout: () => {
        authService.logout();
        set({
            user: null,
            isAuthenticated: false,
            error: null
        });
    },

    setUser: (user: User | null) => {
        set({
            user,
            isAuthenticated: !!user
        });
    },

    clearError: () => {
        set({ error: null });
    },
}));
