'use client'
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ChevronLeft, MapPin, Package, Scale } from 'lucide-react';
import { useBuyerBidDetail, useWithdrawBid, useAcceptCounterOffer, useRejectCounterOffer } from '../../../hooks/useBuyer';

const BidsDetail = () => {
  const params = useParams();
  const router = useRouter();
  const bidId = params.id as string;

  const { data: bid, isLoading, error } = useBuyerBidDetail(bidId);
  const withdrawBid = useWithdrawBid();
  const acceptCounter = useAcceptCounterOffer();
  const rejectCounter = useRejectCounterOffer();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleWithdraw = () => {
    if (confirm('Are you sure you want to withdraw this bid?')) {
      withdrawBid.mutate(bidId, {
        onSuccess: () => {
          alert('Bid withdrawn successfully');
          router.push('/buyersDashboard/bids');
        },
        onError: () => alert('Failed to withdraw bid'),
      });
    }
  };

  const handleAcceptCounter = () => {
    if (bid?.latestCounterOffer) {
      acceptCounter.mutate(bidId, {
        onSuccess: () => {
          alert('Counter offer accepted!');
          router.push('/buyersDashboard/bids');
        },
        onError: () => alert('Failed to accept counter offer'),
      });
    }
  };

  const handleRejectCounter = () => {
    if (bid?.latestCounterOffer) {
      rejectCounter.mutate(bidId, {
        onSuccess: () => {
          alert('Counter offer rejected');
          router.refresh();
        },
        onError: () => alert('Failed to reject counter offer'),
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

  if (error || !bid) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-red-500 mb-4">Failed to load bid details.</p>
        <button
          onClick={() => router.back()}
          className="text-[#C9A227] hover:underline"
        >
          Go Back
        </button>
      </div>
    );
  }

  const images = bid.listing.images?.length > 0 ? bid.listing.images : ['/bid1.png'];
  const isCountered = bid.status === 'countered' && bid.latestCounterOffer;
  const isPending = bid.status === 'pending';

  return (
    <div className="">
      <div className="w-full">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="text-gray-600 mb-4 hover:text-gray-900"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="grid md:grid-cols-12 gap-8 p-6">
          {/* Left Column - Images */}
          <div className='col-span-6 mb-20'>
            {/* Title */}
            <h2 className="text-lg font-semibold mb-2">{bid.listing.title}</h2>

            {/* Image Carousel */}
            <div className="relative rounded-lg overflow-hidden bg-gray-100 mb-4">
              <img
                src={images[currentImageIndex]}
                alt={bid.listing.title}
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
              <h1 className="text-2xl font-bold mb-1">{bid.listing.title}</h1>
              <p className="text-sm text-gray-500 mb-4">
                Offer received on {bid.listing.title}
              </p>

              {/* Description Section */}
              <div className="my-6">
                <h3 className="text-sm font-semibold mb-2">Description</h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {bid.listing.description || 'No description available.'}
                </p>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-start gap-2">
                  <Package className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Base Price</p>
                    <p className="text-sm font-semibold">${Number(bid.listing.basePrice || 0).toFixed(2)}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Location</p>
                    <p className="text-sm font-semibold">{bid.listing.location}, UK</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Scale className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Date Listed</p>
                    <p className="text-sm font-semibold">{bid.listing.dateListed}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Your Offer Card */}
          <div className='col-span-full md:col-start-7 border md:col-span-5'>
            <div className="p-6">
              {/* Header */}
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Your Offer</h2>

              {/* Offer Amount */}
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-1">Your Offer Amount</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${bid.offerPrice?.toFixed(2)} / {bid.offerPriceUnit}
                </p>
              </div>

              {/* Counter Offer (if exists) */}
              {isCountered && bid.latestCounterOffer && (
                <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-800 font-medium mb-1">Counter Offer from Seller</p>
                  <p className="text-xl font-bold text-blue-900">
                    ${bid.latestCounterOffer.price?.toFixed(2)} / {bid.latestCounterOffer.priceUnit}
                  </p>
                </div>
              )}

              {/* Date Submitted */}
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-1">Date Submitted</p>
                <p className="text-sm font-medium text-gray-900">{bid.createdAt}</p>
              </div>

              {/* Status */}
              <div className="mb-6">
                <p className="text-sm text-gray-600">
                  {bid.status === 'pending' && 'Awaiting seller response'}
                  {bid.status === 'countered' && 'Seller has made a counter offer'}
                  {bid.status === 'accepted' && 'Your bid has been accepted!'}
                  {bid.status === 'rejected' && 'Your bid was declined'}
                </p>
              </div>

              {/* Message */}
              {bid.message && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg w-full">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {bid.message}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                {isCountered && (
                  <>
                    <button
                      onClick={handleAcceptCounter}
                      disabled={acceptCounter.isPending}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {acceptCounter.isPending ? 'Accepting...' : 'Accept Counter Offer'}
                    </button>
                    <button
                      onClick={handleRejectCounter}
                      disabled={rejectCounter.isPending}
                      className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {rejectCounter.isPending ? 'Rejecting...' : 'Reject Counter Offer'}
                    </button>
                  </>
                )}
                {isPending && (
                  <>
                    <button
                      onClick={handleWithdraw}
                      disabled={withdrawBid.isPending}
                      className="w-full bg-[#C9A227] hover:bg-yellow-600 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {withdrawBid.isPending ? 'Withdrawing...' : 'Withdraw Offer'}
                    </button>
                    <button
                      onClick={() => router.push(`/buyersDashboard/Marketplace/Placebid?listingId=${bid.listing.id}&editBidId=${bidId}`)}
                      className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 rounded-lg transition-colors"
                    >
                      Edit Bid
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BidsDetail;
