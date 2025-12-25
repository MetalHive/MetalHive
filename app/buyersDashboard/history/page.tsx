"use client";

import { Download, Search } from "lucide-react";

const payoutHistory = [
  {
    id: "#MH-8832-TR",
    date: "Oct 24, 2024",
    item: "Copper Wire",
    seller: "Iron Works LTD.",
    amount: 1200,
    status: "Processing",
  },
  {
    id: "#MH-8832-TR",
    date: "Oct 24, 2024",
    item: "HMS 1&2 Scrap",
    seller: "Heritage Abiba",
    amount: 400,
    status: "Complete",
  },
  {
    id: "#MH-8832-TR",
    date: "Oct 24, 2024",
    item: "Aluminum 6063",
    seller: "James Fidelis",
    amount: 2000,
    status: "Complete",
  },
  {
    id: "#MH-8832-TR",
    date: "Oct 28, 2024",
    item: "Stainless Steels 304",
    seller: "John Doe",
    amount: 100,
    status: "Complete",
  },
  {
    id: "#MH-8832-TR",
    date: "Oct 30, 2024",
    item: "Brass Honey",
    seller: "John Livingstone",
    amount: 560,
    status: "Complete",
  },
];

export default function PayoutHistory() {
  const totalSpent = payoutHistory.reduce((sum, item) => sum + item.amount, 0);
  const completed = payoutHistory.filter(p => p.status === "Complete").length;
  const pending = payoutHistory.filter(p => p.status === "Processing").length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Payout History</h2>
          <p className="text-sm text-gray-500">
            Track your scrap metal purchases, bids, and fulfillment status in one place.
          </p>
        </div>

        <button className="flex items-center gap-2 bg-[#C9A227] text-white px-4 py-2 rounded-md text-sm">
          <Download size={16} />
          Export CSV
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Spent" value={`$${totalSpent.toLocaleString()}`} />
        <StatCard label="Completed" value={completed} />
        <StatCard label="Pending" value={pending} />
        <StatCard label="All Time" value={payoutHistory.length} />
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between border-b border-gray-200">
        <button className="shadow-sm px-3 py-2 rounded-md text-sm">
          Last 30 days
        </button>

        <div className="relative">
          <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
          <input
            placeholder="Search"
            className="pl-9 pr-3 py-2 shadow-sm rounded-md text-sm"
          />
        </div>
      </div>

      {/* Table */}
       <div className="grid grid-cols-24 gap-4 px-4  bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-600 h-6">
            
            <div className="col-span-4">Reference ID</div>
            <div className="col-span-4">Date</div>
            <div className="col-span-4">Listing</div>
            <div className="col-span-4">Seller</div>
            <div className="col-span-5">Amount</div>
            <div className="col-span-3">Status</div>

          </div>
<div className="divide-y divide-gray-200">
  {payoutHistory.map((item) => (
    <div
      key={item.id}
      className="grid grid-cols-24 items-center px-6 py-4 hover:bg-gray-50 transition-colors text-sm"
    >
      <div className="col-span-4 px-2">
        <p className="font-medium text-gray-900">{item.id}</p>
      </div>

      <div className="col-span-4 px-2 text-gray-700">
        {item.date}
      </div>

      <div className="col-span-4 px-2 text-gray-700">
        {item.item}
      </div>

      <div className="col-span-5 px-2 text-gray-700">
        {item.seller}
      </div>

      <div className="col-span-4 px-2 font-medium text-gray-900">
        {item.amount}
      </div>

      <div className="col-span-3 px-2 flex justify-end">
        <StatusBadge status={item.status} />
      </div>
    </div>
  ))}
</div>


    </div>
  );
}

/* ---------- Small Components ---------- */

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="shadow-sm  rounded-lg p-4">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-lg font-semibold mt-1">{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const base = "px-3 py-1 rounded-full text-xs font-medium";

  if (status === "Processing") {
    return <span className={`${base} bg-orange-100 text-orange-600`}>Processing</span>;
  }

  return <span className={`${base} bg-green-100 text-green-600`}>Complete</span>;
}
