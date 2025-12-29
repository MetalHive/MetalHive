"use client"
import { useState } from "react"
import { IoArrowBack } from "react-icons/io5"
import { AiOutlineUpload } from "react-icons/ai"
import { useFormStore } from "@/app/stores/FormStore"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/hooks/useAuth"

interface Form2Props {
  onComplete?: () => void
  onBack?: () => void
}

const Form2: React.FC<Form2Props> = ({ onComplete, onBack }) => {
  const { formData, updateFormData } = useFormStore()
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const router = useRouter()
  const { registerSeller, isLoading, error: authError } = useAuth()

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

    // Validate required fields
    if (!formData.BusinessType) newErrors.BusinessType = "Business Type is required"
    if (!formData.Address) newErrors.Address = "Address is required"
    if (!formData.Description) newErrors.Description = "Description is required"

    // Validate password confirmation
    if (formData.password !== passwordConfirm) {
      newErrors.passwordConfirm = "Passwords do not match"
    }

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
        password_confirm: passwordConfirm,
        business_type: formData.BusinessType as 'INDIVIDUAL' | 'COMPANY',
        address: formData.Address,
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
  const fields = [
    { label: "Business Type", type: "select", key: "BusinessType", options: ["INDIVIDUAL", "COMPANY"] },
    { label: "Address", type: "text", key: "Address" },
    { label: "Upload Company Logo", type: "file", key: "UploadCompanyLogo" },
    { label: "Description", type: "textarea", key: "Description" },
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
          {fields.map(({ label, type, key, options }) => {
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
                        <AiOutlineUpload size={20} /> Upload Company Logo
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
                  ) : type === "select" ? (
                    <select
                      name={key}
                      value={(value as string) ?? ""}
                      onChange={handleChange}
                      disabled={isLoading}
                      className={`w-full bg-white border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 ${errors[key] ? "border-red-500 focus:ring-red-400" : "border-gray-200 focus:ring-yellow-300"
                        } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <option value="">Select type</option>
                      {options?.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : type === "textarea" ? (
                    <textarea
                      name={key}
                      value={(value as string) ?? ""}
                      onChange={handleChange}
                      placeholder="Describe the project, be as detailed as possible"
                      disabled={isLoading}
                      className={`w-full bg-white border rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 ${errors[key] ? "border-red-500 focus:ring-red-400" : "border-gray-200 focus:ring-yellow-300"
                        } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      rows={4}
                    />
                  ) : (
                    <input
                      type="text"
                      name={key}
                      value={(value as string) ?? ""}
                      onChange={handleChange}
                      placeholder={label}
                      disabled={isLoading}
                      className={`w-full bg-white border rounded-xl px-4 py-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 ${errors[key] ? "border-red-500 focus:ring-red-400" : "border-gray-200 focus:ring-yellow-300"
                        } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    />
                  )}
                  {errors[key] && <p className="text-red-500 text-sm mt-1">{errors[key]}</p>}
                </div>
              </label>
            )
          })}

          {/* Password Confirmation Field */}
          <label className="block border bg-[#F6F6F6] border-[#F6F6F6] rounded-2xl text-md text-gray-600">
            <div className="mb-2 text-lg pt-2 pl-2 font-medium">Confirm Password</div>
            <div className="bg-white p-4">
              <input
                type="password"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                placeholder="Re-enter your password"
                disabled={isLoading}
                className={`w-full bg-white border rounded-xl px-4 py-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 ${errors.passwordConfirm ? "border-red-500 focus:ring-red-400" : "border-gray-200 focus:ring-yellow-300"
                  } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              />
              {errors.passwordConfirm && <p className="text-red-500 text-sm mt-1">{errors.passwordConfirm}</p>}
            </div>
          </label>

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
