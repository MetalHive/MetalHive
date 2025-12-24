"use client"
import { useState } from 'react';
import { ChevronDown, Search } from 'lucide-react';

export default function SearchFilterBar() {
    const [materialType, setMaterialType] = useState('Copper Steel');
    const [location, setLocation] = useState('Birmingham');
    const [budget, setBudget] = useState('Low budget');
    const [quantity, setQuantity] = useState('500KG and above');

    return (
        <div className="flex items-center gap-4 p-6 bg-white">
            {/* Material Type */}
            <div className="flex flex-col">
                <label className="text-xs text-gray-500 mb-1">Material type</label>
                <select
                    value={materialType}
                    onChange={(e) => setMaterialType(e.target.value)}
                    className="text-sm font-medium text-gray-900 border-none bg-transparent outline-none cursor-pointer pr-6 appearance-none"
                    style={{ backgroundImage: 'none' }}
                >
                    <option>Copper Steel</option>
                    <option>Aluminum</option>
                    <option>Stainless Steel</option>
                </select>
            </div>

            {/* Divider */}
            <div className="h-12 w-px bg-gray-200"></div>

            {/* Location */}
            <div className="flex flex-col">
                <label className="text-xs text-gray-500 mb-1">Location</label>
                <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="text-sm font-medium text-gray-900 border-none bg-transparent outline-none cursor-pointer pr-6 appearance-none"
                    style={{ backgroundImage: 'none' }}
                >
                    <option>Birmingham</option>
                    <option>London</option>
                    <option>Manchester</option>
                </select>
            </div>

            {/* Divider */}
            <div className="h-12 w-px bg-gray-200"></div>

            {/* Budget */}
            <div className="flex flex-col">
                <label className="text-xs text-gray-500 mb-1">Budget</label>
                <select className="flex items-center gap-2 text-sm font-medium text-gray-900 outline-none" value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}>
                    <option>Below $5,000</option>
                    <option>Above $50,00</option>
                    <option>$10,000 +</option>
                </select>
                   
            </div>

            {/* Divider */}
            <div className="h-12 w-px bg-gray-200"></div>

            {/* Quantity */}
            <div className="flex flex-col">
                <label className="text-xs text-gray-500 mb-1">Quantity</label>
                <div className="relative w-64">
                    <select
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                        className="w-34 appearance-none rounded-xl border-gray-300 bg-white py-2.5  text-sm font-medium  text-gray-900 outline-none  transition  "
                    >
                        <option>Below 500kg</option>
                        <option>Above 500kg</option>
                        <option>1000kg +</option>
                    </select>
                </div>

            </div>

            {/* Search Button */}
            <button className="ml-auto flex items-center gap-2 bg-[#C9A227] hover:bg-yellow-600 text-white px-6 py-3 rounded-full font-medium text-sm transition-colors">
                Search
                <Search size={18} />
            </button>
        </div>
    );
}