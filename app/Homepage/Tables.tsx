"use client";

// import Image from "next/image";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";

const data = [
  { company: "ASM", amount: 10000 },
  { company: "KAM", amount: 6120.21 },    
  { company: "Metec", amount: 3000 },
];

const DashboardCards = () => {
  return (
    <section className="w-full bg-gray-50 px-4 sm:px-8 md:px-12 lg:px-20 py-12">
      <div className="flex flex-col lg:flex-row flex-wrap gap-8 justify-center items-center">
        {/* CARD 1 */}
        <div className="flex-1 w-full sm:w-[360px] h-auto sm:h-[284px] bg-white rounded-2xl shadow p-4 border border-gray-100 max-w-full">
          {/* Table */}
          <div className="overflow-x-auto relative">
            <table className="w-full text-left text-[12px] border-collapse">
              <thead>
                <tr className="border-b font-light text-[#656768] font-sans border-gray-200">
                  <th className="py-2 pl-5 w-1/2 relative">
                    Company
                    <div className="absolute top-0 right-0 h-full border-r border-gray-300"></div>
                  </th>
                  <th className="py-2 pl-7 w-1/2">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-2 w-1/2 relative">
                    <div className="flex items-center gap-2">
                      <input type="checkbox" />
                      Dockey
                    </div>
                    <div className="absolute top-0 right-0 h-full border-r border-gray-300"></div>
                  </td>
                  <td className="py-2 pl-4 w-1/2">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-500"></span>
                      Verification Pending
                    </div>
                  </td>
                </tr>

                <tr className="border-b border-gray-100">
                  <td className="py-2 w-1/2 relative">
                    <div className="flex items-center gap-2">
                      <input type="checkbox" />
                      Nibra Metals
                    </div>
                    <div className="absolute top-0 right-0 h-full border-r border-gray-300"></div>
                  </td>
                  <td className="py-2 pl-4 w-1/2">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-500"></span>
                      Verified
                    </div>
                  </td>
                </tr>

                <tr>
                  <td className="py-2 w-1/2 relative">
                    <div className="flex items-center gap-2">
                      <input type="checkbox" />
                      Metal Hive
                    </div>
                    <div className="absolute top-0 right-0 h-full border-r border-gray-300"></div>
                  </td>
                  <td className="py-2 pl-4 w-1/2">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-500"></span>
                      Verified
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-14">
            <h2 className="text-lg font-semibold mt-6">Verified buyers only</h2>
            <p className="text-gray-500 mt-2 text-sm">
              Trade safely with fully verified companies.
            </p>
          </div>
        </div>

        {/* CARD 2 */}
        <div className="flex-1 bg-white w-full sm:w-[360px] h-auto sm:h-[284px] rounded-2xl shadow p-4 border border-gray-100 max-w-full">
          {/* Logo + Label */}
          <div className="flex items-center gap-3 mb-4">
            <span className="text-sm font-medium text-gray-500">Transactions</span>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[12px] text-[#656768]">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-2 px-2 border-r border-gray-200">Buyer</th>
                  <th className="py-2 px-2 border-r border-gray-200">Scrap</th>
                  <th className="py-2 px-2 border-r border-gray-200">Status</th>
                  <th className="py-2 px-2">Time</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-2 px-2 border-r border-gray-200">Dockey</td>
                  <td className="py-2 px-2 border-r border-gray-200">Copper</td>
                  <td className="py-2 px-2 border-r border-gray-200 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    Verified
                  </td>
                  <td className="py-2 px-2">2h ago</td>
                </tr>

                <tr className="border-b border-gray-100">
                  <td className="py-2 px-2 border-r border-gray-200">Nibra Metals</td>
                  <td className="py-2 px-2 border-r border-gray-200">Aluminum</td>
                  <td className="py-2 px-2 border-r border-gray-200 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    Verified
                  </td>
                  <td className="py-2 px-2">2h ago</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-14">
            <h2 className="text-xl font-semibold mt-2">Transaction overview</h2>
            <p className="text-gray-500 mt-2 text-sm">
              View your latest bids and sales at a glance.
            </p>
          </div>
        </div>

        {/* CARD 3 */}
        <div className="flex-1 bg-white w-full sm:w-[360px] h-auto sm:h-[284px] rounded-2xl shadow p-6 border border-gray-100 max-w-full">
          {/* Top Bids Label + Chart */}
          <div className="shadow rounded-xl px-4 bg-white">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-500 pl-4 pt-2">
                Top Bids
              </span>
            </div>

            <div className="flex mt-2 justify-start items-center w-full border-t border-[#E1E1E1] h-32">
              <ResponsiveContainer width="98%" height="100%">
                <BarChart
                  layout="vertical"
                  data={data}
                  margin={{ top: -4, right: -15, left: -43, bottom: 5 }}
                  className="py-2"
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    type="number"
                    domain={[0, 10000]}
                    tickFormatter={(v) => `${v / 1000}k`}
                    label={{
                      value: "",
                      position: "insideBottom",
                      offset: -5,
                    }}
                  />
                  <YAxis
                    type="category"
                    dataKey="company"
                    tick={{ fontSize: 12 }}
                    width={80}
                  />
                  <Tooltip
                    formatter={(value) => [`₦${value.toLocaleString()}`, "Amount"]}
                  />
                  <Bar dataKey="amount" barSize={18} radius={[0, 5, 5, 0]}>
                    <Cell fill="#C9A227" /> {/* First bar */}
                    <Cell fill="#E4C872" /> {/* Second bar */}
                    <Cell fill="#9E7F1F" /> {/* Third bar */}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bottom Section */}
          <h2 className="text-xl font-semibold mt-6">Transparent Bidding</h2>
          <p className="text-gray-500 mt-2 text-sm">
            Get the best offers with hidden bids.
          </p>
        </div>
      </div>
    </section>
  );
};

export default DashboardCards;
