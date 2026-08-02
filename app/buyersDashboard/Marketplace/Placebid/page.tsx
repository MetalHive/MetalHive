'use client';

import React, { useState } from 'react';
import { ArrowLeft, MapPin, Weight, DollarSign } from 'lucide-react';
import FormField from '@/app/Components/FormField';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMarketplaceListing, usePlaceBid } from '../../../hooks/useBuyer';

import { useToast } from '@/app/Components/Toast';
export default function BidForm() {
    const toast = useToast();
    const router = useRouter();
    const searchParams = useSearchParams();
    const listingId = searchParams.get('listingId') || '';

    const { data: listing, isLoading } = useMarketplaceListing(listingId);
    const placeBid = usePlaceBid();

    const [formData, setFormData] = useState({
        bidPrice: '',
        quantity: '',
        message: ''
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    // The offer is submitted as a price PER UNIT, matching how the seller
    // priced the listing. The form previously said only "Bid Price", so a
    // buyer meaning "$250 for the lot" would submit $250 per kilogram.
    const priceUnit = listing?.priceUnit || 'kg';
    const quantityUnit = listing?.quantityUnit || 'kg';
    const askingPrice = Number(listing?.basePrice || 0);

    const bidPriceValue = parseFloat(formData.bidPrice.replace(/[^0-9.]/g, ''));
    const quantityValue = parseFloat(formData.quantity.replace(/[^0-9.]/g, ''));
    const offerTotal =
        Number.isFinite(bidPriceValue) && Number.isFinite(quantityValue)
            ? bidPriceValue * quantityValue
            : null;

    const updateFormData = (updates: Partial<typeof formData>) => {
        setFormData(prev => ({ ...prev, ...updates }));
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.bidPrice || parseFloat(formData.bidPrice) <= 0) {
            newErrors.bidPrice = 'Please enter a valid bid price';
        }
        if (!formData.quantity) {
            newErrors.quantity = 'Please enter a quantity';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validateForm() || !listingId) return;

        placeBid.mutate({
            listingId,
            bidPrice: parseFloat(formData.bidPrice.replace(/[^0-9.]/g, '')),
            priceUnit: listing?.priceUnit || 'kg',
            quantity: formData.quantity,
            message: formData.message || undefined,
        }, {
            onSuccess: () => {
                toast.success('Bid placed successfully!');
                router.push('/buyersDashboard/bids');
            },
            onError: (error) => {
                toast.error('Failed to place bid. Please try again.');
                console.error('Bid error:', error);
            }
        });
    };

    const goBack = () => {
        router.back();
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C9A227]"></div>
            </div>
        );
    }

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
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Left Column - Bid Form */}
                    <div className='lg:col-span-6'>
                        <h1 className="text-lg font-semibold text-gray-900 mb-1">
                            Place a Bid for {listing?.materialName || 'Listing'} - {listing?.quantity || listing?.weight || ''}
                        </h1>
                        <p className="text-xs text-gray-500 mb-8">
                            Listing by {listing?.seller?.name || listing?.sellerName || 'Seller'}
                        </p>

                        <div>
                            {/* Set Bid Section */}
                            <div className="mb-6">
                                <h2 className="text-sm font-medium text-gray-900 mb-4">
                                    Set Bid
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
                                    disabled={placeBid.isPending}
                                    className="px-8 py-2.5 bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-medium rounded transition-colors disabled:opacity-50"
                                >
                                    {placeBid.isPending ? 'Placing Bid...' : 'Place Bid'}
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
                            <img
                                src={listing?.images?.[0] || "/bid3.png"}
                                alt={listing?.materialName || 'Listing'}
                                className="w-12 h-12 rounded object-cover"
                            />
                            <div>
                                <h2 className="text-sm font-semibold text-gray-900">
                                    {listing?.materialName || 'Listing'}
                                </h2>
                                <p className="text-xs text-gray-500">
                                    Listing created on {listing?.createdAt ? new Date(listing.createdAt).toLocaleDateString() : 'N/A'}
                                </p>
                            </div>
                        </div>

                        <div className="mb-6">
                            <h3 className="text-sm font-medium text-gray-900 mb-3">
                                Description
                            </h3>
                            <p className="text-sm text-gray-700 leading-relaxed">
                                {listing?.description || 'No description available.'}
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
                                        {listing?.location || 'N/A'}
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
