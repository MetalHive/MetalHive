'use client'
import { useState } from 'react'
import SideBar from '@/app/Components/SideBar'
import { Search } from "lucide-react"
import Link from 'next/link'
import { sellerSidebarLinks } from '../../lib/sidebarConfig'
import { useBids } from '../../hooks/useApi'
import { useDebouncedValue } from '../../hooks/useDebounce'
import Pagination from '@/app/Components/Pagination'

type BidStatusFilter = "pending" | "countered" | "accepted" | "rejected"

const STATUS_COLOR: Record<string, string> = {
  pending: 'text-yellow-600',
  countered: 'text-blue-600',
  accepted: 'text-green-600',
  rejected: 'text-red-600',
  expired: 'text-gray-500',
}

const SellerBidsPage = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<BidStatusFilter>("pending")
  const [page, setPage] = useState(1)

  const debouncedSearch = useDebouncedValue(searchQuery, 300)

  // The API filters by status and search, and returns `counts` for the badges.
  const { data: bidsData, isLoading, error } = useBids({
    status: statusFilter,
    search: debouncedSearch || undefined,
    page,
  })

  const bids = bidsData?.bids || []
  const counts = bidsData?.counts

  const tabs: { label: string; value: BidStatusFilter; count: number }[] = [
    { label: "Pending", value: "pending", count: counts?.pending ?? 0 },
    { label: "Countered", value: "countered", count: counts?.countered ?? 0 },
    { label: "Accepted", value: "accepted", count: counts?.accepted ?? 0 },
    { label: "Rejected", value: "rejected", count: counts?.rejected ?? 0 },
  ]

  const selectStatus = (value: BidStatusFilter) => {
    setStatusFilter(value)
    setPage(1)
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SideBar links={sellerSidebarLinks} />

      {/* MAIN CONTENT */}
      <div className="flex-1 p-6 mt-16 lg:mt-0">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-semibold text-[#17181A]">Bids Received</h1>
            <p className="text-[#737780]">View all offers made on your active listings.</p>
          </div>

          {/* Search */}
          <div className="relative w-full max-w-sm mt-2 lg:mt-0">
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setPage(1) }}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
          </div>
        </div>

        {/* Status Tags */}
        <div className="flex flex-wrap gap-3 mb-6">
          {tabs.map((item) => (
            <button
              key={item.value}
              onClick={() => selectStatus(item.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${statusFilter === item.value
                ? "bg-[#C9A227] text-white"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
                }`}
            >
              {item.label} ({item.count})
            </button>
          ))}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#C9A227]"></div>
            <p className="mt-2 text-gray-600">Loading bids...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="p-8 text-center">
            <p className="text-red-600">Failed to load bids. Please try again.</p>
          </div>
        )}

        {/* Bids Grid */}
        {!isLoading && !error && bids.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {bids.map((bid) => (
              <Link
                key={bid.id}
                href={`/sellerDashBoard/Bids/${bid.id}`}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Image */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={bid.listing.image || '/bid1.png'}
                  alt={bid.listing.name}
                  className="w-full h-40 object-cover"
                />

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1">{bid.listing.name}</h3>
                  <p className="text-sm text-gray-500 mb-1">From {bid.buyer?.companyName || bid.buyer?.name || 'Buyer'}</p>
                  {/* bid.quantity already includes its unit (e.g. "30kg"). */}
                  <p className="text-sm text-gray-500 mb-3">Quantity: {bid.quantity}</p>

                  {/* Stats */}
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs text-gray-500">Offer</p>
                      <p className="text-lg font-bold text-[#C9A227]">
                        ${Number(bid.offerPrice || 0).toFixed(2)}
                        {bid.offerPriceUnit && (
                          <span className="text-xs font-normal text-gray-500"> / {bid.offerPriceUnit}</span>
                        )}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Status</p>
                      <p className={`text-sm font-medium ${STATUS_COLOR[bid.status] || 'text-gray-600'}`}>
                        {bid.status.charAt(0).toUpperCase() + bid.status.slice(1)}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && bids.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No {statusFilter} bids found</p>
          </div>
        )}

        {!isLoading && !error && (
          <Pagination page={page} pagination={bidsData?.pagination} onPageChange={setPage} />
        )}
      </div>
    </div>
  )
}

export default SellerBidsPage
