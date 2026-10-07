'use client'
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ChevronLeft, MapPin, Package, Scale } from 'lucide-react';
import ProductCard from '../../components/marketPlaceCard';
import Link from 'next/link';
import { useMarketplaceListing, useSimilarListings, useSaveListing } from '../../../hooks/useBuyer';
import { getErrorMessage } from '@/app/lib/api/client';
import { formatDate } from '@/app/lib/utils/formatters';

import { useToast } from '@/app/Components/Toast';

const EXISTING_BID_LABEL: Record<string, string> = {
  pending: 'Awaiting seller',
  countered: 'Seller countered',
  accepted: 'Accepted',
  rejected: 'Declined',
  withdrawn: 'Withdrawn',
  expired: 'Expired',
};

const ScrapMetalListing = () => {
  const toast = useToast();
  const params = useParams();
  const router = useRouter();
  const listingId = params.id as string;

  const { data: listing, isLoading, error } = useMarketplaceListing(listingId);
  const { data: similarListings } = useSimilarListings(listingId);
  const saveListing = useSaveListing();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleSaveListing = () => {
    if (listingId) {
      saveListing.mutate(listingId, {
        onSuccess: () => toast.success('Listing saved!'),
        onError: (err) => toast.error(getErrorMessage(err, 'Failed to save listing')),
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C9A227]"></div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-red-500 mb-4">Failed to load listing details.</p>
        <button
          onClick={() => router.back()}
          className="text-[#C9A227] hover:underline"
        >
          Go Back
        </button>
      </div>
    );
  }

  const images = listing.images?.filter(Boolean).length > 0 ? listing.images.filter(Boolean) : ['/bid1.png'];
  const existingBid = listing.existingBid;

  return (
    <div className="">
      <div className="w-full ">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="text-gray-600 mb-4 hover:text-gray-900"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="grid md:grid-cols-10 gap-8 p-6 border-b border-b-[#CCCCCC] mb-10">
          {/* Left Column - Images */}
          <div className='col-span-6 mb-20'>
            {/* Title */}
            <h2 className="text-lg font-semibold mb-2">
              {listing.materialName} - {listing.quantity || listing.weight}
            </h2>

            {/* Image Carousel */}
            <div className="relative rounded-lg overflow-hidden bg-gray-100 mb-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={images[currentImageIndex] || '/bid1.png'}
                alt={listing.materialName}
                className="w-full h-80 object-cover"
              />

              {/* Image Dots */}
              {images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all ${index === currentImageIndex
                        ? 'bg-white w-6'
                        : 'bg-white/50'
                        }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Product Title and Date */}
            <div className='mt-7'>
              <h1 className="text-2xl font-bold mb-1">{listing.materialName}</h1>
              <p className="text-sm text-gray-500 mb-4">
                Listing created on {formatDate(listing.createdAt)}
              </p>

              {/* Description Section */}
              <div className="my-6">
                <h3 className="text-sm font-semibold mb-2">Description</h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {listing.description || 'No description available.'}
                </p>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-start gap-2">
                  <Package className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Price</p>
                    <p className="text-sm font-semibold">
                      ${Number(listing.basePrice || 0).toFixed(2)}
                      {listing.priceUnit && ` / ${listing.priceUnit}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Location</p>
                    <p className="text-sm font-semibold">{listing.location || '—'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Scale className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Weight</p>
                    <p className="text-sm font-semibold">{listing.quantity || listing.weight}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className='col-span-full md:col-start-8 md:col-span-4'>
            {/* Seller Info */}
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-1">{listing.seller?.name || listing.sellerName}</p>
              <h3 className="text-xl font-semibold mb-2">{listing.materialName}</h3>

              {/* Price */}
              <p className="text-3xl font-bold mb-2">
                ${Number(listing.basePrice || 0).toFixed(2)}
                {listing.priceUnit && (
                  <span className="text-base font-normal text-gray-500"> / {listing.priceUnit}</span>
                )}
              </p>
              <p className="text-sm text-[#C9A227] flex items-center gap-1">
                <span className="text-[#C9A227]">⚠</span>
                Final price depends on your bid.
              </p>
            </div>

            {/* Details */}
            <div className="space-y-4 mb-6">
              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-sm text-gray-600">Type</span>
                <span className="text-sm font-medium">{listing.materialType || 'Metal Scrap'}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-sm text-gray-600">Quantity</span>
                <span className="text-sm font-medium">{listing.quantity || listing.weight}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-sm text-gray-600">Location</span>
                <span className="text-sm font-medium">{listing.location}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              {existingBid ? (
                <>
                  <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm">
                    <p className="text-gray-600">You already have a bid on this listing</p>
                    <p className="font-semibold text-gray-900 mt-0.5">
                      ${Number(existingBid.offerPrice || 0).toFixed(2)}
                      {existingBid.offerPriceUnit ? ` / ${existingBid.offerPriceUnit}` : ''}
                      <span className="ml-2 text-xs font-medium text-gray-500">
                        {EXISTING_BID_LABEL[existingBid.status] || existingBid.status}
                      </span>
                    </p>
                  </div>
                  <Link
                    href={`/buyersDashboard/bids/${existingBid.id}`}
                    className="block w-full text-center bg-[#C9A227] hover:bg-yellow-600 text-white font-semibold py-3 rounded-lg transition-colors"
                  >
                    View your bid
                  </Link>
                </>
              ) : (
                <Link
                  href={`/buyersDashboard/Marketplace/Placebid?listingId=${listingId}`}
                  className="block w-full text-center bg-[#C9A227] hover:bg-yellow-600 text-white font-semibold py-3 rounded-lg transition-colors"
                >
                  Place Bid
                </Link>
              )}
              <button
                onClick={handleSaveListing}
                disabled={saveListing.isPending}
                className="w-full text-gray-700 hover:bg-[#C9A227] shadow-sm shadow-[#ECECEC] font-medium py-3 hover:text-white rounded-lg transition-colors disabled:opacity-50"
              >
                {saveListing.isPending ? 'Saving...' : 'Save Listing'}
              </button>
            </div>
          </div>
        </div>

        {/* Similar Listings */}
        {similarListings && similarListings.length > 0 && (
          <div>
            <div className='mb-8'>
              <h2 className='font-semibold text-2xl'>Similar Listings</h2>
              <p className='text-[#737780]'>
                View listings similar to &quot;{listing.materialName}&quot;
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarListings.slice(0, 4).map((item) => (
                <Link
                  key={item.id}
                  href={`/buyersDashboard/Marketplace/${item.id}`}
                  className="block"
                >
                  <ProductCard
                    id={item.id}
                    title={item.materialName}
                    price={`$${item.basePrice} / ${item.priceUnit}`}
                    location={item.location}
                    timeAgo={formatDate(item.createdAt)}
                    description={item.description}
                    images={item.images}
                  />
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScrapMetalListing;
