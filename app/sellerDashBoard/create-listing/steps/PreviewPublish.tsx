"use client";
import React, { useState } from "react";
import { Star, ShoppingCart, Edit3 } from "lucide-react";

const productData = {
    title: "Clean Copper Scrap - 200kg",
    productCode: "CCS-2024-001",
    price: 505,
    rating: 5,
    reviews: 32200,
    details: {
        materialType: "Copper",
        condition: "Mixed Grade A/B",
        quantity: "200kg",
        listedOn: "October 16, 2025",
        location: "Sheffield",
    },
    description:
        "High-quality clean copper scrap, ideal for recycling and manufacturing purposes. This batch consists of mixed grade copper materials that have been sorted and prepared for industrial use. All materials are verified and certified for purity and quality. Suitable for various industrial applications, including manufacturing, construction, and metal fabrication.",
    images: [
        "https://images.unsplash.com/photo-1563460716037-460a3ad24ba9?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1618172193622-5c6eb3c94584?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1581093458791-9be1c4c2f7de?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1645129722600-00a9d56d4a89?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1618172249170-54b39c7822f2?auto=format&fit=crop&w=800&q=80",
    ],
};

const ProductListing: React.FC = () => {
    const [currentImage, setCurrentImage] = useState(0);

    return (
        <div className="min-h-screen ">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                                    ({productData.reviews.toLocaleString()} reviews)
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
                                <button className=" bg-white hover:bg-[#C9A227] hover:text-white font-semibold px-4 py-2  rounded-md transition-colors flex border-[#E8E8E8] border items-center justify-center gap-2">
                                    Edit
                                </button>
                                <button className=" bg-[#C9A227] hover:bg-gray-50 hover:text-[#C9A227] text-white font-semibold px-4 py-2  rounded-md border border-gray-300 transition-colors flex items-center justify-center gap-2">
                                    Publish
                                </button>
                            </div>

                            {/* Description */}

                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ProductListing;
