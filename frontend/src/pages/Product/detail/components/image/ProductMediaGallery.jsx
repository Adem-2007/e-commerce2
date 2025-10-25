// src/pages/Product/ProductDetailPage/components/image/ProductMediaGallery.jsx

import React, { useState, useMemo } from 'react';
import { Maximize } from 'lucide-react';
import ImageModal from './ImageModal';
import CachedImage from '../../../../../components/CachedImage/CachedImage';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const getFullImageUrl = (imageIdentifier) => {
    if (!imageIdentifier) return null;
    if (imageIdentifier.startsWith('data:')) return imageIdentifier;
    return `${API_BASE_URL}${imageIdentifier}`;
};

const ProductMediaGallery = ({ product }) => {
    const allMedia = useMemo(() => {
        const mainImage = product.imageUrls ? { type: 'image', url: getFullImageUrl(product.imageUrls.large), thumb: getFullImageUrl(product.imageUrls.thumbnail) } : null;
        const secondaryImages = (product.secondaryImageUrls || []).map(img => ({ type: 'image', url: getFullImageUrl(img.large), thumb: getFullImageUrl(img.thumbnail) }));
        return [mainImage, ...secondaryImages].filter(Boolean);
    }, [product]);

    const [selectedMedia, setSelectedMedia] = useState(allMedia[0]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    if (!product || allMedia.length === 0) {
        return <div>No images available.</div>;
    }

    const imageSourcesForModal = allMedia.map(media => media.url);

    return (
        // --- MODIFIED: Wrapped in a single div with flex-col to stack main image and thumbnails ---
        <div className="flex flex-col gap-4">
            {/* Main Image Display */}
            <div className="relative group aspect-square">
                <CachedImage
                    src={selectedMedia.url}
                    alt={product.name}
                    className="w-full h-full object-cover rounded-xl bg-gray-200"
                />
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="absolute top-4 right-4 bg-black/40 text-white p-2.5 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:scale-110"
                    aria-label="View larger image"
                >
                    <Maximize size={20} />
                </button>
            </div>

            {/* Thumbnail Row --- MODIFIED: Layout is now a horizontal row below the main image */}
            <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-2">
                {allMedia.map((media, index) => (
                    <button
                        key={index}
                        onClick={() => setSelectedMedia(media)}
                        // --- MODIFIED: Simplified classes for a consistent horizontal thumbnail layout ---
                        className={`w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-colors duration-200 ${selectedMedia.url === media.url ? 'border-blue-500' : 'border-transparent hover:border-gray-300'}`}
                    >
                        <CachedImage
                            src={media.thumb}
                            alt={`${product.name} thumbnail ${index + 1}`}
                            className="w-full h-full object-cover"
                        />
                    </button>
                ))}
            </div>

            <ImageModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                images={imageSourcesForModal}
                initialImage={selectedMedia.url}
                altText={product.name}
            />
        </div>
    );
};

export default ProductMediaGallery;