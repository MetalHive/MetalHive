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

    // Local state for address breakdown
    const [addressDetails, setAddressDetails] = useState({
        street: '',
        apartment: '',
        city: '',
        province: '',
        postalCode: '',
        country: ''
    })

    // Initialize address details if buyerData.companyAddress exists
    useState(() => {
        if (buyerData.companyAddress) {
            // Simple init, normally would parse
        }
    })

    const [preview, setPreview] = useState<string | null>(null)

    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setAddressDetails(prev => ({ ...prev, [name]: value }))
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, files } = e.target as any
        if (files && files[0]) {
            updateBuyerData({ [name]: files[0] })
            setPreview(URL.createObjectURL(files[0]))
        } else {
            if (name === "contactPersonName") {
                updateBuyerData({ contactPerson: { ...buyerData.contactPerson, name: value } })
            } else if (name === "contactPersonPosition") {
                updateBuyerData({ contactPerson: { ...buyerData.contactPerson, position: value } })
            } else if (name === "contactPersonPhone") {
                updateBuyerData({ contactPerson: { ...buyerData.contactPerson, phone: value } })
            } else {
                updateBuyerData({ [name]: value })
            }
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const newErrors: { [key: string]: string } = {}

        // Construct full address
        const fullAddress = `${addressDetails.street}, ${addressDetails.apartment ? addressDetails.apartment + ', ' : ''}${addressDetails.city}, ${addressDetails.province}, ${addressDetails.postalCode}, ${addressDetails.country}`.replace(/, ,/g, ',').trim()

        // Validate required fields
        if (!buyerData.companyName) newErrors.companyName = "Company Name is required"
        if (!buyerData.registrationNumber) newErrors.registrationNumber = "Registration Number is required"
        if (!addressDetails.street) newErrors.street = "Street Address is required"
        if (!addressDetails.city) newErrors.city = "City is required"
        if (!addressDetails.province) newErrors.province = "Province is required"
        if (!addressDetails.country) newErrors.country = "Country is required"

        if (!buyerData.contactPerson.name) newErrors.contactPersonName = "Contact Person Name is required"
        if (!buyerData.contactPerson.position) newErrors.contactPersonPosition = "Contact Person Position is required"

        // Validate Phone if needed (User said "add phone number column and this should be verified")
        // Assuming required
        if (!buyerData.contactPerson.phone) newErrors.contactPersonPhone = "Contact Person Phone is required"


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
                password_confirm: buyerData.confirmPassword,
                company_name: buyerData.companyName,
                registration_number: buyerData.registrationNumber,
                company_address: fullAddress,
                contact_person_name: buyerData.contactPerson.name,
                contact_person_position: buyerData.contactPerson.position,
                contact_person_phone: buyerData.contactPerson.phone, // Passing phone to API (Backend change needed)
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

                    {/* Address Fields Block */}
                    <div className="block border bg-[#F6F6F6] border-[#F6F6F6] rounded-2xl text-md text-gray-600">
                        <div className="mb-2 text-lg pt-2 pl-2 font-medium">Company Address</div>
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
                                <input
                                    type="text"
                                    name="province"
                                    placeholder="Province"
                                    value={addressDetails.province}
                                    onChange={handleAddressChange}
                                    className={`w-full bg-white border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 ${errors.province ? "border-red-500" : "border-gray-200 focus:ring-yellow-300"}`}
                                />
                                {errors.province && <p className="text-red-500 text-sm mt-1">{errors.province}</p>}
                            </div>
                            <div>
                                <input
                                    type="text"
                                    name="postalCode"
                                    placeholder="Postal Code"
                                    value={addressDetails.postalCode}
                                    onChange={handleAddressChange}
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
                                📄 Upload document e.g. Business Certificate/License
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
                                name="contactPersonName"
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
                                name="contactPersonPosition"
                                placeholder="Position"
                                value={buyerData.contactPerson.position}
                                onChange={handleChange}
                                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 
                           text-sm placeholder-gray-400 focus:outline-none focus:ring-2 
                           focus:ring-yellow-300"
                                required
                            />

                            <input
                                type="text"
                                name="contactPersonPhone"
                                placeholder="Phone Number"
                                value={buyerData.contactPerson.phone}
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
