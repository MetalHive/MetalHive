'use client';

import React, { useState } from 'react';
import { ArrowLeft, MapPin, Weight, DollarSign } from 'lucide-react';
import FormField from '@/app/Components/FormField';
import { useRouter } from 'next/navigation';
export default function BidForm() {
    const [formData, setFormData] = useState({
        bidPrice: '$300',
        quantity: '300 KG',
        message: ''
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const updateFormData = (updates: Partial<typeof formData>) => {
        setFormData(prev => ({ ...prev, ...updates }));
    };

    const handleSubmit = () => {
        console.log('Bid submitted:', formData);
        alert('Bid placed successfully!');
    };

    const handleSave = () => {
        console.log('Listing saved');
        alert('Listing saved!');
    };
 const router = useRouter();

  const goBack = () => {
    router.back();
  };
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
                            Place a Bid for Copper Scrap - 1.2 tonnes
                        </h1>
                        <p className="text-xs text-gray-500 mb-8">
                            Listing by Metal Recycling Ltd.
                        </p>

                        <div>
                            {/* Set Bid Section */}
                            <div className="mb-6">
                                <h2 className="text-sm font-medium text-gray-900 mb-4">
                                    Set Bid
                                </h2>

                                {/* Using FormField Component Pattern */}

                                <FormField
                                    label="Bid Price"
                                    placeholder="e.g. $300"
                                    value={formData.bidPrice}
                                    onChange={(e) => updateFormData({ bidPrice: e.target.value })}
                                    error={errors.bidPrice}
                                />

                                <FormField
                                    label="Quantity (KG)"
                                    placeholder="e.g. 300 KG"
                                    value={formData.quantity}
                                    onChange={(e) => updateFormData({ quantity: e.target.value })}
                                    error={errors.quantity}
                                />

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
                                    className="px-8 py-2.5 bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-medium rounded transition-colors"
                                >
                                    Place Bid
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="px-8 py-2.5 bg-white hover:bg-gray-50 text-gray-900 text-sm font-medium rounded border border-gray-300 transition-colors"
                                >
                                    Save listing
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Product Details */}
                    <div className='lg:col-span-6'>
                        <div className="flex items-start gap-3 mb-6">
                            <img
                                src="/bid3.png"
                                alt="Aluminium Sheets"
                                className="w-12 h-12 rounded object-cover"
                            />
                            <div>
                                <h2 className="text-sm font-semibold text-gray-900">
                                    Aluminium Sheets
                                </h2>
                                <p className="text-xs text-gray-500">
                                    Listing created on 12-07-2025
                                </p>
                            </div>
                        </div>

                        <div className="mb-6">
                            <h3 className="text-sm font-medium text-gray-900 mb-3">
                                Description
                            </h3>
                            <p className="text-sm text-gray-700 leading-relaxed">
                                This copper scrap batch is clean, well-sorted, and ready for immediate
                                pickup. Material has low moisture content and consistent grade, suitable
                                for recycling or industrial use.
                            </p>
                        </div>

                        {/* Details */}
                        <div className="flex flex-row gap-6">
                            <div className="flex gap-2">
                                <DollarSign className="w-4 h-4 text-gray-400 mt-0.5" />
                                <div>
                                    <p className="text-xs text-gray-500">Price</p>
                                    <p className="text-sm font-semibold text-gray-900">$350.00</p>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                                <div>
                                    <p className="text-xs text-gray-500">Location</p>
                                    <p className="text-sm font-semibold text-gray-900">Birmingham, UK</p>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <Weight className="w-4 h-4 text-gray-400 mt-0.5" />
                                <div>
                                    <p className="text-xs text-gray-500">Weight</p>
                                    <p className="text-sm font-semibold text-gray-900">500 Kg</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}