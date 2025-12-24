"use client"
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Clock } from 'lucide-react';

interface ProductCardProps {
    id: string; // <-- added id
    title: string;
    price: string;
    location: string;
    timeAgo: string;
    description: string;
    images: string[];
}

const ProductCard: React.FC<ProductCardProps> = ({
    id,
    title,
    price,
    location,
    timeAgo,
    description,
    images
}) => {
    const router = useRouter();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const goToSlide = (index: number) => {
        setCurrentImageIndex(index);
    };

    const handleCardClick = () => {
        router.push(`/buyersDashboard/Marketplace/${id}`);
    };

    return (
        <div
            onClick={handleCardClick}
            className="w-full rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
        >
            {/* Image Carousel */}
            <div className="relative h-48 bg-gray-200">
                <img
                    src={images[currentImageIndex]}
                    alt={`${title} - Image ${currentImageIndex + 1}`}
                    className="w-full h-full object-cover"
                />

                {/* Carousel Dots */}
                <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1.5">
                    {images.map((_, index) => (
                        <button
                            key={index}
                            onClick={(e) => {
                                e.stopPropagation(); // prevent navigating when clicking dot
                                goToSlide(index);
                            }}
                            className={`w-1.5 h-1.5 rounded-full transition-all ${index === currentImageIndex
                                    ? 'bg-white w-4'
                                    : 'bg-white/60 hover:bg-white/80'
                                }`}
                            aria-label={`Go to image ${index + 1}`}
                        />
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="p-2">
                {/* Title and Price */}
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-md font-semibold text-gray-900">{title}</h3>
                    <span className="text-md font-bold text-gray-900 whitespace-nowrap ml-2">
                        {price}
                    </span>
                </div>

                {/* Location and Time */}
                <div className="text-sm text-[#666666] mb-3">
                    <div className="flex items-center gap-1 mb-2">
                        <MapPin className="w-4 h-4" />
                        <span>{location}</span>
                    </div>
                    <div className="flex items-center gap-1 mb-2">
                        <Clock className="w-4 h-4" />
                        <span>{timeAgo}</span>
                    </div>
                </div>

                {/* Description */}
                <p className="text-sm">{description}</p>
            </div>
        </div>
    );
};

export default ProductCard;
