"use client"

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { ChevronLeft, User, Shield, CreditCard, HelpCircle, FileText, UserX, LogOut } from 'lucide-react';

interface SettingsSidebarProps {
    onClose?: () => void;
}

const SettingsSidebar: React.FC<SettingsSidebarProps> = ({ onClose }) => {
    const router = useRouter();
    const pathname = usePathname();

    const handleLogout = () => {
        // TODO: Implement logout functionality
        router.push('/signin');
    };

    const settingsLinks = [
        {
            category: 'Account & Profile',
            items: [
                { label: 'Profile', href: '/sellerDashBoard/Settings', icon: User },
                { label: 'Login & Security', href: '/sellerDashBoard/Settings/security', icon: Shield },
            ]
        },
        {
            category: 'Payments & Payouts',
            items: [
                { label: 'Payout Details', href: '/sellerDashBoard/Settings/payout', icon: CreditCard },
            ]
        },
        {
            category: 'Support & Legal',
            items: [
                { label: 'Help & Support', href: '/sellerDashBoard/Settings/support', icon: HelpCircle },
                { label: 'Privacy Policy', href: '/sellerDashBoard/Settings/privacy', icon: FileText },
                { label: 'Delete Account', href: '/sellerDashBoard/Settings/delete', icon: UserX },
            ]
        },
    ];

    return (
        <div className="w-[275px] bg-white border-r border-[#ececec] min-h-screen p-6">
            {/* Header */}
            <div className="flex items-center gap-3 mb-8">
                <button
                    onClick={() => router.push('/sellerDashBoard')}
                    className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <ChevronLeft className="w-5 h-5 text-[#17181a]" />
                </button>
                <h1 className="text-xl font-semibold text-[#17181a]">Settings</h1>
            </div>

            {/* Settings Links */}
            <div className="space-y-6">
                {settingsLinks.map((section, index) => (
                    <div key={index}>
                        <h2 className="text-xs font-medium text-[#999999] uppercase mb-3 px-3">
                            {section.category}
                        </h2>
                        <div className="space-y-1">
                            {section.items.map((item) => {
                                const Icon = item.icon;
                                const isActive = pathname === item.href;

                                return (
                                    <button
                                        key={item.href}
                                        onClick={() => router.push(item.href)}
                                        className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg transition-colors ${isActive
                                                ? 'bg-[#f5f5f5] text-[#17181a] font-medium'
                                                : 'text-[#737780] hover:bg-gray-50'
                                            }`}
                                    >
                                        <Icon className="w-5 h-5" />
                                        <span className="text-sm">{item.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ))}

                {/* Logout */}
                <div className="pt-4 border-t border-[#ececec]">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="text-sm font-medium">Logout</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SettingsSidebar;
