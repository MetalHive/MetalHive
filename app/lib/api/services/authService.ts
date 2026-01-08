import apiClient from '../client';
import { AuthResponse, saveAuth, clearAuth } from '../auth';

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
    description: string;
    company_logo?: File;
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
        formData.append('description', data.description);

        if (data.company_logo) {
            formData.append('company_logo', data.company_logo);
        }

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

    // Logout
    logout(): void {
        clearAuth();
    },
};

export default authService;
