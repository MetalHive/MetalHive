import { useAuthStore } from '../stores/AuthStore';

export const useAuth = () => {
    const {
        user,
        isAuthenticated,
        isLoading,
        error,
        login,
        registerSeller,
        registerBuyer,
        logout,
        clearError,
    } = useAuthStore();

    const isSeller = user?.role === 'SELLER';
    const isBuyer = user?.role === 'BUYER';

    return {
        user,
        isAuthenticated,
        isLoading,
        error,
        isSeller,
        isBuyer,
        login,
        registerSeller,
        registerBuyer,
        logout,
        clearError,
    };
};
