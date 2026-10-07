"use client";

import { useState } from "react";
import { Download, Search } from "lucide-react";
import { usePurchaseHistory, useExportPurchaseHistory } from "../../hooks/useBuyer";
import { useDebouncedValue } from "../../hooks/useDebounce";
import Pagination from "@/app/Components/Pagination";
import { formatDate } from "@/app/lib/utils/formatters";
import { getErrorMessage } from "@/app/lib/api/client";
import { useToast } from "@/app/Components/Toast";

export default function PurchaseHistoryPage() {
  const toast = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebouncedValue(searchQuery, 300);

  const { data, isLoading, error } = usePurchaseHistory({
    search: debouncedSearch || undefined,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
    page,
  });

  const exportHistory = useExportPurchaseHistory();

  const purchases = data?.purchases || [];
  const summary = data?.summary || {
    totalSpent: 0,
    totalPurchases: 0,
    completedPurchases: 0,
    pendingPurchases: 0,
  };

  const handleExport = () => {
    exportHistory.mutate(undefined, {
      onError: (err) => toast.error(getErrorMessage(err, 'Failed to export purchase history')),
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Purchase History</h2>
          <p className="text-sm text-gray-500">
            Track your scrap metal purchases, bids, and fulfillment status in one place.
          </p>
        </div>

        <button
          onClick={handleExport}
          disabled={exportHistory.isPending}
          className="flex items-center gap-2 bg-[#C9A227] text-white px-4 py-2 rounded-md text-sm disabled:opacity-50"
        >
          <Download size={16} />
          {exportHistory.isPending ? 'Exporting...' : 'Export CSV'}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Spent"
          value={`$${Number(summary.totalSpent || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
        />
        <StatCard label="Completed" value={summary.completedPurchases || 0} />
        <StatCard label="Pending" value={summary.pendingPurchases || 0} />
        <StatCard label="All Time" value={summary.totalPurchases || 0} />
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <div className="flex gap-4">
          <input
            type="date"
            value={startDate}
            onChange={(e) => { setStartDate(e.target.value); setPage(1); }}
            className="shadow-sm px-3 py-2 rounded-md text-sm border border-gray-200"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => { setEndDate(e.target.value); setPage(1); }}
            className="shadow-sm px-3 py-2 rounded-md text-sm border border-gray-200"
          />
        </div>

        <div className="relative">
          <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
          <input
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
            className="pl-9 pr-3 py-2 shadow-sm rounded-md text-sm border border-gray-200"
          />
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C9A227]"></div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-16">
          <p className="text-red-500">Failed to load purchase history.</p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && purchases.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          No purchase history found.
        </div>
      )}

      {/* Table */}
      {!isLoading && !error && purchases.length > 0 && (
        <>
          <div className="grid grid-cols-24 gap-4 px-4 bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-600 h-10 items-center">
            <div className="col-span-4">Reference ID</div>
            <div className="col-span-4">Date</div>
            <div className="col-span-4">Listing</div>
            <div className="col-span-5">Seller</div>
            <div className="col-span-4">Amount</div>
            <div className="col-span-3">Status</div>
          </div>
          <div className="divide-y divide-gray-200">
            {purchases.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-24 items-center px-6 py-4 hover:bg-gray-50 transition-colors text-sm"
              >
                <div className="col-span-4 px-2">
                  <p className="font-medium text-gray-900 truncate" title={String(item.id)}>#{item.id}</p>
                </div>

                <div className="col-span-4 px-2 text-gray-700">
                  {formatDate(item.date)}
                </div>

                <div className="col-span-4 px-2 text-gray-700 flex items-center gap-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.listing?.image || '/bid1.png'}
                    alt={item.listing?.name || 'Listing'}
                    className="w-8 h-8 rounded object-cover"
                  />
                  <span className="truncate">{item.listing?.name || 'Listing removed'}</span>
                </div>

                <div className="col-span-5 px-2 text-gray-700 truncate">
                  {item.seller?.name || '—'}
                </div>

                <div className="col-span-4 px-2 font-medium text-gray-900">
                  ${Number(item.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>

                <div className="col-span-3 px-2 flex justify-end">
                  <StatusBadge status={item.status} />
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {!isLoading && !error && (
        <Pagination page={page} pagination={data?.pagination} onPageChange={setPage} />
      )}
    </div>
  );
}

/* ---------- Small Components ---------- */

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="shadow-sm rounded-lg p-4">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-lg font-semibold mt-1">{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const base = "px-3 py-1 rounded-full text-xs font-medium";
  const normalized = (status || '').toLowerCase();

  if (normalized === "processing" || normalized === "pending") {
    return <span className={`${base} bg-orange-100 text-orange-600`}>Processing</span>;
  }

  return <span className={`${base} bg-green-100 text-green-600`}>Complete</span>;
}
