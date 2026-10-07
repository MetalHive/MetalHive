'use client'
import { Search } from 'lucide-react';
import { useState } from "react";
import ProductCard from "../components/marketPlaceCard";
import Link from 'next/link';
import { useBuyerBids } from "../../hooks/useBuyer";
import { useDebouncedValue } from "../../hooks/useDebounce";
import Pagination from "@/app/Components/Pagination";
import { formatDate } from "@/app/lib/utils/formatters";

type BidTab = 'all' | 'pending' | 'countered' | 'accepted' | 'rejected' | 'withdrawn';

const BuyerBidsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebouncedValue(searchQuery, 300);
  const [activeTab, setActiveTab] = useState<BidTab>('all');
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useBuyerBids({
    status: activeTab === 'all' ? undefined : activeTab,
    page,
  });

  const bids = data?.bids || [];
  // Tab badges come from the API's `counts`, so they reflect every bid, not
  // just the current page/tab.
  const counts = data?.counts || {
    all: 0,
    pending: 0,
    countered: 0,
    accepted: 0,
    rejected: 0,
    withdrawn: 0,
  };

  const tabs: { id: BidTab; label: string; count: number }[] = [
    { id: 'all', label: 'All Bids', count: counts.all },
    { id: 'pending', label: 'Pending', count: counts.pending },
    { id: 'countered', label: 'Countered', count: counts.countered },
    { id: 'accepted', label: 'Accepted', count: counts.accepted },
    { id: 'rejected', label: 'Rejected', count: counts.rejected },
    { id: 'withdrawn', label: 'Withdrawn', count: counts.withdrawn },
  ];

  const selectTab = (tab: BidTab) => {
    setActiveTab(tab);
    setPage(1);
  };

  // Filter by search query (client-side; the bids endpoint has no search param)
  const needle = debouncedSearch.trim().toLowerCase();
  const filteredBids = needle
    ? bids.filter(bid =>
        (bid.listing?.title || bid.listing?.name || '').toLowerCase().includes(needle)
      )
    : bids;

  // Map status to display text
  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { text: string; color: string }> = {
      pending: { text: 'Awaiting Seller', color: 'bg-yellow-100 text-yellow-800' },
      countered: { text: 'Countered', color: 'bg-blue-100 text-blue-800' },
      accepted: { text: 'Accepted', color: 'bg-green-100 text-green-800' },
      rejected: { text: 'Declined', color: 'bg-red-100 text-red-800' },
      withdrawn: { text: 'Withdrawn', color: 'bg-gray-100 text-gray-800' },
      expired: { text: 'Expired', color: 'bg-gray-100 text-gray-800' },
    };
    return statusMap[status] || { text: status, color: 'bg-gray-100 text-gray-800' };
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-semibold">My Bids</h2>
          <p className="text-base text-[#737780]">Track all the offers you&apos;ve placed and see their current status.</p>
        </div>
        <div className='flex gap-4'>
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
        <div className="flex gap-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => selectTab(tab.id)}
              className={`pb-3 px-1 text-sm font-medium transition-colors relative whitespace-nowrap ${activeTab === tab.id
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
          {needle ? 'No bids match your search.' : 'No bids found for this status.'}
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
                    title={bid.listing.title || bid.listing.name || 'Listing'}
                    price={`$${Number(bid.listing.basePrice || 0).toFixed(2)}${bid.listing.priceUnit ? ` / ${bid.listing.priceUnit}` : ''}`}
                    location={bid.listing.location}
                    timeAgo={formatDate(bid.createdAt)}
                    // offerPrice is a price per unit, not a total.
                    description={`Your offer: $${Number(bid.offerPrice || 0).toFixed(2)}${bid.offerPriceUnit ? `/${bid.offerPriceUnit}` : ''} × ${bid.quantity}${bid.totalAmount ? ` = $${Number(bid.totalAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : ''}`}
                    images={bid.listing.image ? [bid.listing.image] : []}
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

      {!isLoading && !error && (
        <Pagination page={page} pagination={data?.pagination} onPageChange={setPage} />
      )}
    </div>
  );
};

export default BuyerBidsPage;
