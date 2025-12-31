"use client"

import React, { useState } from 'react';
import { SettingsCard, TextInput, SettingsButton, SettingsSection } from '../../../../Components/SettingsComponents';
import { Upload, FileText, Briefcase } from 'lucide-react';

const VerificationPage = () => {
    const [formData, setFormData] = useState({
        businessName: '',
        registrationNumber: '',
        taxId: '',
        address: '',
    });

    const [files, setFiles] = useState<{
        license: File | null;
        idProof: File | null;
    }>({
        license: null,
        idProof: null,
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'license' | 'idProof') => {
        if (e.target.files && e.target.files[0]) {
            setFiles(prev => ({
                ...prev,
                [type]: e.target.files![0]
            }));
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        console.log('Verification data:', { ...formData, ...files });
        alert('Verification request submitted successfully! We will review your documents shortly.');
        setIsSubmitting(false);
    };

    return (
        <main className="p-10 mt-16 lg:mt-0 mx-auto max-w-4xl">
            <div className="max-w-[612px]">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-semibold text-[#17181a] mb-2">
                        Business Verification
                    </h1>
                    <p className="text-sm text-[#737780]">
                        Verify your business to unlock higher transaction limits and premium features.
                    </p>
                </div>

                <div className="space-y-8">
                    {/* Business Details Section */}
                    <SettingsSection title="Business Details" description="Provide your official business information.">
                        <SettingsCard>
                            <div className="space-y-4">
                                <TextInput
                                    label="Registered Business Name"
                                    name="businessName"
                                    value={formData.businessName}
                                    onChange={handleInputChange}
                                    placeholder="e.g. Acme Corp Ltd."
                                />
                                <TextInput
                                    label="Registration Number"
                                    name="registrationNumber"
                                    value={formData.registrationNumber}
                                    onChange={handleInputChange}
                                    placeholder="Business Registration No."
                                />
                                <TextInput
                                    label="Tax ID / VAT Number"
                                    name="taxId"
                                    value={formData.taxId}
                                    onChange={handleInputChange}
                                    placeholder="Tax ID"
                                />
                                <TextInput
                                    label="Business Address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    placeholder="123 Business St, City, Country"
                                />
                            </div>
                        </SettingsCard>
                    </SettingsSection>

                    {/* Document Upload Section */}
                    <SettingsSection title="Documents" description="Upload official documents for verification.">
                        <SettingsCard>
                            <div className="space-y-6">
                                {/* Business License Upload */}
                                <div>
                                    <label className="block text-sm font-medium text-[#17181a] mb-2">
                                        Business License / Incorporation Certificate
                                    </label>
                                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-[#ececec] border-dashed rounded-lg hover:bg-gray-50 transition-colors relative">
                                        <div className="space-y-1 text-center">
                                            {files.license ? (
                                                <div className="flex flex-col items-center">
                                                    <FileText className="mx-auto h-12 w-12 text-[#C9A227]" />
                                                    <p className="text-sm text-[#17181a] font-medium mt-2">{files.license.name}</p>
                                                    <p className="text-xs text-gray-500">{(files.license.size / 1024).toFixed(2)} KB</p>
                                                </div>
                                            ) : (
                                                <>
                                                    <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
                                                    <div className="flex text-sm text-gray-600 justify-center">
                                                        <span className="relative cursor-pointer bg-white rounded-md font-medium text-[#C9A227] hover:text-[#b08f1f]">
                                                            Upload a file
                                                        </span>
                                                        <p className="pl-1">or drag and drop</p>
                                                    </div>
                                                    <p className="text-xs text-gray-500">
                                                        PDF, PNG, JPG up to 10MB
                                                    </p>
                                                </>
                                            )}
                                            <input
                                                type="file"
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                accept=".pdf,.png,.jpg,.jpeg"
                                                onChange={(e) => handleFileChange(e, 'license')}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* ID Proof Upload */}
                                <div>
                                    <label className="block text-sm font-medium text-[#17181a] mb-2">
                                        Director / Admin ID Proof
                                    </label>
                                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-[#ececec] border-dashed rounded-lg hover:bg-gray-50 transition-colors relative">
                                        <div className="space-y-1 text-center">
                                            {files.idProof ? (
                                                <div className="flex flex-col items-center">
                                                    <FileText className="mx-auto h-12 w-12 text-[#C9A227]" />
                                                    <p className="text-sm text-[#17181a] font-medium mt-2">{files.idProof.name}</p>
                                                    <p className="text-xs text-gray-500">{(files.idProof.size / 1024).toFixed(2)} KB</p>
                                                </div>
                                            ) : (
                                                <>
                                                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                                    <div className="flex text-sm text-gray-600 justify-center">
                                                        <span className="relative cursor-pointer bg-white rounded-md font-medium text-[#C9A227] hover:text-[#b08f1f]">
                                                            Upload a file
                                                        </span>
                                                        <p className="pl-1">or drag and drop</p>
                                                    </div>
                                                    <p className="text-xs text-gray-500">
                                                        PDF, PNG, JPG up to 10MB
                                                    </p>
                                                </>
                                            )}
                                            <input
                                                type="file"
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                accept=".pdf,.png,.jpg,.jpeg"
                                                onChange={(e) => handleFileChange(e, 'idProof')}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <SettingsButton
                                    onClick={handleSubmit}
                                    isLoading={isSubmitting}
                                    disabled={!formData.businessName || !files.license}
                                    className="w-full"
                                >
                                    Submit for Verification
                                </SettingsButton>
                            </div>
                        </SettingsCard>
                    </SettingsSection>
                </div>
            </div>
        </main>
    );
};

export default VerificationPage;
