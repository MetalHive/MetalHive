import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import buyerService, {
    BuyerProfile,
    BuyerDashboardStats,
    MarketplaceListingsResponse,
    ListingDetail,
    MarketplaceListing,
    SavedListing,
    BuyerBidsResponse,
    BuyerBidDetail,
    PurchaseHistoryResponse,
    PlaceBidData,
} from '../lib/api/services/buyerService';

// ========== PROFILE HOOKS ==========

export function useBuyerProfile() {
    return useQuery<BuyerProfile>({
        queryKey: ['buyerProfile'],
        queryFn: () => buyerService.getProfile(),
    });
}

export function useUpdateBuyerProfile() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: Partial<BuyerProfile>) => buyerService.updateProfile(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['buyerProfile'] });
        },
    });
}

export function useUploadBuyerLogo() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (file: File) => buyerService.uploadLogo(file),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['buyerProfile'] });
        },
    });
}

// ========== DASHBOARD STATS ==========

export function useBuyerDashboardStats() {
    return useQuery<BuyerDashboardStats>({
        queryKey: ['buyerDashboardStats'],
        queryFn: () => buyerService.getDashboardStats(),
    });
}

// ========== MARKETPLACE HOOKS ==========

export function useMarketplaceListings(params?: {
    search?: string;
    materialType?: string;
    location?: string;
    page?: number;
    limit?: number;
}) {
    return useQuery<MarketplaceListingsResponse>({
        queryKey: ['marketplaceListings', params],
        queryFn: () => buyerService.getMarketplaceListings(params),
    });
}

export function useMarketplaceListing(id: string) {
    return useQuery<ListingDetail>({
        queryKey: ['marketplaceListing', id],
        queryFn: () => buyerService.getListingById(id),
        enabled: !!id,
    });
}

export function useSimilarListings(id: string) {
    return useQuery<MarketplaceListing[]>({
        queryKey: ['similarListings', id],
        queryFn: () => buyerService.getSimilarListings(id),
        enabled: !!id,
    });
}

// ========== SAVED LISTINGS HOOKS ==========

export function useSavedListings() {
    return useQuery<SavedListing[]>({
        queryKey: ['savedListings'],
        queryFn: () => buyerService.getSavedListings(),
    });
}

export function useSaveListing() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (listingId: string) => buyerService.saveListing(listingId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['savedListings'] });
            queryClient.invalidateQueries({ queryKey: ['buyerDashboardStats'] });
        },
    });
}

export function useUnsaveListing() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (listingId: string) => buyerService.unsaveListing(listingId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['savedListings'] });
            queryClient.invalidateQueries({ queryKey: ['buyerDashboardStats'] });
        },
    });
}

// ========== BIDS HOOKS ==========

export function useBuyerBids(params?: {
    status?: 'all' | 'pending' | 'countered' | 'accepted' | 'rejected' | 'withdrawn';
    page?: number;
}) {
    return useQuery<BuyerBidsResponse>({
        queryKey: ['buyerBids', params],
        queryFn: () => buyerService.getBids(params),
    });
}

export function useBuyerBidDetail(id: string) {
    return useQuery<BuyerBidDetail>({
        queryKey: ['buyerBid', id],
        queryFn: () => buyerService.getBidById(id),
        enabled: !!id,
    });
}

export function usePlaceBid() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: PlaceBidData) => buyerService.placeBid(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['buyerBids'] });
            queryClient.invalidateQueries({ queryKey: ['buyerDashboardStats'] });
            queryClient.invalidateQueries({ queryKey: ['marketplaceListing'] });
        },
    });
}

export function useEditBid() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<PlaceBidData> }) =>
            buyerService.editBid(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['buyerBids'] });
            queryClient.invalidateQueries({ queryKey: ['buyerBid', variables.id] });
        },
    });
}

export function useWithdrawBid() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => buyerService.withdrawBid(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['buyerBids'] });
            queryClient.invalidateQueries({ queryKey: ['buyerDashboardStats'] });
        },
    });
}

export function useAcceptCounterOffer() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => buyerService.acceptCounterOffer(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: ['buyerBids'] });
            queryClient.invalidateQueries({ queryKey: ['buyerBid', id] });
            queryClient.invalidateQueries({ queryKey: ['buyerDashboardStats'] });
        },
    });
}

export function useRejectCounterOffer() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => buyerService.rejectCounterOffer(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: ['buyerBids'] });
            queryClient.invalidateQueries({ queryKey: ['buyerBid', id] });
        },
    });
}

export function useCounterBack() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: { counterPrice: number; counterPriceUnit: string; message?: string } }) =>
            buyerService.counterBack(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['buyerBids'] });
            queryClient.invalidateQueries({ queryKey: ['buyerBid', variables.id] });
        },
    });
}

// ========== PURCHASE HISTORY HOOKS ==========

export function usePurchaseHistory(params?: {
    startDate?: string;
    endDate?: string;
    search?: string;
    page?: number;
}) {
    return useQuery<PurchaseHistoryResponse>({
        queryKey: ['purchaseHistory', params],
        queryFn: () => buyerService.getPurchaseHistory(params),
    });
}

export function useExportPurchaseHistory() {
    return useMutation({
        mutationFn: () => buyerService.exportPurchaseHistory(),
        onSuccess: (blob) => {
            // Trigger download
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `purchase-history-${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        },
    });
}
