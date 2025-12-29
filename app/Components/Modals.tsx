import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/50"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative bg-white rounded-2xl shadow-xl max-w-lg w-full mx-4">
                {children}
            </div>
        </div>
    );
};

interface ConfirmDeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isLoading?: boolean;
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    isLoading = false,
}) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-[#17181a]">Delete Account</h2>
                    <button
                        onClick={onClose}
                        className="text-[#737780] hover:text-[#17181a] transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="mb-8">
                    <p className="text-sm text-[#737780] leading-relaxed">
                        Are you sure you want to delete your account? This action will permanently remove all your
                        listings, bids, and payout history. This cannot be undone.
                    </p>
                </div>

                {/* Buttons */}
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-6 py-3 border border-[#ececec] text-[#17181a] font-medium text-sm rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="flex-1 px-6 py-3 bg-red-600 text-white font-medium text-sm rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Deleting...' : 'Delete Account'}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

interface SuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message: string;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({
    isOpen,
    onClose,
    title,
    message,
}) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="p-8 text-center">
                {/* Success Icon */}
                <div className="flex justify-center mb-6">
                    <div className="w-36 h-36 rounded-full bg-green-100 flex items-center justify-center">
                        <svg className="w-20 h-20 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                </div>

                {/* Content */}
                <div className="mb-8">
                    <h2 className="text-xl font-semibold text-[#17181a] mb-3">{title}</h2>
                    <p className="text-sm text-[#737780] leading-relaxed">{message}</p>
                </div>

                {/* Done Button */}
                <button
                    onClick={onClose}
                    className="w-full px-6 py-3 bg-[#C9A227] text-white font-medium text-sm rounded-lg hover:bg-[#b08f1f] transition-colors"
                >
                    Done
                </button>
            </div>
        </Modal>
    );
};
