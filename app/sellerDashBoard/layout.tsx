'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/app/stores/AuthStore'

export default function SellerDashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const router = useRouter()
    const user = useAuthStore((s) => s.user)
    const isInitialized = useAuthStore((s) => s.isInitialized)

    // AuthInitializer hydrates the store from localStorage (and validates the
    // session with /auth/me/). Until that has happened we show a spinner; once
    // it has, anyone who is not a seller is sent to the right place.
    useEffect(() => {
        if (!isInitialized) return
        if (!user) {
            router.replace('/signin')
            return
        }
        if (user.role !== 'SELLER') {
            router.replace(user.role === 'BUYER' ? '/buyersDashboard' : '/signin')
        }
    }, [isInitialized, user, router])

    const isAuthorized = isInitialized && user?.role === 'SELLER'

    if (!isAuthorized) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C9A227]"></div>
            </div>
        )
    }

    return <>{children}</>
}
