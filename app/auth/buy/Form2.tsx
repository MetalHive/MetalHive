"use client"

import { useState } from "react"
import { useBuyerFormStore } from "@/app/stores/BuyerStore"
import { useRouter } from "next/navigation"
import authService from "@/app/lib/api/services/authService"
import { useAuthStore } from "@/app/stores/AuthStore"
import { getErrorMessage } from "@/app/lib/api/client"
import Link from "next/link"
import {
  AuthHeading,
  BackButton,
  FieldCard,
  FileUploadInput,
  PrimaryButton,
  TextInput,
  VerificationModal,
} from "@/app/Components/AuthFormUI"

interface Form2Props {
  onComplete?: () => void
  onBack?: () => void
}

const Form2: React.FC<Form2Props> = ({ onComplete, onBack }) => {
  const router = useRouter()
  const { buyerData, updateBuyerData, resetBuyerData } = useBuyerFormStore()
  // Register through the auth store so the dashboard gate sees the new session.
  const registerBuyer = useAuthStore((s) => s.registerBuyer)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [showVerification, setShowVerification] = useState(false)
  const [fileName, setFileName] = useState<string | undefined>(
    buyerData.verificationDocument?.name
  )

  // Local state for address breakdown
  const [addressDetails, setAddressDetails] = useState({
    street: "",
    apartment: "",
    city: "",
    province: "",
    postalCode: "",
    country: "",
  })

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setAddressDetails((prev) => ({ ...prev, [name]: value }))
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    const files = (e.target as HTMLInputElement).files
    if (files && files[0]) {
      updateBuyerData({ verificationDocument: files[0] })
      setFileName(files[0].name)
    } else if (name === "contactPersonName") {
      updateBuyerData({ contactPerson: { ...buyerData.contactPerson, name: value } })
    } else if (name === "contactPersonPosition") {
      updateBuyerData({ contactPerson: { ...buyerData.contactPerson, position: value } })
    } else if (name === "contactPersonPhone") {
      updateBuyerData({ contactPerson: { ...buyerData.contactPerson, phone: value } })
    } else {
      updateBuyerData({ [name]: value })
    }
  }

  const goToDashboard = () => {
    resetBuyerData()
    if (onComplete) onComplete()
    router.push("/buyersDashboard")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors: { [key: string]: string } = {}

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

    if (!buyerData.companyName) newErrors.companyName = "Company Name is required"
    if (!buyerData.registrationNumber) newErrors.registrationNumber = "Registration Number is required"
    if (!addressDetails.street) newErrors.street = "Street Address is required"
    if (!addressDetails.city) newErrors.city = "City is required"
    if (!addressDetails.province) newErrors.province = "Province is required"
    if (!addressDetails.country) newErrors.country = "Country is required"
    if (!buyerData.contactPerson.name) newErrors.contactPersonName = "Contact Person Name is required"
    if (!buyerData.contactPerson.position) newErrors.contactPersonPosition = "Contact Person Position is required"
    if (!buyerData.contactPerson.phone) newErrors.contactPersonPhone = "Contact Person Phone is required"

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors({})
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      await registerBuyer({
        email: buyerData.email,
        password: buyerData.password,
        password_confirm: buyerData.confirmPassword,
        company_name: buyerData.companyName,
        registration_number: buyerData.registrationNumber,
        company_address: fullAddress,
        contact_person_name: buyerData.contactPerson.name,
        contact_person_position: buyerData.contactPerson.position,
        contact_person_phone: buyerData.contactPerson.phone,
        verification_document: buyerData.verificationDocument || undefined,
      })

      // Registration has no name/phone fields; fill the profile right after
      // (best-effort, non-blocking).
      void authService.completeProfile({
        name: buyerData.fullName || buyerData.contactPerson.name,
        phone: buyerData.phone || buyerData.contactPerson.phone,
      })

      setShowVerification(true)
      setTimeout(goToDashboard, 4000)
    } catch (error: unknown) {
      setSubmitError(getErrorMessage(error, "Registration failed. Please try again."))
    } finally {
      setIsSubmitting(false)
    }
  }

  const addressError =
    errors.street || errors.city || errors.province || errors.country
  const contactError =
    errors.contactPersonName || errors.contactPersonPosition || errors.contactPersonPhone

  return (
    <div className="flex flex-col gap-6">
      <BackButton onClick={onBack} disabled={isSubmitting} />

      <AuthHeading
        title="Verify Your Company"
        subtitle="We verify every buyer to keep the marketplace secure and compliant."
      />

      <form onSubmit={handleSubmit} className="flex flex-col gap-10">
        <div className="flex flex-col gap-4">
          <FieldCard label="Company name" error={errors.companyName}>
            <TextInput
              type="text"
              name="companyName"
              placeholder="Company name"
              value={buyerData.companyName}
              onChange={handleChange}
              hasError={!!errors.companyName}
              disabled={isSubmitting}
            />
          </FieldCard>

          <FieldCard label="Registration number / business ID" error={errors.registrationNumber}>
            <TextInput
              type="text"
              name="registrationNumber"
              placeholder="Registration number"
              value={buyerData.registrationNumber}
              onChange={handleChange}
              hasError={!!errors.registrationNumber}
              disabled={isSubmitting}
            />
          </FieldCard>

          <FieldCard label="Company address" error={addressError}>
            <div className="grid grid-cols-1 gap-[14px] md:grid-cols-2">
              <div className="md:col-span-2">
                <TextInput
                  type="text"
                  name="street"
                  placeholder="Street address"
                  value={addressDetails.street}
                  onChange={handleAddressChange}
                  hasError={!!errors.street}
                  disabled={isSubmitting}
                />
              </div>
              <TextInput
                type="text"
                name="apartment"
                placeholder="Apartment / Suite No"
                value={addressDetails.apartment}
                onChange={handleAddressChange}
                disabled={isSubmitting}
              />
              <TextInput
                type="text"
                name="city"
                placeholder="City"
                value={addressDetails.city}
                onChange={handleAddressChange}
                hasError={!!errors.city}
                disabled={isSubmitting}
              />
              <TextInput
                type="text"
                name="province"
                placeholder="Province"
                value={addressDetails.province}
                onChange={handleAddressChange}
                hasError={!!errors.province}
                disabled={isSubmitting}
              />
              <TextInput
                type="text"
                name="postalCode"
                placeholder="Postal Code"
                value={addressDetails.postalCode}
                onChange={handleAddressChange}
                disabled={isSubmitting}
              />
              <div className="md:col-span-2">
                <TextInput
                  type="text"
                  name="country"
                  placeholder="Country"
                  value={addressDetails.country}
                  onChange={handleAddressChange}
                  hasError={!!errors.country}
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </FieldCard>

          <FieldCard
            label="Upload verification documents"
            hint="(business license, tax ID, or trade certificate)"
          >
            <FileUploadInput
              name="document"
              onChange={handleChange}
              fileName={fileName}
              disabled={isSubmitting}
            />
          </FieldCard>

          <FieldCard label="Contact person name & position" error={contactError}>
            <div className="flex flex-col gap-[14px]">
              <TextInput
                type="text"
                name="contactPersonName"
                placeholder="Full name"
                value={buyerData.contactPerson.name}
                onChange={handleChange}
                hasError={!!errors.contactPersonName}
                disabled={isSubmitting}
              />
              <TextInput
                type="text"
                name="contactPersonPosition"
                placeholder="Position"
                value={buyerData.contactPerson.position}
                onChange={handleChange}
                hasError={!!errors.contactPersonPosition}
                disabled={isSubmitting}
              />
              <TextInput
                type="tel"
                name="contactPersonPhone"
                placeholder="Phone number"
                value={buyerData.contactPerson.phone}
                onChange={handleChange}
                hasError={!!errors.contactPersonPhone}
                disabled={isSubmitting}
              />
            </div>
          </FieldCard>
        </div>

        <div className="flex flex-col gap-6">
          {submitError && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {submitError}
            </div>
          )}

          <p className="text-center text-sm leading-5 tracking-[0.14px] text-[#737780]">
            By filling out this form, you acknowledge that you have read and agree to our{" "}
            <Link href="/terms" className="font-medium text-[#C9A227] hover:underline">
              Terms &amp; Conditions
            </Link>
            .
          </p>

          <div className="flex justify-end">
            <PrimaryButton type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit for verification"}
            </PrimaryButton>
          </div>
        </div>
      </form>

      <VerificationModal open={showVerification} onClose={goToDashboard} />
    </div>
  )
}

export default Form2
