import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import settingsService, { UserProfile, PayoutDetails, SupportTicket } from '../lib/api/services/settingsService';

// Profile Hooks
export const useUserProfile = () => {
    return useQuery({
        queryKey: ['userProfile'],
        queryFn: () => settingsService.getUserProfile(),
    });
};

export const useUpdateProfile = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: {
            name?: string;
            phone?: string;
            country?: string;
            city?: string;
        }) => settingsService.updateUserProfile(data),
        onSuccess: (data) => {
            queryClient.setQueryData(['userProfile'], data);
            queryClient.invalidateQueries({ queryKey: ['userProfile'] });
        },
    });
};

export const useUploadProfilePicture = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (file: File) => settingsService.uploadProfilePicture(file),
        onSuccess: (data) => {
            // Update the cached profile with new picture
            queryClient.setQueryData(['userProfile'], (old: UserProfile | undefined) => {
                if (old) {
                    return { ...old, profilePicture: data.profilePicture };
                }
                return old;
            });
            queryClient.invalidateQueries({ queryKey: ['userProfile'] });
        },
    });
};

// Security Hooks
export const useChangeEmail = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: { newEmail: string; currentPassword: string }) =>
            settingsService.changeEmail(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['userProfile'] });
        },
    });
};

export const useChangePassword = () => {
    return useMutation({
        mutationFn: (data: { currentPassword: string; newPassword: string }) =>
            settingsService.changePassword(data),
    });
};

// Payout Hooks
export const usePayoutDetails = () => {
    return useQuery({
        queryKey: ['payoutDetails'],
        queryFn: () => settingsService.getPayoutDetails(),
    });
};

export const useUpdatePayoutDetails = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: {
            paymentMethod?: string;
            accountHolderName: string;
            bankName?: string;
            accountNumber: string;
            routingNumber?: string;
        }) => settingsService.updatePayoutDetails(data),
        onSuccess: (data) => {
            queryClient.setQueryData(['payoutDetails'], data);
            queryClient.invalidateQueries({ queryKey: ['payoutDetails'] });
        },
    });
};

// Account Management
export const useDeleteAccount = () => {
    return useMutation({
        mutationFn: (data: { reason?: string; password: string }) =>
            settingsService.deleteAccount(data),
    });
};

// Support Hooks
export const useCreateSupportTicket = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: {
            subject: string;
            email: string;
            message: string;
            category?: string;
        }) => settingsService.createSupportTicket(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['supportTickets'] });
        },
    });
};

export const useSupportTickets = () => {
    return useQuery({
        queryKey: ['supportTickets'],
        queryFn: () => settingsService.getSupportTickets(),
    });
};
