"use client"

import React, { useState, useEffect } from 'react';
import SettingsSidebar from "../../../Components/SettingsSidebar";
import { SettingsCard, TextInput, SettingsButton } from "../../../Components/SettingsComponents";
import { usePayoutDetails, useUpdatePayoutDetails } from '../../../hooks/useSettings';

// Values must be the API's choice keys. The select previously carried the
// display labels ("Bank Transfer"), which the backend rejected outright with
// `"Bank Transfer" is not a valid choice` — every save returned 400.
const PAYMENT_METHODS = [
    { value: 'bank_transfer', label: 'Bank Transfer' },
    { value: 'paypal', label: 'PayPal' },
];

const digitsOnly = (value: string) => value.replace(/[\s-]/g, '');

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
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [saved, setSaved] = useState(false);

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
        setPayoutData(prev => ({ ...prev, [field]: value }));
        setErrors(prev => ({ ...prev, [field]: '' }));
        setSaved(false);
    };

    const isBankTransfer = payoutData.paymentMethod === 'bank_transfer';

    // Mirrors UpdatePayoutDetailsSerializer so the rules are stated here rather
    // than discovered through a 400 after submitting.
    const validate = () => {
        const next: Record<string, string> = {};

        if (!payoutData.accountHolderName.trim()) {
            next.accountHolderName = 'Account holder name is required.';
        }

        const account = digitsOnly(payoutData.accountNumber);
        if (!account) {
            next.accountNumber = 'Account number is required.';
        } else if (!/^\d+$/.test(account)) {
            next.accountNumber = 'Account number must contain only digits.';
        } else if (account.length < 8) {
            next.accountNumber = 'Account number must be at least 8 digits.';
        }

        const routing = digitsOnly(payoutData.routingNumber);
        if (isBankTransfer && !routing) {
            next.routingNumber = 'Routing number is required for bank transfers.';
        } else if (routing) {
            if (!/^\d+$/.test(routing)) {
                next.routingNumber = 'Routing number must contain only digits.';
            } else if (routing.length !== 9) {
                next.routingNumber = `Routing number must be exactly 9 digits (you entered ${routing.length}).`;
            }
        }

        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const handleSave = async () => {
        if (!validate()) return;

        try {
            await updatePayout.mutateAsync({
                ...payoutData,
                accountNumber: digitsOnly(payoutData.accountNumber),
                routingNumber: digitsOnly(payoutData.routingNumber),
            });
            setSaved(true);
            setErrors({});
        } catch (error: any) {
            // Surface what the API actually objected to instead of a generic
            // "please try again".
            const details = error?.response?.data?.errors?.details;
            if (Array.isArray(details) && details.length) {
                setErrors(
                    details.reduce((acc: Record<string, string>, d: any) => {
                        acc[d.field] = d.message;
                        return acc;
                    }, {})
                );
            } else {
                setErrors({
                    form: error?.response?.data?.message || 'Failed to save payout details. Please try again.',
                });
            }
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
                                        {PAYMENT_METHODS.map((method) => (
                                            <option key={method.value} value={method.value}>
                                                {method.label}
                                            </option>
                                        ))}
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
                                {errors.paymentMethod && (
                                    <p className="mt-1 text-xs text-red-600">{errors.paymentMethod}</p>
                                )}
                            </div>

                            {/* Account Holder Name */}
                            <TextInput
                                label="Account Holder Name"
                                value={payoutData.accountHolderName}
                                onChange={(e) => handleInputChange('accountHolderName', e.target.value)}
                                placeholder="Enter account holder name"
                                error={errors.accountHolderName}
                            />

                            {/* Bank Name */}
                            <TextInput
                                label="Bank Name"
                                value={payoutData.bankName}
                                onChange={(e) => handleInputChange('bankName', e.target.value)}
                                placeholder="Enter bank name"
                                error={errors.bankName}
                            />

                            {/* Account Number */}
                            <TextInput
                                label="Account Number"
                                inputMode="numeric"
                                value={payoutData.accountNumber}
                                onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                                placeholder={existingPayout ? `****${existingPayout.accountNumberLast4}` : "Enter account number"}
                                error={errors.accountNumber}
                                hint="Digits only, at least 8."
                            />

                            {/* Routing Number */}
                            <TextInput
                                label={isBankTransfer ? 'Routing Number' : 'Routing Number (optional)'}
                                inputMode="numeric"
                                maxLength={11}
                                value={payoutData.routingNumber}
                                onChange={(e) => handleInputChange('routingNumber', e.target.value)}
                                placeholder="9 digits, e.g. 021000021"
                                error={errors.routingNumber}
                                hint={`Exactly 9 digits.${
                                    digitsOnly(payoutData.routingNumber)
                                        ? ` ${digitsOnly(payoutData.routingNumber).length}/9 entered.`
                                        : ''
                                }`}
                            />

                            {errors.form && (
                                <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                    {errors.form}
                                </div>
                            )}

                            {saved && (
                                <div className="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                                    Payout details saved.
                                </div>
                            )}

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
