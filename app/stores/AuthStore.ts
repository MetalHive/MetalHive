import { create } from 'zustand';
import { User, AuthResponse } from '../lib/api/auth';
import { getErrorMessage } from '../lib/api/client';
import authService, { LoginCredentials, SellerRegistrationData, BuyerRegistrationData } from '../lib/api/services/authService';

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    /** True once the stored session has been read on the client. */
    isInitialized: boolean;
    isLoading: boolean;
    error: string | null;

    // Actions
    login: (credentials: LoginCredentials) => Promise<void>;
    registerSeller: (data: SellerRegistrationData) => Promise<void>;
    registerBuyer: (data: BuyerRegistrationData) => Promise<void>;
    logout: () => Promise<void>;
    setUser: (user: User | null) => void;
    setInitialized: (value: boolean) => void;
    clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,
    isInitialized: false,
    isLoading: false,
    error: null,

    login: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null });
        try {
            const authData: AuthResponse = await authService.login(credentials);
            set({
                user: authData.user,
                isAuthenticated: true,
                isInitialized: true,
                isLoading: false,
                error: null
            });
        } catch (error: unknown) {
            set({
                error: getErrorMessage(error, 'Login failed. Please check your email and password.'),
                isLoading: false,
                isAuthenticated: false
            });
            throw error;
        }
    },

    registerSeller: async (data: SellerRegistrationData) => {
        set({ isLoading: true, error: null });
        try {
            const authData: AuthResponse = await authService.registerSeller(data);
            set({
                user: authData.user,
                isAuthenticated: true,
                isInitialized: true,
                isLoading: false,
                error: null
            });
        } catch (error: unknown) {
            set({
                error: getErrorMessage(error, 'Registration failed. Please try again.'),
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
                isInitialized: true,
                isLoading: false,
                error: null
            });
        } catch (error: unknown) {
            set({
                error: getErrorMessage(error, 'Registration failed. Please try again.'),
                isLoading: false,
                isAuthenticated: false
            });
            throw error;
        }
    },

    logout: async () => {
        await authService.logout();
        set({
            user: null,
            isAuthenticated: false,
            error: null
        });
        if (typeof window !== 'undefined') {
            window.location.href = '/signin';
        }
    },

    setUser: (user: User | null) => {
        set({
            user,
            isAuthenticated: !!user
        });
    },

    setInitialized: (value: boolean) => {
        set({ isInitialized: value });
    },

    clearError: () => {
        set({ error: null });
    },
}));
