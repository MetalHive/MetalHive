"use client"
import { useState, useEffect } from "react"
import { IoArrowBack } from "react-icons/io5"
import { AiOutlineUpload } from "react-icons/ai"
import { useFormStore } from "@/app/stores/FormStore"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/hooks/useAuth"
import Link from "next/link"
interface Form2Props {
  onComplete?: () => void
  onBack?: () => void
}

const Form2: React.FC<Form2Props> = ({ onComplete, onBack }) => {
  const { formData, updateFormData } = useFormStore()
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const router = useRouter()
  const { registerSeller, isLoading, error: authError } = useAuth()

  // Local state for address breakdown
  const [addressDetails, setAddressDetails] = useState({
    street: '',
    apartment: '',
    city: '',
    province: '',
    postalCode: '',
    country: ''
  })

  // Initialize address details if formData.Address exists (simple check)
  useEffect(() => {
    if (formData.Address && !addressDetails.street) {
      // Ideally parse existing address, but for signup it's mostly empty.
      // Keeping it simple.
    }
  }, [formData.Address])


  const handleAddressChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    let { name, value } = e.target

    if (name === "postalCode") {
      value = value.toUpperCase().replace(/[^A-Z0-9]/g, "")

      if (value.length > 3) {
        value = value.slice(0, 3) + " " + value.slice(3, 6)
      }
    }

    setAddressDetails(prev => ({ ...prev, [name]: value }))
  }



  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, files } = e.target as any
    if (files) {
      updateFormData({ [name]: files[0] })
    } else {
      updateFormData({ [name]: value })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors: { [key: string]: string } = {}

    // Construct full address
    const fullAddress = `${addressDetails.street}, ${addressDetails.apartment ? addressDetails.apartment + ', ' : ''}${addressDetails.city}, ${addressDetails.province}, ${addressDetails.postalCode}, ${addressDetails.country}`.replace(/, ,/g, ',').trim()

    // Validate required fields
    if (!formData.BusinessType) newErrors.BusinessType = "Business Type is required"
    if (!addressDetails.street) newErrors.street = "Street Address is required"
    if (!addressDetails.city) newErrors.city = "City is required"
    if (!addressDetails.province) newErrors.province = "Province is required"
    if (!addressDetails.country) newErrors.country = "Country is required"
    if (!formData.Description) newErrors.Description = "Description is required"

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors({})

    try {
      // Map formData to API format
      const registrationData = {
        email: formData.email,
        password: formData.password,
        password_confirm: formData.confirmPassword,
        business_type: formData.BusinessType as 'INDIVIDUAL' | 'COMPANY',
        address: fullAddress, // Send concatenated address
        description: formData.Description,
        company_logo: formData.UploadCompanyLogo || undefined,
      }

      // Register seller via API
      await registerSeller(registrationData)

      // Success - redirect to dashboard
      router.push("/sellerDashBoard")
    } catch (err: any) {
      console.error("Registration failed:", err)
      // Error will be shown via authError from useAuth
    }

  }


  // Map labels to store keys explicitly
  // Removed "Address" from here, handled manually
  const fields = [
    { label: "Business Type", type: "select", key: "BusinessType", options: ["INDIVIDUAL", "COMPANY"] },
    { label: "Upload Scrap Photo (Max 5MB, 4 photos)", type: "file", key: "UploadCompanyLogo" },
    { label: "Describe scrap metal. And add estimate weight.", type: "textarea", key: "Description" },
  ]

  return (
    <div className="flex-1 flex justify-center items-center px-4 mt-10">
      <div className="w-full max-w-2xl flex flex-col">
        <button
          className="flex items-center gap-2 text-gray-500 text-sm border-2 border-[#D8D8D8] w-20 h-10 rounded-full px-3 mb-6"
          onClick={onBack}
          disabled={isLoading}
        >
          <IoArrowBack size={20} /> <span>Back</span>
        </button>

        <h2 className="text-xl font-semibold text-[#17181A]">Complete Your Seller Profile</h2>
        <p className="text-[#737780] mb-6">Add a few details so buyers can trust your listings.</p>

        {/* Show API error if any */}
        {authError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {authError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col space-y-6">

          {/* Business Type Field (First item from fields) */}
          <label className="block border bg-[#F6F6F6] border-[#F6F6F6] rounded-2xl text-md text-gray-600">
            <div className="mb-2 text-lg pt-2 pl-2 font-medium">Business Type</div>
            <div className="bg-white p-4">
              <select
                name="BusinessType"
                value={formData.BusinessType || ""}
                onChange={handleChange}
                className="w-full bg-white border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 border-gray-200 focus:ring-yellow-300"
              >
                <option value="">Select type</option>
                <option value="INDIVIDUAL">INDIVIDUAL</option>
                <option value="COMPANY">COMPANY</option>
              </select>
              {errors.BusinessType && <p className="text-red-500 text-sm mt-1">{errors.BusinessType}</p>}
            </div>
          </label>

          {/* Address Fields Block */}
          <div className="block border bg-[#F6F6F6] border-[#F6F6F6] rounded-2xl text-md text-gray-600">
            <div className="mb-2 text-lg pt-2 pl-2 font-medium">Address Details</div>
            <div className="bg-white p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <input
                  type="text"
                  name="street"
                  placeholder="Street Address"
                  value={addressDetails.street}
                  onChange={handleAddressChange}
                  className={`w-full bg-white border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 ${errors.street ? "border-red-500" : "border-gray-200 focus:ring-yellow-300"}`}
                />
                {errors.street && <p className="text-red-500 text-sm mt-1">{errors.street}</p>}
              </div>
              <div>
                <input
                  type="text"
                  name="apartment"
                  placeholder="Apartment / Suite No"
                  value={addressDetails.apartment}
                  onChange={handleAddressChange}
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-300"
                />
              </div>
              <div>
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={addressDetails.city}
                  onChange={handleAddressChange}
                  className={`w-full bg-white border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 ${errors.city ? "border-red-500" : "border-gray-200 focus:ring-yellow-300"}`}
                />
                {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
              </div>
              <div>
                <select
                  name="province"
                  value={addressDetails.province}
                  onChange={handleAddressChange}
                  className={`w-full bg-white border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 ${errors.province
                    ? "border-red-500"
                    : "border-gray-200 focus:ring-yellow-300"
                    }`}
                >
                  <option value="">Select Province / Territory</option>
                  <option value="Alberta">Alberta</option>
                  <option value="British Columbia">British Columbia</option>
                  <option value="Manitoba">Manitoba</option>
                  <option value="New Brunswick">New Brunswick</option>
                  <option value="Newfoundland and Labrador">Newfoundland and Labrador</option>
                  <option value="Northwest Territories">Northwest Territories</option>
                  <option value="Nova Scotia">Nova Scotia</option>
                  <option value="Nunavut">Nunavut</option>
                  <option value="Ontario">Ontario</option>
                  <option value="Prince Edward Island">Prince Edward Island</option>
                  <option value="Quebec">Quebec</option>
                  <option value="Saskatchewan">Saskatchewan</option>
                  <option value="Yukon">Yukon</option>
                </select>

                {errors.province && (
                  <p className="text-red-500 text-sm mt-1">{errors.province}</p>
                )}
              </div>

              <div>
                <input
                  type="text"
                  name="postalCode"
                  placeholder="Postal Code"
                  value={addressDetails.postalCode}
                  onChange={handleAddressChange}
                  pattern="[A-Za-z]\d[A-Za-z]\s?\d[A-Za-z]\d"
                  title="Postal code must be in the format V3T 0S8"
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-300"
                />
              </div>
              <div className="md:col-span-2">
                <input
                  type="text"
                  name="country"
                  placeholder="Country"
                  value={addressDetails.country}
                  onChange={handleAddressChange}
                  className={`w-full bg-white border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 ${errors.country ? "border-red-500" : "border-gray-200 focus:ring-yellow-300"}`}
                />
                {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
              </div>
            </div>
          </div>

          {/* Remaining Fields (Logo, Description) */}
          {/* {fields.slice(1).map(({ label, type, key, options }) => {
            const value = formData[key as keyof typeof formData]

            return (
              <label key={key} className="block border bg-[#F6F6F6] border-[#F6F6F6] rounded-2xl text-md text-gray-600">
                <div className="mb-2 text-lg pt-2 pl-2 font-medium">{label}</div>
                <div className="bg-white p-4">
                  {type === "file" ? (
                    <div>
                      <input
                        type="file"
                        name={key}
                        id={key}
                        accept="image/*"
                        onChange={handleChange}
                        className="hidden"
                        disabled={isLoading}
                      />
                      <label
                        htmlFor={key}
                        className={`flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl px-4 py-3 ${isLoading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                      >
                        <AiOutlineUpload size={20} /> {label}
                      </label>
                      {value instanceof File && (
                        <div className="mt-3 flex items-center gap-4">
                          {value.type.startsWith("image/") && (
                            <img
                              src={URL.createObjectURL(value)}
                              alt="Preview"
                              className="w-16 h-16 object-cover rounded-md border"
                            />
                          )}
                          <span className="text-gray-700">{value.name}</span>
                        </div>
                      )}
                    </div>
                  ) : type === "textarea" ? (
                    <textarea
                      name={key}
                      value={(value as string) ?? ""}
                      onChange={handleChange}
                      placeholder="Describe the project... estimate weight needed"
                      disabled={isLoading}
                      className={`w-full bg-white border rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 ${errors[key] ? "border-red-500 focus:ring-red-400" : "border-gray-200 focus:ring-yellow-300"
                        } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      rows={4}
                    />
                  ) : null}
                  {errors[key] && <p className="text-red-500 text-sm mt-1">{errors[key]}</p>}
                </div>
              </label>
            )
          })} */}
          <p className="text-center">
            By filling out this form, you acknowledge that you have read and agree to our{' '}
            <Link href="/terms" className="text-[#C9A227] hover:underline">
              Terms & Conditions
            </Link>.
          </p>



          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className={`bg-[#C9A227] text-white hover:border-[#C9A227] hover:border-2 hover:bg-white hover:text-[#C9A227] font-semibold px-5 py-2.5 md:px-6 md:py-3 rounded-lg transition ${isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </div>
        </form>

      </div>
    </div>
  )
}

export default Form2
