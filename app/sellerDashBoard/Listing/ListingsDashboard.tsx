"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { useListings } from '@/app/hooks/useApi';
import { useDebouncedValue } from '@/app/hooks/useDebounce';
import Pagination from '@/app/Components/Pagination';

type ListingTab = 'active' | 'sold' | 'inactive' | 'draft';

const TAB_LABELS: Record<ListingTab, string> = {
  active: 'Active',
  sold: 'Sold',
  inactive: 'Inactive',
  draft: 'Draft',
};

const STATUS_BADGE: Record<string, string> = {
  active: 'bg-green-100 text-green-700',
  sold: 'bg-blue-100 text-blue-700',
  draft: 'bg-yellow-100 text-yellow-700',
  inactive: 'bg-gray-100 text-gray-700',
  suspended: 'bg-red-100 text-red-700',
};

const ListingsDashboard = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ListingTab>('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebouncedValue(searchQuery, 300);

  // The API filters by status, so each tab maps 1:1 to a backend status.
  const { data: listingsData, isLoading, error } = useListings({
    status: activeTab,
    search: debouncedSearch || undefined,
    page,
  });

  const listings = listingsData?.listings || [];
  const counts = listingsData?.counts;

  const tabs: { id: ListingTab; count: number }[] = [
    { id: 'active', count: counts?.active ?? 0 },
    { id: 'sold', count: counts?.sold ?? 0 },
    { id: 'inactive', count: counts?.inactive ?? 0 },
    { id: 'draft', count: counts?.draft ?? 0 },
  ];

  const selectTab = (tab: ListingTab) => {
    setActiveTab(tab);
    setPage(1);
  };

  return (
    <div className="min-h-screen mt-2 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border-t-4 border-[#EFEFEF]">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h1 className="text-xl font-semibold text-gray-800">Listings</h1>
            <div className='flex gap-4'>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#EFEFEF] focus:border-transparent"
                />
                <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex justify-between items-center ">
              <div>
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => selectTab(tab.id)}
                    className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id
                      ? 'border-[#C9A227] '
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                  >
                    {TAB_LABELS[tab.id]} ({tab.count})
                  </button>
                ))}
              </div>
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

          {/* Table Content */}
          {!isLoading && !error && (
            <>
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-600">
                <div className="col-span-5">Product</div>
                <div className="col-span-1">Bids</div>
                <div className="col-span-2">Price</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-2">Action</div>
              </div>

              {/* Listings */}
              <div className="divide-y divide-gray-200">
                {listings.map((listing) => (
                  <div key={listing.id} className="grid grid-cols-12 gap-4 px-4 py-4 hover:bg-gray-50 transition-colors">
                    <div className="col-span-5 flex items-center space-x-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={listing.image || '/bid1.png'}
                        alt={listing.name}
                        className="w-16 h-16 rounded object-cover"
                      />
                      <div>
                        <h3 className="font-medium text-gray-900">{listing.name}</h3>
                        <div className="text-sm text-gray-500 space-x-2">
                          {listing.materialType && <span>Type: <span className="font-medium">{listing.materialType}</span></span>}
                        </div>
                        <div className="text-sm text-gray-500">
                          Quantity: <span className="font-medium">{listing.quantity}</span>
                        </div>
                      </div>
                    </div>

                    <div className="col-span-1 flex items-center">
                      <span className="text-gray-900">{listing.bidsCount}</span>
                    </div>

                    <div className="col-span-2 flex items-center">
                      <div>
                        <div className="font-semibold text-gray-900">${Number(listing.price || 0).toFixed(2)}</div>
                        {listing.priceUnit && (
                          <div className="text-sm text-gray-500">per {listing.priceUnit}</div>
                        )}
                      </div>
                    </div>

                    <div className="col-span-2 flex items-center">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${STATUS_BADGE[listing.status] || 'bg-gray-100 text-gray-700'}`}>
                        {listing.status}
                      </span>
                    </div>

                    <div className="col-span-2 flex items-center">
                      <button
                        onClick={() => router.push(`/sellerDashBoard/${listing.id}`)}
                        className="px-4 py-2 text-[#C9A227] rounded-md font-medium text-sm transition-colors hover:underline"
                      >
                        View Listing
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Empty State */}
              {listings.length === 0 && (
                <div className="py-12 text-center text-gray-500">
                  No {TAB_LABELS[activeTab].toLowerCase()} listings found
                </div>
              )}

              <Pagination
                page={page}
                pagination={listingsData?.pagination}
                onPageChange={setPage}
                className="px-4 pb-4"
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListingsDashboard;
