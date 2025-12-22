"use client";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function BidDetails() {
  const bids = [
    {
      id: 1,
      product: "Aluminum Sheets - 500Kg",
      images: [
        "/bid1.png","/bid2.png","/bid3.png","/bid4.png","/bid5.png",
      ],
      bidder: "Recytex Global",
      description:
        "We can arrange pickup within 24 hours and will handle all loading logistics on our side. Our team operates nationwide, so collection will not require any support from you. This ensures a smooth, quick turnaround.",
      offerPerTonne: 250,
      weight: 500,
      location: "Seller's listed location",
      timeline: [
        { label: "Offer submitted", time: "Nov 10, 13:44" },
        { label: "Seller countered at $280", time: "Nov 11, 09:12" },
        { label: "Awaiting buyer response", time: "" },
      ],
    },
  ];

  const bid = bids[0];

  return (
    <div className="min-h-screen  p-4 md:p-6">
      <div className="max-w-6xl mx-auto  p-4 md:p-6">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-2">
            <Link href='/sellerDashBoard/Bids'>
            <ArrowLeft className="w-5 h-5 cursor-pointer" />
            </Link>
           
          </div>

          <button className="text-sm text-gray-600 hover:underline">
            Go to bid page ↗
          </button>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left */}
          <div className="lg:col-span-2 space-y-4">
             <h2 className="font-semibold text-lg">{bid.product}</h2>
            <img
              src={bid.images[0]}
              alt={bid.product}
              className="w-full h-64 md:h-80 object-cover rounded-lg"
            />

            {/* Image indicators */}
            <div className="flex justify-center gap-2">
              {bid.images.map((_, i) => (
                <span
                  key={i}
                  className="w-2 h-2 rounded-full bg-gray-300"
                />
              ))}
            </div>

            {/* Bid info */}
            <div>
              <p className="text-lg font-semibold">
                Bid from {bid.bidder}
              
              </p>
                <p className="text-mdmb-3 text-gray-600 mt-5">
                    Message
                </p>
              <p >
                {bid.description}
              </p>
            </div>

            {/* Meta */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm pt-2">
              <div>
                <p className="text-gray-400 mb-3">Offer</p>
                <p className="font-medium">${bid.offerPerTonne} / tonne</p>
              </div>

              <div>
                <p className="text-gray-400 mb-3">Location</p>
                <p className="font-medium">{bid.location}</p>
              </div>

              <div>
                <p className="text-gray-400 mb-3">Weight</p>
                <p className="font-medium">{bid.weight} Kg</p>
              </div>
            </div>
          </div>

          {/* Right panel */}
          <div className=" p-4 space-y-4 mt-12 h-fit">
            {bid.timeline.map((item, index) => (
              <div key={index}>
                <p className="text-xl text-gray-500 ">{item.label}</p>
                {item.time && (
                  <p className="text-md font-semibold ">{item.time}</p>
                )}
              </div>
            ))}

            <button className="w-full bg-[#C9A227] hover:bg-yellow-600 text-white py-2 rounded-lg font-medium">
              Accept Bid
            </button>

            <button className="w-full border border-gray-300 py-2 rounded-lg text-sm">
              Counter Offer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
