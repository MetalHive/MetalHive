'use client'

import { Bell } from 'lucide-react'

const TopBar = () => {
  return (
    <header className="w-full h-16 bg-white  flex items-center justify-end px-6">
      <div className="flex items-center gap-6">
        {/* Notification */}
        <div className="relative cursor-pointer">
          <Bell className="w-6 h-6 text-gray-600" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
        </div>

        {/* User Info */}
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="w-9 h-9 rounded-md bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-600">
            CC
          </div>

          {/* Name & role */}
          <div className="leading-tight">
            <p className="text-sm font-medium text-gray-800">
              Carbon Copy
            </p>
            <p className="text-xs text-gray-500">
              Verified buyer
            </p>
          </div>
        </div>
      </div>
    </header>
  )
}

export default TopBar
