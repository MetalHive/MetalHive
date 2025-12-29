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
  title: 'Aluminium Sheets',
  weight: '500kg',
  seller: 'Metal Recycling Ltd.',
  price: 18.00,
  rating: 5,
  type: 'Copper Scrap',
  quantity: '500kg',
  location: 'Birmingham',
  description: 'This copper scrap batch is clean, well-sorted, and ready for immediate pickup. Material has low moisture content and consistent grade, suitable for recycling or industrial use.',
  images: [
    'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&q=80',
    'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&q=80',
    'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&q=80',
  ],
  createdDate: '12-07-2025',
  priceNote: 'Final price depends on your bid.'
};

const ScrapMetalListing: React.FC<{ data?: ListingData }> = ({ data = sampleListing }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  return (
    <div className="">
      <div className="w-full ">
          {/* Back Button */}
            <button className=" text-gray-600 mb-4 hover:text-gray-900">
              <ChevronLeft className="w-5 h-5" />
            </button>
        <div className="grid md:grid-cols-10 gap-8 p-6 border-b border-b-[#CCCCCC] mb-10">
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
                Listing created on {data.createdDate}
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
                    <p className="text-xs text-gray-500">Offer</p>
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
                    <p className="text-xs text-gray-500">Weight</p>
                    <p className="text-sm font-semibold">{data.quantity}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className='col-span-full md:col-start-8 md:col-span-4'>
            {/* Seller Info */}
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-1">{data.seller}</p>
              <h3 className="text-xl font-semibold mb-2">{data.title}</h3>
              
              {/* Rating */}
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-4 h-4 ${
                      i < data.rating 
                        ? 'fill-black text-black' 
                        : 'fill-gray-200 text-gray-200'
                    }`}
                  />
                ))}
              </div>

              {/* Price */}
              <p className="text-3xl font-bold mb-2">${data.price.toFixed(2)}</p>
              <p className="text-sm text-[#C9A227] flex items-center gap-1">
                <span className="text-[#C9A227]">⚠</span>
                {data.priceNote}
              </p>
            </div>

            {/* Details */}
            <div className="space-y-4 mb-6">
              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-sm text-gray-600">Type</span>
                <span className="text-sm font-medium">{data.type}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-sm text-gray-600">Quantity</span>
                <span className="text-sm font-medium">{data.quantity}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-sm text-gray-600">Location</span>
                <span className="text-sm font-medium">{data.location}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Link
                        href={`/buyersDashboard/Marketplace/Placebid`}
                        className="block"
                    >
              <button className="w-full bg-[#C9A227] hover:bg-yellow-600 text-white font-semibold py-3 rounded-lg transition-colors">
                Place Bid
              </button>
                    </Link>
              <button className="w-full text-gray-700 hover:bg-[#C9A227] shadow-sm shadow-[#ECECEC] font-medium py-3 hover:text-white rounded-lg transition-colors">
                Save listinge
              </button>
            </div>
          </div>
        </div>
            {/* Product Grid */}
          <div>
<div className='mb-8'>
  <h2 className='font-semibold text-2xl '>
    Similar Listings
  </h2>
  <p className='text-[#737780]'>
    View listings similar to “Aluminium Sheets - 500kg”
  </p>
</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {sampleProducts.map((product) => (
                    <Link
                        key={product.id}
                        href={`/buyersDashboard/Marketplace/${product.id}`}
                        className="block"
                    >
                        <ProductCard {...product} />
                    </Link>
                ))}
            </div>
          </div>
      </div>
    </div>
  );
};

export default ScrapMetalListing;