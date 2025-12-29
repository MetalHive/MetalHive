"use client"

import React, { useState } from 'react';
import SettingsSidebar from "../../../Components/SettingsSidebar";
import { SettingsCard, SettingsSection, PasswordInput, TextInput, SettingsButton } from "../../../Components/SettingsComponents";
import { useUserProfile, useChangeEmail, useChangePassword } from '../../../hooks/useSettings';

const SecurityPage = () => {
    const { data: profile } = useUserProfile();
    const changeEmail = useChangeEmail();
    const changePassword = useChangePassword();

    const [email, setEmail] = useState('');
    const [currentPasswordForEmail, setCurrentPasswordForEmail] = useState('');

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const handleChangeEmail = async () => {
        if (!email || !currentPasswordForEmail) {
            alert('Please enter new email and current password');
            return;
        }

        try {
            await changeEmail.mutateAsync({
                newEmail: email,
                currentPassword: currentPasswordForEmail,
            });
            alert('Email changed successfully! Please verify your new email.');
            setEmail('');
            setCurrentPasswordForEmail('');
        } catch (error: any) {
            console.error('Failed to change email:', error);
            if (error.response?.data?.errors?.code === 'INVALID_PASSWORD') {
                alert('Current password is incorrect');
            } else {
                alert('Failed to change email. Please try again.');
            }
        }
    };

    const handleChangePassword = async () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        if (passwordData.newPassword.length < 8) {
            alert('Password must be at least 8 characters long!');
            return;
        }

        try {
            await changePassword.mutateAsync({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword,
            });
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            });
            alert('Password changed successfully!');
        } catch (error: any) {
            console.error('Failed to change password:', error);
            if (error.response?.data?.errors?.code === 'INVALID_PASSWORD') {
                alert('Current password is incorrect');
            } else {
                alert('Failed to change password. Please try again.');
            }
        }
    };

    return (
        <div className="flex min-h-screen bg-[#fafafa]">
            <SettingsSidebar />

            <main className="flex-1 p-10 mt-16 lg:mt-0 mx-30">
                <div className="max-w-[612px]">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-2xl font-semibold text-[#17181a] mb-2">
                            Login & Security
                        </h1>
                        <p className="text-sm text-[#737780]">
                            Keep your account secure
                        </p>
                    </div>

                    {/* Login Email Section */}
                    <SettingsCard className="mb-6">
                        <div className="space-y-4">
                            <TextInput
                                label="Current Email"
                                value={profile?.email || ''}
                                onChange={() => { }}
                                placeholder="your.email@example.com"
                                disabled
                            />
                            <TextInput
                                label="New Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="new.email@example.com"
                            />
                            <PasswordInput
                                label="Current Password"
                                value={currentPasswordForEmail}
                                onChange={(e) => setCurrentPasswordForEmail(e.target.value)}
                                placeholder="Enter current password"
                            />
                            <SettingsButton
                                variant="secondary"
                                onClick={handleChangeEmail}
                                isLoading={changeEmail.isPending}
                            >
                                Change email
                            </SettingsButton>
                        </div>
                    </SettingsCard>

                    {/* Change Password Section */}
                    <SettingsSection title="Change Password">
                        <SettingsCard>
                            <div className="space-y-6">
                                <PasswordInput
                                    label="Current Password"
                                    value={passwordData.currentPassword}
                                    onChange={(e) =>
                                        setPasswordData({ ...passwordData, currentPassword: e.target.value })
                                    }
                                    placeholder="Enter current password"
                                />

                                <PasswordInput
                                    label="New Password"
                                    value={passwordData.newPassword}
                                    onChange={(e) =>
                                        setPasswordData({ ...passwordData, newPassword: e.target.value })
                                    }
                                    placeholder="Enter new password"
                                />

                                <PasswordInput
                                    label="Confirm New Password"
                                    value={passwordData.confirmPassword}
                                    onChange={(e) =>
                                        setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                                    }
                                    placeholder="Confirm new password"
                                />

                                <SettingsButton
                                    onClick={handleChangePassword}
                                    isLoading={changePassword.isPending}
                                >
                                    Change password
                                </SettingsButton>
                            </div>
                        </SettingsCard>
                    </SettingsSection>
                </div>
            </main >
        </div >
    );
};

export default SecurityPage;
