'use client'

import SideBar from '@/app/Components/SideBar'
import TopBar from '@/app/Components/Topbar'
import { buyerSidebarLinks } from '../lib/sidebarConfig'
export default function BuyersDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
     <SideBar links={buyerSidebarLinks}/>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <TopBar />

        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  )
}
