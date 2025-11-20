"use client"

import Image from "next/image"
import { useState } from "react"
import Form1 from "./Form1"
import Form2 from "./Form2"

const page = () => {
  const [step, setStep] = useState(1)

  const handleForm1Complete = () => setStep(2)
  const handleForm2Back = () => setStep(1)

  return (
    <div className="min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6">
        <Image
          src="/logoBlack.png"
          width={120}
          height={120}
          alt="MetalHive black logo"
        />
      </div>

      
      {step === 1 && <Form1 onComplete={handleForm1Complete} />}
      {step === 2 && <Form2 onBack={handleForm2Back} />}
    </div>
  )
}

export default page
