"use client"

import { useState } from "react"
import { IoArrowBack } from "react-icons/io5"
import { useBuyerFormStore } from "@/app/stores/BuyerStore"
import { useRouter } from "next/navigation"
import authService from "@/app/lib/api/services/authService"

interface Form2Props {
  onComplete?: () => void
  onBack?: () => void
}
const Form2: React.FC<Form2Props> = ({ onComplete, onBack }) => {
  const router = useRouter()
  const { buyerData, updateBuyerData, resetBuyerData } = useBuyerFormStore()
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)


  const [preview, setPreview] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, files } = e.target as any
    if (files) {
      updateBuyerData({ [name]: files[0] })
    } else {
      if (name === "contactPersonName") {
        updateBuyerData({ contactPerson: { ...buyerData.contactPerson, name: value } })
      } else if (name === "contactPersonPosition") {
        updateBuyerData({ contactPerson: { ...buyerData.contactPerson, position: value } })
      } else {
        updateBuyerData({ [name]: value })
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors: { [key: string]: string } = {}

    // Validate required fields
    if (!buyerData.companyName) newErrors.companyName = "Company Name is required"
    if (!buyerData.registrationNumber) newErrors.registrationNumber = "Registration Number is required"
    if (!buyerData.companyAddress) newErrors.companyAddress = "Company Address is required"
    if (!buyerData.contactPerson.name) newErrors.contactPersonName = "Contact Person Name is required"
    if (!buyerData.contactPerson.position) newErrors.contactPersonPosition = "Contact Person Position is required"

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors({})
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      await authService.registerBuyer({
        email: buyerData.email,
        password: buyerData.password,
        password_confirm: buyerData.password,
        company_name: buyerData.companyName,
        registration_number: buyerData.registrationNumber,
        company_address: buyerData.companyAddress,
        contact_person_name: buyerData.contactPerson.name,
        contact_person_position: buyerData.contactPerson.position,
        verification_document: buyerData.verificationDocument || undefined,
      })

      resetBuyerData()
      if (onComplete) onComplete()
      router.push("/buyersDashboard")
    } catch (error: any) {
      console.error('Registration error:', error)
      setSubmitError(error?.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }



  return (
    <div className="flex-1 flex justify-center items-start px-4 pt-10">
      <div className="w-full max-w-2xl flex flex-col">

        {/* Back button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-500 text-sm border-2 border-[#D8D8D8] 
                     w-20 h-10 rounded-full px-3 mb-6"
        >
          <IoArrowBack size={20} /> <span>Back</span>
        </button>

        <h2 className="text-xl font-semibold text-[#17181A]">
          Verify Your Company
        </h2>
        <p className="text-[#737780] mb-6">
          We verify every buyer to keep the marketplace secure and compliant.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col space-y-6">

          {/* Company Name */}
          <LabelInput
            label="Company Name"
            name="companyName"
            value={buyerData.companyName}
            onChange={handleChange}
            required
          />

          {/* Registration Number */}
          <LabelInput
            label="Registration Number"
            name="registrationNumber"
            value={buyerData.registrationNumber}
            onChange={handleChange}
            required
          />

          {/* Company Address */}
          <LabelInput
            label="Company Address"
            name="companyAddress"
            value={buyerData.companyAddress}
            onChange={handleChange}
            required
          />

          {/* File Upload */}
          <div className="block border bg-[#F6F6F6] border-[#F6F6F6] rounded-2xl">
            <div className="mb-2 text-lg pt-2 pl-2 font-medium">
              Upload Verification Document
            </div>

            <div className="bg-white p-4">

              <label
                className="cursor-pointer flex items-center gap-3 w-fit 
                           bg-gray-100 border border-gray-300 
                           text-gray-700 px-4 py-2 rounded-xl text-sm hover:bg-gray-200"
              >
                📄 Upload Document
                <input
                  type="file"
                  name="document"
                  className="hidden"
                  onChange={handleChange}
                />
              </label>

              {/* Preview */}
              {preview && (
                <div className="mt-4 flex items-center gap-4">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-16 h-16 object-cover rounded-md border"
                  />
                  <p className="text-sm text-gray-600">{buyerData.verificationDocument?.name}</p>
                </div>
              )}
            </div>
          </div>

          {/* Contact Person Group */}
          <div className="block border bg-[#F6F6F6] border-[#F6F6F6] rounded-2xl">
            <div className="mb-2 text-lg pt-2 pl-2 font-medium">Contact person name & position</div>

            <div className="bg-white p-4 flex flex-col gap-4">

              <input
                type="text"
                name="contactName"
                placeholder="Full Name"
                value={buyerData.contactPerson.name}
                onChange={handleChange}
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 
                           text-sm placeholder-gray-400 focus:outline-none focus:ring-2 
                           focus:ring-yellow-300"
                required
              />

              <input
                type="text"
                name="contactPosition"
                placeholder="Position"
                value={buyerData.contactPerson.position}
                onChange={handleChange}
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 
                           text-sm placeholder-gray-400 focus:outline-none focus:ring-2 
                           focus:ring-yellow-300"
                required
              />

            </div>
          </div>

          {/* Error Message */}
          {submitError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {submitError}
            </div>
          )}

          {/* Submit */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#C9A227] text-white hover:border-[#C9A227] hover:border-2 
                       hover:bg-white hover:text-[#C9A227] font-semibold px-5 py-2.5 
                       md:px-6 md:py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit for verification'}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}


// Reusable input component
const LabelInput = ({
  label,
  name,
  value,
  onChange,
  required,
}: any) => (
  <label className="block border bg-[#F6F6F6] border-[#F6F6F6] rounded-2xl">
    <div className="mb-2 text-lg pt-2 pl-2 font-medium">{label}</div>
    <div className="bg-white p-4">
      <input
        type="text"
        name={name}
        placeholder={label}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 
                   text-sm placeholder-gray-400 focus:outline-none focus:ring-2 
                   focus:ring-yellow-300"
      />
    </div>
  </label>
)

export default Form2
