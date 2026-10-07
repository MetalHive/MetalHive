import apiClient from '../client';
import { AuthResponse, User, saveAuth, clearAuth, getRefreshToken } from '../auth';

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface BuyerRegistrationData {
    email: string;
    password: string;
    password_confirm: string;
    company_name: string;
    registration_number: string;
    company_address: string;
    contact_person_name: string;
    contact_person_position: string;
    contact_person_phone: string;
    verification_document?: File;
}

export interface SellerRegistrationData {
    email: string;
    password: string;
    password_confirm: string;
    business_type: 'INDIVIDUAL' | 'COMPANY';
    address: string;
}

const authService = {
    // Login
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        const response = await apiClient.post<AuthResponse>('/auth/token/', credentials);
        saveAuth(response.data);
        return response.data;
    },

    // Register Buyer
    async registerBuyer(data: BuyerRegistrationData): Promise<AuthResponse> {
        const formData = new FormData();

        formData.append('email', data.email);
        formData.append('password', data.password);
        formData.append('password_confirm', data.password_confirm);
        formData.append('company_name', data.company_name);
        formData.append('registration_number', data.registration_number);
        formData.append('company_address', data.company_address);
        formData.append('contact_person_name', data.contact_person_name);
        formData.append('contact_person_position', data.contact_person_position);
        formData.append('contact_person_phone', data.contact_person_phone);

        if (data.verification_document) {
            formData.append('verification_document', data.verification_document);
        }

        const response = await apiClient.post<AuthResponse>('/auth/register/buyer/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        saveAuth(response.data);
        return response.data;
    },

    // Register Seller
    async registerSeller(data: SellerRegistrationData): Promise<AuthResponse> {
        const formData = new FormData();

        formData.append('email', data.email);
        formData.append('password', data.password);
        formData.append('password_confirm', data.password_confirm);
        formData.append('business_type', data.business_type);
        formData.append('address', data.address);

        const response = await apiClient.post<AuthResponse>('/auth/register/seller/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        saveAuth(response.data);
        return response.data;
    },

    // Refresh Token
    async refreshToken(refreshToken: string): Promise<{ access: string }> {
        const response = await apiClient.post<{ access: string }>('/auth/token/refresh/', {
            refresh: refreshToken,
        });

        // Update access token in localStorage
        if (typeof window !== 'undefined') {
            localStorage.setItem('access_token', response.data.access);
        }

        return response.data;
    },

    // Current user — used to validate a stored session.
    async me(): Promise<User> {
        const response = await apiClient.get<User>('/auth/me/');
        return response.data;
    },

    /**
     * Best-effort post-registration profile fill. Registration has no name /
     * phone fields, so the profile is patched right afterwards. Failures are
     * swallowed: the account exists either way.
     */
    async completeProfile(data: { name?: string; phone?: string }): Promise<void> {
        const payload: { name?: string; phone?: string } = {};
        if (data.name && data.name.trim()) payload.name = data.name.trim();
        if (data.phone && data.phone.trim()) payload.phone = data.phone.trim();
        if (Object.keys(payload).length === 0) return;
        try {
            await apiClient.patch('/auth/user/profile/', payload);
        } catch {
            // non-blocking
        }
    },

    // Logout: invalidate the refresh token server-side, then clear local state.
    async logout(): Promise<void> {
        const refresh = getRefreshToken();
        try {
            if (refresh) {
                await apiClient.post('/auth/logout/', { refresh });
            }
        } catch {
            // The session is being discarded regardless of what the server says.
        } finally {
            clearAuth();
        }
    },
};

export default authService;
