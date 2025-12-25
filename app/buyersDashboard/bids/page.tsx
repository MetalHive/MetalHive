'use client'
import { IoFilter } from "react-icons/io5";
import { Search } from 'lucide-react';
import { useState } from "react";
import ProductCard from "../components/marketPlaceCard";
const page = () => {
  const [searchQuery, setSearchQuery] = useState('');
    const sampleProducts = [
  {id:'1',
    title: "Copper Scrap",
    price: "$520 / tonne",
    location: "Liverpool",
    timeAgo: "2 hours ago",
    description: "Bulk supply available, uniform quality",
    images: ["/bid1.png", "/bid2.png", "/bid3.png", "/bid4.png", "/bid5.png"],
  },
  {
    id:'2',
    title: "Aluminium Ingots",
    price: "$1,200 / tonne",
    location: "Manchester",
    timeAgo: "5 hours ago",
    description: "High-grade aluminium suitable for industrial use",
    images: ["/bid2.png", "/bid3.png", "/bid4.png"],
  },
  {
    id:'3',
    title: "Steel Rebars",
    price: "$780 / tonne",
    location: "Birmingham",
    timeAgo: "1 day ago",
    description: "Construction-grade steel, ready for pickup",
    images: ["/bid3.png", "/bid4.png", "/bid5.png"],
  },
  {
    id:'4',
    title: "Brass Scrap",
    price: "$640 / tonne",
    location: "Leeds",
    timeAgo: "3 hours ago",
    description: "Clean brass scrap with consistent composition",
    images: ["/bid1.png", "/bid3.png", "/bid5.png"],
  },
  {
    id:'5',
    title: "Iron Ore",
    price: "$410 / tonne",
    location: "Sheffield",
    timeAgo: "6 hours ago",
    description: "Raw iron ore available in large quantities",
    images: ["/bid2.png", "/bid4.png", "/bid5.png"],
  },
  {
    id:'6',
    title: "Zinc Sheets",
    price: "$890 / tonne",
    location: "Nottingham",
    timeAgo: "12 hours ago",
    description: "Weather-resistant zinc sheets for roofing",
    images: ["/bid1.png", "/bid2.png", "/bid3.png"],
  },
  {
    id:'7',
    title: "Lead Blocks",
    price: "$1,050 / tonne",
    location: "Bristol",
    timeAgo: "8 hours ago",
    description: "Dense lead blocks for industrial applications",
    images: ["/bid3.png", "/bid4.png"],
  },
  {
    id:'8',
    title: "Nickel Alloy",
    price: "$2,300 / tonne",
    location: "Coventry",
    timeAgo: "1 day ago",
    description: "Premium nickel alloy with corrosion resistance",
    images: ["/bid2.png", "/bid4.png", "/bid5.png"],
  },
  {
    id:'9',
    title: "Tin Plates",
    price: "$980 / tonne",
    location: "Derby",
    timeAgo: "4 hours ago",
    description: "Tin-coated plates suitable for packaging",
    images: ["/bid1.png", "/bid2.png", "/bid5.png"],
  },
];
  return (
    <div>
        <div className="flex justify-between items-center mb-20">
          <div>
            <h2 className="text-2xl font-semibold">My Bids</h2>
            <p className="text-base text-[#737780]">Track all the offers you’ve placed and see their current status.</p>
          </div>
          <div className='flex gap-4'>
                     <button className="border flex items-center gap-2 border-gray-300 px-4 py-2 rounded-md text-[15px] font-normal">
                      <IoFilter /> Filter
                    </button>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#EFEFEF] focus:border-transparent"
                    />
                    <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
                  </div>
                   </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {sampleProducts.map((product, index) => (
       
        <ProductCard key={index} {...product} />
   
    ))}
  </div>
    </div>
  )
}

export default page