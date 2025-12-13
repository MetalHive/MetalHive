// stores/formStore.ts
import { create } from "zustand"

interface FormData {
  fullName: string
  email: string
  password: string
  phone: string
  BusinessType: string
  Address: string
UploadCompanyLogo: File | null
  Description: string
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
    BusinessType: "",
    Address: "",
    UploadCompanyLogo:  null,
    Description: "",
  },
  updateFormData: (data) =>
    set((state) => ({ formData: { ...state.formData, ...data } })),
}))
