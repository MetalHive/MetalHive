"use client";
import React, { useState } from "react";
import { Edit3, ChevronLeft } from "lucide-react";
import { useListingFormStore } from "@/app/stores/ListingFormStore";

interface PreviewPublishProps {
    onBack?: () => void;
    /** Jump back to step 1 (wizard state, not browser history). */
    onEdit: () => void;
    onPublish: () => void;
    isPublishing?: boolean;
    /** Error from the last create/publish attempt, if any. */
    error?: string | null;
}

const PreviewPublish: React.FC<PreviewPublishProps> = ({ onBack, onEdit, onPublish, isPublishing = false, error }) => {
    const { getFormData } = useListingFormStore();

    const [currentImage, setCurrentImage] = useState(0);

    // Get form data from store
    const formData = getFormData();

    // Create product data from form
    const productData = {
        title: formData.materialName || "Untitled listing",
        price: parseFloat(formData.basePrice) || 0,
        details: {
            materialType: formData.materialType || "N/A",
            condition: formData.condition || "N/A",
            quantity: formData.quantity || "N/A",
            listedOn: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
            location: formData.location || "N/A",
        },
        description: formData.description || "No description provided",
        additionalNotes: formData.additionalNotes,
        images: formData.images.length > 0 ? formData.images : ["/bid1.png"],
    };

    const activeImage = Math.min(currentImage, productData.images.length - 1);

    return (
        <div className="min-h-screen ">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Back Button */}
                {onBack && (
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-[#17181a] mb-6 hover:opacity-70 transition-opacity"
                    >
                        <ChevronLeft className="w-5 h-5" />
                        <span className="text-sm font-medium">Back</span>
                    </button>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
                    {/* Image Section */}
                    <div className=" col-span-3">
                        <div className="relative">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={productData.images[activeImage]}
                                alt={productData.title}
                                className="w-full h-[600px] md:h-[450px] object-cover rounded-lg shadow-md bg-gray-200"
                            />
                        </div>
                        {productData.images.length > 1 && (
                            <div className="flex justify-center gap-3 mt-4">
                                {productData.images.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentImage(index)}
                                        className={`w-3 h-3 rounded-full transition-colors ${activeImage === index ? "bg-gray-900" : "bg-gray-300"
                                            }`}
                                        aria-label={`View image ${index + 1}`}
                                    />
                                ))}
                            </div>
                        )}
                        {/* Description */}
                        <div className="mt-8">
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">Description</h2>
                            <p className="text-gray-600 leading-relaxed whitespace-pre-line">{productData.description}</p>
                            {productData.additionalNotes && (
                                <>
                                    <h3 className="text-base font-semibold text-gray-900 mt-6 mb-2">Additional Notes</h3>
                                    <p className="text-gray-600 leading-relaxed whitespace-pre-line">{productData.additionalNotes}</p>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="col-span-2">
                        <div className="flex flex-col justify-start">
                            <h1 className="text-3xl font-bold text-gray-900 mb-1">
                                {productData.title}
                            </h1>
                            <p className="text-sm text-gray-500 mb-6">Preview — this is how buyers will see your listing.</p>

                            {/* Price */}
                            <div className="flex items-baseline gap-2 mb-6">
                                <p className="text-4xl font-extrabold text-gray-900">
                                    ${productData.price.toFixed(2)}
                                </p>
                                <span className="text-lg text-gray-600">
                                    per {formData.priceUnit || "kg"}
                                </span>
                            </div>

                            {/* Details */}
                            <div className="space-y-2 mb-6  p-4 ">
                                {Object.entries(productData.details).map(([key, value]) => (
                                    <div
                                        key={key}
                                        className="flex justify-between items-center py-2 border-b border-b-[#ECECEC] last:border-b-0 "
                                    >
                                        <span className="text-gray-600 capitalize">
                                            {key.replace(/([A-Z])/g, " $1").trim()}
                                        </span>
                                        <span className="font-medium text-gray-900">{value}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-4">
                                <button
                                    onClick={onEdit}
                                    disabled={isPublishing}
                                    className="bg-white hover:bg-[#C9A227] hover:text-white font-semibold px-4 py-2 rounded-md transition-colors flex border-[#E8E8E8] border items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Edit3 className="w-4 h-4" />
                                    Edit
                                </button>
                                <button
                                    onClick={onPublish}
                                    disabled={isPublishing}
                                    className="bg-[#C9A227] hover:bg-gray-50 hover:text-[#C9A227] text-white font-semibold px-4 py-2 rounded-md border border-gray-300 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isPublishing ? 'Publishing...' : 'Publish'}
                                </button>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
                                    {error}
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default PreviewPublish;
