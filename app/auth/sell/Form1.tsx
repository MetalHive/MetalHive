"use client"

import { useFormStore } from "@/app/stores/FormStore"
import CreateAccountForm from "@/app/Components/CreateAccountForm"

interface Form1Props {
  onComplete: () => void
}

const Form1: React.FC<Form1Props> = ({ onComplete }) => {
  const { formData, updateFormData } = useFormStore()

  return (
    <CreateAccountForm
      data={{
        fullName: String(formData.fullName ?? ""),
        email: String(formData.email ?? ""),
        password: String(formData.password ?? ""),
        confirmPassword: String(formData.confirmPassword ?? ""),
        phone: String(formData.phone ?? ""),
      }}
      onChange={(patch) => updateFormData(patch)}
      onComplete={onComplete}
    />
  )
}

export default Form1
