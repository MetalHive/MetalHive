"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import AccordionSection from "../Components/AccordionSection";

interface Listing {
  id: string;
  image: string;
  name: string;
  type?: string;
  color?: string;
  size?: string;
  quantity: number;
  bids: number;
  price: number;
  paymentMethod?: string;
  status: "Active" | "Inactive" | "Sold";
}

const SellerDashboardTable = () => {
  const [activeTab, setActiveTab] = useState<"Active" | "Sold" | "Inactive" | null>("Active");
  const [searchQuery, setSearchQuery] = useState("");

  const listings: Listing[] = [
    { id: "1", image: "/bid1.png", name: "Copper Scrap Bundle", type: "Copper", size: "200KG", quantity: 2, bids: 12, price: 26.35, status: "Inactive" },
    { id: "2", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop", name: "Nike Air Jordan", color: "Black", size: "23", quantity: 2, bids: 0, price: 26.35, paymentMethod: "Credit card", status: "Active" },
    { id: "3", image: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=100&h=100&fit=crop", name: "Nike Air Jordan Reflex", color: "Black", size: "23", quantity: 2, bids: 0, price: 26.35, paymentMethod: "Credit card", status: "Active" },
    { id: "4", image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=100&h=100&fit=crop", name: "Nike Air Jordan Reflex", color: "Black", size: "23", quantity: 2, bids: 0, price: 26.35, paymentMethod: "Credit card", status: "Active" },
    { id: "5", image: "https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?w=100&h=100&fit=crop", name: "Copper Scrap Bundle", type: "Copper", size: "200KG", quantity: 2, bids: 12, price: 26.35, status: "Active" },
    { id: "6", image: "/bid2.png", name: "Copper Scrap Bundle", type: "Copper", size: "200KG", quantity: 2, bids: 12, price: 26.35, status: "Inactive" },
    { id: "7", image: "/bid3.png", name: "Copper Scrap Bundle", type: "Copper", size: "200KG", quantity: 2, bids: 12, price: 26.35, status: "Sold" },
    { id: "8", image: "/bid4.png", name: "Copper Scrap Bundle", type: "Copper", size: "200KG", quantity: 2, bids: 12, price: 26.35, status: "Active" },
    { id: "9", image: "/bid5.png", name: "Copper Scrap Bundle", type: "Copper", size: "200KG", quantity: 2, bids: 12, price: 26.35, status: "Active" },
  ];

  const activeListings = listings.filter((l) => l.status === "Active");
  const soldListings = listings.filter((l) => l.status === "Sold");
  const inactiveListings = listings.filter((l) => l.status === "Inactive");

  const activeCount = activeListings.length;
  const soldCount = soldListings.length;
  const inactiveCount = inactiveListings.length;

  return (
    <div className="min-h-screen mt-10 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border-t-4 border-[#EFEFEF]">

          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h1 className="text-xl font-semibold text-gray-800">Listings</h1>
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#EFEFEF]"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
            </div>
          </div>

          {/* Accordion Sections */}
          <div className="divide-y divide-gray-200">

            <AccordionSection
              title={`Active (${activeCount})`}
              isOpen={activeTab === "Active"}
              onToggle={() => setActiveTab(activeTab === "Active" ? null : "Active")}
              listings={activeListings}
            />

            <AccordionSection
              title={`Sold (${soldCount})`}
              isOpen={activeTab === "Sold"}
              onToggle={() => setActiveTab(activeTab === "Sold" ? null : "Sold")}
              listings={soldListings}
            />

            <AccordionSection
              title={`Inactive (${inactiveCount})`}
              isOpen={activeTab === "Inactive"}
              onToggle={() => setActiveTab(activeTab === "Inactive" ? null : "Inactive")}
              listings={inactiveListings}
            />

          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboardTable;
