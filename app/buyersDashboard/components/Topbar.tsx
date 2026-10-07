'use client'

import { Bell } from 'lucide-react'
import { useBuyerProfile } from '@/app/hooks/useBuyer'

const initialsOf = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('') || 'B'

const TopBar = () => {
  const { data: profile, isLoading } = useBuyerProfile()

  const displayName = profile?.companyName || profile?.fullName || profile?.email || 'Buyer'
  const secondary = profile?.fullName && profile?.companyName ? profile.fullName : profile?.email

  const status = profile?.verificationStatus ?? (profile?.isVerified ? 'verified' : 'pending')
  const statusLabel =
    status === 'verified' ? 'Verified buyer' : status === 'rejected' ? 'Verification rejected' : 'Verification pending'
  const statusClass =
    status === 'verified' ? 'text-green-600' : status === 'rejected' ? 'text-red-600' : 'text-amber-600'

  return (
    <header className="w-full h-16 bg-white  flex items-center justify-end px-6">
      <div className="flex items-center gap-6">
        {/* Notification */}
        <div className="relative cursor-pointer">
          <Bell className="w-6 h-6 text-gray-600" />
        </div>

        {/* User Info */}
        <div className="flex items-center gap-3">
          {/* Avatar */}
          {profile?.companyLogo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.companyLogo}
              alt={displayName}
              className="w-9 h-9 rounded-md object-cover bg-gray-200"
            />
          ) : (
            <div className="w-9 h-9 rounded-md bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-600">
              {isLoading ? '' : initialsOf(displayName)}
            </div>
          )}

          {/* Name & role */}
          <div className="leading-tight">
            {isLoading ? (
              <>
                <div className="h-4 w-28 bg-gray-200 rounded animate-pulse mb-1" />
                <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
              </>
            ) : (
              <>
                <p className="text-sm font-medium text-gray-800">{displayName}</p>
                <p className={`text-xs ${statusClass}`} title={secondary || undefined}>
                  {statusLabel}
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default TopBar
