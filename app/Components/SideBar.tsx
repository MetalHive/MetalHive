"use client"

import { useState } from 'react';
import { Menu, X, Home, Grid, Tag, Wallet } from 'lucide-react';
import Image from "next/image";
export default function MetalhiveSidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0  bg-opacity-50 z-30"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0  bg-white shadow-xl z-40 transition-transform duration-300 ease-in-out h-screen
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static
          w-80
        `}
      >
        <div className="p-6">          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
         
            <div>
             <Image
          src="/logoBlack.png"
          width={120}
          height={120}
          alt="MetalHive black logo"
        />
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            {/* Dashboard */}
            <a
              href="/sellerDashBoard"
              className="flex items-center gap-4 px-4 py-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors group"
            >
              <div className="relative">
                <Home className="text-yellow-600" size={24} />
               
              </div>
              <span className="text-gray-900 font-medium">Dashboard</span>
            </a>

            {/* Listings */}
            <a
              href="Listing"
              className="flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors group"
            >
              <Grid className="text-gray-600 group-hover:text-gray-900" size={24} />
              <span className="text-gray-700 group-hover:text-gray-900">Listings</span>
            </a>

            {/* Bids */}
            <a
              href="#bids"
              className="flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors group"
            >
              <Tag className="text-gray-600 group-hover:text-gray-900" size={24} />
              <span className="text-gray-700 group-hover:text-gray-900">Bids</span>
            </a>

            {/* Wallet */}
            <a
              href="#wallet"
              className="flex items-center justify-between gap-4 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors group"
            >
              <div className="flex items-center gap-4">
                <Wallet className="text-gray-600 group-hover:text-gray-900" size={24} />
                <span className="text-gray-700 group-hover:text-gray-900">Wallet</span>
              </div>
              <span className="text-gray-400 font-medium">£1,240</span>
            </a>
          </nav>
        </div>
      </aside>
    </>
  );
}