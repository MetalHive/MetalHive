import { create } from 'zustand';
import { CreateListingData } from '../lib/api/services/listingsService';

interface ListingFormState {
    // Step 1: Basic Details
    materialName: string;
    materialType: 'Copper' | 'Aluminium' | 'Steel' | '';
    condition: 'Processed' | 'Unprocessed' | 'Mixed' | '';
    quantity: string;
    quantityUnit: 'kg' | 'tonne' | 'g' | 'lb';
    basePrice: string;
    priceUnit: 'kg' | 'tonne' | 'g' | 'lb';
    location: string;

    // Step 2: Images
    images: string[];

    // Step 3: Description
    description: string;
    additional_notes: string;

    // Form state
    currentStep: number;
    isSubmitting: boolean;

    // Actions
    updateBasicDetails: (data: Partial<ListingFormState>) => void;
    updateImages: (images: string[]) => void;
    updateDescription: (description: string) => void;
    updateAdditionalNotes: (notes: string) => void;
    setCurrentStep: (step: number) => void;
    setIsSubmitting: (isSubmitting: boolean) => void;
    resetForm: () => void;
    getFormData: () => CreateListingData;
}

const initialState = {
    materialName: '',
    materialType: '' as '',
    condition: '' as '',
    quantity: '',
    quantityUnit: 'kg' as const,
    basePrice: '',
    priceUnit: 'tonne' as const,
    location: '',
    images: [],
    description: '',
    additional_notes: '',
    currentStep: 1,
    isSubmitting: false,
};

export const useListingFormStore = create<ListingFormState>((set, get) => ({
    ...initialState,

    updateBasicDetails: (data) => set((state) => ({ ...state, ...data })),

    updateImages: (images) => set({ images }),

    updateDescription: (description) => set({ description }),

    updateAdditionalNotes: (additional_notes) => set({ additional_notes }),

    setCurrentStep: (currentStep) => set({ currentStep }),

    setIsSubmitting: (isSubmitting) => set({ isSubmitting }),

    resetForm: () => set(initialState),

    getFormData: (): CreateListingData => {
        const state = get();
        return {
            materialName: state.materialName,
            materialType: state.materialType as 'Copper' | 'Aluminium' | 'Steel',
            condition: state.condition as 'Processed' | 'Unprocessed' | 'Mixed',
            // The seller's own unit is preserved for display; the backend
            // normalises to kilograms internally.
            quantity: `${state.quantity}${state.quantityUnit}`,
            quantityValue: state.quantity,
            quantityUnit: state.quantityUnit,
            basePrice: state.basePrice,
            location: state.location,
            description: state.description,
            additional_notes: state.additional_notes,
            images: state.images,
            priceUnit: state.priceUnit,
        };
    },
}));
