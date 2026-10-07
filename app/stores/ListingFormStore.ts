import { create } from 'zustand';
import { CreateListingData, WeightUnit } from '../lib/api/services/listingsService';

export type MaterialType = 'Copper' | 'Aluminium' | 'Steel';
export type ConditionType = 'Processed' | 'Unprocessed' | 'Mixed';

interface ListingFormValues {
    // Step 1: Basic Details
    materialName: string;
    materialType: MaterialType | '';
    condition: ConditionType | '';
    quantity: string;
    quantityUnit: WeightUnit;
    basePrice: string;
    priceUnit: WeightUnit;
    location: string;

    // Step 2: Images
    images: string[];

    // Step 3: Description
    description: string;
    additionalNotes: string;

    // Form state
    currentStep: number;
    isSubmitting: boolean;
}

interface ListingFormState extends ListingFormValues {
    // Actions
    updateBasicDetails: (data: Partial<ListingFormValues>) => void;
    updateImages: (images: string[]) => void;
    updateDescription: (description: string) => void;
    updateAdditionalNotes: (notes: string) => void;
    setCurrentStep: (step: number) => void;
    setIsSubmitting: (isSubmitting: boolean) => void;
    resetForm: () => void;
    getFormData: () => CreateListingData;
    /** Field-level errors for the given wizard step; empty object when valid. */
    validateStep: (step: number) => Record<string, string>;
}

const initialState: ListingFormValues = {
    materialName: '',
    materialType: '',
    condition: '',
    quantity: '',
    quantityUnit: 'kg',
    basePrice: '',
    // Matches quantityUnit above: defaulting quantity to kg but price to tonne
    // meant a seller who left both dropdowns alone priced per tonne against a
    // kilogram quantity.
    priceUnit: 'kg',
    location: '',
    images: [],
    description: '',
    additionalNotes: '',
    currentStep: 1,
    isSubmitting: false,
};

const isPositiveNumber = (value: string) => {
    const n = parseFloat(value.replace(/[^0-9.]/g, ''));
    return Number.isFinite(n) && n > 0;
};

export const useListingFormStore = create<ListingFormState>((set, get) => ({
    ...initialState,

    updateBasicDetails: (data) => set((state) => ({ ...state, ...data })),

    updateImages: (images) => set({ images }),

    updateDescription: (description) => set({ description }),

    updateAdditionalNotes: (additionalNotes) => set({ additionalNotes }),

    setCurrentStep: (currentStep) => set({ currentStep }),

    setIsSubmitting: (isSubmitting) => set({ isSubmitting }),

    resetForm: () => set(initialState),

    validateStep: (step) => {
        const state = get();
        const errors: Record<string, string> = {};

        if (step === 1) {
            if (!state.materialName.trim()) errors.materialName = 'Material name is required';
            if (!state.materialType) errors.materialType = 'Select a material type';
            if (!state.condition) errors.condition = 'Select a condition';
            if (!state.quantity.trim()) errors.quantity = 'Estimated weight is required';
            else if (!isPositiveNumber(state.quantity)) errors.quantity = 'Enter a weight greater than zero';
            if (!state.basePrice.trim()) errors.basePrice = 'Price is required';
            else if (!isPositiveNumber(state.basePrice)) errors.basePrice = 'Enter a price greater than zero';
            if (!state.location.trim()) errors.location = 'Location is required';
        }

        if (step === 2) {
            if (state.images.length === 0) errors.images = 'Upload at least one photo of your material';
        }

        // Step 3 (description) is optional; step 4 is the preview.
        return errors;
    },

    getFormData: (): CreateListingData => {
        const state = get();
        return {
            materialName: state.materialName.trim(),
            materialType: state.materialType as MaterialType,
            condition: state.condition as ConditionType,
            // The seller's own unit is preserved for display; the backend
            // normalises to kilograms internally.
            quantity: `${state.quantity}${state.quantityUnit}`,
            quantityValue: state.quantity,
            quantityUnit: state.quantityUnit,
            basePrice: state.basePrice,
            location: state.location.trim(),
            description: state.description,
            additionalNotes: state.additionalNotes,
            images: state.images,
            priceUnit: state.priceUnit,
        };
    },
}));
