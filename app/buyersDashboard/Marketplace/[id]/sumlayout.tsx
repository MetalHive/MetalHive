'use client'

import TopBar from '../../components/Topbar'

export default function ListingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <TopBar />

      <main className="flex-1 p-6 bg-gray-50">
        {children}
      </main>
    </div>
  )
}
