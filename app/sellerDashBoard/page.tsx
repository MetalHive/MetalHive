"use client"

import { useState } from "react";
import SideBar from "../Components/SideBar";
import { FiPlus } from "react-icons/fi";
import { FaSortDown } from "react-icons/fa";
import { LuCalendarRange } from "react-icons/lu";
import { FiTag, FiInbox, FiShoppingCart, FiDollarSign } from "react-icons/fi";
import FeatureCards from "../Components/FeatureCards";
import SellerDashboardTable from "./SellerDashboardTable";
import Link from "next/link";
import { sellerSidebarLinks } from "../lib/sidebarConfig";
import { useDashboardStats } from "../hooks/useApi";
import { useAuth } from "../hooks/useAuth";
import { useUserProfile } from "../hooks/useSettings";

type Period = "30days" | "7days" | "2weeks" | "24hours";

const SellerDashboardPage = () => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Period>("30days");
  const { user } = useAuth();
  const { data: profile } = useUserProfile();

  // Fetch dashboard stats with selected period
  const { data: stats, isLoading, error } = useDashboardStats(selected);

  // Map display labels to API values
  const periodMap: Record<string, Period> = {
    "30 days": "30days",
    "2 weeks": "2weeks",
    "7 days": "7days",
    "24 hours": "24hours",
  };

  const reversePeriodMap: Record<Period, string> = {
    "30days": "30 days",
    "2weeks": "2 weeks",
    "7days": "7 days",
    "24hours": "24 hours",
  };

  const displayName =
    profile?.name?.trim() || (user?.email ? user.email.split('@')[0] : 'Seller');

  return (

    <div className="flex min-h-screen">
      <SideBar links={sellerSidebarLinks} />
      <div className="flex-1 p-6 mt-16 lg:mt-0 w-full">

        {/* HEADER */}
        <div className="flex flex-col lg:flex-row justify-between gap-4">
          <div>
            <h1 className="text-2xl text-[#17181A] font-semibold">
              Welcome back, {displayName}
            </h1>
            <p className="text-[#737780]">
              Here&apos;s a quick look at your listings and recent activity.
            </p>
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <button
                  onClick={() => setOpen(!open)}
                  className="flex items-center gap-3 border border-gray-300 rounded-md px-4 py-2 text-[15px] font-normal hover:bg-gray-50"
                >
                  <LuCalendarRange className="text-black text-[18px]" />
                  <span className="text-black">{reversePeriodMap[selected]}</span>
                  <FaSortDown className="text-black text-[18px]" />
                </button>

                {open && (
                  <div className="absolute mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-md z-10">
                    {["30 days", "2 weeks", "7 days", "24 hours"].map((opt) => (
                      <button
                        key={opt}
                        onClick={() => {
                          setSelected(periodMap[opt]);
                          setOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-[15px] font-normal"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <Link href={'/sellerDashBoard/create-listing'} className="flex items-center bg-[#C9A227] gap-2 px-4 py-2 rounded-md text-white text-md font-semibold">
                <FiPlus className="text-white" size={20} />
                Create Listing
              </Link>
            </div>
          </div>
        </div>

        {/* SECTION 2 - Stats */}
        <div className="mt-8 border border-[#EFEFEF] shadow-sm rounded-lg">
          {isLoading ? (
            <div className="flex gap-6 overflow-x-auto sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:overflow-visible py-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="shrink-0 w-52 sm:w-auto flex flex-col p-4 mr-4 sm:mr-0 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="p-4 text-center text-red-600">
              Failed to load stats. Please try again.
            </div>
          ) : (
            <div className="flex gap-6 overflow-x-auto sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:overflow-visible py-2">

              <div className="shrink-0 w-52 sm:w-auto flex flex-col p-4 mr-4 sm:mr-0">
                <div className="flex gap-2 text-[#737780]">
                  <FiTag size={20} />
                  <span className="text-[15px] font-normal">Active Listings</span>
                </div>
                <p className="text-xl font-semibold mt-2">{stats?.activeListings || 0}</p>
              </div>


              <div className="shrink-0 w-52 sm:w-auto flex flex-col p-4 mr-4 sm:mr-0">
                <div className="flex gap-2 text-[#737780]">
                  <FiInbox size={20} />
                  <span className="text-[15px] font-normal">Bids Received</span>
                </div>
                <p className="text-xl font-semibold mt-2">{stats?.bidsReceived || 0}</p>
              </div>


              <div className="shrink-0 w-52 sm:w-auto flex flex-col p-4 mr-4 sm:mr-0">
                <div className="flex gap-2 text-[#737780]">
                  <FiShoppingCart size={20} />
                  <span className="text-[15px] font-normal">Items Sold</span>
                </div>
                <p className="text-xl font-semibold mt-2">{stats?.itemsSold || 0}</p>
              </div>


              <div className="shrink-0 w-52 sm:w-auto flex flex-col p-4">
                <div className="flex gap-2 text-[#737780]">
                  <FiDollarSign size={20} />
                  <span className="text-[15px] font-normal">Pending Payouts</span>
                </div>
                <p className="text-xl font-semibold mt-2">
                  ${Number(stats?.pendingPayouts || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>

            </div>
          )}
        </div>
        {/* SECTION 3 */}
        <FeatureCards />
        <SellerDashboardTable />
      </div>
    </div>
  )
}

export default SellerDashboardPage
