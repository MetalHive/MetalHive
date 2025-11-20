// stores/formStore.ts
import { create } from "zustand"

interface FormData {
  fullName: string
  email: string
  password: string
  phone: string
  businessType: string
  address: string
  logo: File | null
  description: string
}

interface FormStore {
  formData: FormData
  updateFormData: (data: Partial<FormData>) => void
}

export const useFormStore = create<FormStore>((set) => ({
  formData: {
    fullName: "",
    email: "",
    password: "",
    phone: "",
    businessType: "",
    address: "",
    logo: null,
    description: "",
  },
  updateFormData: (data) =>
    set((state) => ({ formData: { ...state.formData, ...data } })),
}))
