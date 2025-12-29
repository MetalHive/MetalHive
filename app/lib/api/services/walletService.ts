import apiClient from '../client';

export interface WalletSummary {
    availableBalance: number;
    pendingPayouts: number;
    totalEarned: number;
    lastPayout: {
        amount: number;
        date: string;
    };
    currency: string;
}

export interface MonthlyEarnings {
    year: number;
    earnings: Array<{
        month: string;
        value: number;
    }>;
}

export interface Transaction {
    id: string;
    type: 'earning' | 'withdrawal' | 'refund';
    amount: number;
    description: string;
    listingId: string | null;
    buyerId: string | null;
    bankAccount: string | null;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    createdAt: string;
}

export interface TransactionsResponse {
    transactions: Transaction[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        pages: number;
    };
}

const walletService = {
    // Get wallet summary
    async getWalletSummary(): Promise<WalletSummary> {
        const response = await apiClient.get<WalletSummary>('/seller/wallet');
        return response.data;
    },

    // Get monthly earnings
    async getMonthlyEarnings(year?: number): Promise<MonthlyEarnings> {
        const response = await apiClient.get<MonthlyEarnings>('/seller/wallet/earnings', {
            params: year ? { year } : undefined,
        });
        return response.data;
    },

    // Get transactions
    async getTransactions(params?: {
        type?: 'earning' | 'withdrawal' | 'all';
        page?: number;
        limit?: number;
    }): Promise<TransactionsResponse> {
        const response = await apiClient.get<TransactionsResponse>('/seller/wallet/transactions', { params });
        return response.data;
    },

    // Request withdrawal
    async requestWithdrawal(data: {
        amount: number;
        bankAccountId: string;
        notes?: string;
    }): Promise<{
        id: string;
        amount: number;
        status: string;
        estimatedCompletionDate: string;
        createdAt: string;
    }> {
        const response = await apiClient.post('/seller/wallet/withdraw', data);
        return response.data;
    },
};

export default walletService;
