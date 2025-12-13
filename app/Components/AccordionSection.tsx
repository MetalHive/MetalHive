import { FaChevronDown } from "react-icons/fa6";
import { FaChevronUp } from "react-icons/fa6";
import Link from 'next/link'
const AccordionSection = ({ title, isOpen, onToggle, listings }: any) => {
    return (
        <div>
            {/* Header */}
            <button
                onClick={onToggle}
                className="w-full flex justify-between items-center px-4 py-4 bg-gray-100 hover:bg-gray-200 border-b"
            >
                <span className="text-lg font-semibold text-gray-800">{title}</span>
                <span className="text-xl">{isOpen ? <FaChevronUp /> : <FaChevronDown />}</span>
            </button>

            {/* Content */}
            {isOpen && (
                <div className="pb-4">

                    {/* Table Header */}
                    <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-gray-50 border-b text-sm font-medium text-gray-600">
                        <div className="col-span-1"></div>
                        <div className="col-span-4">Product</div>
                        <div className="col-span-1">Bids</div>
                        <div className="col-span-2">Price</div>
                        <div className="col-span-2">Status</div>
                        <div className="col-span-2">Action</div>
                    </div>

                    {/* Items */}
                    <div className="divide-y h-[350px] overflow-y-auto">
                        {listings.map((listing: any) => (
                            <div key={listing.id} className="grid grid-cols-12 gap-4 px-4 py-4 hover:bg-gray-50 border-b border-b-[#737780]">

                                <div className="col-span-1 flex items-center">
                                    <input type="checkbox" className="w-4 h-4 border-gray-300" />
                                </div>

                                <div className="col-span-4 flex items-center space-x-3">
                                    <img src={listing.image} className="w-16 h-16 rounded object-cover" />
                                    <div>
                                        <h3 className="font-medium">{listing.name}</h3>
                                        <p className="text-sm text-gray-500">
                                            Qty: <span className="font-medium">{listing.quantity}</span>
                                        </p>
                                    </div>
                                </div>

                                <div className="col-span-1 flex items-center">
                                    {listing.bids}
                                </div>

                                <div className="col-span-2 flex items-center">
                                    ${listing.price.toFixed(2)}
                                </div>

                                <div className="col-span-2 flex items-center">
                                    <span
                                        className={`
                      px-3 py-1 rounded-full text-sm
                      ${listing.status === "Active"
                                                ? "bg-green-100 text-green-700"
                                                : listing.status === "Sold"
                                                    ? "bg-yellow-100 text-yellow-700"
                                                    : "bg-gray-200 text-gray-700"
                                            }
                    `}
                                    >
                                        {listing.status}
                                    </span>
                                </div>

                                <Link href={`/sellerDashBoard/${listing.id}`}>
                                    <button className="px-2 w-28 py-2 bg-[#C9A227] hover:bg-yellow-600 text-white rounded">
                                        View Listing
                                    </button>
                                </Link>

                            </div>
                        ))}

                        {listings.length === 0 && (
                            <div className="py-6 text-center text-gray-500">No items found.</div>
                        )}
                    </div>

                </div>
            )}
        </div>
    );
};

export default AccordionSection;