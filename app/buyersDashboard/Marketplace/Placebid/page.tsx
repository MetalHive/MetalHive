'use client';

import React, { Suspense, useState } from 'react';
import { ArrowLeft, MapPin, Weight, DollarSign, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import FormField from '@/app/Components/FormField';
import { useRouter, useSearchParams } from 'next/navigation';
import {
    useMarketplaceListing,
    usePlaceBid,
    useEditBid,
    useBuyerBidDetail,
    useBuyerProfile,
} from '../../../hooks/useBuyer';
import type { ListingDetail, BuyerBidDetail } from '@/app/lib/api/services/buyerService';
import { getErrorCode, getErrorMessage } from '@/app/lib/api/client';
import { formatDate } from '@/app/lib/utils/formatters';

import { useToast } from '@/app/Components/Toast';

const NOT_VERIFIED_MESSAGE = 'Your company must be verified before you can bid.';

const Spinner = () => (
    <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C9A227]"></div>
    </div>
);

interface BidFormProps {
    listingId: string;
    listing?: ListingDetail;
    editBidId?: string;
    existingBid?: BuyerBidDetail;
    verificationStatus: 'pending' | 'verified' | 'rejected' | 'unknown';
}

/**
 * The form proper. It is only mounted once the listing (and, when editing,
 * the bid) has loaded, so the initial state can be seeded directly from the
 * data instead of via an effect.
 */
function BidForm({ listingId, listing, editBidId, existingBid, verificationStatus }: BidFormProps) {
    const toast = useToast();
    const router = useRouter();
    const placeBid = usePlaceBid();
    const editBid = useEditBid();
    const isEditing = Boolean(editBidId && existingBid);

    const [formData, setFormData] = useState({
        bidPrice: existingBid ? String(existingBid.offerPrice ?? '') : '',
        quantity: existingBid?.quantity ? String(existingBid.quantity).replace(/[^0-9.]/g, '') : '',
        message: existingBid?.message || '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [notVerifiedError, setNotVerifiedError] = useState<string | null>(null);

    // The offer is submitted as a price PER UNIT, matching how the seller
    // priced the listing. priceUnit is sent to the API exactly as the listing
    // reports it (tonne, kg, g, lb, unit).
    const priceUnit = listing?.priceUnit || existingBid?.offerPriceUnit || 'kg';
    const quantityUnit = listing?.quantityUnit || 'kg';
    const askingPrice = Number(listing?.basePrice || existingBid?.listing?.basePrice || 0);

    const bidPriceValue = parseFloat(formData.bidPrice.replace(/[^0-9.]/g, ''));
    const quantityValue = parseFloat(formData.quantity.replace(/[^0-9.]/g, ''));
    const offerTotal =
        Number.isFinite(bidPriceValue) && Number.isFinite(quantityValue)
            ? bidPriceValue * quantityValue
            : null;

    const isBlocked = verificationStatus === 'pending' || verificationStatus === 'rejected';
    const isSubmitting = placeBid.isPending || editBid.isPending;

    const updateFormData = (updates: Partial<typeof formData>) => {
        setFormData(prev => ({ ...prev, ...updates }));
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!Number.isFinite(bidPriceValue) || bidPriceValue <= 0) {
            newErrors.bidPrice = 'Please enter a valid bid price';
        }
        if (!Number.isFinite(quantityValue) || quantityValue <= 0) {
            newErrors.quantity = 'Please enter a valid quantity';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleError = (error: unknown, fallback: string) => {
        const code = getErrorCode(error);
        const message = getErrorMessage(error, fallback);
        if (code === 'BUYER_NOT_VERIFIED') {
            setNotVerifiedError(message || NOT_VERIFIED_MESSAGE);
        }
        toast.error(message);
    };

    const handleSubmit = () => {
        if (!validateForm()) return;
        setNotVerifiedError(null);

        // Quantity is sent with the listing's own unit so the seller sees it
        // the way they listed it (e.g. "300kg").
        const quantityWithUnit = `${quantityValue}${quantityUnit}`;

        if (isEditing && editBidId) {
            editBid.mutate(
                {
                    id: editBidId,
                    data: {
                        offerAmount: bidPriceValue,
                        quantity: quantityWithUnit,
                        message: formData.message || undefined,
                    },
                },
                {
                    onSuccess: () => {
                        toast.success('Bid updated successfully!');
                        router.push(`/buyersDashboard/bids/${editBidId}`);
                    },
                    onError: (error) => handleError(error, 'Failed to update bid. Please try again.'),
                }
            );
            return;
        }

        if (!listingId) return;
        placeBid.mutate({
            listingId,
            bidPrice: bidPriceValue,
            priceUnit,
            quantity: quantityWithUnit,
            message: formData.message || undefined,
        }, {
            onSuccess: () => {
                toast.success('Bid placed successfully!');
                router.push('/buyersDashboard/bids');
            },
            onError: (error) => handleError(error, 'Failed to place bid. Please try again.'),
        });
    };

    const goBack = () => {
        router.back();
    };

    const title = listing?.materialName || existingBid?.listing?.title || 'Listing';
    const sellerName = listing?.seller?.name || listing?.sellerName || existingBid?.seller?.name || 'Seller';
    const image = listing?.images?.[0] || existingBid?.listing?.images?.[0] || '/bid3.png';
    const createdAt = listing?.createdAt || existingBid?.listing?.dateListed;

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4">
                <button onClick={goBack} className="text-gray-700 hover:text-gray-900">
                    <ArrowLeft className="w-5 h-5" />
                </button>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Verification notice */}
                {(isBlocked || notVerifiedError) && (
                    <div
                        role="alert"
                        className="mb-8 flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"
                    >
                        <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
                        <div className="flex-1">
                            <p className="font-medium">{notVerifiedError || NOT_VERIFIED_MESSAGE}</p>
                            <p className="mt-0.5">
                                {verificationStatus === 'rejected'
                                    ? 'Your verification was rejected. Please contact support to resolve this before bidding.'
                                    : 'Verification is in progress — bidding unlocks once your company is verified.'}
                            </p>
                        </div>
                        <Link
                            href="/buyersDashboard/settings/verification"
                            className="shrink-0 font-medium underline underline-offset-2"
                        >
                            View status
                        </Link>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Left Column - Bid Form */}
                    <div className='lg:col-span-6'>
                        <h1 className="text-lg font-semibold text-gray-900 mb-1">
                            {isEditing ? 'Edit your bid for' : 'Place a Bid for'} {title}
                            {listing?.quantity || listing?.weight ? ` - ${listing?.quantity || listing?.weight}` : ''}
                        </h1>
                        <p className="text-xs text-gray-500 mb-8">
                            Listing by {sellerName}
                        </p>

                        <div>
                            {/* Set Bid Section */}
                            <div className="mb-6">
                                <h2 className="text-sm font-medium text-gray-900 mb-4">
                                    {isEditing ? 'Update Bid' : 'Set Bid'}
                                </h2>

                                <FormField
                                    label={`Bid Price (per ${priceUnit})`}
                                    placeholder={`e.g. 12.50 per ${priceUnit}`}
                                    value={formData.bidPrice}
                                    onChange={(e) => updateFormData({ bidPrice: e.target.value })}
                                    error={errors.bidPrice}
                                />
                                <p className="-mt-2 mb-4 text-xs text-gray-500">
                                    This is a price <span className="font-medium">per {priceUnit}</span>, not a
                                    total. The seller is asking ${askingPrice.toFixed(2)} per {priceUnit}.
                                </p>

                                <FormField
                                    label={`Quantity (${quantityUnit})`}
                                    placeholder={`e.g. 300 ${quantityUnit}`}
                                    value={formData.quantity}
                                    onChange={(e) => updateFormData({ quantity: e.target.value })}
                                    error={errors.quantity}
                                />
                                <p className="-mt-2 mb-4 text-xs text-gray-500">
                                    {listing?.quantity
                                        ? `The seller has ${listing.quantity} available.`
                                        : 'How much you want to buy.'}
                                </p>

                                {offerTotal !== null && (
                                    <div className="mb-4 rounded-md border border-gray-200 bg-gray-50 px-4 py-3">
                                        <p className="text-xs text-gray-500">Your total offer</p>
                                        <p className="text-lg font-bold text-gray-900">
                                            ${offerTotal.toLocaleString(undefined, {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            })}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {quantityValue.toLocaleString()} {quantityUnit} × $
                                            {bidPriceValue.toFixed(2)} per {priceUnit}
                                        </p>
                                    </div>
                                )}

                                <FormField
                                    label="Message (Optional)"
                                    type="textarea"
                                    placeholder="Write a compelling message to convince the seller"
                                    value={formData.message}
                                    onChange={(e) => updateFormData({ message: e.target.value })}
                                    error={errors.message}
                                />
                            </div>

                            <p className="text-xs text-gray-500 mb-6">
                                Buyers with detailed messages get faster responses.
                            </p>

                            {/* Action Buttons */}
                            <div className="flex gap-4">
                                <button
                                    onClick={handleSubmit}
                                    disabled={isSubmitting || isBlocked}
                                    title={isBlocked ? NOT_VERIFIED_MESSAGE : undefined}
                                    className="px-8 py-2.5 bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-medium rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting
                                        ? (isEditing ? 'Saving...' : 'Placing Bid...')
                                        : (isEditing ? 'Save Changes' : 'Place Bid')}
                                </button>
                                <button
                                    onClick={goBack}
                                    className="px-8 py-2.5 bg-white hover:bg-gray-50 text-gray-900 text-sm font-medium rounded border border-gray-300 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Product Details */}
                    <div className='lg:col-span-6'>
                        <div className="flex items-start gap-3 mb-6">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={image}
                                alt={title}
                                className="w-12 h-12 rounded object-cover"
                            />
                            <div>
                                <h2 className="text-sm font-semibold text-gray-900">
                                    {title}
                                </h2>
                                <p className="text-xs text-gray-500">
                                    Listing created on {createdAt ? formatDate(createdAt) : 'N/A'}
                                </p>
                            </div>
                        </div>

                        <div className="mb-6">
                            <h3 className="text-sm font-medium text-gray-900 mb-3">
                                Description
                            </h3>
                            <p className="text-sm text-gray-700 leading-relaxed">
                                {listing?.description || existingBid?.listing?.description || 'No description available.'}
                            </p>
                        </div>

                        {/* Details */}
                        <div className="flex flex-row gap-6">
                            <div className="flex gap-2">
                                <DollarSign className="w-4 h-4 text-gray-400 mt-0.5" />
                                <div>
                                    <p className="text-xs text-gray-500">Price</p>
                                    <p className="text-sm font-semibold text-gray-900">
                                        ${askingPrice.toFixed(2)} / {priceUnit}
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                                <div>
                                    <p className="text-xs text-gray-500">Location</p>
                                    <p className="text-sm font-semibold text-gray-900">
                                        {listing?.location || existingBid?.listing?.location || 'N/A'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <Weight className="w-4 h-4 text-gray-400 mt-0.5" />
                                <div>
                                    <p className="text-xs text-gray-500">Weight</p>
                                    <p className="text-sm font-semibold text-gray-900">
                                        {listing?.quantity || listing?.weight || 'N/A'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

/** Reads the query string and loads the data the form needs. */
function BidFormLoader() {
    const searchParams = useSearchParams();
    const listingId = searchParams.get('listingId') || '';
    const editBidId = searchParams.get('editBidId') || '';

    const { data: listing, isLoading: listingLoading } = useMarketplaceListing(listingId);
    const { data: existingBid, isLoading: bidLoading } = useBuyerBidDetail(editBidId);
    const { data: profile } = useBuyerProfile();

    if ((listingId && listingLoading) || (editBidId && bidLoading)) {
        return <Spinner />;
    }

    const verificationStatus = profile
        ? profile.verificationStatus ?? (profile.isVerified ? 'verified' : 'pending')
        : 'unknown';

    return (
        <BidForm
            key={`${listingId}-${editBidId}`}
            listingId={listingId || existingBid?.listing?.id || ''}
            listing={listing}
            editBidId={editBidId || undefined}
            existingBid={existingBid}
            verificationStatus={verificationStatus}
        />
    );
}

export default function PlaceBidPage() {
    // useSearchParams must be inside a Suspense boundary for static rendering.
    return (
        <Suspense fallback={<Spinner />}>
            <BidFormLoader />
        </Suspense>
    );
}
