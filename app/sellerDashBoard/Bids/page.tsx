'use client'
import { useState } from 'react'
import SideBar from '@/app/Components/SideBar'
import { Search } from "lucide-react"
import Link from 'next/link'
import { sellerSidebarLinks } from '../../lib/sidebarConfig'
import { useBids } from '../../hooks/useApi'

interface Bid {
  id: string
  image: string
  name: string
  quantity: number
  bids: number
  price: number
  status: "pending" | "accepted" | "rejected" | "countered" | "expired"
}

const Page = () => {
  const [searchQuery, setSearchQuery] = useState("")
  // Note: API can return "expired" bids, but doesn't support filtering by "expired"
  const [statusFilter, setStatusFilter] = useState<"pending" | "accepted" | "rejected" | "countered" | "all">("pending")

  // Fetch bids from API
  const { data: bidsData, isLoading, error } = useBids({
    status: statusFilter,
    search: searchQuery || undefined,
  })

  // Map API data to component format
  const bids: Bid[] = (bidsData?.bids || []).map((bid) => ({
    id: bid.id,
    image: bid.listing.image || '/bid1.png',
    name: bid.listing.name,
    quantity: parseInt(bid.quantity) || 0,
    bids: 1, // Each bid item represents one bid
    price: bid.offerPrice || 0,
    status: bid.status,
  }))

  // Filtered bids
  const filteredBids = bids.filter(
    (item) =>
      item.status === statusFilter &&
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Counts - calculate from filtered bids since API doesn't provide counts
  const pendingCount = bids.filter(b => b.status === 'pending').length
  const acceptedCount = bids.filter(b => b.status === 'accepted').length
  const rejectedCount = bids.filter(b => b.status === 'rejected').length

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
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
          </div>
        </div>

        {/* Status Tags */}
        <div className="flex flex-wrap gap-3 mb-6">
          {[
            { label: "Pending", value: "pending" as const, count: pendingCount },
            { label: "Accepted", value: "accepted" as const, count: acceptedCount },
            { label: "Rejected", value: "rejected" as const, count: rejectedCount },
          ].map((item) => (
            <button
              key={item.value}
              onClick={() => setStatusFilter(item.value)}
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
        {!isLoading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBids.map((item) => (
              <Link
                key={item.id}
                href={`/sellerDashBoard/Bids/${item.id}`}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Image */}
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-40 object-cover"
                />

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
                  <p className="text-sm text-gray-500 mb-3">Quantity: {item.quantity}kg</p>

                  {/* Stats */}
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs text-gray-500">Offer</p>
                      <p className="text-lg font-bold text-[#C9A227]">${item.price}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Status</p>
                      <p className={`text-sm font-medium ${item.status === 'pending' ? 'text-yellow-600' :
                        item.status === 'accepted' ? 'text-green-600' : 'text-red-600'
                        }`}>
                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && filteredBids.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No {statusFilter} bids found</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Page
