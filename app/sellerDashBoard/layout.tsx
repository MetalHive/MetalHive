'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getStoredUser, isAuthenticated } from '@/app/lib/api/auth'

export default function SellerDashboardLayout({
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
        if (user?.role !== 'SELLER') {
            // If user is a buyer, redirect to buyer dashboard
            if (user?.role === 'BUYER') {
                router.push('/buyersDashboard')
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

    return <>{children}</>
}
