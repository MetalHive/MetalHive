'use client'
import { useState } from 'react'
import SideBar from '../../Components/SideBar'
import { Search } from "lucide-react"
import Link from 'next/link'
interface Listing {
  id: string
  image: string
  name: string
  quantity: number
  bids: number
  price: number
  status: "Active" | "Inactive" | "Sold"
}

const Page = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<"Active" | "Inactive" | "Sold">("Active")

  const listings: Listing[] = [
    // 🔵 ACTIVE (8)
    { id: "1", image: "/bid1.png", name: "Aluminium Sheets", quantity: 1, bids: 8, price: 400, status: "Active" },
    { id: "2", image: "/bid2.png", name: "Copper Scrap", quantity: 2, bids: 12, price: 420, status: "Active" },
    { id: "3", image: "/bid3.png", name: "Steel Rods", quantity: 5, bids: 6, price: 380, status: "Active" },
    { id: "4", image: "/bid4.png", name: "Brass Scrap", quantity: 3, bids: 9, price: 410, status: "Active" },
    { id: "5", image: "/bid5.png", name: "Iron Sheets", quantity: 4, bids: 4, price: 360, status: "Active" },
    { id: "6", image: "/bid1.png", name: "Zinc Plates", quantity: 2, bids: 7, price: 395, status: "Active" },
    { id: "7", image: "/bid2.png", name: "Aluminium Cans", quantity: 10, bids: 15, price: 330, status: "Active" },
    { id: "8", image: "/bid3.png", name: "Copper Wires", quantity: 6, bids: 11, price: 450, status: "Active" },

    // ⚪ INACTIVE (4)
    { id: "9", image: "/bid4.png", name: "Iron Rods", quantity: 1, bids: 5, price: 400, status: "Inactive" },
    { id: "10", image: "/bid5.png", name: "Mixed Metal Scrap", quantity: 2, bids: 2, price: 370, status: "Inactive" },
    { id: "11", image: "/bid1.png", name: "Old Steel Beams", quantity: 1, bids: 3, price: 390, status: "Inactive" },
    { id: "12", image: "/bid2.png", name: "Scrap Pipes", quantity: 4, bids: 1, price: 340, status: "Inactive" },

    // 🟣 SOLD (4)
    { id: "13", image: "/bid3.png", name: "Copper Plates", quantity: 2, bids: 14, price: 480, status: "Sold" },
    { id: "14", image: "/bid4.png", name: "Aluminium Blocks", quantity: 3, bids: 10, price: 460, status: "Sold" },
    { id: "15", image: "/bid5.png", name: "Steel Scrap Bundle", quantity: 5, bids: 8, price: 420, status: "Sold" },
    { id: "16", image: "/bid1.png", name: "Iron Frames", quantity: 2, bids: 6, price: 390, status: "Sold" },
  ]

  // Filtered listings
  const filteredListings = listings.filter(
    (item) =>
      item.status === statusFilter &&
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SideBar />

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
          {["Active", "Inactive", "Sold"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status as any)}
              className={`px-4 py-2 rounded-md border text-sm font-medium ${
                statusFilter === status
                  ? "bg-[#17181A] text-white border-[#17181A]"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* CARDS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map((item) => (
             <Link href={`Bids/${item.id}`}>

            <div key={item.id} className="overflow-hidden bg-white rounded-lg shadow-sm">
              <div className="h-48 bg-gray-200">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>

              <div className="p-5">
                <div className="flex justify-between mb-4">
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <span className="font-bold">${item.price}</span>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Buyer</span>
                    <span>Iron Works Ltd.</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-500">Offer</span>
                    <span className="font-medium">${Math.round(item.price * 0.775)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-500">Status</span>
                    <span
                      className={`font-medium ${
                        item.status === "Active"
                          ? "text-green-600"
                          : item.status === "Inactive"
                          ? "text-gray-500"
                          : "text-purple-600"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
             </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Page
