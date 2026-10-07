"use client"

import { useState } from 'react'
import { Menu, X, LogOut } from 'lucide-react'
import Image from "next/image"
import Link from 'next/link'
import { SidebarLink } from '@/app/lib/sidebarConfig'
import { usePathname } from 'next/navigation'
import { useAuthStore } from '@/app/stores/AuthStore'
import { useWalletSummary } from '@/app/hooks/useApi'

interface SidebarProps {
  links: SidebarLink[]
}

/** Live available balance for the seller "Wallet" link. */
function WalletBadge() {
  const { data } = useWalletSummary()
  if (!data || typeof data.availableBalance !== 'number') return null
  return (
    <span className="text-gray-400 font-medium">
      ${data.availableBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
    </span>
  )
}

export default function SideBar({ links }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)
  const pathname = usePathname()
  const logout = useAuthStore((s) => s.logout)

  const toggleSidebar = () => setIsOpen(!isOpen)

  const handleLogout = async () => {
    if (loggingOut) return
    setLoggingOut(true)
    try {
      await logout()
    } finally {
      setLoggingOut(false)
    }
  }

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
          className="lg:hidden fixed inset-0 bg-black/30 z-30"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 bg-white shadow-xl z-40
          transition-transform duration-300 ease-in-out h-screen
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static
          w-80
        `}
      >
        <div className="p-6 flex flex-col h-full">
          {/* Logo */}
          <div className="mb-8">
            <Image
              src="/logoBlack.png"
              width={120}
              height={120}
              alt="MetalHive black logo"
            />
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            {links.map((link) => {
              const isActive = pathname === link.href
              const Icon = link.icon

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`
                    flex items-center justify-between gap-4 px-4 py-3 rounded-lg transition-colors
                    ${isActive ? 'bg-gray-100' : 'hover:bg-gray-100'}
                  `}
                >
                  <div className="flex items-center gap-4">
                    <Icon
                      size={24}
                      className={isActive ? 'text-yellow-600' : 'text-gray-600'}
                    />
                    <span
                      className={`font-medium ${
                        isActive ? 'text-gray-900' : 'text-gray-700'
                      }`}
                    >
                      {link.label}
                    </span>
                  </div>

                  {link.badge === 'walletBalance' && <WalletBadge />}
                </Link>
              )
            })}
          </nav>

          {/* Logout */}
          <div className="mt-auto pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="flex items-center gap-4 w-full px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
            >
              <LogOut size={24} />
              <span className="font-medium">{loggingOut ? 'Logging out...' : 'Logout'}</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
