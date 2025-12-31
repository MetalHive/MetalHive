import React from 'react';
import BuyerSettingsSidebar from '../components/BuyerSettingsSidebar';

export default function SettingsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-[#fafafa]">
            <BuyerSettingsSidebar />
            <div className="flex-1">
                {children}
            </div>
        </div>
    );
}
