"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SettingsCard, PasswordInput } from '../../../Components/SettingsComponents';
import { SuccessModal } from '../../../Components/Modals';
import { useDeleteAccount } from '../../../hooks/useSettings';

const DeleteAccountPage = () => {
    const router = useRouter();
    const deleteAccount = useDeleteAccount();

    const [reason, setReason] = useState('');
    const [password, setPassword] = useState('');
    const [showPasswordInput, setShowPasswordInput] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const deleteReasons = [
        "I'm not finding relevant listings",
        "I'm not winning enough bids",
        "The platform is difficult to use",
        "I found a better alternative",
        "Privacy concerns",
        "Other"
    ];

    const handleContinue = () => {
        setShowPasswordInput(true);
    };

    const handleConfirmDelete = async () => {
        if (!password) {
            alert('Please enter your password to confirm');
            return;
        }

        try {
            await deleteAccount.mutateAsync({ reason, password });
            setShowPasswordInput(false);
            setShowSuccessModal(true);
        } catch (error: any) {
            console.error('Failed to delete account:', error);
            if (error.response?.data?.errors?.code === 'ACTIVE_TRANSACTIONS') {
                alert('Cannot delete account with active bids or pending transactions');
            } else if (error.response?.data?.errors?.code === 'INVALID_PASSWORD') {
                alert('Incorrect password');
            } else {
                alert('Failed to delete account. Please try again.');
            }
        }
    };

    const handleSuccessClose = () => {
        setShowSuccessModal(false);
        router.push('/signin');
    };

    return (
        <main className="p-10 mt-16 lg:mt-0 mx-auto max-w-4xl">
            <div className="max-w-[612px]">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-semibold text-[#17181a] mb-3">
                        Delete Account
                    </h1>
                    <p className="text-sm text-[#737780] leading-relaxed">
                        Deleting your account will permanently remove your bids, saved listings, and history.
                        This action cannot be undone.
                    </p>
                </div>

                {/* Delete Form */}
                <SettingsCard className="mb-6">
                    <div className="space-y-6">
                        {/* Reason Dropdown */}
                        <div>
                            <label className="block text-sm font-medium text-[#17181a] mb-2">
                                Why are you leaving? (optional)
                            </label>
                            <div className="relative">
                                <select
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    className="w-full px-4 py-3 border border-[#ececec] rounded-lg text-sm text-[#17181a] appearance-none focus:outline-none focus:border-[#C9A227] bg-white"
                                >
                                    <option value="">Select a reason</option>
                                    {deleteReasons.map((r) => (
                                        <option key={r} value={r}>{r}</option>
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
                        </div>
                    </div>
                </SettingsCard>

                {/* Continue Button */}
                {!showPasswordInput ? (
                    <button
                        onClick={handleContinue}
                        className="px-6 py-3 bg-red-600 text-white font-medium text-sm rounded-lg hover:bg-red-700 transition-colors"
                    >
                        Continue
                    </button>
                ) : (
                    <SettingsCard className="p-6">
                        <PasswordInput
                            label="Confirm Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                        />
                        <div className="flex gap-3 mt-4">
                            <button
                                onClick={() => setShowPasswordInput(false)}
                                className="flex-1 px-6 py-3 border border-[#ececec] text-[#17181a] font-medium text-sm rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmDelete}
                                disabled={deleteAccount.isPending}
                                className="flex-1 px-6 py-3 bg-red-600 text-white font-medium text-sm rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                            >
                                {deleteAccount.isPending ? 'Deleting...' : 'Delete Account'}
                            </button>
                        </div>
                    </SettingsCard>
                )}
            </div>

            <SuccessModal
                isOpen={showSuccessModal}
                onClose={handleSuccessClose}
                title="Account Deleted"
                message="Your account has been deleted successfully. We hope to see you again!"
            />
        </main>
    );
};

export default DeleteAccountPage;
