"use client"

import React from 'react';
import { SettingsCard } from '../../../Components/SettingsComponents';

const PrivacyPage = () => {
    return (
        <main className="p-10 mt-16 lg:mt-0 mx-auto max-w-4xl">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-semibold text-[#17181a] mb-2">
                    Privacy Policy
                </h1>
                <p className="text-sm text-[#737780]">
                    Last updated: December 31, 2025
                </p>
            </div>

            <SettingsCard className="space-y-6 text-[#17181a] leading-relaxed">
                <div>
                    <h2 className="text-lg font-semibold mb-3">1. Introduction</h2>
                    <p className="text-sm text-gray-600">
                        Welcome to Metal Hive. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website (regardless of where you visit it from) and tell you about your privacy rights and how the law protects you.
                    </p>
                </div>

                <div>
                    <h2 className="text-lg font-semibold mb-3">2. Data We Collect</h2>
                    <p className="text-sm text-gray-600 mb-2">
                        We may collect, use, store and transfer different kinds of personal data about you which we have grouped together follows:
                    </p>
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 ml-4">
                        <li>Identity Data includes first name, maiden name, last name, username or similar identifier, marital status, title, date of birth and gender.</li>
                        <li>Contact Data includes billing address, delivery address, email address and telephone numbers.</li>
                        <li>Financial Data includes bank account and payment card details.</li>
                        <li>Transaction Data includes details about payments to and from you and other details of products and services you have purchased from us.</li>
                    </ul>
                </div>

                <div>
                    <h2 className="text-lg font-semibold mb-3">3. How We Use Your Data</h2>
                    <p className="text-sm text-gray-600">
                        We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
                    </p>
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 ml-4 mt-2">
                        <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
                        <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
                        <li>Where we need to comply with a legal or regulatory obligation.</li>
                    </ul>
                </div>

                <div>
                    <h2 className="text-lg font-semibold mb-3">4. Data Security</h2>
                    <p className="text-sm text-gray-600">
                        We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.
                    </p>
                </div>

                <div>
                    <h2 className="text-lg font-semibold mb-3">5. Contact Us</h2>
                    <p className="text-sm text-gray-600">
                        If you have any questions about this privacy policy or our privacy practices, please contact our data privacy manager at: privacy@metalhive.com
                    </p>
                </div>
            </SettingsCard>
        </main>
    );
};

export default PrivacyPage;
