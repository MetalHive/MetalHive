import apiClient from '../client';

// Types
export interface UserProfile {
    id: number;
    email: string;
    name: string;
    phone: string;
    country: string;
    city: string;
    profilePicture: string;
}

export interface PayoutDetails {
    id: string;
    paymentMethod: string;
    accountHolderName: string;
    bankName: string;
    accountNumber: string;
    accountNumberLast4: string;
    routingNumber: string;
    verified: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface SupportTicket {
    ticketId: string;
    subject: string;
    status: 'open' | 'in_progress' | 'resolved' | 'closed';
    category: string;
    createdAt: string;
    lastResponse: string | null;
}

const settingsService = {
    // Profile Settings
    async getUserProfile(): Promise<UserProfile> {
        const response = await apiClient.get<UserProfile>('/auth/user/profile/');
        return response.data;
    },

    async updateUserProfile(data: {
        name?: string;
        phone?: string;
        country?: string;
        city?: string;
    }): Promise<UserProfile> {
        const response = await apiClient.patch<UserProfile>('/auth/user/profile/', data);
        return response.data;
    },

    async uploadProfilePicture(file: File): Promise<{ profilePicture: string }> {
        const formData = new FormData();
        formData.append('file', file);

        const response = await apiClient.post<{ profilePicture: string }>(
            '/auth/user/profile/picture/',
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        return response.data;
    },

    // Security Settings
    async changeEmail(data: {
        newEmail: string;
        currentPassword: string;
    }): Promise<void> {
        await apiClient.patch('/auth/user/email/', data);
    },

    async changePassword(data: {
        currentPassword: string;
        newPassword: string;
    }): Promise<void> {
        await apiClient.patch('/auth/user/password/', data);
    },

    // Payout Settings
    async getPayoutDetails(): Promise<PayoutDetails | null> {
        try {
            const response = await apiClient.get<PayoutDetails>('/auth/seller/payout-details/');
            return response.data;
        } catch (error: any) {
            // Return null if no payout details configured
            if (error.response?.status === 404 || error.response?.data?.data === null) {
                return null;
            }
            throw error;
        }
    },

    async updatePayoutDetails(data: {
        paymentMethod?: string;
        accountHolderName: string;
        bankName?: string;
        accountNumber: string;
        routingNumber?: string;
    }): Promise<PayoutDetails> {
        const response = await apiClient.put<PayoutDetails>('/auth/seller/payout-details/', data);
        return response.data;
    },

    // Account Management
    async deleteAccount(data: {
        reason?: string;
        password: string;
    }): Promise<void> {
        await apiClient.delete('/auth/user/account/', { data });
    },

    // Support
    async createSupportTicket(data: {
        subject: string;
        email: string;
        message: string;
        category?: string;
    }): Promise<{ ticketId: string; createdAt: string }> {
        const response = await apiClient.post<{ ticketId: string; createdAt: string }>(
            '/auth/support/messages/',
            data
        );
        return response.data;
    },

    async getSupportTickets(): Promise<SupportTicket[]> {
        const response = await apiClient.get<{ tickets: SupportTicket[] }>('/auth/support/messages/');
        return response.data.tickets || [];
    },
};

export default settingsService;
