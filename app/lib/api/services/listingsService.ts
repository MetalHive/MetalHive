import apiClient from '../client';

export interface Listing {
    id: string;
    image: string;
    name: string;
    materialType: string;
    quantity: string;
    quantityValue?: string;
    quantityUnit?: WeightUnit;
    bidsCount: number;
    price: number;
    priceUnit: string;
    status: 'draft' | 'active' | 'inactive' | 'suspended' | 'sold';
    createdAt: string;
}

export interface ListingDetail {
    id: string;
    productCode: string;
    title: string;
    price: number;
    priceUnit: string;
    materialType: string;
    condition: string;
    quantity: string;
    location: string;
    description: string;
    images: string[];
    status: 'draft' | 'active' | 'inactive' | 'suspended' | 'sold';
    listedOn: string;
    updatedAt: string;
    bidsCount: number;
    viewsCount: number;
}

export interface ListingsResponse {
    listings: Listing[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        pages: number;
    };
    counts: {
        active: number;
        sold: number;
        inactive: number;
        draft: number;
    };
}

export type WeightUnit = 'kg' | 'tonne' | 'g' | 'lb';

export interface CreateListingData {
    materialName: string;
    materialType: 'Copper' | 'Aluminium' | 'Steel';
    condition: 'Processed' | 'Unprocessed' | 'Mixed';
    /** Display form, e.g. "500kg". Kept for backwards compatibility. */
    quantity: string;
    /** Preferred structured form; the backend normalises these to kilograms. */
    quantityValue?: string;
    quantityUnit?: WeightUnit;
    basePrice: string;
    priceUnit?: WeightUnit | 'unit';
    location: string;
    description?: string;
    additional_notes?: string;
    images: string[];
}

export interface CreateListingResponse {
    id: string;
    status: string;
    createdAt: string;
    message: string;
}

const listingsService = {
    // Get all listings
    async getListings(params?: {
        status?: 'active' | 'inactive' | 'sold' | 'draft' | 'all';
        search?: string;
        page?: number;
        limit?: number;
    }): Promise<ListingsResponse> {
        const response = await apiClient.get<ListingsResponse>('/seller/listings', { params });
        return response.data;
    },

    // Get listing by ID
    async getListingById(id: string): Promise<ListingDetail> {
        const response = await apiClient.get<ListingDetail>(`/seller/listings/${id}`);
        return response.data;
    },

    // Create listing
    async createListing(data: CreateListingData): Promise<CreateListingResponse> {
        const response = await apiClient.post<CreateListingResponse>('/seller/listings', data);
        return response.data;
    },

    // Update listing
    async updateListing(id: string, data: Partial<CreateListingData>): Promise<{ id: string; status: string; updatedAt: string }> {
        const response = await apiClient.patch(`/seller/listings/${id}`, data);
        return response.data;
    },

    // Publish listing
    async publishListing(id: string): Promise<{ id: string; status: string; publishedAt: string }> {
        const response = await apiClient.patch(`/seller/listings/${id}/publish`);
        return response.data;
    },

    // Delete listing
    async deleteListing(id: string): Promise<{ message: string }> {
        const response = await apiClient.delete(`/seller/listings/${id}`);
        return response.data;
    },
};

export default listingsService;
