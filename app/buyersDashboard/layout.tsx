'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import SideBar from '@/app/Components/SideBar'
import TopBar from './components/Topbar'
import { buyerSidebarLinks } from '../lib/sidebarConfig'
import { getStoredUser, isAuthenticated } from '@/app/lib/api/auth'

export default function BuyersDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    // Check authentication and authorization
    if (!isAuthenticated()) {
      router.push('/signin')
      return
    }

    const user = getStoredUser()
    if (user?.role !== 'BUYER') {
      // If user is a seller, redirect to seller dashboard
      if (user?.role === 'SELLER') {
        router.push('/sellerDashBoard')
      } else {
        router.push('/signin')
      }
      return
    }

    setIsAuthorized(true)
    setIsChecking(false)
  }, [router])

  // Show loading while checking authorization
  if (isChecking) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C9A227]"></div>
      </div>
    )
  }

  // Don't render if not authorized
  if (!isAuthorized) {
    return null
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <SideBar links={buyerSidebarLinks} />

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
