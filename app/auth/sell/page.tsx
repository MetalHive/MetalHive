"use client"

import { useState } from "react"
import { AuthShell } from "@/app/Components/AuthFormUI"
import Form1 from "./Form1"
import Form2 from "./Form2"

const RegistrationPage = () => {
  const [step, setStep] = useState(1)

  const handleForm1Complete = () => setStep(2)
  const handleForm2Back = () => setStep(1)

  return (
    <AuthShell>
      {step === 1 && <Form1 onComplete={handleForm1Complete} />}
      {step === 2 && <Form2 onBack={handleForm2Back} />}
    </AuthShell>
  )
}

export default RegistrationPage
