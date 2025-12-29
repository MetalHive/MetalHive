"use client"

import SideBar from "../../Components/SideBar"
import { sellerSidebarLinks } from "../../lib/sidebarConfig"
import { useSalesHistory } from "../../hooks/useApi"
import { formatDate, formatCurrency } from "../../lib/utils/formatters"

const HistoryPage = () => {
    // Fetch sales history from API
    const { data, isLoading, error } = useSalesHistory()

    return (
        <div className="flex min-h-screen bg-[#fafafa]">
            <SideBar links={sellerSidebarLinks} />

            <div className="flex-1 p-6 mt-16 lg:mt-0">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-[32px] font-semibold text-[#17181a] mb-2">Sales History</h1>
                    <p className="text-[#737780] text-base">
                        View your complete sales record and transaction history.
                    </p>
                </div>

                {/* Loading State */}
                {isLoading && (
                    <div className="flex flex-col items-center justify-center py-16">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#C9A227]"></div>
                        <p className="mt-4 text-[#737780]">Loading sales history...</p>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                        <p className="text-red-600 font-medium">Failed to load sales history. Please try again.</p>
                    </div>
                )}

                {/* Sales List */}
                {!isLoading && !error && (
                    <>
                        {data?.sales && data.sales.length > 0 ? (
                            <div className="space-y-4">
                                {data.sales.map((sale) => (
                                    <div
                                        key={sale.id}
                                        className="bg-white rounded-2xl border border-[#ececec] p-6 hover:shadow-md transition-all duration-200"
                                    >
                                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                                            {/* Left Side - Product Info */}
                                            <div className="flex gap-4 flex-1">
                                                <img
                                                    src={sale.listing.image || '/bid1.png'}
                                                    alt={sale.listing.name}
                                                    className="w-24 h-24 rounded-xl object-cover border border-[#ececec]"
                                                />
                                                <div className="flex-1">
                                                    <h3 className="text-lg font-semibold text-[#17181a] mb-2">
                                                        {sale.listing.name}
                                                    </h3>
                                                    <div className="flex flex-wrap gap-4 text-sm text-[#737780]">
                                                        <div className="flex items-center gap-2">
                                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                                            </svg>
                                                            <span className="font-medium">{sale.quantity} kg</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                            </svg>
                                                            <span>{formatDate(sale.soldAt)}</span>
                                                        </div>
                                                    </div>
                                                    <p className="text-sm text-[#999999] mt-2">
                                                        <span className="text-[#737780] font-medium">Buyer:</span> {sale.buyer.name}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Right Side - Price & Status */}
                                            <div className="flex flex-col lg:items-end gap-3">
                                                <div className="text-right">
                                                    <p className="text-sm text-[#737780] mb-1">Sale Amount</p>
                                                    <p className="text-3xl font-bold text-[#C9A227]">
                                                        {formatCurrency(sale.finalPrice)}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-sm text-[#737780]">Payment:</span>
                                                    <span
                                                        className={`px-4 py-1.5 rounded-full text-xs font-semibold ${sale.paymentStatus === 'completed'
                                                            ? 'bg-[#d4f4dd] text-[#0e6027]'
                                                            : sale.paymentStatus === 'pending'
                                                                ? 'bg-[#fff3cd] text-[#856404]'
                                                                : 'bg-[#f0f0f0] text-[#666666]'
                                                            }`}
                                                    >
                                                        {sale.paymentStatus.charAt(0).toUpperCase() + sale.paymentStatus.slice(1)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white rounded-2xl border border-[#ececec] p-16 text-center">
                                <div className="flex justify-center mb-6">
                                    <div className="w-20 h-20 bg-[#fafafa] rounded-full flex items-center justify-center">
                                        <svg className="w-10 h-10 text-[#cccccc]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                        </svg>
                                    </div>
                                </div>
                                <h3 className="text-xl font-semibold text-[#17181a] mb-2">
                                    No Sales Yet
                                </h3>
                                <p className="text-[#737780] max-w-md mx-auto">
                                    Your sales history will appear here once you complete your first transaction.
                                </p>
                            </div>
                        )}

                        {/* Summary Stats */}
                        {data?.summary && data.sales && data.sales.length > 0 && (
                            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-white rounded-2xl border border-[#ececec] p-6 hover:shadow-md transition-all">
                                    <p className="text-sm text-[#737780] mb-2 font-medium">Total Sales</p>
                                    <p className="text-4xl font-bold text-[#17181a]">
                                        {data.summary.totalSales}
                                    </p>
                                    <p className="text-sm text-[#999999] mt-2">Completed transactions</p>
                                </div>
                                <div className="bg-white rounded-2xl border border-[#ececec] p-6 hover:shadow-md transition-all">
                                    <p className="text-sm text-[#737780] mb-2 font-medium">Total Revenue</p>
                                    <p className="text-4xl font-bold text-[#C9A227]">
                                        {formatCurrency(data.summary.totalRevenue)}
                                    </p>
                                    <p className="text-sm text-[#999999] mt-2">Total earnings</p>
                                </div>
                                <div className="bg-white rounded-2xl border border-[#ececec] p-6 hover:shadow-md transition-all">
                                    <p className="text-sm text-[#737780] mb-2 font-medium">Average Sale</p>
                                    <p className="text-4xl font-bold text-[#17181a]">
                                        {formatCurrency(data.summary.averageSale)}
                                    </p>
                                    <p className="text-sm text-[#999999] mt-2">Per transaction</p>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}

export default HistoryPage
