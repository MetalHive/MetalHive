import React from 'react'
import SideBar from '../../Components/SideBar'
import ListingsDashboard from './ListingsDashboard'
const page = () => {
  return (
   
    <div className="flex min-h-screen">
        <SideBar />
   <div className="flex-1 p-6 mt-16 lg:mt-0 w-full">
    <div className="w-full ">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
  <div>
    <h1 className="text-3xl font-semibold text-gray-900 mb-2">
      My Listings
    </h1>
    <p className="text-gray-600 text-sm leading-relaxed">
      View and manage all your listed materials. Track bids, update details,<br />
      or close a listing anytime.
    </p>
  </div>

  <button className="bg-[#C9A227] hover:bg-yellow-700 text-white px-4 py-2 rounded-md font-medium flex items-center gap-2 transition-colors w-full md:w-auto justify-center md:justify-start">
    <span className="text-lg">+</span>
    Create New Listing
  </button>
</div>

      </div>
    </div>
    <ListingsDashboard />
   </div>
    </div>
  )
}

export default page