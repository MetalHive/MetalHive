"use client"

import React from 'react';
import Link from 'next/link';
import { SettingsCard, SettingsSection } from '../../../Components/SettingsComponents';
import { FileText, Briefcase, CheckCircle2, Clock, XCircle, LifeBuoy } from 'lucide-react';
import { useBuyerProfile } from '@/app/hooks/useBuyer';

type Status = 'pending' | 'verified' | 'rejected';

const STATUS_META: Record<Status, {
    label: string;
    description: string;
    icon: React.ReactNode;
    badge: string;
}> = {
    pending: {
        label: 'Verification in progress',
        description:
            'Our team is reviewing the documents you submitted during registration. Bidding unlocks automatically once your company is verified.',
        icon: <Clock className="w-6 h-6 text-amber-600" />,
        badge: 'bg-amber-50 text-amber-800 border-amber-200',
    },
    verified: {
        label: 'Verified',
        description: 'Your company has been verified. You can place bids on any marketplace listing.',
        icon: <CheckCircle2 className="w-6 h-6 text-green-600" />,
        badge: 'bg-green-50 text-green-800 border-green-200',
    },
    rejected: {
        label: 'Verification rejected',
        description:
            'The documents you submitted could not be verified. Please contact support so we can help you resolve this.',
        icon: <XCircle className="w-6 h-6 text-red-600" />,
        badge: 'bg-red-50 text-red-800 border-red-200',
    },
};

const fileNameFromUrl = (url: string): string => {
    try {
        const path = new URL(url, 'http://placeholder.local').pathname;
        const name = decodeURIComponent(path.split('/').filter(Boolean).pop() || '');
        return name || url;
    } catch {
        return url;
    }
};

const VerificationPage = () => {
    const { data: profile, isLoading, error } = useBuyerProfile();

    if (isLoading) {
        return (
            <div className="flex-1 flex items-center justify-center min-h-[50vh]">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#C9A227]"></div>
            </div>
        );
    }

    const status: Status =
        profile?.verificationStatus ?? (profile?.isVerified ? 'verified' : 'pending');
    const meta = STATUS_META[status];
    const documentUrl = profile?.verificationDocument || null;

    return (
        <main className="p-10 mt-16 lg:mt-0 mx-auto max-w-4xl">
            <div className="max-w-[612px]">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-semibold text-[#17181a] mb-2">
                        Business Verification
                    </h1>
                    <p className="text-sm text-[#737780]">
                        Verification confirms your company is a legitimate buyer. It is required before you can bid.
                    </p>
                </div>

                {error && (
                    <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        We could not load your verification status. Please refresh the page.
                    </div>
                )}

                <div className="space-y-8">
                    {/* Status */}
                    <SettingsSection title="Status" description="Where your verification currently stands.">
                        <SettingsCard>
                            <div className="flex items-start gap-4">
                                <div className="shrink-0 w-12 h-12 rounded-full bg-[#f5f5f5] flex items-center justify-center">
                                    {meta.icon}
                                </div>
                                <div className="flex-1">
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full border text-xs font-semibold ${meta.badge}`}>
                                        {meta.label}
                                    </span>
                                    <p className="text-sm text-[#737780] mt-3 leading-relaxed">{meta.description}</p>
                                </div>
                            </div>
                        </SettingsCard>
                    </SettingsSection>

                    {/* Company details on file */}
                    <SettingsSection title="Company on file" description="The business details we are verifying.">
                        <SettingsCard>
                            <div className="flex items-start gap-3">
                                <Briefcase className="w-5 h-5 text-[#737780] mt-0.5" />
                                <div>
                                    <p className="text-sm font-semibold text-[#17181a]">
                                        {profile?.companyName || 'Company name not provided'}
                                    </p>
                                    <p className="text-sm text-[#737780]">{profile?.email}</p>
                                    {profile?.fullName && (
                                        <p className="text-sm text-[#737780]">Contact: {profile.fullName}</p>
                                    )}
                                </div>
                            </div>
                        </SettingsCard>
                    </SettingsSection>

                    {/* Submitted document */}
                    <SettingsSection title="Submitted document" description="Uploaded when you created your account.">
                        <SettingsCard>
                            {documentUrl ? (
                                <div className="flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <FileText className="w-5 h-5 text-[#C9A227] shrink-0" />
                                        <span className="text-sm font-medium text-[#17181a] truncate">
                                            {fileNameFromUrl(documentUrl)}
                                        </span>
                                    </div>
                                    <a
                                        href={documentUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="shrink-0 text-sm font-medium text-[#C9A227] hover:underline"
                                    >
                                        View
                                    </a>
                                </div>
                            ) : (
                                <div className="flex items-start gap-3">
                                    <FileText className="w-5 h-5 text-[#999999] mt-0.5" />
                                    <p className="text-sm text-[#737780]">
                                        No verification document is on file. Contact support to submit one.
                                    </p>
                                </div>
                            )}
                        </SettingsCard>
                    </SettingsSection>

                    {/* Support */}
                    <SettingsCard className="bg-[#fafafa]">
                        <div className="flex items-start gap-3">
                            <LifeBuoy className="w-5 h-5 text-[#737780] mt-0.5" />
                            <div className="text-sm text-[#737780] leading-relaxed">
                                <p className="font-medium text-[#17181a] mb-1">Need to update your documents?</p>
                                <p>
                                    Documents cannot be changed from this page. If anything is incorrect, or your
                                    verification was rejected, please{' '}
                                    <Link href="/buyersDashboard/settings/support" className="text-[#C9A227] font-medium hover:underline">
                                        contact support
                                    </Link>{' '}
                                    and our team will help you.
                                </p>
                            </div>
                        </div>
                    </SettingsCard>
                </div>
            </div>
        </main>
    );
};

export default VerificationPage;
