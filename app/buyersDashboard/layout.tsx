'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import SideBar from '@/app/Components/SideBar'
import TopBar from './components/Topbar'
import { buyerSidebarLinks } from '../lib/sidebarConfig'
import { useAuthStore } from '@/app/stores/AuthStore'

export default function BuyersDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const user = useAuthStore((s) => s.user)
  const isInitialized = useAuthStore((s) => s.isInitialized)

  // AuthInitializer hydrates the store from localStorage (and validates the
  // session with /auth/me/). Until that has happened we show a spinner; once
  // it has, anyone who is not a buyer is sent to the right place.
  useEffect(() => {
    if (!isInitialized) return
    if (!user) {
      router.replace('/signin')
      return
    }
    if (user.role !== 'BUYER') {
      router.replace(user.role === 'SELLER' ? '/sellerDashBoard' : '/signin')
    }
  }, [isInitialized, user, router])

  const isAuthorized = isInitialized && user?.role === 'BUYER'

  if (!isAuthorized) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C9A227]"></div>
      </div>
    )
  }

  // Check if we are in settings pages
  const isSettingsPage = pathname?.startsWith('/buyersDashboard/settings')

  if (isSettingsPage) {
    return <>{children}</>
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
