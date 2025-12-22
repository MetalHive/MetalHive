"use client"

import { useState } from 'react';
import { Search } from 'lucide-react';
import { IoFilter } from "react-icons/io5";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
interface Listing {
  id: string;
  image: string;
  name: string;
  type?: string;
  color?: string;
  size?: string;
  quantity: number;
  bids: number;
  price: number;
  paymentMethod?: string;
  status: 'Active' | 'Inactive';
}

const ListingsDashboard = () => {
  const [activeTab, setActiveTab] = useState<'active' | 'sold' | 'inactive'>('active');
  const [searchQuery, setSearchQuery] = useState('');

  const listings: Listing[] = [
    {
      id: '1',
      image: '/bid1.png',
      name: 'Copper Scrap Bundle',
      type: 'Copper',
      size: '200KG',
      quantity: 2,
      bids: 12,
      price: 26.35,
      status: 'Active'
    },
    {
      id: '6',
      image: '/bid2.png',
      name: 'Copper Scrap Bundle',
      type: 'Copper',
      size: '200KG',
      quantity: 2,
      bids: 12,
      price: 26.35,
      status: 'Active'
    },
    {
      id: '7',
      image: '/bid3.png',
      name: 'Copper Scrap Bundle',
      type: 'Copper',
      size: '200KG',
      quantity: 2,
      bids: 12,
      price: 26.35,
      status: 'Active'
    },
    {
      id: '8',
      image: '/bid4.png',
      name: 'Copper Scrap Bundle',
      type: 'Copper',
      size: '200KG',
      quantity: 2,
      bids: 12,
      price: 26.35,
      status: 'Active'
    },
    {
      id: '9',
      image: '/bid5.png',
      name: 'Copper Scrap Bundle',
      type: 'Copper',
      size: '200KG',
      quantity: 2,
      bids: 12,
      price: 26.35,
      status: 'Active'
    },
    {
      id: '5',
      image: 'https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?w=100&h=100&fit=crop',
      name: 'Copper Scrap Bundle',
      type: 'Copper',
      size: '200KG',
      quantity: 2,
      bids: 12,
      price: 26.35,
      status: 'Active'
    },
    {
      id: '2',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop',
      name: 'Nike Air Jordan Reflex',
      color: 'Black',
      size: '23',
      quantity: 2,
      bids: 0,
      price: 26.35,
      paymentMethod: 'Credit card',
      status: 'Active'
    },
    {
      id: '3',
      image: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=100&h=100&fit=crop',
      name: 'Nike Air Jordan Reflex',
      color: 'Black',
      size: '23',
      quantity: 2,
      bids: 0,
      price: 26.35,
      paymentMethod: 'Credit card',
      status: 'Active'
    },
    {
      id: '4',
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=100&h=100&fit=crop',
      name: 'Nike Air Jordan Reflex',
      color: 'Black',
      size: '23',
      quantity: 2,
      bids: 0,
      price: 26.35,
      paymentMethod: 'Credit card',
      status: 'Active'
    }
  ];

  const activeListings = listings.filter(l => l.status === 'Active');
  const inactiveListings = listings.filter(l => l.status === 'Inactive');

  const displayedListings = activeTab === 'active' ? activeListings : activeTab === 'inactive' ? inactiveListings : [];

  return (
    <div className="min-h-screen mt-2 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border-t-4 border-[#EFEFEF]">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h1 className="text-xl font-semibold text-gray-800">Listings</h1>
             <div className='flex gap-4'>
               <button className="border flex items-center gap-2 border-gray-300 px-4 py-2 rounded-md text-[15px] font-normal">
                <IoFilter /> Filter
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
          <div className="border-b border-gray-200">
            <div className="flex justify-between items-center ">
              <div>
                <button
                onClick={() => setActiveTab('active')}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'active'
                    ? 'border-[#C9A227] '
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
              >
                Active ({activeListings.length})
              </button>
              <button
                onClick={() => setActiveTab('sold')}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'sold'
                    ? 'border-[#C9A227] '
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
              >
                Sold (0)
              </button>
              <button
                onClick={() => setActiveTab('inactive')}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'inactive'
                    ? 'border-[#C9A227] '
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
              >
                Inactive (0)
              </button>
              </div>
              <div className='flex gap-10 px-4'>
                <button  className='flex gap-2'>
                  <FiEdit size={20}/>
                  Edit</button>
                <button className='flex gap-2'>
                  <RiDeleteBin6Line size={20}/>
                  Delete</button>
              </div>
            </div>
          </div>

          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-600">
            <div className="col-span-1 flex items-center">
              <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
            </div>
            <div className="col-span-4">Product</div>
            <div className="col-span-1">Bids</div>
            <div className="col-span-2">Price</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2">Action</div>
          </div>

          {/* Listings */}
          <div className="divide-y divide-gray-200">
            {displayedListings.map((listing) => (
              <div key={listing.id} className="grid grid-cols-12 gap-4 px-4 py-4 hover:bg-gray-50 transition-colors">
                <div className="col-span-1 flex items-center">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
                </div>

                <div className="col-span-4 flex items-center space-x-3">
                  <img
                    src={listing.image}
                    alt={listing.name}
                    className="w-16 h-16 rounded object-cover"
                  />
                  <div>
                    <h3 className="font-medium text-gray-900">{listing.name}</h3>
                    <div className="text-sm text-gray-500 space-x-2">
                      {listing.type && <span>Type: <span className="font-medium">{listing.type}</span></span>}
                      {listing.color && <span>Color: <span className="font-medium">{listing.color}</span></span>}
                      {listing.size && <span>Size: <span className="font-medium">{listing.size}</span></span>}
                    </div>
                    <div className="text-sm text-gray-500">
                      Quantity: <span className="font-medium">{listing.quantity}</span>
                    </div>
                  </div>
                </div>

                <div className="col-span-1 flex items-center">
                  <span className="text-gray-900">{listing.bids}</span>
                </div>

                <div className="col-span-2 flex items-center">
                  <div>
                    <div className="font-semibold text-gray-900">${listing.price.toFixed(2)}</div>
                    {listing.paymentMethod && (
                      <div className="text-sm text-gray-500">{listing.paymentMethod}</div>
                    )}
                  </div>
                </div>

                <div className="col-span-2 flex items-center">
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
                    {listing.status}
                  </span>
                </div>

                <div className="col-span-2 flex items-center">
                  <button className="px-4 py-2 text-[#C9A227] rounded-md font-medium text-sm transition-colors">
                    View Listing
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {displayedListings.length === 0 && (
            <div className="py-12 text-center text-gray-500">
              No {activeTab} listings found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListingsDashboard;