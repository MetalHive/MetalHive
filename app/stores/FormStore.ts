// stores/formStore.ts - Updated for API integration
import { create } from "zustand"

interface FormData {
  fullName: string
  email: string
  password: string
  confirmPassword: string
  phone: string
  BusinessType: 'INDIVIDUAL' | 'COMPANY' | ''
  Address: string
  UploadCompanyLogo: File | null
  Description: string
}

interface FormStore {
  formData: FormData
  updateFormData: (data: Partial<FormData>) => void
  resetForm: () => void
}

const initialState: FormData = {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
  phone: "",
  BusinessType: "",
  Address: "",
  UploadCompanyLogo: null,
  Description: "",
};

export const useFormStore = create<FormStore>((set) => ({
  formData: initialState,

  updateFormData: (data) =>
    set((state) => ({ formData: { ...state.formData, ...data } })),

  resetForm: () => set({ formData: initialState }),
}))
