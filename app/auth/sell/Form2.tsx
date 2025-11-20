"use client"
import { useState } from "react"
import { IoArrowBack } from "react-icons/io5"
import { AiOutlineUpload } from "react-icons/ai"
import { useFormStore } from "@/app/stores/FormStore"

interface Form2Props {
  onComplete?: () => void
  onBack?: () => void
}
const Form2: React.FC<Form2Props> = ({onComplete, onBack}) => {
  const { formData, updateFormData } = useFormStore()
  const [errors, setErrors] = useState<{ [key: string]: string }>({})


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, files } = e.target as any
    if (files) {
      updateFormData({ [name]: files[0] })
    } else {
      updateFormData({ [name]: value })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    const newErrors: { [key: string]: string } = {}
    if (!formData.businessType) newErrors.businessType = "Business Type is required"
    if (!formData.address) newErrors.address = "Address is required"
    if (!formData.description) newErrors.description = "Description is required"

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors({})
    console.log("All form data:", formData) // ready to submit to backend
    if (onComplete) onComplete()
  }

 

  const fields = [
    { label: "Business Type", type: "select", options: ["LLC", "Sole Proprietorship", "Partnership", "Corporation"] },
    { label: "Address", type: "text" },
    { label: "Upload Company Logo", type: "file" },
    { label: "Description", type: "textarea" },
  ]

  return (
    <div className="flex-1 flex justify-center items-center px-4 mt-10">
      <div className="w-full max-w-2xl flex flex-col">
        <button
          className="flex items-center gap-2 text-gray-500 text-sm border-2 border-[#D8D8D8] w-20 h-10 rounded-full px-3 mb-6"
          onClick={onBack}
        >
          <IoArrowBack size={20} /> <span>Back</span>
        </button>

        <h2 className="text-xl font-semibold text-[#17181A]">Complete Your Seller Profile</h2>
        <p className="text-[#737780] mb-6">Add a few details so buyers can trust your listings.</p>

        <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
          {fields.map(({ label, type, options }) => {
            const name = label.replace(/\s+/g, "")
            const value = formData[name as keyof typeof formData] as string | File | null

            return (
              <label key={label} className="block border bg-[#F6F6F6] border-[#F6F6F6] rounded-2xl text-md text-gray-600">
                <div className="mb-2 text-lg pt-2 pl-2 font-medium">{label}</div>
                <div className="bg-white p-4">
                  {type === "file" ? (
                    <div>
                      <input
                        type="file"
                        name={name}
                        id={name}
                        accept="image/*"
                        onChange={handleChange}
                        className="hidden"
                      />
                      <label
                        htmlFor={name}
                        className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl px-4 py-3 cursor-pointer"
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
                      name={name}
                      value={value as string}
                      onChange={handleChange}
                      className={`w-full bg-white border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 ${
                        errors[name] ? "border-red-500 focus:ring-red-400" : "border-gray-200 focus:ring-yellow-300"
                      }`}
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
                      name={name}
                      value={value as string}
                      onChange={handleChange}
                      placeholder="Describe the project, be as detailed as possible"
                      className={`w-full bg-white border rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 ${
                        errors[name] ? "border-red-500 focus:ring-red-400" : "border-gray-200 focus:ring-yellow-300"
                      }`}
                      rows={4}
                    />
                  ) : (
                    <input
                      type="text"
                      name={name}
                      value={value as string}
                      onChange={handleChange}
                      placeholder={label}
                      className={`w-full bg-white border rounded-xl px-4 py-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 ${
                        errors[name] ? "border-red-500 focus:ring-red-400" : "border-gray-200 focus:ring-yellow-300"
                      }`}
                    />
                  )}
                  {errors[name] && <p className="text-red-500 text-sm mt-1">{errors[name]}</p>}
                </div>
              </label>
            )
          })}

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-[#C9A227] text-white hover:border-[#C9A227] hover:border-2 hover:bg-white hover:text-[#C9A227] font-semibold px-5 py-2.5 md:px-6 md:py-3 rounded-lg transition"
            >
              Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Form2
