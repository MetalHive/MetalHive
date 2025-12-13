"use client"
import React, { useState } from 'react';
import { Star, ShoppingCart, Edit3 } from 'lucide-react';
import Image from "next/image";
// Product data object
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
    location: "Sheffield"
  },
  description: "High-quality clean copper scrap, ideal for recycling and manufacturing purposes. This batch consists of mixed grade copper materials that have been sorted and prepared for industrial use. All materials are verified and certified for purity and quality. Suitable for various industrial applications, including manufacturing, construction, and metal fabrication.",
 images: [
  "https://images.unsplash.com/photo-1563460716037-460a3ad24ba9?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1618172193622-5c6eb3c94584?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1581093458791-9be1c4c2f7de?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1645129722600-00a9d56d4a89?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1618172249170-54b39c7822f2?auto=format&fit=crop&w=800&q=80"
],
  bids: [
    {
      id: 1,
      buyer: "Vendor Ltd.",
      offer: 450,
      date: "Oct 22",
      status: "New"
    },
    {
      id: 2,
      buyer: "Londonbiz Co.",
      offer: 530,
      date: "Oct 23",
      status: "Selected"
    },
    {
      id: 3,
      buyer: "Shellfield",
      offer: 505,
      date: "Oct 21",
      status: "New"
    }
  ]
};

const ProductListing: React.FC = () => {
  const [currentImage, setCurrentImage] = useState(0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
           <Image
                    src="/logoBlack.png"
                    width={120}
                    height={120}
                    alt="MetalHive black logo"
                  />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Product Grid */}
        <div className=" p-6 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Image Section */}
            <div>
              <div className="relative">
                <img
                  src={productData.images[currentImage]}
                  alt={productData.title}
                  className="w-full h-96 md:h-[589px] object-cover rounded-lg bg-gray-200"
                />
              </div>
              <div className="flex justify-center gap-2 mt-4">
                {productData.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImage(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      currentImage === index ? 'bg-gray-900' : 'bg-gray-300'
                    }`}
                    aria-label={`View image ${index + 1}`}
                  />
                ))}
              </div>
               {/* Bid Summary */}
        <div className=" p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Bid Summary</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Buyer</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Offer</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Status</th>
                </tr>
              </thead>
              <tbody>
                {productData.bids.map((bid) => (
                  <tr key={bid.id} className="border-b border-gray-200">
                    <td className="py-3 px-4 text-gray-900">{bid.buyer}</td>
                    <td className="py-3 px-4 text-gray-900">${bid.offer}</td>
                    <td className="py-3 px-4 text-gray-900">{bid.date}</td>
                    <td className="py-3 px-4">
                      <span className={`font-medium ${
                        bid.status === 'Selected' ? 'text-blue-600' : 'text-green-600'
                      }`}>
                        {bid.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                {productData.title}
              </h1>
              <p className="text-sm text-gray-500 mb-3">{productData.productCode}</p>
              
              <div className="flex items-center gap-2 mb-4">
                <div className="flex text-yellow-500">
                  {[...Array(productData.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <span className="text-sm text-gray-600">({productData.reviews.toLocaleString()})</span>
              </div>

              <p className="text-3xl font-bold text-gray-900 mb-6">
                ${productData.price}
              </p>

              {/* Details */}
              <div className="space-y-2 mb-4">
                {Object.entries(productData.details).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center py-3 border-b border-gray-200">
                    <span className="text-gray-600 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <span className="font-medium text-gray-900">{value}</span>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <button className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 px-4 rounded-md transition-colors mb-2 flex items-center justify-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Place Bid
              </button>
              <button className="w-full bg-white hover:bg-gray-50 text-gray-900 font-semibold py-3 px-4 rounded-md border border-gray-300 transition-colors flex items-center justify-center gap-2">
                <Edit3 className="w-5 h-5" />
                Edit Listing
              </button>
               {/* Description */}
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
          <p className="text-gray-600 leading-relaxed">
            {productData.description}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Stats Card */}
        <div className="flex justify-between items-center gap-4 ">
          <div>
            <div className="text-gray-500 text-sm mb-2">Views</div>
            <div className="text-3xl font-semibold text-gray-900">164</div>
          </div>
          
          <div>
            <div className="text-gray-500 text-sm mb-2">Bids Received</div>
            <div className="text-3xl font-semibold text-gray-900">4</div>
          </div>
          
          <div>
            <div className="text-gray-500 text-sm mb-2">Average Offer</div>
            <div className="text-3xl font-semibold text-gray-900">$505</div>
          </div>
        </div>
      </div>
    </div>
        </div>
            </div>



       
       
      </main>
    </div>
  );
};

export default ProductListing;