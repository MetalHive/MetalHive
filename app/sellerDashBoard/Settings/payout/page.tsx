"use client"

import React, { useState, useEffect } from 'react';
import SettingsSidebar from "../../../Components/SettingsSidebar";
import { SettingsCard, TextInput, SettingsButton } from "../../../Components/SettingsComponents";
import { usePayoutDetails, useUpdatePayoutDetails } from '../../../hooks/useSettings';

const PayoutPage = () => {
    const { data: existingPayout, isLoading } = usePayoutDetails();
    const updatePayout = useUpdatePayoutDetails();

    const [payoutData, setPayoutData] = useState({
        paymentMethod: 'bank_transfer',
        accountHolderName: '',
        bankName: '',
        accountNumber: '',
        routingNumber: '',
    });

    // Pre-fill form when data loads
    useEffect(() => {
        if (existingPayout) {
            setPayoutData({
                paymentMethod: existingPayout.paymentMethod || 'bank_transfer',
                accountHolderName: existingPayout.accountHolderName || '',
                bankName: existingPayout.bankName || '',
                accountNumber: '', // Don't pre-fill for security
                routingNumber: existingPayout.routingNumber || '',
            });
        }
    }, [existingPayout]);

    const handleInputChange = (field: string, value: string) => {
        setPayoutData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = async () => {
        if (!payoutData.accountHolderName || !payoutData.accountNumber) {
            alert('Please fill in required fields');
            return;
        }

        try {
            await updatePayout.mutateAsync(payoutData);
            alert('Payout details saved successfully!');
        } catch (error) {
            console.error('Failed to save payout details:', error);
            alert('Failed to save payout details. Please try again.');
        }
    };

    if (isLoading) {
        return (
            <div className="flex min-h-screen bg-[#fafafa]">
                <SettingsSidebar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#C9A227]"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-[#fafafa]">
            <SettingsSidebar />

            <main className="flex-1 p-10 mt-16 lg:mt-0 mx-30">
                <div className="max-w-[612px]">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-2xl font-semibold text-[#17181a] mb-2">
                            Payout Details
                        </h1>
                        <p className="text-sm text-[#737780]">
                            View or change where your earnings are sent
                        </p>
                    </div>

                    {/* Payout Form */}
                    <SettingsCard>
                        <div className="space-y-6">
                            {/* Payment Method */}
                            <div>
                                <label className="block text-sm font-medium text-[#17181a] mb-2">
                                    Payment Method
                                </label>
                                <div className="relative">
                                    <select
                                        value={payoutData.paymentMethod}
                                        onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                                        className="w-full px-4 py-3 border border-[#ececec] rounded-lg text-sm text-[#17181a] appearance-none focus:outline-none focus:border-[#C9A227] bg-white"
                                    >
                                        <option value="Bank Transfer">Bank Transfer</option>
                                        <option value="PayPal">PayPal</option>
                                        <option value="Mobile Money">Mobile Money</option>
                                    </select>
                                    <svg
                                        className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#737780] pointer-events-none"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>

                            {/* Account Holder Name */}
                            <TextInput
                                label="Account Holder Name"
                                value={payoutData.accountHolderName}
                                onChange={(e) => handleInputChange('accountHolderName', e.target.value)}
                                placeholder="Enter account holder name"
                            />

                            {/* Bank Name */}
                            <TextInput
                                label="Bank Name"
                                value={payoutData.bankName}
                                onChange={(e) => handleInputChange('bankName', e.target.value)}
                                placeholder="Enter bank name"
                            />

                            {/* Account Number */}
                            <TextInput
                                label="Account Number"
                                value={payoutData.accountNumber}
                                onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                                placeholder={existingPayout ? `****${existingPayout.accountNumberLast4}` : "Enter account number"}
                            />

                            {/* Routing Number */}
                            <TextInput
                                label="Routing Number (optional)"
                                value={payoutData.routingNumber}
                                onChange={(e) => handleInputChange('routingNumber', e.target.value)}
                                placeholder="Enter routing number"
                            />

                            {/* Save Button */}
                            <SettingsButton
                                onClick={handleSave}
                                isLoading={updatePayout.isPending}
                            >
                                Save Payout Details
                            </SettingsButton>
                        </div>
                    </SettingsCard>
                </div>
            </main>
        </div>
    );
};

export default PayoutPage;
