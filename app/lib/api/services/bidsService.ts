import apiClient from '../client';

export interface Bid {
    id: string;
    listingId: string;
    listing: {
        id: string;
        name: string;
        image: string;
        status: string;
    };
    buyer: {
        id: string;
        name: string;
        companyName: string;
        verified: boolean;
    };
    offerPrice: number;
    offerPriceUnit: string;
    quantity: string;
    message: string;
    status: 'pending' | 'accepted' | 'rejected' | 'countered' | 'expired';
    createdAt: string;
    expiresAt: string;
}

export interface BidDetail {
    id: string;
    listing: {
        id: string;
        name: string;
        images: string[];
    };
    buyer: {
        id: string;
        name: string;
        companyName: string;
        verified: boolean;
        rating: number;
    };
    offerPrice: number;
    offerPriceUnit: string;
    weight: string;
    location: string;
    message: string;
    status: 'pending' | 'accepted' | 'rejected' | 'countered' | 'expired';
    timeline: Array<{
        event: string;
        label: string;
        timestamp: string | null;
        data?: Record<string, any>;
    }>;
    createdAt: string;
    expiresAt: string;
}

export interface BidsResponse {
    bids: Bid[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        pages: number;
    };
}

const bidsService = {
    // Get all bids
    async getBids(params?: {
        status?: 'pending' | 'accepted' | 'rejected' | 'countered' | 'all';
        listingId?: string;
        search?: string;
        page?: number;
        limit?: number;
    }): Promise<BidsResponse> {
        const response = await apiClient.get<BidsResponse>('/seller/bids', { params });
        return response.data;
    },

    // Get bid details
    async getBidById(id: string): Promise<BidDetail> {
        const response = await apiClient.get<BidDetail>(`/seller/bids/${id}`);
        return response.data;
    },

    // Accept bid
    async acceptBid(id: string, data: { acceptedPrice: number; notes?: string }): Promise<{
        id: string;
        status: string;
        acceptedAt: string;
        transaction: {
            id: string;
            amount: number;
            status: string;
        };
    }> {
        const response = await apiClient.patch(`/seller/bids/${id}/accept`, data);
        return response.data;
    },

    // Reject bid
    async rejectBid(id: string, reason: string): Promise<{
        id: string;
        status: string;
        rejectedAt: string;
    }> {
        const response = await apiClient.patch(`/seller/bids/${id}/reject`, { reason });
        return response.data;
    },

    // Counter offer
    async counterOffer(id: string, data: {
        counterPrice: number;
        counterPriceUnit: string;
        message?: string;
    }): Promise<{
        id: string;
        status: string;
        counterOffer: {
            price: number;
            priceUnit: string;
            createdAt: string;
        };
    }> {
        const response = await apiClient.post(`/seller/bids/${id}/counter`, data);
        return response.data;
    },
};

export default bidsService;
