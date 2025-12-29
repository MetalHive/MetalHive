"use client"

import React from "react"
import SideBar from "../../Components/SideBar"
import EarningsChart from "../../Components/EarningsChart"
import { useWalletSummary, useMonthlyEarnings } from "../../hooks/useApi"
import { sellerSidebarLinks } from "../../lib/sidebarConfig"

interface Stat {
  title: string
  value: string
  subText: string
}

const Page = () => {
  // Fetch wallet data and earnings from API
  const { data: wallet, isLoading: walletLoading } = useWalletSummary()
  const { data: earningsData, isLoading: earningsLoading } = useMonthlyEarnings()

  // Map API data to stats
  const stats: Stat[] = [
    {
      title: "Available Balance",
      value: `$${wallet?.availableBalance.toFixed(2) || '0.00'}`,
      subText: "Withdrawable balance",
    },
    {
      title: "Pending Payouts",
      value: `$${wallet?.pendingPayouts.toFixed(2) || '0.00'}`,
      subText: "Processing from trades",
    },
    {
      title: "Total Earned",
      value: `$${wallet?.totalEarned.toFixed(2) || '0.00'}`,
      subText: "All-time earnings",
    },
    {
      title: "Last Payout",
      value: wallet?.lastPayout ? `$${wallet.lastPayout.amount.toFixed(2)}` : '$0.00',
      subText: wallet?.lastPayout?.date ? new Date(wallet.lastPayout.date).toLocaleDateString() : 'No payouts yet',
    },
  ]

  const earnings = earningsData?.earnings || []

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SideBar links={sellerSidebarLinks} />

      <div className="flex-1 p-6 mt-16 lg:mt-0">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-[#17181A]">Payouts</h1>
          <p className="text-[#737780]">
            Track your earnings, withdrawal history, and payout status in one place.
          </p>
        </div>

        {/* Loading State */}
        {walletLoading && (
          <div className="mt-6 flex justify-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#C9A227]"></div>
          </div>
        )}

        {/* Stats Grid */}
        {!walletLoading && (
          <>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-lg border border-[#EFEFEF] p-6 shadow-sm"
                >
                  <p className="text-sm text-[#737780]">{stat.title}</p>
                  <h2 className="mt-2 text-2xl font-semibold text-[#17181A]">
                    {stat.value}
                  </h2>
                  <p className="mt-1 text-xs text-[#737780]">{stat.subText}</p>
                </div>
              ))}
            </div>

            {/* Earnings Chart */}
            <div className="mt-6">
              <EarningsChart earnings={earnings} isLoading={earningsLoading} />
            </div>

            {/* Withdraw Button */}
            <div className="mt-6">
              <button className="bg-[#C9A227] hover:bg-[#B08F1F] text-white font-semibold px-6 py-3 rounded-lg transition-colors">
                Withdraw Funds
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Page
