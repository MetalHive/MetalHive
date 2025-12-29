import React, { useState } from 'react';
import { Modal } from './Modals';
import { X } from 'lucide-react';

// Accept Bid Modal
interface AcceptBidModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (price: number, notes?: string) => void;
    bid: {
        buyer: { companyName: string };
        listing: { name: string };
        offerPrice: string;
    };
    isLoading?: boolean;
}

export const AcceptBidModal: React.FC<AcceptBidModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    bid,
    isLoading = false,
}) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="p-8 text-center">
                {/* Icon */}
                <div className="flex justify-center mb-6">
                    <div className="w-32 h-32 relative">
                        <svg viewBox="0 0 100 100" className="w-full h-full">
                            <rect x="25" y="50" width="50" height="35" fill="#4A5568" rx="2" />
                            <rect x="30" y="45" width="40" height="30" fill="#E8F4FF" rx="2" />
                            <ellipse cx="50" cy="30" rx="15" ry="20" fill="#C9A227" />
                            <circle cx="50" cy="22" r="8" fill="#B8911F" />
                        </svg>
                    </div>
                </div>

                {/* Content */}
                <h2 className="text-2xl font-semibold text-[#17181a] mb-4">Accept This Bid?</h2>
                <p className="text-sm text-[#737780] mb-8">
                    You're about to accept an offer for this listing.
                </p>

                {/* Details */}
                <div className="space-y-3 mb-8 text-left">
                    <div className="flex justify-between">
                        <span className="text-[#737780]">Listing:</span>
                        <span className="font-semibold text-[#17181a]">{bid.listing.name}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-[#737780]">Buyer:</span>
                        <span className="font-semibold text-[#17181a]">{bid.buyer.companyName}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-[#737780]">Offer Price:</span>
                        <span className="font-bold text-[#17181a] text-xl">${parseFloat(bid.offerPrice).toFixed(0)}</span>
                    </div>
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
                        onClick={() => onConfirm(parseFloat(bid.offerPrice))}
                        disabled={isLoading}
                        className="flex-1 px-6 py-3 bg-[#C9A227] text-white font-medium text-sm rounded-lg hover:bg-[#b08f1f] transition-colors disabled:opacity-50"
                    >
                        {isLoading ? 'Accepting...' : 'Confirm'}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

// Counter Offer Modal
interface CounterOfferModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (price: number, message?: string) => void;
    bid: {
        offerPrice: string;
        offerPriceUnit: string;
    };
    isLoading?: boolean;
}

export const CounterOfferModal: React.FC<CounterOfferModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    bid,
    isLoading = false,
}) => {
    const [counterPrice, setCounterPrice] = useState(bid.offerPrice);
    const [message, setMessage] = useState('');

    const handleSubmit = () => {
        if (!counterPrice || parseFloat(counterPrice) <= 0) {
            alert('Please enter a valid price');
            return;
        }
        onSubmit(parseFloat(counterPrice), message || undefined);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold text-[#17181a]">Make a Counter Offer</h2>
                    <button onClick={onClose} className="text-[#737780] hover:text-[#17181a]">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <p className="text-sm text-[#737780] mb-6">
                    Adjust the price and send a response to the buyer.
                </p>

                {/* Counter Price Input */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-[#737780] mb-2">
                        Your Counter Price
                    </label>
                    <input
                        type="number"
                        value={counterPrice}
                        onChange={(e) => setCounterPrice(e.target.value)}
                        className="w-full px-4 py-3 border border-[#ececec] rounded-lg text-lg font-semibold text-[#17181a] focus:outline-none focus:border-[#C9A227]"
                        placeholder="$500"
                    />
                </div>

                {/* Message Input */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-[#737780] mb-2">
                        Message (optional)
                    </label>
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 border border-[#ececec] rounded-lg text-sm text-[#17181a] placeholder:text-[#999999] focus:outline-none focus:border-[#C9A227] resize-none"
                        placeholder="Explain your price or add helpful details like availability or pickup conditions"
                    />
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
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="flex-1 px-6 py-3 bg-[#C9A227] text-white font-medium text-sm rounded-lg hover:bg-[#b08f1f] transition-colors disabled:opacity-50"
                    >
                        {isLoading ? 'Sending...' : 'Send'}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

// Decline Bid Modal
interface DeclineBidModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (reason: string) => void;
    isLoading?: boolean;
}

export const DeclineBidModal: React.FC<DeclineBidModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    isLoading = false,
}) => {
    const [reason, setReason] = useState('');

    const handleSubmit = () => {
        onConfirm(reason || 'No reason provided');
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold text-[#17181a]">Decline Offer</h2>
                    <button onClick={onClose} className="text-[#737780] hover:text-[#17181a]">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <p className="text-sm text-[#737780] mb-6">
                    Are you sure you want to decline this offer?<br />
                    The buyer will be notified and this action can't be undone.
                </p>

                {/* Reason Input */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-[#737780] mb-2">
                        Reason for declining (optional)
                    </label>
                    <input
                        type="text"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        className="w-full px-4 py-3 border border-[#ececec] rounded-lg text-sm text-[#17181a] placeholder:text-[#999999] focus:outline-none focus:border-[#C9A227]"
                        placeholder="Price too low"
                    />
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
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="flex-1 px-6 py-3 bg-red-600 text-white font-medium text-sm rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                    >
                        {isLoading ? 'Declining...' : 'Decline'}
                    </button>
                </div>
            </div>
        </Modal>
    );
};
