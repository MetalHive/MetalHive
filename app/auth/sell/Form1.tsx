"use client"
import { IoArrowBack } from "react-icons/io5"
import { useFormStore } from "@/app/stores/FormStore"
import { useState } from "react"
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai"
import { useRouter } from "next/navigation";

interface Form1Props {
  onComplete: () => void
}

const Form1: React.FC<Form1Props> = ({ onComplete }) => {
  const { formData, updateFormData } = useFormStore()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const router = useRouter()
  const handleClick = () => {
    router.push(`/auth`);
  };

  const fields = [
    { label: "Full Name", key: "fullName", type: "text", placeholder: "Atiba Heritage" },
    { label: "Email", key: "email", type: "email", placeholder: "you@example.com" },
    { label: "Password", key: "password", type: "password", placeholder: "********" },
    { label: "Confirm Password", key: "confirmPassword", type: "password", placeholder: "********" },
    { label: "Phone Number", key: "phone", type: "number", placeholder: "08012345678" },
  ]

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors: { [key: string]: string } = {}
    fields.forEach(({ key, label }) => {
      if (!formData[key as keyof typeof formData] || formData[key as keyof typeof formData] === "") {
        newErrors[key] = `${label} is required`
      }
    })

    // Password strength check
    const password = formData.password
    const confirmPassword = formData.confirmPassword

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
    <div className="flex-1 flex justify-center items-center px-4">
      <div className="w-full max-w-2xl flex flex-col">
        <button className="flex items-center gap-2 text-gray-500 text-sm border-2 border-[#D8D8D8] w-20 h-10 rounded-full px-3 mb-6"
          onClick={handleClick}>
          <IoArrowBack size={20} /> <span>Back</span>
        </button>

        <h2 className="text-xl font-semibold text-[#17181A] mb-6">Create Your Account</h2>

        <form onSubmit={handleContinue} className="flex flex-col space-y-6">
          {fields.map(({ label, key, type, placeholder }) => (
            <label
              key={label}
              className="block border bg-[#F6F6F6] border-[#F6F6F6] rounded-2xl text-md text-gray-600"
            >
              <div className="mb-2 text-lg pt-2 pl-2 font-medium">{label}</div>
              <div className="bg-white p-4 relative">
                <input
                  type={
                    label === "Password"
                      ? (showPassword ? "text" : "password")
                      : label === "Confirm Password"
                        ? (showConfirmPassword ? "text" : "password")
                        : type
                  }
                  placeholder={placeholder}
                  value={formData[key as keyof typeof formData] as string | number}
                  onChange={(e) => updateFormData({ [key]: e.target.value })}
                  className={`w-full bg-white border rounded-xl px-4 py-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 ${errors[key] ? "border-red-500 focus:ring-red-400" : "border-gray-200 focus:ring-yellow-300"
                    }`}
                />
                {label === "Password" && (
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? <AiFillEyeInvisible size={20} /> : <AiFillEye size={20} />}
                  </button>
                )}
                {label === "Confirm Password" && (
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showConfirmPassword ? <AiFillEyeInvisible size={20} /> : <AiFillEye size={20} />}
                  </button>
                )}
              </div>
              {errors[key] && <p className="text-red-500 text-sm mt-1">{errors[key]}</p>}
            </label>
          ))}

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

export default Form1
