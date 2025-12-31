'use client'
import { useState } from 'react';
import ProductCard from '../components/marketPlaceCard';
import SearchFilterBar from '../components/filterMarket';
import Link from 'next/link';
import { useMarketplaceListings } from '../../hooks/useBuyer';

const Page = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [materialType, setMaterialType] = useState('');
  const [location, setLocation] = useState('');

  const { data, isLoading, error } = useMarketplaceListings({
    search: searchQuery || undefined,
    materialType: materialType || undefined,
    location: location || undefined,
  });

  const listings = data?.listings || [];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Marketplace</h1>
        <p className="text-sm text-gray-600 mt-1">
          Browse the latest metals available from verified sellers.
        </p>
      </div>

      <SearchFilterBar
        onSearch={setSearchQuery}
        onMaterialTypeChange={setMaterialType}
        onLocationChange={setLocation}
      />

      {/* CARDS */}
      <div className="min-h-screen bg-gray-50 p-8">
        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C9A227]"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-16">
            <p className="text-red-500">Failed to load listings. Please try again.</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && listings.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500">No listings found. Try adjusting your filters.</p>
          </div>
        )}

        {/* Product Grid */}
        {!isLoading && !error && listings.length > 0 && (
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
    </div>
  );
};

export default Page;
