import apiClient from '../client';

// ============ INTERFACES ============

export interface BuyerProfile {
    id: number;
    fullName: string;
    email: string;
    phone: string;
    companyName: string;
    companyLogo: string;
    isVerified: boolean;
    rating: number;
    reviewsCount: number;
}

export interface BuyerDashboardStats {
    activeBids: number;
    pendingBids: number;
    acceptedBids: number;
    savedListings: number;
}

export interface MarketplaceListing {
    id: string;
    materialName: string;
    basePrice: number;
    priceUnit: string;
    location: string;
    createdAt: string;
    description: string;
    images: string[];
    sellerName: string;
    materialType?: string;
    condition?: string;
    quantity?: string;
}

export interface MarketplaceListingsResponse {
    listings: MarketplaceListing[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        pages: number;
    };
}

export interface ListingDetail extends MarketplaceListing {
    seller: {
        id: string;
        name: string;
        rating: number;
        verified: boolean;
    };
    weight?: string;
    existingBid?: BuyerBid | null;
}

export interface SavedListing {
    id: string;
    listing: MarketplaceListing;
    savedAt: string;
}

export interface BuyerBid {
    id: string;
    listing: {
        id: string;
        title: string;
        image: string;
        location: string;
        basePrice: number;
    };
    offerAmount: number;
    quantity: string;
    status: 'pending' | 'countered' | 'accepted' | 'rejected' | 'withdrawn';
    message: string;
    createdAt: string;
}

export interface BuyerBidDetail {
    id: string;
    status: string;
    offerPrice: number;
    offerPriceUnit: string;
    quantity: string;
    message: string;
    timeline: Array<{
        event: string;
        timestamp: string;
        label: string;
    }>;
    latestCounterOffer: {
        price: number;
        priceUnit: string;
    } | null;
    listing: {
        id: string;
        title: string;
        images: string[];
        basePrice: number;
        location: string;
        dateListed: string;
        description: string;
    };
    seller: {
        id: string;
        name: string;
    };
    createdAt: string;
}

export interface BuyerBidsResponse {
    bids: BuyerBid[];
    counts: {
        all: number;
        pending: number;
        countered: number;
        accepted: number;
        rejected: number;
        withdrawn: number;
    };
    pagination: {
        total: number;
        page: number;
        limit: number;
        pages: number;
    };
}

export interface Purchase {
    id: string;
    date: string;
    listing: {
        name: string;
        image: string;
    };
    seller: {
        id: string;
        name: string;
    };
    amount: number;
    status: 'complete' | 'processing';
}

export interface PurchaseHistoryResponse {
    purchases: Purchase[];
    summary: {
        totalSpent: number;
        completed: number;
        pending: number;
        allTime: number;
    };
    pagination: {
        total: number;
        page: number;
        limit: number;
        pages: number;
    };
}

export interface PlaceBidData {
    listingId: string;
    bidPrice: number;
    priceUnit: string;
    quantity: string;
    message?: string;
}

// ============ SERVICE ============

const buyerService = {
    // ========== PROFILE ==========
    async getProfile(): Promise<BuyerProfile> {
        const response = await apiClient.get('/buyer/profile/');
        return response.data?.data || response.data || {
            id: 0,
            fullName: '',
            email: '',
            phone: '',
            companyName: '',
            companyLogo: '',
            isVerified: false,
            rating: 0,
            reviewsCount: 0,
        };
    },

    async updateProfile(data: Partial<BuyerProfile>): Promise<BuyerProfile> {
        const response = await apiClient.patch('/buyer/profile/', data);
        return response.data?.data || response.data;
    },

    async uploadLogo(file: File): Promise<{ companyLogo: string }> {
        const formData = new FormData();
        formData.append('file', file);
        const response = await apiClient.post('/buyer/profile/logo/', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data?.data || response.data;
    },

    // ========== DASHBOARD STATS ==========
    async getDashboardStats(): Promise<BuyerDashboardStats> {
        const response = await apiClient.get('/buyer/dashboard/stats/');
        return response.data?.data || response.data || {
            activeBids: 0,
            pendingBids: 0,
            acceptedBids: 0,
            savedListings: 0,
        };
    },

    // ========== MARKETPLACE ==========
    async getMarketplaceListings(params?: {
        search?: string;
        materialType?: string;
        location?: string;
        page?: number;
        limit?: number;
    }): Promise<MarketplaceListingsResponse> {
        const response = await apiClient.get('/marketplace/listings/', { params });
        const data = response.data?.data || response.data;
        return {
            listings: data?.listings || [],
            pagination: data?.pagination || { total: 0, page: 1, limit: 20, pages: 0 },
        };
    },

    async getListingById(id: string): Promise<ListingDetail> {
        const response = await apiClient.get(`/marketplace/listings/${id}/`);
        return response.data?.data || response.data;
    },

    async getSimilarListings(id: string): Promise<MarketplaceListing[]> {
        const response = await apiClient.get(`/marketplace/listings/${id}/similar/`);
        const data = response.data?.data || response.data;
        return data?.listings || data || [];
    },

    // ========== SAVED LISTINGS ==========
    async getSavedListings(): Promise<SavedListing[]> {
        const response = await apiClient.get('/buyer/saved-listings/');
        return response.data?.data || response.data || [];
    },

    async saveListing(listingId: string): Promise<{ message: string }> {
        const response = await apiClient.post(`/buyer/saved-listings/${listingId}/`);
        return response.data;
    },

    async unsaveListing(listingId: string): Promise<{ message: string }> {
        const response = await apiClient.delete(`/buyer/saved-listings/${listingId}/`);
        return response.data;
    },

    // ========== BIDS ==========
    async getBids(params?: {
        status?: 'all' | 'pending' | 'countered' | 'accepted' | 'rejected' | 'withdrawn';
        page?: number;
    }): Promise<BuyerBidsResponse> {
        const response = await apiClient.get('/buyer/bids/', { params });
        const data = response.data?.data || response.data;
        return {
            bids: data?.bids || [],
            counts: data?.counts || { all: 0, pending: 0, countered: 0, accepted: 0, rejected: 0, withdrawn: 0 },
            pagination: data?.pagination || { total: 0, page: 1, limit: 20, pages: 0 },
        };
    },

    async getBidById(id: string): Promise<BuyerBidDetail> {
        const response = await apiClient.get(`/buyer/bids/${id}/`);
        return response.data?.data || response.data;
    },

    async placeBid(data: PlaceBidData): Promise<{ id: string; status: string; message: string }> {
        const response = await apiClient.post('/buyer/bids/', data);
        return response.data?.data || response.data;
    },

    async editBid(id: string, data: Partial<PlaceBidData>): Promise<BuyerBidDetail> {
        const response = await apiClient.patch(`/buyer/bids/${id}/edit/`, data);
        return response.data?.data || response.data;
    },

    async withdrawBid(id: string): Promise<{ message: string }> {
        const response = await apiClient.delete(`/buyer/bids/${id}/withdraw/`);
        return response.data;
    },

    async acceptCounterOffer(id: string): Promise<BuyerBidDetail> {
        const response = await apiClient.patch(`/buyer/bids/${id}/accept-counter/`);
        return response.data?.data || response.data;
    },

    async rejectCounterOffer(id: string): Promise<BuyerBidDetail> {
        const response = await apiClient.post(`/buyer/bids/${id}/reject-counter/`);
        return response.data?.data || response.data;
    },

    async counterBack(id: string, data: { counterPrice: number; counterPriceUnit: string; message?: string }): Promise<BuyerBidDetail> {
        const response = await apiClient.post(`/buyer/bids/${id}/counter/`, data);
        return response.data?.data || response.data;
    },

    // ========== PURCHASE HISTORY ==========
    async getPurchaseHistory(params?: {
        startDate?: string;
        endDate?: string;
        search?: string;
        page?: number;
    }): Promise<PurchaseHistoryResponse> {
        const response = await apiClient.get('/buyer/history/purchases/', { params });
        const data = response.data?.data || response.data;
        return {
            purchases: data?.purchases || [],
            summary: data?.summary || { totalSpent: 0, completed: 0, pending: 0, allTime: 0 },
            pagination: data?.pagination || { total: 0, page: 1, limit: 20, pages: 0 },
        };
    },

    async exportPurchaseHistory(): Promise<Blob> {
        const response = await apiClient.get('/buyer/history/purchases/export/', {
            responseType: 'blob',
        });
        return response.data;
    },
};

export default buyerService;
