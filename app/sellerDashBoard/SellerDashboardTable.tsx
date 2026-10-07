"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import AccordionSection, { AccordionListing } from "../Components/AccordionSection";
import { useListings } from "../hooks/useApi";
import { useDebouncedValue } from "../hooks/useDebounce";

type Section = "Active" | "Sold" | "Inactive" | "Draft";

const SECTION_STATUS: Record<Section, 'active' | 'sold' | 'inactive' | 'draft'> = {
  Active: 'active',
  Sold: 'sold',
  Inactive: 'inactive',
  Draft: 'draft',
};

const SellerDashboardTable = () => {
  const [openSection, setOpenSection] = useState<Section | null>("Active");
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebouncedValue(searchQuery, 300);

  // Fetch listings for the open section; counts for every section come back
  // with each response.
  const { data: listingsData, isLoading, error } = useListings({
    status: openSection ? SECTION_STATUS[openSection] : 'all',
    search: debouncedSearch || undefined,
  });

  const listings: AccordionListing[] = (listingsData?.listings || []).map((listing) => ({
    id: listing.id,
    image: listing.image || '/bid1.png',
    name: listing.name,
    quantity: listing.quantity,
    bids: listing.bidsCount,
    price: listing.price || 0,
    status: listing.status.charAt(0).toUpperCase() + listing.status.slice(1),
  }));

  const counts = listingsData?.counts;
  const sections: { id: Section; count: number }[] = [
    { id: "Active", count: counts?.active ?? 0 },
    { id: "Sold", count: counts?.sold ?? 0 },
    { id: "Inactive", count: counts?.inactive ?? 0 },
    { id: "Draft", count: counts?.draft ?? 0 },
  ];

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

          {/* Error State */}
          {error && (
            <div className="p-8 text-center">
              <p className="text-red-600">Failed to load listings. Please try again.</p>
            </div>
          )}

          {/* Accordion Sections */}
          {!error && (
            <div className="divide-y divide-gray-200">
              {sections.map((section) => (
                <AccordionSection
                  key={section.id}
                  title={`${section.id} (${section.count})`}
                  isOpen={openSection === section.id}
                  onToggle={() => setOpenSection(openSection === section.id ? null : section.id)}
                  listings={openSection === section.id && !isLoading ? listings : []}
                />
              ))}
              {isLoading && openSection && (
                <div className="p-4 text-center text-sm text-gray-500">Loading listings...</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerDashboardTable;
