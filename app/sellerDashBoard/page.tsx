"use client"

import { useState } from "react";
import SideBar from "../Components/SideBar";
import Image from "next/image";
import { FiPlus } from "react-icons/fi";
import { FaSortDown } from "react-icons/fa";
import { IoFilter } from "react-icons/io5";
import { LuCalendarRange } from "react-icons/lu";
import { FiTag, FiInbox, FiShoppingCart, FiDollarSign } from "react-icons/fi";
import FeatureCards from "../Components/FeatureCards";
import SellerDashboardTable from "./SellerDashboardTable";


const page = () => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("30 days");
  
  return (

    <div className="flex min-h-screen">
      <SideBar />
      <div className="flex-1 p-6 mt-16 lg:mt-0 w-full">

        {/* HEADER */}
        <div className="flex flex-col lg:flex-row justify-between gap-4">
          <div>
            <h1 className="text-2xl text-[#17181A] font-semibold">
              Welcome back, Heritage
            </h1>
            <p className="text-[#737780]">
              Here’s a quick look at your listings and recent activity.
            </p>
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-3">


              <button className="border flex items-center gap-2 border-gray-300 px-4 py-2 rounded-md text-[15px] font-normal">
                <IoFilter /> Filter
              </button>


              <div className="relative">
                <button
                  onClick={() => setOpen(!open)}
                  className="flex items-center gap-3 border border-gray-300 rounded-md px-4 py-2 text-[15px] font-normal hover:bg-gray-50"
                >
                  <LuCalendarRange className="text-black text-[18px]" />
                  <span className="text-black">{selected}</span>
                  <FaSortDown className="text-black text-[18px]" />
                </button>

                {open && (
                  <div className="absolute mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-md z-10">
                    {["30 days", "2 weeks", "7 days", "24 hours"].map((opt) => (
                      <button
                        key={opt}
                        onClick={() => {
                          setSelected(opt);
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

              <button className="flex items-center bg-[#C9A227] gap-2 px-4 py-2 rounded-md text-white text-md font-semibold">
                <FiPlus className="text-white" size={20} />
                Create Listing
              </button>
            </div>
          </div>
        </div>

        {/* SECTION 2 */}
        <div className="mt-8 border border-[#EFEFEF] shadow-sm rounded-lg">
          <div className="flex gap-6 overflow-x-auto sm:grid sm:grid-cols-2 lg:grid-cols-5 sm:overflow-visible py-2">


            <div className="shrink-0 w-52 sm:w-auto flex flex-col p-4 mr-4 sm:mr-0">
              <div className="flex gap-2 text-[#737780]">
                <FiTag size={20} />
                <span className="text-[15px] font-normal">Active Listings</span>
              </div>
              <p className="text-xl font-semibold mt-2">90</p>
            </div>


            <div className="shrink-0 w-52 sm:w-auto flex flex-col p-4 mr-4 sm:mr-0">
              <div className="flex gap-2 text-[#737780]">
                <FiInbox size={20} />
                <span className="text-[15px] font-normal">Bids Received</span>
              </div>
              <p className="text-xl font-semibold mt-2">67</p>
            </div>


            <div className="shrink-0 w-52 sm:w-auto flex flex-col p-4 mr-4 sm:mr-0">
              <div className="flex gap-2 text-[#737780]">
                <FiShoppingCart size={20} />
                <span className="text-[15px] font-normal">Items Sold</span>
              </div>
              <p className="text-xl font-semibold mt-2">78</p>
            </div>


            <div className="shrink-0 w-52 sm:w-auto flex flex-col p-4">
              <div className="flex gap-2 text-[#737780]">
                <FiDollarSign size={20} />
                <span className="text-[15px] font-normal">Pending Payouts</span>
              </div>
              <p className="text-xl font-semibold mt-2">45</p>
            </div>

          </div>
        </div>
            {/* SECTION 3 */}
            <FeatureCards />
          <SellerDashboardTable />
      </div>
    </div>
  )
}

export default page