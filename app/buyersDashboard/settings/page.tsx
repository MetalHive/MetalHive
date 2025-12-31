"use client"

import React, { useState, useEffect } from 'react';
import { Upload } from 'lucide-react';
import { useBuyerProfile, useUpdateBuyerProfile, useUploadBuyerLogo } from '../../hooks/useBuyer';

const SettingsPage = () => {
    const { data: profile, isLoading: loadingProfile } = useBuyerProfile();
    const updateProfile = useUpdateBuyerProfile();
    const uploadLogo = useUploadBuyerLogo();

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        companyName: '',
    });

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>('');

    // Pre-fill form when profile data loads
    useEffect(() => {
        if (profile) {
            setFormData({
                fullName: profile.fullName || '',
                email: profile.email || '',
                phone: profile.phone || '',
                companyName: profile.companyName || '',
            });
            setPreviewUrl(profile.companyLogo || '');
        }
    }, [profile]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);
            const imageUrl = URL.createObjectURL(file);
            setPreviewUrl(imageUrl);

            // Upload immediately
            try {
                await uploadLogo.mutateAsync(file);
                alert('Profile logo uploaded successfully!');
            } catch (error) {
                console.error('Failed to upload logo:', error);
                alert('Failed to upload profile logo. Please try again.');
                setPreviewUrl(profile?.companyLogo || '');
            }
        }
    };

    const handleSaveChanges = async () => {
        try {
            await updateProfile.mutateAsync(formData);
            alert('Profile updated successfully!');
        } catch (error) {
            console.error('Failed to update profile:', error);
            alert('Failed to update profile. Please try again.');
        }
    };

    if (loadingProfile) {
        return (
            <div className="flex-1 flex items-center justify-center min-h-[50vh]">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#C9A227]"></div>
            </div>
        );
    }

    return (
        <main className="p-10 mt-16 lg:mt-0 mx-auto max-w-4xl">
            <div className="max-w-[612px]">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-semibold text-[#17181a] mb-2">
                        Profile Information
                    </h1>
                    <p className="text-sm text-[#737780]">
                        Manage your personal and company information.
                    </p>
                </div>

                {/* Profile Picture / Logo */}
                <div className="bg-white rounded-2xl border border-[#ececec] p-6 mb-6">
                    <div className="flex items-start gap-5">
                        <div className="relative">
                            {previewUrl ? (
                                <img
                                    src={previewUrl}
                                    alt="Profile"
                                    className="w-16 h-16 rounded-full object-cover bg-gray-200"
                                />
                            ) : (
                                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                                    <span className="text-2xl text-gray-400">
                                        {formData.fullName.charAt(0).toUpperCase() || profile?.fullName?.charAt(0).toUpperCase() || 'U'}
                                    </span>
                                </div>
                            )}
                        </div>

                        <div>
                            <p className="text-base font-semibold text-[#17181a] mb-2">Company Logo / Profile Picture</p>
                            <label
                                htmlFor="profile-upload"
                                className="inline-flex items-center gap-2 px-6 py-3 border border-[#ececec] rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                            >
                                <Upload className="w-4 h-4 text-[#737780]" />
                                <span className="text-sm font-medium text-[#17181a]">Upload image</span>
                                <input
                                    id="profile-upload"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageUpload}
                                />
                            </label>
                        </div>
                    </div>
                </div>

                {/* Form Fields */}
                <div className="bg-white rounded-2xl border border-[#ececec] p-6 space-y-6">
                    {/* Full Name */}
                    <div>
                        <label className="block text-sm font-medium text-[#17181a] mb-2">
                            Full Name
                        </label>
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            placeholder="Enter your full name"
                            className="w-full px-4 py-3 border border-[#ececec] rounded-lg text-sm text-[#17181a] placeholder:text-[#999999] focus:outline-none focus:border-[#C9A227]"
                        />
                    </div>

                    {/* Company Name */}
                    <div>
                        <label className="block text-sm font-medium text-[#17181a] mb-2">
                            Company Name
                        </label>
                        <input
                            type="text"
                            name="companyName"
                            value={formData.companyName}
                            onChange={handleInputChange}
                            placeholder="Enter your company name"
                            className="w-full px-4 py-3 border border-[#ececec] rounded-lg text-sm text-[#17181a] placeholder:text-[#999999] focus:outline-none focus:border-[#C9A227]"
                        />
                    </div>

                    {/* Email Address */}
                    <div>
                        <label className="block text-sm font-medium text-[#17181a] mb-2">
                            Email Address
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={profile?.email || ''} // Usually email is not editable directly here or read-only
                            disabled
                            placeholder="your.email@example.com"
                            className="w-full px-4 py-3 border border-[#ececec] rounded-lg text-sm text-[#17181a] bg-gray-50 placeholder:text-[#999999] focus:outline-none"
                        />
                        <p className="mt-1 text-xs text-gray-500">To change your email, please go to Login & Security.</p>
                    </div>

                    {/* Phone Number */}
                    <div>
                        <label className="block text-sm font-medium text-[#17181a] mb-2">
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="+ 123 456 7890"
                            className="w-full px-4 py-3 border border-[#ececec] rounded-lg text-sm text-[#17181a] placeholder:text-[#999999] focus:outline-none focus:border-[#C9A227]"
                        />
                    </div>

                    {/* Save Button */}
                    <div className="pt-4">
                        <button
                            onClick={handleSaveChanges}
                            disabled={updateProfile.isPending}
                            className="px-6 py-3 bg-[#C9A227] text-white font-medium text-sm rounded-lg hover:bg-[#b08f1f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {updateProfile.isPending ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default SettingsPage;
