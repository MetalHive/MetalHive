"use client"
import { useState } from "react"
import { useFormStore } from "@/app/stores/FormStore"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/hooks/useAuth"
import authService from "@/app/lib/api/services/authService"
import Link from "next/link"
import {
  AuthHeading,
  BackButton,
  FieldCard,
  PrimaryButton,
  SelectInput,
  TextInput,
} from "@/app/Components/AuthFormUI"

interface Form2Props {
  onComplete?: () => void
  onBack?: () => void
}

const PROVINCES = [
  "Alberta",
  "British Columbia",
  "Manitoba",
  "New Brunswick",
  "Newfoundland and Labrador",
  "Northwest Territories",
  "Nova Scotia",
  "Nunavut",
  "Ontario",
  "Prince Edward Island",
  "Quebec",
  "Saskatchewan",
  "Yukon",
]

const Form2: React.FC<Form2Props> = ({ onBack }) => {
  const { formData, updateFormData } = useFormStore()
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const router = useRouter()
  const { registerSeller, isLoading, error: authError } = useAuth()

  // Local state for address breakdown
  const [addressDetails, setAddressDetails] = useState({
    street: "",
    apartment: "",
    city: "",
    province: "",
    postalCode: "",
    country: "",
  })

  const handleAddressChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name } = e.target
    let { value } = e.target

    if (name === "postalCode") {
      value = value.toUpperCase().replace(/[^A-Z0-9]/g, "")
      if (value.length > 3) {
        value = value.slice(0, 3) + " " + value.slice(3, 6)
      }
    }

    setAddressDetails((prev) => ({ ...prev, [name]: value }))
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    const files = (e.target as HTMLInputElement).files
    if (files) {
      updateFormData({ [name]: files[0] })
    } else {
      updateFormData({ [name]: value })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors: Record<string, string> = {}
    if (!formData.BusinessType) newErrors.BusinessType = "Business Type is required"
    if (!addressDetails.street) newErrors.street = "Street Address is required"
    if (!addressDetails.city) newErrors.city = "City is required"
    if (!addressDetails.province) newErrors.province = "Province is required"
    if (!addressDetails.country) newErrors.country = "Country is required"

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    setErrors({})

    const fullAddress = [
      addressDetails.street,
      addressDetails.apartment,
      addressDetails.city,
      addressDetails.province,
      addressDetails.postalCode,
      addressDetails.country,
    ]
      .filter(Boolean)
      .join(", ")

    const registrationData = {
      email: formData.email,
      password: formData.password,
      password_confirm: formData.confirmPassword,
      business_type: formData.BusinessType as "INDIVIDUAL" | "COMPANY",
      address: fullAddress,
    }

    try {
      await registerSeller(registrationData)
      // Registration has no name/phone fields; fill the profile right after
      // (best-effort, non-blocking).
      void authService.completeProfile({ name: formData.fullName, phone: formData.phone })
      router.push("/sellerDashBoard")
    } catch {
      // The store exposes the backend message via `authError`, rendered below.
    }
  }

  const addressError =
    errors.street || errors.city || errors.province || errors.country

  return (
    <div className="flex flex-col gap-6">
      <BackButton onClick={onBack} disabled={isLoading} />

      <AuthHeading
        title="Complete Your Seller Profile"
        subtitle="Add a few details so buyers can trust your listings."
      />

      {authError && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {authError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-10">
        <div className="flex flex-col gap-4">
          {/* Business type */}
          <FieldCard label="Business type" error={errors.BusinessType}>
            <SelectInput
              name="BusinessType"
              value={formData.BusinessType || ""}
              onChange={handleChange}
              hasError={!!errors.BusinessType}
              disabled={isLoading}
            >
              <option value="">Select type</option>
              <option value="INDIVIDUAL">Individual</option>
              <option value="COMPANY">Company</option>
            </SelectInput>
          </FieldCard>

          {/* Address */}
          <FieldCard label="Address" error={addressError}>
            <div className="grid grid-cols-1 gap-[14px] md:grid-cols-2">
              <div className="md:col-span-2">
                <TextInput
                  type="text"
                  name="street"
                  placeholder="Street address"
                  value={addressDetails.street}
                  onChange={handleAddressChange}
                  hasError={!!errors.street}
                  disabled={isLoading}
                />
              </div>
              <TextInput
                type="text"
                name="apartment"
                placeholder="Apartment / Suite No"
                value={addressDetails.apartment}
                onChange={handleAddressChange}
                disabled={isLoading}
              />
              <TextInput
                type="text"
                name="city"
                placeholder="City"
                value={addressDetails.city}
                onChange={handleAddressChange}
                hasError={!!errors.city}
                disabled={isLoading}
              />
              <SelectInput
                name="province"
                value={addressDetails.province}
                onChange={handleAddressChange}
                hasError={!!errors.province}
                disabled={isLoading}
              >
                <option value="">Select Province / Territory</option>
                {PROVINCES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </SelectInput>
              <TextInput
                type="text"
                name="postalCode"
                placeholder="Postal Code"
                value={addressDetails.postalCode}
                onChange={handleAddressChange}
                pattern="[A-Za-z]\d[A-Za-z]\s?\d[A-Za-z]\d"
                title="Postal code must be in the format V3T 0S8"
                disabled={isLoading}
              />
              <div className="md:col-span-2">
                <TextInput
                  type="text"
                  name="country"
                  placeholder="Country"
                  value={addressDetails.country}
                  onChange={handleAddressChange}
                  hasError={!!errors.country}
                  disabled={isLoading}
                />
              </div>
            </div>
          </FieldCard>
        </div>

        <div className="flex flex-col gap-6">
          <p className="text-center text-sm leading-5 tracking-[0.14px] text-[#737780]">
            By filling out this form, you acknowledge that you have read and agree to our{" "}
            <Link href="/terms" className="font-medium text-[#C9A227] hover:underline">
              Terms &amp; Conditions
            </Link>
            .
          </p>

          <div className="flex justify-end">
            <PrimaryButton type="submit" disabled={isLoading}>
              {isLoading ? "Creating Account..." : "Create Account"}
            </PrimaryButton>
          </div>
        </div>
      </form>
    </div>
  )
}

export default Form2
