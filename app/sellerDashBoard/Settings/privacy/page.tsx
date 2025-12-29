"use client"

import React from 'react';
import SettingsSidebar from "../../../Components/SettingsSidebar";

const PrivacyPolicyPage = () => {
    return (
        <div className="flex min-h-screen bg-[#fafafa]">
            <SettingsSidebar />

            <main className="flex-1 p-10 mt-16 lg:mt-0 mx-30">
                <div className="max-w-[800px]">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-2xl font-semibold text-[#17181a] mb-2">
                            Privacy Policy
                        </h1>
                        <p className="text-sm text-[#737780]">
                            Last updated: December 2024
                        </p>
                    </div>

                    {/* Content */}
                    <div className="bg-white rounded-2xl border border-[#ececec] p-8 space-y-6">
                        <section>
                            <h2 className="text-lg font-semibold text-[#17181a] mb-3">1. Information We Collect</h2>
                            <p className="text-sm text-[#737780] leading-relaxed">
                                We collect information you provide directly to us, including your name, email address, company information,
                                payment details, and listing information. We also collect information about your use of our services,
                                including transaction history and communication with buyers.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-lg font-semibold text-[#17181a] mb-3">2. How We Use Your Information</h2>
                            <p className="text-sm text-[#737780] leading-relaxed mb-3">
                                We use the information we collect to:
                            </p>
                            <ul className="list-disc list-inside text-sm text-[#737780] space-y-2 ml-4">
                                <li>Provide, maintain, and improve our services</li>
                                <li>Process transactions and send related information</li>
                                <li>Send you technical notices and support messages</li>
                                <li>Respond to your comments and questions</li>
                                <li>Protect against fraudulent or illegal activity</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-lg font-semibold text-[#17181a] mb-3">3. Information Sharing</h2>
                            <p className="text-sm text-[#737780] leading-relaxed">
                                We do not sell your personal information. We may share your information with buyers to facilitate
                                transactions, with service providers who perform services on our behalf, and when required by law or
                                to protect our rights.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-lg font-semibold text-[#17181a] mb-3">4. Data Security</h2>
                            <p className="text-sm text-[#737780] leading-relaxed">
                                We implement appropriate technical and organizational measures to protect your personal information
                                against unauthorized access, alteration, disclosure, or destruction. However, no internet transmission
                                is completely secure.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-lg font-semibold text-[#17181a] mb-3">5. Your Rights</h2>
                            <p className="text-sm text-[#737780] leading-relaxed mb-3">
                                You have the right to:
                            </p>
                            <ul className="list-disc list-inside text-sm text-[#737780] space-y-2 ml-4">
                                <li>Access and receive a copy of your personal information</li>
                                <li>Correct inaccurate or incomplete information</li>
                                <li>Request deletion of your personal information</li>
                                <li>Object to or restrict certain processing of your information</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-lg font-semibold text-[#17181a] mb-3">6. Contact Us</h2>
                            <p className="text-sm text-[#737780] leading-relaxed">
                                If you have any questions about this Privacy Policy, please contact us at privacy@metalhive.com
                            </p>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default PrivacyPolicyPage;
