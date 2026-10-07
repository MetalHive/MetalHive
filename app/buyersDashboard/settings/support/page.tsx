"use client"

import React, { useState } from 'react';
import { SettingsCard, TextInput, SettingsButton } from '../../../Components/SettingsComponents';
import { Mail, MessageCircle, Phone } from 'lucide-react';
import { useCreateSupportTicket, useUserProfile } from '../../../hooks/useSettings';
import { getErrorMessage } from '@/app/lib/api/client';

import { useToast } from '@/app/Components/Toast';
const HelpSupportPage = () => {
    const toast = useToast();
    const createTicket = useCreateSupportTicket();
    const { data: profile } = useUserProfile();

    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    // `null` means "not edited yet": the field shows the profile email as soon
    // as it loads, and keeps the user's own value once they type.
    const [emailOverride, setEmailOverride] = useState<string | null>(null);
    const email = emailOverride ?? profile?.email ?? '';

    const handleSubmit = async () => {
        if (!subject || !email || !message) {
            toast.error('Please fill in all fields');
            return;
        }

        try {
            const result = await createTicket.mutateAsync({ subject, email, message });
            toast.success(`Your message has been sent successfully! Ticket ID: ${result.ticketId}`);
            setSubject('');
            setMessage('');
            setEmailOverride(null);
        } catch (error: unknown) {
            toast.error(getErrorMessage(error, 'Failed to send message. Please try again.'));
        }
    };

    return (
        <main className="p-10 mt-16 lg:mt-0 mx-auto max-w-[800px]">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-semibold text-[#17181a] mb-2">
                    Help & Support
                </h1>
                <p className="text-sm text-[#737780]">
                    Get help or contact our support team
                </p>
            </div>

            {/* Contact Methods */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-white rounded-xl border border-[#ececec] p-6 text-center">
                    <div className="flex justify-center mb-3">
                        <div className="w-12 h-12 rounded-full bg-[#f5f5f5] flex items-center justify-center">
                            <Mail className="w-6 h-6 text-[#C9A227]" />
                        </div>
                    </div>
                    <h3 className="text-sm font-semibold text-[#17181a] mb-1">Email</h3>
                    <p className="text-xs text-[#737780]">support@metalhive.com</p>
                </div>

                <div className="bg-white rounded-xl border border-[#ececec] p-6 text-center">
                    <div className="flex justify-center mb-3">
                        <div className="w-12 h-12 rounded-full bg-[#f5f5f5] flex items-center justify-center">
                            <Phone className="w-6 h-6 text-[#C9A227]" />
                        </div>
                    </div>
                    <h3 className="text-sm font-semibold text-[#17181a] mb-1">Phone</h3>
                    <p className="text-xs text-[#737780]">+1 (555) 123-4567</p>
                </div>

                <div className="bg-white rounded-xl border border-[#ececec] p-6 text-center">
                    <div className="flex justify-center mb-3">
                        <div className="w-12 h-12 rounded-full bg-[#f5f5f5] flex items-center justify-center">
                            <MessageCircle className="w-6 h-6 text-[#C9A227]" />
                        </div>
                    </div>
                    <h3 className="text-sm font-semibold text-[#17181a] mb-1">Live Chat</h3>
                    <p className="text-xs text-[#737780]">Available 9AM-5PM EST</p>
                </div>
            </div>

            {/* Contact Form */}
            <SettingsCard>
                <h2 className="text-lg font-semibold text-[#17181a] mb-6">Send us a message</h2>

                <div className="space-y-6">
                    <TextInput
                        label="Subject"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="What do you need help with?"
                    />

                    <TextInput
                        label="Email Address"
                        value={email}
                        onChange={(e) => setEmailOverride(e.target.value)}
                        placeholder="your.email@example.com"
                        type="email"
                    />

                    <div>
                        <label className="block text-sm font-medium text-[#17181a] mb-2">
                            Message
                        </label>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            rows={6}
                            className="w-full px-4 py-3 border border-[#ececec] rounded-lg text-sm text-[#17181a] placeholder:text-[#999999] focus:outline-none focus:border-[#C9A227] resize-none"
                            placeholder="Describe your issue or question in detail..."
                        />
                    </div>

                    <SettingsButton onClick={handleSubmit} isLoading={createTicket.isPending}>
                        Send Message
                    </SettingsButton>
                </div>
            </SettingsCard>

            {/* FAQs */}
            <div className="mt-8">
                <h2 className="text-lg font-semibold text-[#17181a] mb-4">Frequently Asked Questions</h2>

                <div className="space-y-4">
                    <SettingsCard className="p-4">
                        <h3 className="text-sm font-semibold text-[#17181a] mb-2">How do I verify my business?</h3>
                        <p className="text-sm text-[#737780]">
                            Your documents are submitted during registration. Check Settings → Verification & Compliance for the current status.
                        </p>
                    </SettingsCard>

                    <SettingsCard className="p-4">
                        <h3 className="text-sm font-semibold text-[#17181a] mb-2">How do I place a bid?</h3>
                        <p className="text-sm text-[#737780]">
                            Browse the marketplace, select a listing, and click &quot;Place Bid&quot;. You can track your bids in the dashboard.
                        </p>
                    </SettingsCard>

                    <SettingsCard className="p-4">
                        <h3 className="text-sm font-semibold text-[#17181a] mb-2">How do I contact a seller?</h3>
                        <p className="text-sm text-[#737780]">
                            You can communicate with sellers once your bid has been accepted or countered.
                        </p>
                    </SettingsCard>
                </div>
            </div>
        </main>
    );
};

export default HelpSupportPage;
