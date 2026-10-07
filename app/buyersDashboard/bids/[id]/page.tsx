'use client'
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ChevronLeft, MapPin, Package, Scale, X } from 'lucide-react';
import { useBuyerBidDetail, useWithdrawBid, useAcceptCounterOffer, useRejectCounterOffer } from '../../../hooks/useBuyer';
import { Modal } from '@/app/Components/Modals';
import { getErrorMessage } from '@/app/lib/api/client';

import { useToast } from '@/app/Components/Toast';
const formatDate = (value?: string | null) => {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? '—'
    : date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

const formatDateTime = (value?: string | null) => {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? '—'
    : date.toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

const STATUS_TEXT: Record<string, string> = {
  pending: 'Awaiting seller response',
  countered: 'Seller has made a counter offer',
  accepted: 'Your bid has been accepted!',
  rejected: 'Your bid was declined',
  withdrawn: 'You withdrew this bid',
  expired: 'This bid has expired',
};

// Withdraw confirmation (replaces the native confirm()).
const WithdrawBidModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason?: string) => void;
  isLoading?: boolean;
}> = ({ isOpen, onClose, onConfirm, isLoading = false }) => {
  const [reason, setReason] = useState('');
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-[#17181a]">Withdraw Offer</h2>
          <button onClick={onClose} className="text-[#737780] hover:text-[#17181a]">
            <X className="w-5 h-5" />
          </button>
        </div>
        <p className="text-sm text-[#737780] mb-6">
          Are you sure you want to withdraw this bid? The seller will no longer see your offer.
        </p>
        <div className="mb-6">
          <label className="block text-sm font-medium text-[#737780] mb-2">
            Reason (optional)
          </label>
          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full px-4 py-3 border border-[#ececec] rounded-lg text-sm text-[#17181a] placeholder:text-[#999999] focus:outline-none focus:border-[#C9A227]"
            placeholder="e.g. Found another supplier"
          />
        </div>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 border border-[#ececec] text-[#17181a] font-medium text-sm rounded-lg hover:bg-gray-50 transition-colors"
          >
            Keep Bid
          </button>
          <button
            onClick={() => onConfirm(reason.trim() || undefined)}
            disabled={isLoading}
            className="flex-1 px-6 py-3 bg-[#C9A227] text-white font-medium text-sm rounded-lg hover:bg-[#b08f1f] transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Withdrawing...' : 'Withdraw'}
          </button>
        </div>
      </div>
    </Modal>
  );
};

const BidsDetail = () => {
  const toast = useToast();
  const params = useParams();
  const router = useRouter();
  const bidId = params.id as string;

  const { data: bid, isLoading, error } = useBuyerBidDetail(bidId);
  const withdrawBid = useWithdrawBid();
  const acceptCounter = useAcceptCounterOffer();
  const rejectCounter = useRejectCounterOffer();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showWithdraw, setShowWithdraw] = useState(false);

  const handleWithdraw = (reason?: string) => {
    withdrawBid.mutate({ id: bidId, reason }, {
      onSuccess: () => {
        setShowWithdraw(false);
        toast.success('Bid withdrawn successfully');
        router.push('/buyersDashboard/bids');
      },
      onError: (err) => toast.error(getErrorMessage(err, 'Failed to withdraw bid')),
    });
  };

  const handleAcceptCounter = () => {
    if (bid?.latestCounterOffer) {
      acceptCounter.mutate(bidId, {
        onSuccess: () => {
          toast.success('Counter offer accepted!');
          router.push('/buyersDashboard/bids');
        },
        onError: (err) => toast.error(getErrorMessage(err, 'Failed to accept counter offer')),
      });
    }
  };

  const handleRejectCounter = () => {
    if (bid?.latestCounterOffer) {
      rejectCounter.mutate(bidId, {
        onSuccess: () => {
          toast.success('Counter offer rejected');
        },
        onError: (err) => toast.error(getErrorMessage(err, 'Failed to reject counter offer')),
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

  const images = bid.listing.images?.filter(Boolean).length > 0 ? bid.listing.images.filter(Boolean) : ['/bid1.png'];
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
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={images[currentImageIndex] || '/bid1.png'}
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
                Offer sent on {formatDate(bid.createdAt)}
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
                    <p className="text-sm font-semibold">
                      ${Number(bid.listing.basePrice || 0).toFixed(2)}
                      {bid.listing.priceUnit && ` / ${bid.listing.priceUnit}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Location</p>
                    <p className="text-sm font-semibold">{bid.listing.location || '—'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Scale className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Date Listed</p>
                    <p className="text-sm font-semibold">{formatDate(bid.listing.dateListed)}</p>
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
                  ${Number(bid.offerPrice || 0).toFixed(2)} / {bid.offerPriceUnit}
                </p>
                {bid.quantity && (
                  <p className="text-sm text-gray-500 mt-1">Quantity: {bid.quantity}</p>
                )}
              </div>

              {/* Counter Offer (if exists) */}
              {isCountered && bid.latestCounterOffer && (
                <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-800 font-medium mb-1">Counter Offer from Seller</p>
                  <p className="text-xl font-bold text-blue-900">
                    ${Number(bid.latestCounterOffer.price || 0).toFixed(2)} / {bid.latestCounterOffer.priceUnit}
                  </p>
                </div>
              )}

              {/* Date Submitted */}
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-1">Date Submitted</p>
                <p className="text-sm font-medium text-gray-900">{formatDateTime(bid.createdAt)}</p>
              </div>

              {/* Status */}
              <div className="mb-6">
                <p className="text-sm text-gray-600">
                  {STATUS_TEXT[bid.status] || bid.status}
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
                      onClick={() => setShowWithdraw(true)}
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

      <WithdrawBidModal
        isOpen={showWithdraw}
        onClose={() => setShowWithdraw(false)}
        onConfirm={handleWithdraw}
        isLoading={withdrawBid.isPending}
      />
    </div>
  );
};

export default BidsDetail;
