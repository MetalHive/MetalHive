"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import AccordionSection from "../Components/AccordionSection";
import { useListings } from "../hooks/useApi";

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

  // Map frontend tab to backend status
  const getApiStatus = (tab: "Active" | "Sold" | "Inactive" | null) => {
    if (tab === "Inactive") return "draft";
    if (tab === "Active") return "active";
    if (tab === "Sold") return "sold";
    return "all";
  };

  // Fetch listings from API with mapped status
  const { data: listingsData, isLoading, error } = useListings({
    status: getApiStatus(activeTab) as 'active' | 'inactive' | 'sold' | 'draft' | 'all',
    search: searchQuery || undefined,
  });

  // Map API data to component format
  const listings: Listing[] = (listingsData?.listings || []).map((listing) => ({
    id: listing.id,
    image: listing.image || '/bid1.png',
    name: listing.name,
    type: listing.materialType,
    size: listing.quantity,
    quantity: parseInt(listing.quantity) || 0,
    bids: listing.bidsCount,
    price: listing.price || 0,
    // Map draft to Inactive for display
    status: listing.status === 'draft' ? 'Inactive' :
      (listing.status.charAt(0).toUpperCase() + listing.status.slice(1)) as "Active" | "Sold" | "Inactive",
  }));

  const activeListings = listings.filter((l) => l.status === "Active");
  const soldListings = listings.filter((l) => l.status === "Sold");
  const inactiveListings = listings.filter((l) => l.status === "Inactive");

  // Use counts from API if available, otherwise from filtered lists
  const activeCount = listingsData?.counts?.active ?? activeListings.length;
  const soldCount = listingsData?.counts?.sold ?? soldListings.length;
  const inactiveCount = listingsData?.counts?.inactive ?? inactiveListings.length;

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

          {/* Loading State */}
          {isLoading && (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#C9A227]"></div>
              <p className="mt-2 text-gray-600">Loading listings...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="p-8 text-center">
              <p className="text-red-600">Failed to load listings. Please try again.</p>
            </div>
          )}

          {/* Accordion Sections */}
          {!isLoading && !error && (
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
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerDashboardTable;
