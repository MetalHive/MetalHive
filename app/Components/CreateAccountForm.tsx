"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  AuthHeading,
  BackButton,
  FieldCard,
  PasswordInput,
  PhoneInput,
  PrimaryButton,
  TextInput,
} from "./AuthFormUI"

/**
 * Step 1 of both the seller and buyer registration flows ("Create Your Account").
 * The store is injected so the same markup serves both paths.
 */

export type AccountData = {
  fullName: string
  email: string
  password: string
  confirmPassword: string
  phone: string
}

interface CreateAccountFormProps {
  data: AccountData
  onChange: (patch: Partial<AccountData>) => void
  onComplete: () => void
}

const CreateAccountForm: React.FC<CreateAccountFormProps> = ({ data, onChange, onComplete }) => {
  const router = useRouter()
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors: { [key: string]: string } = {}
    const required: { key: keyof AccountData; label: string }[] = [
      { key: "fullName", label: "Full Name" },
      { key: "email", label: "Email" },
      { key: "password", label: "Password" },
      { key: "confirmPassword", label: "Confirm Password" },
      { key: "phone", label: "Phone Number" },
    ]
    required.forEach(({ key, label }) => {
      if (!data[key]) newErrors[key] = `${label} is required`
    })

    const { password, confirmPassword } = data
    if (password) {
      if (password.length < 8) {
        newErrors.password = "Password must be at least 8 characters long"
      } else if (!/[A-Z]/.test(password)) {
        newErrors.password = "Password must contain at least one uppercase letter"
      } else if (!/[0-9]/.test(password)) {
        newErrors.password = "Password must contain at least one number"
      } else if (!/[!@#$%^&*]/.test(password)) {
        newErrors.password = "Password must contain at least one special character (!@#$%^&*)"
      }
    }
    if (password && confirmPassword && password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    setErrors({})
    onComplete()
  }

  return (
    <div className="flex flex-col gap-6">
      <BackButton onClick={() => router.push("/auth")} />

      <AuthHeading title="Create Your Account" />

      <form onSubmit={handleContinue} className="flex flex-col gap-10">
        <div className="flex flex-col gap-4">
          <FieldCard label="Full Name" error={errors.fullName}>
            <TextInput
              type="text"
              placeholder="First & Last name"
              value={data.fullName}
              onChange={(e) => onChange({ fullName: e.target.value })}
              hasError={!!errors.fullName}
            />
          </FieldCard>

          <FieldCard label="Email" error={errors.email}>
            <TextInput
              type="email"
              placeholder="you@example.com"
              value={data.email}
              onChange={(e) => onChange({ email: e.target.value })}
              hasError={!!errors.email}
            />
          </FieldCard>

          <FieldCard label="Password" error={errors.password}>
            <PasswordInput
              placeholder="********"
              value={data.password}
              onChange={(e) => onChange({ password: e.target.value })}
              hasError={!!errors.password}
            />
          </FieldCard>

          <FieldCard label="Confirm Password" error={errors.confirmPassword}>
            <PasswordInput
              placeholder="********"
              value={data.confirmPassword}
              onChange={(e) => onChange({ confirmPassword: e.target.value })}
              hasError={!!errors.confirmPassword}
            />
          </FieldCard>

          <FieldCard label="Phone number" error={errors.phone}>
            <PhoneInput
              type="tel"
              inputMode="numeric"
              placeholder="(662) 241-4991"
              value={data.phone}
              onChange={(e) => onChange({ phone: e.target.value })}
              hasError={!!errors.phone}
            />
          </FieldCard>
        </div>

        <div className="flex justify-end">
          <PrimaryButton type="submit">Continue</PrimaryButton>
        </div>
      </form>
    </div>
  )
}

export default CreateAccountForm
