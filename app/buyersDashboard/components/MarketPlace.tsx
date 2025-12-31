'use client';

import ProductCard from "./marketPlaceCard";
import Link from "next/link";
import { useMarketplaceListings } from "../../hooks/useBuyer";

const MarketPlace = () => {
    const { data, isLoading, error } = useMarketplaceListings({ limit: 9 });
    const listings = data?.listings || [];


    return (
        <div className="min-h-screen bg-gray-50 p-8">
            {/* Marketplace Header */}
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Marketplace</h1>
                    <p className="text-sm text-gray-600 mt-1">
                        Browse available materials from verified sellers
                    </p>
                </div>
                <Link
                    href="/buyersDashboard/Marketplace"
                    className="text-[#C9A227] font-medium text-sm hover:underline"
                >
                    View All →
                </Link>
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
                    <p className="text-red-500">Failed to load listings.</p>
                </div>
            )}

            {/* Product Grid */}
            {!isLoading && !error && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {listings.map((listing) => (
                        <Link
                            key={listing.id}
                            href={`/buyersDashboard/Marketplace/${listing.id}`}
                            className="block"
                        >
                            <ProductCard
                                id={listing.id}
                                title={listing.materialName}
                                price={`$${listing.basePrice} / ${listing.priceUnit}`}
                                location={listing.location}
                                timeAgo={new Date(listing.createdAt).toLocaleDateString()}
                                description={listing.description}
                                images={listing.images}
                            />
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MarketPlace;
