"use client";

import { Star } from "lucide-react";
import { MdVerified } from "react-icons/md";
import MarketPlace from "./components/MarketPlace";
export default function CompanyOverview() {
  const stats = [
    { label: "Active Bids", value: 4 },
    { label: "Pending Bids", value: 2 },
    { label: "Accepted Bids", value: 1 },
    { label: "Saved Listings", value: 3 },
  ];

  return (
    <div className="space-y-6 ">
      {/* Profile Header */}
      <div className="shadow-sm rounded-lg  p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Left */}
        <div className="flex  gap-6">
          <div className="h-40 w-40 rounded-full bg-gray-200" />

          <div>
            <h2 className="text-xl md:text-3xl font-semibold">Carbon Copy</h2>
            <p className="text-md font-semibold">info@carboncopy.com</p>

            <div className=" gap-3 mt-1 text-sm">
              <p className="flex items-center gap-1 text-lg text-[#17181A] font-semibold">
                <MdVerified className="text-[#C9A227]" size={23} />
                Identity Verified
              </p>
              <p className="flex items-center gap-1 text-[#17181A] pt-2 text-lg">
                <Star size={23} className="text-[#C9A227] fill-[#C9A227]" />
                <span className="font-semibold">4.8</span>
                <span className="text-[#737780] text-md ">(5,108)</span>
              </p>
            </div>
          </div>
        </div>

        {/* Right */}
        <button className="self-start md:self-center bg-[#C9A227] text-white text-sm font-medium px-4 py-2 rounded-md">
          Edit Company Profile
        </button>
      </div>

      {/* Stats */}
      <div>
        
        <h2 className="font-semibold text-lg">Statistcs</h2>
      <div className=" mt-4 rounded-lg border-y border-y-[#DDDDDD] grid grid-cols-2 md:grid-cols-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="flex flex-col px-5 justify-center p-8 border-l-6 border-l-[#DDDDDD]"
          >
            <span className="text-lg font-semibold">{stat.value}</span>
            <span className="text-sm text-gray-500">{stat.label}</span>
          </div>
        ))}
      </div>
      </div>
{/* Marketplace preview */}
<MarketPlace />
    </div>
  );
}
