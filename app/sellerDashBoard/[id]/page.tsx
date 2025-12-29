"use client"

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Share2, Edit3, Clock, ChevronLeft } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import listingsService from '@/app/lib/api/services/listingsService';
import bidsService from '@/app/lib/api/services/bidsService';
import SideBar from "../../Components/SideBar";
import { sellerSidebarLinks } from "../../lib/sidebarConfig";
import { AcceptBidModal, CounterOfferModal, DeclineBidModal } from "../../Components/BidModals";
import { SuccessModal } from "../../Components/Modals";

const ListingDetailPage: React.FC = () => {
  const params = useParams();
  const router = useRouter(); const queryClient = useQueryClient();
  const listingId = params.id as string;
  const [currentImage, setCurrentImage] = useState(0);
  const [activeTab, setActiveTab] = useState<'pending' | 'countered' | 'accepted'>('pending');

  // Modal states
  const [selectedBid, setSelectedBid] = useState<any>(null);
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showCounterModal, setShowCounterModal] = useState(false);
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState({ title: '', message: '' });
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch listing details
  const { data: listing, isLoading, error } = useQuery({
    queryKey: ['listing', listingId],
    queryFn: () => listingsService.getListingById(listingId),
  });

  // Fetch bids for this listing
  const { data: bidsData } = useQuery({
    queryKey: ['listing-bids', listingId],
    queryFn: () => bidsService.getBids({ listingId }),
  });

  // Bid action handlers
  const handleAcceptBid = async (price: number, notes?: string) => {
    if (!selectedBid) return;
    setIsProcessing(true);
    try {
      await bidsService.acceptBid(selectedBid.id, { acceptedPrice: price, notes });
      queryClient.invalidateQueries({ queryKey: ['listing-bids', listingId] });
      queryClient.invalidateQueries({ queryKey: ['listing', listingId] });
      setShowAcceptModal(false);
      setSuccessMessage({
        title: 'Bid Accepted',
        message: "You've successfully accepted this offer. The buyer has been notified and next steps can begin."
      });
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Failed to accept bid:', error);
      alert('Failed to accept bid. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCounterOffer = async (price: number, message?: string) => {
    if (!selectedBid) return;
    setIsProcessing(true);
    try {
      await bidsService.counterOffer(selectedBid.id, {
        counterPrice: price,
        counterPriceUnit: selectedBid.offerPriceUnit,
        message
      });
      queryClient.invalidateQueries({ queryKey: ['listing-bids', listingId] });
      setShowCounterModal(false);
      setSuccessMessage({
        title: 'Offer Sent',
        message: 'Counter offer sent successfully'
      });
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Failed to send counter offer:', error);
      alert('Failed to send counter offer. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeclineBid = async (reason: string) => {
    if (!selectedBid) return;
    setIsProcessing(true);
    try {
      await bidsService.rejectBid(selectedBid.id, reason);
      queryClient.invalidateQueries({ queryKey: ['listing-bids', listingId] });
      setShowDeclineModal(false);
      setSuccessMessage({
        title: 'Bid Declined',
        message: 'The buyer has been notified of your decision.'
      });
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Failed to decline bid:', error);
      alert('Failed to decline bid. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-[#fafafa]">
        <SideBar links={sellerSidebarLinks} />
        <div className="flex-1 flex items-center justify-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#C9A227]"></div>
        </div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="flex min-h-screen bg-[#fafafa]">
        <SideBar links={sellerSidebarLinks} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-4">Failed to load listing</p>
            <button
              onClick={() => router.back()}
              className="text-[#C9A227] hover:underline"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  const bids = bidsData?.bids || [];

  return (
    <div className="flex min-h-screen bg-[#fafafa]">
      {/* Sidebar */}
      <SideBar links={sellerSidebarLinks} />

      {/* Main Content */}
      <main className="flex-1 p-10 mt-16 lg:mt-0">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-medium text-[#17181a] bg-white border border-[#ececec] rounded-lg hover:bg-gray-50 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>

        {/* Header Section */}
        <div className="bg-white rounded-2xl border border-[#ececec] p-6 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-[24px] font-semibold text-[#17181a]">
                  {listing.title}
                </h1>
                <div className="flex items-center gap-2 px-3 py-1 bg-[#f5f5f5] rounded-lg">
                  <span className="text-sm text-[#737780]">ID:</span>
                  <span className="text-sm font-semibold text-[#17181a]">#{listing.productCode}</span>
                </div>
              </div>
              <p className="text-sm text-[#999999]">
                Here's a quick look at all bids received for your listing
              </p>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2.5 border border-[#ececec] rounded-lg hover:bg-gray-50 transition-colors">
                <Share2 className="w-4 h-4 text-[#737780]" />
                <span className="text-sm font-medium text-[#17181a]">Share Listing</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2.5 border border-[#ececec] rounded-lg hover:bg-gray-50 transition-colors">
                <Edit3 className="w-4 h-4 text-[#737780]" />
                <span className="text-sm font-medium text-[#17181a]">Edit Listing</span>
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-full">
          <div className="space-y-6">
            {/* Combined Image + Description Card */}
            <div className="bg-white rounded-2xl border border-[#ececec] p-6">
              <div className="grid grid-cols-[200px_1fr] gap-6">
                {/* Image Thumbnail */}
                <div>
                  <img
                    src={listing.images[currentImage] || '/bid1.png'}
                    alt={listing.title}
                    className="w-full h-[160px] object-cover rounded-xl"
                  />
                  <div className="flex justify-center gap-2 mt-3">
                    {listing.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImage(index)}
                        className={`w-1.5 h-1.5 rounded-full transition-colors ${currentImage === index ? 'bg-[#17181a]' : 'bg-[#d9d9d9]'
                          }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Content */}
                <div className="grid grid-cols-[1fr_auto] gap-8">
                  {/* Left: Title and Bids */}
                  <div>
                    <h2 className="text-xl font-semibold text-[#17181a] mb-2">
                      {listing.title}
                    </h2>
                    <p className="text-sm text-[#999999] mb-4">
                      Listed {new Date(listing.listedOn).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                    </p>
                    <p className="text-base font-semibold text-[#17181a]">
                      {listing.bidsCount} bids
                    </p>
                  </div>

                  {/* Right: Description and Details */}
                  <div className="border-l border-[#ececec] pl-8 min-w-[400px]">
                    <h3 className="text-sm font-semibold text-[#17181a] mb-3">Description</h3>
                    <p className="text-sm text-[#737780] leading-relaxed mb-6">
                      {listing.description}
                    </p>

                    {/* Details Grid */}
                    <div className="grid grid-cols-3 gap-6">
                      <div className="flex items-start gap-2">
                        <svg className="w-4 h-4 text-[#999999] mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                          <p className="text-xs text-[#999999] mb-1">Price</p>
                          <p className="text-sm font-semibold text-[#17181a]">${listing.price.toFixed(2)}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <svg className="w-4 h-4 text-[#999999] mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <div>
                          <p className="text-xs text-[#999999] mb-1">Location</p>
                          <p className="text-sm font-semibold text-[#17181a]">{listing.location}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <svg className="w-4 h-4 text-[#999999] mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                        </svg>
                        <div>
                          <p className="text-xs text-[#999999] mb-1">Weight</p>
                          <p className="text-sm font-semibold text-[#17181a]">{listing.quantity}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bids Section */}
            <div className="bg-white rounded-2xl border border-[#ececec] p-6">
              {/* Tabs */}
              <div className="flex gap-6 border-b border-[#ececec] mb-6">
                {[
                  { label: 'New Offers', status: 'pending' as const },
                  { label: 'In Review', status: 'countered' as const },
                  { label: 'Accepted', status: 'accepted' as const },
                ].map((tab) => {
                  const count = bids.filter((b: any) => b.status === tab.status).length;
                  const isActive = activeTab === tab.status;

                  return (
                    <button
                      key={tab.status}
                      onClick={() => setActiveTab(tab.status)}
                      className={`pb-3 px-1 text-sm font-medium transition-colors relative ${isActive
                        ? 'text-[#17181a]'
                        : 'text-[#999999] hover:text-[#737780]'
                        }`}
                    >
                      {tab.label} ({count})
                      {isActive && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C9A227]" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Bids Grid */}
              {bids.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {bids.filter((b: any) => b.status === activeTab).map((bid: any) => (
                    <div
                      key={bid.id}
                      className="border border-[#ececec] rounded-xl p-4 hover:shadow-md transition-shadow"
                    >
                      {/* Company Info */}
                      <div className="flex items-start gap-3 mb-4">
                        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                          <span className="text-lg font-semibold text-gray-600">
                            {(bid.buyer.companyName || 'U').charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-[#17181a] truncate">
                            {bid.buyer.companyName || 'Anonymous Buyer'}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-[#999999]">Region: NA</span>
                            <span className="text-xs text-[#999999]">•</span>
                            <div className="flex items-center gap-1">
                              <span className="text-xs text-[#999999]">{bid.buyer.rating || 4.2}</span>
                              <svg className="w-3 h-3 text-[#C9A227]" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Offer Price */}
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-[#999999] mb-1">QUANTITY</p>
                          <p className="text-base font-bold text-[#17181a]">
                            {bid.quantity} {bid.offerPriceUnit}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-[#999999] mb-1">OFFER PRICE</p>
                          <p className="text-base font-bold text-[#17181a]">
                            ${parseFloat(bid.offerPrice).toFixed(0)}
                          </p>
                        </div>
                      </div>

                      {/* Time */}
                      <div className="flex items-center gap-1 text-xs text-[#999999] mb-4">
                        <Clock className="w-3 h-3" />
                        <span>Received {new Date(bid.createdAt).toLocaleDateString()}</span>
                      </div>

                      {/* Action Buttons */}
                      {bid.status === 'pending' && (
                        <div className="grid grid-cols-3 gap-2">
                          <button
                            onClick={() => {
                              setSelectedBid(bid);
                              setShowDeclineModal(true);
                            }}
                            className="px-3 py-2 text-xs font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                          >
                            Decline
                          </button>
                          <button
                            onClick={() => {
                              setSelectedBid(bid);
                              setShowCounterModal(true);
                            }}
                            className="px-3 py-2 text-xs font-medium text-[#17181a] border border-[#ececec] rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            Counter
                          </button>
                          <button
                            onClick={() => {
                              setSelectedBid(bid);
                              setShowAcceptModal(true);
                            }}
                            className="px-3 py-2 text-xs font-medium bg-[#C9A227] text-white rounded-lg hover:bg-[#b08f1f] transition-colors"
                          >
                            Accept
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-[#999999]">No bids received yet</p>
                </div>
              )}
            </div>
          </div>


        </div>
      </main>
      {/* Modals */}
      {selectedBid && (
        <>
          <AcceptBidModal
            isOpen={showAcceptModal}
            onClose={() => setShowAcceptModal(false)}
            onConfirm={handleAcceptBid}
            bid={selectedBid}
            isLoading={isProcessing}
          />

          <CounterOfferModal
            isOpen={showCounterModal}
            onClose={() => setShowCounterModal(false)}
            onSubmit={handleCounterOffer}
            bid={selectedBid}
            isLoading={isProcessing}
          />

          <DeclineBidModal
            isOpen={showDeclineModal}
            onClose={() => setShowDeclineModal(false)}
            onConfirm={handleDeclineBid}
            isLoading={isProcessing}
          />
        </>
      )}

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title={successMessage.title}
        message={successMessage.message}
      />
    </div>
  );
};

export default ListingDetailPage;