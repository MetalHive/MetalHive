"use client"
import { useState } from 'react';
import { Search } from 'lucide-react';

interface SearchFilterBarProps {
    onSearch?: (value: string) => void;
    onMaterialTypeChange?: (value: string) => void;
    onLocationChange?: (value: string) => void;
}

export default function SearchFilterBar({
    onSearch,
    onMaterialTypeChange,
    onLocationChange
}: SearchFilterBarProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [materialType, setMaterialType] = useState('');
    const [location, setLocation] = useState('');
    const [budget, setBudget] = useState('');
    const [quantity, setQuantity] = useState('');

    const handleSearch = () => {
        onSearch?.(searchQuery);
        onMaterialTypeChange?.(materialType);
        onLocationChange?.(location);
    };

    const handleMaterialChange = (value: string) => {
        setMaterialType(value);
        onMaterialTypeChange?.(value);
    };

    const handleLocationChange = (value: string) => {
        setLocation(value);
        onLocationChange?.(value);
    };

    return (
        <div className="flex items-center gap-4 p-6 bg-white">
            {/* Material Type */}
            <div className="flex flex-col">
                <label className="text-xs text-gray-500 mb-1">Material type</label>
                <select
                    value={materialType}
                    onChange={(e) => handleMaterialChange(e.target.value)}
                    className="text-sm font-medium text-gray-900 border-none bg-transparent outline-none cursor-pointer pr-6 appearance-none"
                    style={{ backgroundImage: 'none' }}
                >
                    <option value="">All Types</option>
                    <option value="Copper">Copper</option>
                    <option value="Aluminium">Aluminium</option>
                    <option value="Steel">Steel</option>
                </select>
            </div>

            {/* Divider */}
            <div className="h-12 w-px bg-gray-200"></div>

            {/* Location */}
            <div className="flex flex-col">
                <label className="text-xs text-gray-500 mb-1">Location</label>
                <select
                    value={location}
                    onChange={(e) => handleLocationChange(e.target.value)}
                    className="text-sm font-medium text-gray-900 border-none bg-transparent outline-none cursor-pointer pr-6 appearance-none"
                    style={{ backgroundImage: 'none' }}
                >
                    <option value="">All Locations</option>
                    <option value="Birmingham">Birmingham</option>
                    <option value="London">London</option>
                    <option value="Manchester">Manchester</option>
                    <option value="Liverpool">Liverpool</option>
                    <option value="Sheffield">Sheffield</option>
                </select>
            </div>

            {/* Divider */}
            <div className="h-12 w-px bg-gray-200"></div>

            {/* Budget */}
            <div className="flex flex-col">
                <label className="text-xs text-gray-500 mb-1">Budget</label>
                <select
                    className="flex items-center gap-2 text-sm font-medium text-gray-900 outline-none"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                >
                    <option value="">Any Budget</option>
                    <option value="low">Below $5,000</option>
                    <option value="medium">$5,000 - $50,000</option>
                    <option value="high">$50,000+</option>
                </select>
            </div>

            {/* Divider */}
            <div className="h-12 w-px bg-gray-200"></div>

            {/* Quantity */}
            <div className="flex flex-col">
                <label className="text-xs text-gray-500 mb-1">Quantity</label>
                <div className="relative w-64">
                    <select
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        className="w-34 appearance-none rounded-xl border-gray-300 bg-white py-2.5 text-sm font-medium text-gray-900 outline-none transition"
                    >
                        <option value="">Any Quantity</option>
                        <option value="below500">Below 500kg</option>
                        <option value="above500">Above 500kg</option>
                        <option value="above1000">1000kg+</option>
                    </select>
                </div>
            </div>

            {/* Search Input */}
            <div className="flex-1 ml-4">
                <input
                    type="text"
                    placeholder="Search listings..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A227]"
                />
            </div>

            {/* Search Button */}
            <button
                onClick={handleSearch}
                className="flex items-center gap-2 bg-[#C9A227] hover:bg-yellow-600 text-white px-6 py-3 rounded-full font-medium text-sm transition-colors"
            >
                Search
                <Search size={18} />
            </button>
        </div>
    );
}
