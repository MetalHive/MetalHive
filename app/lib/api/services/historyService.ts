import apiClient from '../client';

export interface Sale {
    id: string;
    listingId: string;
    listing: {
        name: string;
        image: string;
        materialType: string;
    };
    buyer: {
        id: string;
        name: string;
    };
    quantity: string;
    finalPrice: number;
    priceUnit: string;
    totalAmount: number;
    soldAt: string;
    payoutStatus: 'pending' | 'processing' | 'completed';
    payoutDate: string | null;
}

export interface SalesHistoryResponse {
    sales: Sale[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        pages: number;
    };
    summary: {
        totalSales: number;
        totalRevenue: number;
    };
}

const historyService = {
    // Get sales history
    async getSalesHistory(params?: {
        startDate?: string;
        endDate?: string;
        page?: number;
        limit?: number;
    }): Promise<SalesHistoryResponse> {
        const response = await apiClient.get<SalesHistoryResponse>('/seller/history/sales', { params });
        return response.data;
    },
};

export default historyService;
