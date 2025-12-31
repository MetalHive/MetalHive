'use client'
import { IoFilter } from "react-icons/io5";
import { Search } from 'lucide-react';
import { useState } from "react";
import ProductCard from "../components/marketPlaceCard";
import Link from 'next/link';
import { useBuyerBids } from "../../hooks/useBuyer";

const Page = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'countered' | 'accepted' | 'rejected' | 'withdrawn'>('all');

  const { data, isLoading, error } = useBuyerBids({
    status: activeTab === 'all' ? undefined : activeTab,
  });

  const bids = data?.bids || [];
  const counts = data?.counts || {
    all: 0,
    pending: 0,
    countered: 0,
    accepted: 0,
    rejected: 0,
    withdrawn: 0,
  };

  const tabs = [
    { id: 'all' as const, label: 'All Bids', count: counts.all },
    { id: 'pending' as const, label: 'Pending', count: counts.pending },
    { id: 'countered' as const, label: 'Countered', count: counts.countered },
    { id: 'accepted' as const, label: 'Accepted', count: counts.accepted },
    { id: 'rejected' as const, label: 'Rejected', count: counts.rejected },
  ];

  // Filter by search query
  const filteredBids = bids.filter(bid =>
    (bid.listing?.title || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Map status to display text
  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { text: string; color: string }> = {
      pending: { text: 'Awaiting Seller', color: 'bg-yellow-100 text-yellow-800' },
      countered: { text: 'Countered', color: 'bg-blue-100 text-blue-800' },
      accepted: { text: 'Accepted', color: 'bg-green-100 text-green-800' },
      rejected: { text: 'Declined', color: 'bg-red-100 text-red-800' },
      withdrawn: { text: 'Withdrawn', color: 'bg-gray-100 text-gray-800' },
    };
    return statusMap[status] || { text: status, color: 'bg-gray-100 text-gray-800' };
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-semibold">My Bids</h2>
          <p className="text-base text-[#737780]">Track all the offers you've placed and see their current status.</p>
        </div>
        <div className='flex gap-4'>
          <button className="border flex items-center gap-2 border-gray-300 px-4 py-2 rounded-md text-[15px] font-normal">
            <IoFilter />Filter
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

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <div className="flex gap-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 px-1 text-sm font-medium transition-colors relative ${activeTab === tab.id
                ? 'text-gray-900'
                : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              {tab.label} ({tab.count})
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C9A227]" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C9A227]"></div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-16">
          <p className="text-red-500">Failed to load bids. Please try again.</p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && filteredBids.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No bids found for this status.
        </div>
      )}

      {/* Products Grid */}
      {!isLoading && !error && filteredBids.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBids.map((bid) => {
            const statusBadge = getStatusBadge(bid.status);
            return (
              <Link
                key={bid.id}
                href={`/buyersDashboard/bids/${bid.id}`}
                className="block"
              >
                <div className="relative">
                  <ProductCard
                    id={bid.id}
                    title={bid.listing.title}
                    price={`$${bid.listing.basePrice}`}

                    location={bid.listing.location}
                    timeAgo={new Date(bid.createdAt).toLocaleDateString()}
                    description={`Your offer: $${bid.offerAmount} - ${bid.quantity}`}
                    images={[bid.listing.image]}
                  />
                  <span className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${statusBadge.color}`}>
                    {statusBadge.text}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Page;
