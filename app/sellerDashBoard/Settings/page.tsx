"use client"

import React, { useState, useEffect } from 'react';
import SettingsSidebar from "../../Components/SettingsSidebar";
import { Upload } from 'lucide-react';
import { useUserProfile, useUpdateProfile, useUploadProfilePicture } from '../../hooks/useSettings';

const SettingsPage = () => {
    const { data: profile, isLoading: loadingProfile } = useUserProfile();
    const updateProfile = useUpdateProfile();
    const uploadPicture = useUploadProfilePicture();

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        country: '',
        city: '',
    });

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>('');

    // Pre-fill form when profile data loads
    useEffect(() => {
        if (profile) {
            setFormData({
                name: profile.name || '',
                phone: profile.phone || '',
                country: profile.country || '',
                city: profile.city || '',
            });
            setPreviewUrl(profile.profilePicture || '');
        }
    }, [profile]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
                await uploadPicture.mutateAsync(file);
                alert('Profile picture uploaded successfully!');
            } catch (error) {
                console.error('Failed to upload picture:', error);
                alert('Failed to upload profile picture. Please try again.');
                setPreviewUrl(profile?.profilePicture || '');
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
                            Profile Information
                        </h1>
                        <p className="text-sm text-[#737780]">
                            This information is used to identify you to sellers during bidding.
                        </p>
                    </div>

                    {/* Profile Picture */}
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
                                            {formData.name.charAt(0).toUpperCase() || profile?.name.charAt(0).toUpperCase() || 'U'}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div>
                                <p className="text-base font-semibold text-[#17181a] mb-2">Profile Picture</p>
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
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="Enter your full name"
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
                                value={profile?.email || ''}
                                onChange={handleInputChange}
                                placeholder="your.email@example.com"
                                className="w-full px-4 py-3 border border-[#ececec] rounded-lg text-sm text-[#17181a] placeholder:text-[#999999] focus:outline-none focus:border-[#C9A227]"
                            />
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
                                placeholder="+ 234 12 3456 7890"
                                className="w-full px-4 py-3 border border-[#ececec] rounded-lg text-sm text-[#17181a] placeholder:text-[#999999] focus:outline-none focus:border-[#C9A227]"
                            />
                        </div>

                        {/* Location */}
                        <div className="space-y-4">
                            <label className="block text-sm font-medium text-[#17181a]">
                                Location
                            </label>

                            {/* Country Dropdown */}
                            <div className="relative">
                                <select
                                    name="country"
                                    value={formData.country}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-[#ececec] rounded-lg text-sm text-[#17181a] appearance-none focus:outline-none focus:border-[#C9A227] bg-white"
                                >
                                    <option value="">Select Country</option>
                                    <option value="Nigeria">Nigeria</option>
                                    <option value="UK">United Kingdom</option>
                                    <option value="USA">United States</option>
                                    <option value="Ghana">Ghana</option>
                                    <option value="Kenya">Kenya</option>
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

                            {/* City Dropdown */}
                            <div className="relative">
                                <select
                                    name="city"
                                    value={formData.city}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-[#ececec] rounded-lg text-sm text-[#17181a] appearance-none focus:outline-none focus:border-[#C9A227] bg-white"
                                >
                                    <option value="">Select City</option>
                                    <option value="Lagos">Lagos</option>
                                    <option value="London">London</option>
                                    <option value="New York">New York</option>
                                    <option value="Accra">Accra</option>
                                    <option value="Nairobi">Nairobi</option>
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
        </div>
    );
};

export default SettingsPage;
