"use client"

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { ChevronLeft, User, Shield, HelpCircle, FileText, UserX, LogOut, Briefcase } from 'lucide-react';

interface SettingsSidebarProps {
    onClose?: () => void;
}

const BuyerSettingsSidebar: React.FC<SettingsSidebarProps> = ({ onClose }) => {
    const router = useRouter();
    const pathname = usePathname();

    const handleLogout = () => {
        // TODO: Implement logout functionality
        router.push('/signin');
    };

    const settingsLinks = [
        {
            category: 'Account Settings',
            items: [
                { label: 'Profile Information', href: '/buyersDashboard/settings', icon: User },
                { label: 'Login & Security', href: '/buyersDashboard/settings/security', icon: Shield },
            ]
        },
        {
            category: 'Verification & Compliance',
            items: [
                { label: 'Business Verification', href: '/buyersDashboard/settings/verification', icon: Briefcase },
            ]
        },
        {
            category: 'Support & Legal',
            items: [
                { label: 'Help & Support', href: '/buyersDashboard/settings/support', icon: HelpCircle },
                { label: 'Privacy Policy', href: '/buyersDashboard/settings/privacy', icon: FileText },
                { label: 'Delete Account', href: '/buyersDashboard/settings/delete', icon: UserX },
            ]
        },
    ];

    return (
        <div className="w-[275px] bg-white border-r border-[#ececec] min-h-screen p-6">
            {/* Header */}
            <div className="flex items-center gap-3 mb-8">
                <button
                    onClick={() => router.push('/buyersDashboard')}
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

export default BuyerSettingsSidebar;
