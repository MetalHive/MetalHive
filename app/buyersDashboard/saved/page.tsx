"use client"

import Link from 'next/link';
import { Bookmark, X } from 'lucide-react';
import ProductCard from '../components/marketPlaceCard';
import { useSavedListings, useUnsaveListing } from '@/app/hooks/useBuyer';
import { formatDate } from '@/app/lib/utils/formatters';
import { getErrorMessage } from '@/app/lib/api/client';
import { useToast } from '@/app/Components/Toast';

const STATUS_NOTE: Record<string, string> = {
  sold: 'Sold',
  inactive: 'No longer available',
  suspended: 'No longer available',
  draft: 'Not published',
};

export default function SavedListingsPage() {
  const toast = useToast();
  const { data: saved, isLoading, error } = useSavedListings();
  const unsave = useUnsaveListing();

  const items = saved || [];

  const remove = (listingId: string, name: string) => {
    unsave.mutate(listingId, {
      onSuccess: () => toast.success(`Removed "${name}" from your saved listings.`),
      onError: (err) => toast.error(getErrorMessage(err, 'Could not remove the listing.')),
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[#17181a]">Saved Listings</h1>
        <p className="text-[#737780]">
          Listings you bookmarked from the marketplace. Open one to place a bid.
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-[#C9A227]"></div>
        </div>
      ) : error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Could not load your saved listings. Please try again.
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#ececec] px-6 py-16 text-center">
          <Bookmark className="mx-auto mb-4 h-10 w-10 text-[#C9A227]" />
          <h2 className="text-lg font-semibold text-[#17181a]">No saved listings yet</h2>
          <p className="mt-1 text-sm text-[#737780]">
            Tap &quot;Save Listing&quot; on any listing in the marketplace and it will show up here.
          </p>
          <Link
            href="/buyersDashboard/Marketplace"
            className="mt-6 inline-block rounded-lg bg-[#C9A227] px-5 py-2.5 text-sm font-semibold text-white hover:bg-yellow-600 transition-colors"
          >
            Browse the marketplace
          </Link>
        </div>
      ) : (
        <>
          <p className="mb-4 text-sm text-[#737780]">
            {items.length} saved {items.length === 1 ? 'listing' : 'listings'}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map(({ listing, savedAt }) => {
              const note = STATUS_NOTE[listing.status || ''];
              return (
                <div key={listing.id} className="relative bg-white rounded-lg border border-[#ececec]">
                  <Link href={`/buyersDashboard/Marketplace/${listing.id}`} className="block">
                    <ProductCard
                      id={listing.id}
                      title={listing.materialName}
                      price={`$${listing.basePrice} / ${listing.priceUnit}`}
                      location={listing.location}
                      timeAgo={formatDate(listing.createdAt)}
                      description={listing.description}
                      images={listing.images}
                    />
                  </Link>
                  {note && (
                    <span className="absolute left-3 top-3 rounded-full bg-black/70 px-3 py-1 text-xs font-medium text-white">
                      {note}
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => remove(listing.id, listing.materialName)}
                    disabled={unsave.isPending}
                    aria-label={`Remove ${listing.materialName} from saved listings`}
                    className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-[#17181a] shadow hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-50"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <div className="flex items-center justify-between border-t border-[#f1f1f1] px-3 py-2 text-xs text-[#737780]">
                    <span>Saved {formatDate(savedAt)}</span>
                    <Link href={`/buyersDashboard/Marketplace/${listing.id}`} className="font-medium text-[#C9A227] hover:underline">
                      View listing
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
