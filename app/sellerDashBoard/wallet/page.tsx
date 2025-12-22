import React from "react"
import SideBar from "../../Components/SideBar"
import EarningsChart from "../../Components/EarningsChart"

interface Stat {
  title: string
  value: string
  subText: string
}

const stats: Stat[] = [
  {
    title: "Available Balance",
    value: "$1,240.00",
    subText: "Withdrawable balance",
  },
  {
    title: "Pending Payouts",
    value: "$460.00",
    subText: "Processing from trades",
  },
  {
    title: "Total Earned",
    value: "$8,320.00",
    subText: "All-time earnings",
  },
  {
    title: "Last Payout",
    value: "$520.00",
    subText: "2 days ago",
  },
]

const earnings = [
  { month: "Jan", value: 30 },
  { month: "Feb", value: 80 },
  { month: "Mar", value: 40 },
  { month: "Apr", value: 45 },
  { month: "May", value: 65 },
  { month: "Jun", value: 75 },
  { month: "Jul", value: 30 },
  { month: "Aug", value: 65 },
  { month: "Sep", value: 80 },
  { month: "Oct", value: 70 },
  { month: "Nov", value: 25 },
  { month: "Dec", value: 105 },
]

const Page = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <SideBar />

      <div className="flex-1 p-6 mt-16 lg:mt-0">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-[#17181A]">Payouts</h1>
          <p className="text-[#737780]">
            Track your earnings, withdrawal history, and payout status in one place.
          </p>

          <button className="bg-[#C9A227] hover:bg-yellow-700 text-white px-4 py-2 rounded-md font-medium mt-4">
            Withdraw Funds
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
          {stats.map((stat, index) => (
            <div key={index}>
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <p className="text-lg text-[#737780] mb-2">
                  {stat.title}
                </p>

                <h2 className="text-2xl font-semibold text-gray-900">
                  {stat.value}
                </h2>
              </div>

              <p className="text-md text-[#ACACAC] mt-2 ml-4">
                {stat.subText}
              </p>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div className="mt-10">
          <EarningsChart earnings={earnings} />
        </div>
      </div>
    </div>
  )
}

export default Page
