"use client";
import React, { useState } from "react";
import { Star, Edit3, ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useListingFormStore } from "@/app/stores/ListingFormStore";
import { useCreateListing, usePublishListing } from "@/app/hooks/useApi";

interface PreviewPublishProps {
    onBack?: () => void;
}

const ProductListing: React.FC<PreviewPublishProps> = ({ onBack }) => {
    const router = useRouter();
    const { getFormData, resetForm } = useListingFormStore();
    const createListing = useCreateListing();
    const publishListing = usePublishListing();

    const [currentImage, setCurrentImage] = useState(0);
    const [isPublishing, setIsPublishing] = useState(false);

    // Get form data from store
    const formData = getFormData();

    // Create product data from form
    const productData = {
        title: formData.materialName || "Copper Scrap Bundle",
        productCode: `CS-${Date.now()}`,
        price: parseFloat(formData.basePrice) || 0,
        rating: 5,
        reviews: 0,
        details: {
            materialType: formData.materialType || "N/A",
            condition: formData.condition || "N/A",
            quantity: formData.quantity || "N/A",
            listedOn: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
            location: formData.location || "N/A",
        },
        description: formData.description || "No description provided",
        images: formData.images.length > 0 ? formData.images : [
            "https://images.unsplash.com/photo-1563460716037-460a3ad24ba9?auto=format&fit=crop&w=800&q=80",
        ],
    };

    const handlePublish = async () => {
        setIsPublishing(true);
        try {
            // Create the listing first
            const result = await createListing.mutateAsync(formData);

            // If creation successful, publish it
            if (result.id) {
                try {
                    await publishListing.mutateAsync(result.id);

                    // Success - show message, reset form and redirect
                    alert('Listing published successfully!');
                    resetForm();
                    router.push('/sellerDashBoard');
                } catch (publishError) {
                    console.error('Failed to publish listing:', publishError);
                    alert('Listing created but failed to publish. You can publish it manually from your dashboard.');
                    resetForm();
                    router.push('/sellerDashBoard');
                }
            }
        } catch (error) {
            console.error('Failed to create listing:', error);
            alert('Failed to create listing. Please try again.');
        } finally {
            setIsPublishing(false);
        }
    };

    const handleEdit = () => {
        // Go back to step 1
        router.back();
    };

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
                            <img
                                src={productData.images[currentImage]}
                                alt={productData.title}
                                className="w-full h-[600px] md:h-[450px] object-cover rounded-lg shadow-md bg-gray-200"
                            />
                        </div>
                        <div className="flex justify-center gap-3 mt-4">
                            {productData.images.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentImage(index)}
                                    className={`w-3 h-3 rounded-full transition-colors ${currentImage === index ? "bg-gray-900" : "bg-gray-300"
                                        }`}
                                    aria-label={`View image ${index + 1}`}
                                />
                            ))}
                        </div>
                        {/* Description */}
                        <div className="mt-8">
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">Description</h2>
                            <p className="text-gray-600 leading-relaxed">{productData.description}</p>
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="col-span-2">
                        <div className="flex flex-col justify-start">
                            <h1 className="text-3xl font-bold text-gray-900 mb-1">
                                {productData.title}
                            </h1>
                            <p className="text-sm text-gray-500 mb-3">{productData.productCode}</p>

                            {/* Rating */}
                            <div className="flex items-center gap-2 mb-6">
                                <div className="flex text-yellow-500">
                                    {[...Array(productData.rating)].map((_, i) => (
                                        <Star key={i} className="w-5 h-5 fill-current" />
                                    ))}
                                </div>
                                <span className="text-sm text-gray-600">
                                    (New listing)
                                </span>
                            </div>

                            {/* Price */}
                            <div className="flex items-baseline gap-2 mb-6">
                                <p className="text-4xl font-extrabold text-gray-900">
                                    ${productData.price}
                                </p>
                                <span className="text-lg text-gray-600">per tonne</span>
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
                                    onClick={handleEdit}
                                    disabled={isPublishing}
                                    className="bg-white hover:bg-[#C9A227] hover:text-white font-semibold px-4 py-2 rounded-md transition-colors flex border-[#E8E8E8] border items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Edit3 className="w-4 h-4" />
                                    Edit
                                </button>
                                <button
                                    onClick={handlePublish}
                                    disabled={isPublishing}
                                    className="bg-[#C9A227] hover:bg-gray-50 hover:text-[#C9A227] text-white font-semibold px-4 py-2 rounded-md border border-gray-300 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isPublishing ? 'Publishing...' : 'Publish'}
                                </button>
                            </div>

                            {/* Error Message */}
                            {createListing.error && (
                                <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
                                    Failed to create listing. Please try again.
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ProductListing;
