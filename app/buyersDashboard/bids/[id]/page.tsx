'use client'
import { useState } from 'react';
import { ChevronLeft, Star, MapPin, Package, Scale } from 'lucide-react';
import ProductCard from '../../components/marketPlaceCard';
import Link from 'next/link'
interface ListingData {
  id: string;
  title: string;
  weight: string;
  seller: string;
  price: number;
  rating: number;
  type: string;
  quantity: string;
  location: string;
  description: string;
  images: string[];
  createdDate: string;
  priceNote: string;
}
 const sampleProducts = [
        {
            id: '1',
            title: "Copper Scrap",
            price: "$520 / tonne",
            location: "Liverpool",
            timeAgo: "2 hours ago",
            description: "Bulk supply available, uniform quality",
            images: ["/bid1.png", "/bid2.png", "/bid3.png", "/bid4.png", "/bid5.png"],
        },
        {
            id: '2',
            title: "Aluminium Ingots",
            price: "$1,200 / tonne",
            location: "Manchester",
            timeAgo: "5 hours ago",
            description: "High-grade aluminium suitable for industrial use",
            images: ["/bid2.png", "/bid3.png", "/bid4.png"],
        },
        {
            id: '3',
            title: "Steel Rebars",
            price: "$780 / tonne",
            location: "Birmingham",
            timeAgo: "1 day ago",
            description: "Construction-grade steel, ready for pickup",
            images: ["/bid3.png", "/bid4.png", "/bid5.png"],
        },
        {
            id: '4',
            title: "Brass Scrap",
            price: "$640 / tonne",
            location: "Leeds",
            timeAgo: "3 hours ago",
            description: "Clean brass scrap with consistent composition",
            images: ["/bid1.png", "/bid3.png", "/bid5.png"],
        },
       
    ];
// Sample data - replace with your actual data
const sampleListing: ListingData = {
  id: '1',
  title: 'Copper Scrap – 200kg',
  weight: '500kg',
  seller: 'Offer received on Mixed Steel Scrap – 500kg',
  price: 18.00,
  rating: 5,
  type: 'Copper Scrap',
  quantity: '500kg',
  location: 'Birmingham',
  description: 'We can arrange pickup within 24 hours and will handle all loading logistics on our side. Our team operates nationwide, so collection will not require any support from you. This ensures a smooth, quick turnaround.',
  images: [
    'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&q=80',
    'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&q=80',
    'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&q=80',
  ],
  createdDate: '12-07-2025',
  priceNote: 'Final price depends on your bid.'
};

const BidsDetail: React.FC<{ data?: ListingData }> = ({ data = sampleListing }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  return (
    <div className="">
      <div className="w-full ">
          {/* Back Button */}
            <button className=" text-gray-600 mb-4 hover:text-gray-900">
              <ChevronLeft className="w-5 h-5" />
            </button>
        <div className="grid md:grid-cols-12 gap-8 p-6">
          {/* Left Column - Images */}
          <div className=' col-span-6 mb-20'>
            {/* Title */}
            <h2 className="text-lg font-semibold mb-2">{data.title} - {data.weight}</h2>

            {/* Image Carousel */}
            <div className="relative rounded-lg overflow-hidden bg-gray-100 mb-4">
              <img 
                src={data.images[currentImageIndex]} 
                alt={data.title}
                className="w-full h-80 object-cover"
              />
              
              {/* Image Dots */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                {data.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentImageIndex 
                        ? 'bg-white w-6' 
                        : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Product Title and Date */}
            <div className='mt-7'>
              <h1 className="text-2xl font-bold mb-1">{data.title}</h1>
              <p className="text-sm text-gray-500 mb-4">
              Offer received on Mixed Steel Scrap – 500kg
              </p>

              {/* Description Section */}
              <div className="my-6">
                <h3 className="text-sm font-semibold mb-2">Description</h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {data.description}
                </p>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-start gap-2">
                  <Package className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Base Price</p>
                    <p className="text-sm font-semibold">${data.price.toFixed(2)}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Location</p>
                    <p className="text-sm font-semibold">{data.location}, UK</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Scale className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Date Listed</p>
                    <p className="text-sm font-semibold"> Nov 10, 2025</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

      {/* Right Column - Your Offer Card */}
<div className='col-span-full md:col-start-7 border md:col-span-5'>
  <div className="p-6">
    {/* Header */}
    <h2 className="text-lg font-semibold text-gray-900 mb-6">Your Offer</h2>
    
    {/* Offer Amount */}
    <div className="mb-4">
      <p className="text-sm text-gray-600 mb-1">Your Offer Amount</p>
      <p className="text-2xl font-bold text-gray-900">£540</p>
    </div>
    
    {/* Date Submitted */}
    <div className="mb-4">
      <p className="text-sm text-gray-600 mb-1">Date Submitted</p>
      <p className="text-sm font-medium text-gray-900">Nov 11, 2025 09:12</p>
    </div>
    
    {/* Status */}
    <div className="mb-6">
      <p className="text-sm text-gray-600">Awaiting buyer response</p>
    </div>
    
    {/* Message */}
    <div className="mb-6 p-4 bg-gray-50 rounded-lg w-full">
      <p className="text-sm text-gray-700 leading-relaxed">
        We can arrange pickup within 24 hours and cover logistics. If the material is available in additional volume, 
        we're open to a larger purchase and long-term supply agreement
      </p>
    </div>
    
    {/* Action Buttons */}
    <div className="space-y-3">
      <button className="w-full bg-[#C9A227] hover:bg-yellow-600 text-white font-semibold py-3 rounded-lg transition-colors">
        Withdraw Offer
      </button>
      <button className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 rounded-lg transition-colors">
        Edit Bid
      </button>
    </div>
  </div>
</div>
        </div>
          
      </div>
    </div>
  );
};

export default BidsDetail;