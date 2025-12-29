interface EarningsItem {
  month: string
  value: number
}

interface Props {
  earnings: EarningsItem[]
  isLoading?: boolean
}

const EarningsChart = ({ earnings, isLoading }: Props) => {
  const maxValue = Math.max(...earnings.map(e => e.value), 1)

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Earnings for the month
        </h2>

        <div className="flex items-center gap-3">
          <button className="px-3 py-2 text-sm border rounded-md text-gray-600 hover:bg-gray-50">
            Filter
          </button>

          <input
            type="text"
            placeholder="Search"
            className="px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>
      </div>

      {/* Chart */}
      <div className="flex items-end justify-between gap-3 h-64">
        {earnings.map((item) => {
          const height = (item.value / maxValue) * 100
          const isDecember = item.month === "Dec"

          return (
            <div key={item.month} className="flex flex-col items-center flex-1">
              <div className="w-full flex justify-center">
                <div
                  className={`w-4 sm:w-6 rounded-full ${isDecember ? "bg-amber-500" : "bg-gray-200"
                    }`}
                  style={{ height: `${height}%` }}
                />
              </div>

              <span
                className={`mt-2 text-xs ${isDecember
                    ? "bg-amber-500 text-white px-2 py-0.5 rounded-full"
                    : "text-gray-500"
                  }`}
              >
                {item.month}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default EarningsChart
