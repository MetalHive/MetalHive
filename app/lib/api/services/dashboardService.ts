import apiClient from '../client';

export interface DashboardStats {
    activeListings: number;
    bidsReceived: number;
    itemsSold: number;
    pendingPayouts: number;
    period: string;
}

const dashboardService = {
    // Get dashboard statistics
    async getStats(period: '24hours' | '7days' | '2weeks' | '30days' = '30days'): Promise<DashboardStats> {
        const response = await apiClient.get<DashboardStats>('/seller/dashboard/stats', {
            params: { period },
        });
        return response.data;
    },
};

export default dashboardService;
