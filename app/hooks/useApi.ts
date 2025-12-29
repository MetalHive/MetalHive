import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    dashboardService,
    listingsService,
    bidsService,
    walletService,
    historyService,
} from '../lib/api/services';

// Dashboard hooks
export const useDashboardStats = (period: '24hours' | '7days' | '2weeks' | '30days' = '30days') => {
    return useQuery({
        queryKey: ['dashboardStats', period],
        queryFn: () => dashboardService.getStats(period),
    });
};

// Listings hooks
export const useListings = (params?: {
    status?: 'active' | 'inactive' | 'sold' | 'draft' | 'all';
    search?: string;
    page?: number;
    limit?: number;
}) => {
    return useQuery({
        queryKey: ['listings', params],
        queryFn: () => listingsService.getListings(params),
    });
};

export const useListingDetail = (id: string) => {
    return useQuery({
        queryKey: ['listing', id],
        queryFn: () => listingsService.getListingById(id),
        enabled: !!id,
    });
};

export const useCreateListing = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: listingsService.createListing,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['listings'] });
            queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
        },
    });
};

export const useUpdateListing = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) =>
            listingsService.updateListing(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['listing', variables.id] });
            queryClient.invalidateQueries({ queryKey: ['listings'] });
        },
    });
};

export const usePublishListing = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => listingsService.publishListing(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: ['listing', id] });
            queryClient.invalidateQueries({ queryKey: ['listings'] });
            queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
        },
    });
};

export const useDeleteListing = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => listingsService.deleteListing(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['listings'] });
            queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
        },
    });
};

// Bids hooks
export const useBids = (params?: {
    status?: 'pending' | 'accepted' | 'rejected' | 'countered' | 'all';
    listingId?: string;
    search?: string;
    page?: number;
    limit?: number;
}) => {
    return useQuery({
        queryKey: ['bids', params],
        queryFn: () => bidsService.getBids(params),
    });
};

export const useBidDetail = (id: string) => {
    return useQuery({
        queryKey: ['bid', id],
        queryFn: () => bidsService.getBidById(id),
        enabled: !!id,
    });
};

export const useAcceptBid = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: { acceptedPrice: number; notes?: string } }) =>
            bidsService.acceptBid(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['bid', variables.id] });
            queryClient.invalidateQueries({ queryKey: ['bids'] });
            queryClient.invalidateQueries({ queryKey: ['listings'] });
            queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
            queryClient.invalidateQueries({ queryKey: ['wallet'] });
        },
    });
};

export const useRejectBid = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, reason }: { id: string; reason: string }) =>
            bidsService.rejectBid(id, reason),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['bid', variables.id] });
            queryClient.invalidateQueries({ queryKey: ['bids'] });
        },
    });
};

export const useCounterOffer = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: { counterPrice: number; counterPriceUnit: string; message?: string } }) =>
            bidsService.counterOffer(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['bid', variables.id] });
            queryClient.invalidateQueries({ queryKey: ['bids'] });
        },
    });
};

// Wallet hooks
export const useWalletSummary = () => {
    return useQuery({
        queryKey: ['wallet'],
        queryFn: () => walletService.getWalletSummary(),
    });
};

export const useMonthlyEarnings = (year?: number) => {
    return useQuery({
        queryKey: ['earnings', year],
        queryFn: () => walletService.getMonthlyEarnings(year),
    });
};

export const useTransactions = (params?: {
    type?: 'earning' | 'withdrawal' | 'all';
    page?: number;
    limit?: number;
}) => {
    return useQuery({
        queryKey: ['transactions', params],
        queryFn: () => walletService.getTransactions(params),
    });
};

export const useRequestWithdrawal = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: { amount: number; bankAccountId: string; notes?: string }) =>
            walletService.requestWithdrawal(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['wallet'] });
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
        },
    });
};

// History hooks
export const useSalesHistory = (params?: {
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
}) => {
    return useQuery({
        queryKey: ['salesHistory', params],
        queryFn: () => historyService.getSalesHistory(params),
    });
};
