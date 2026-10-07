"use client"

import { useBuyerFormStore } from "@/app/stores/BuyerStore"
import CreateAccountForm from "@/app/Components/CreateAccountForm"

interface Form1Props {
  onComplete: () => void
}

const Form1: React.FC<Form1Props> = ({ onComplete }) => {
  const { buyerData, updateBuyerData } = useBuyerFormStore()

  return (
    <CreateAccountForm
      data={{
        fullName: String(buyerData.fullName ?? ""),
        email: String(buyerData.email ?? ""),
        password: String(buyerData.password ?? ""),
        confirmPassword: String(buyerData.confirmPassword ?? ""),
        phone: String(buyerData.phone ?? ""),
      }}
      onChange={(patch) => updateBuyerData(patch)}
      onComplete={onComplete}
    />
  )
}

export default Form1
