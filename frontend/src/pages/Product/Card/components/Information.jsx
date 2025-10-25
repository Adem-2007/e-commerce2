// src/pages/Product/Card/components/Information.jsx
import React from 'react';
import { Star } from 'lucide-react';

const ColorSwatches = ({ colors }) => {
    if (!colors || colors.length === 0) return null;
    const visibleColors = colors.slice(0, 3);
    const remainingCount = colors.length - visibleColors.length;

    return (
        <div className="flex items-center gap-2 rounded-lg bg-slate-200/60 px-2 py-1">
            <div className="flex items-center space-x-[-6px]">
                {visibleColors.map(hex => (
                    <span
                        key={hex}
                        title={hex}
                        style={{ backgroundColor: hex }}
                        className="h-5 w-5 rounded-full border-2 border-white/80 shadow-sm"
                    ></span>
                ))}
            </div>
            {remainingCount > 0 && (
                <span className="text-xs font-bold text-slate-600">+{remainingCount}</span>
            )}
        </div>
    );
};

const SizeTags = ({ sizes }) => {
    if (!sizes || sizes.length === 0) return null;
    const visibleSizes = sizes.slice(0, 2);
    const remainingCount = sizes.length - visibleSizes.length;

    return (
        <div className="flex items-center gap-2 rounded-lg bg-slate-200/60 px-2 py-1">
            <div className="flex items-center gap-1.5">
                {visibleSizes.map(size => (
                    <span key={size} className="text-xs font-bold text-slate-700">{size}</span>
                ))}
            </div>
            {remainingCount > 0 && (
                <span className="text-xs font-bold text-slate-600">+{remainingCount}</span>
            )}
        </div>
    );
};

// --- CORRECTED: StarRating now displays the numerical average rating ---
const StarRating = ({ rating = 0, reviewCount = 0 }) => {
    const totalStars = 5;
    const roundedRating = Math.round(rating);

    return (
        <div className="flex items-center gap-2 h-7">
            <div className="flex items-center" title={reviewCount > 0 ? `${rating.toFixed(1)} out of 5 stars` : 'No reviews yet'}>
                {[...Array(totalStars)].map((_, index) => (
                    <Star
                        key={index}
                        size={18}
                        className={reviewCount > 0 && index < roundedRating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}
                    />
                ))}
            </div>
            {/* --- ADDED: Display the numerical rating if reviews exist --- */}
            {reviewCount > 0 && (
                <>
                    <span className="text-sm font-bold text-slate-700">{rating.toFixed(1)}</span>
                    <span className="text-sm font-medium text-slate-500">({reviewCount})</span>
                </>
            )}
        </div>
    );
};


const ProductInformation = ({ product }) => {
    const {
        name = 'Untitled Product',
        price = 0,
        currency = 'DZD',
        colors = [],
        sizes = [],
        averageRating = 0,
        reviewCount = 0
    } = product || {};

    return (
        <div className="p-4 flex flex-col flex-grow text-start">
            <h3 
                className="font-bold text-slate-800 text-lg leading-tight truncate mb-1" 
                title={name}
            >
                {name}
            </h3>

            <StarRating rating={averageRating} reviewCount={reviewCount} />

            <div className="mt-2 flex flex-wrap items-center gap-2">
                <ColorSwatches colors={colors} />
                <SizeTags sizes={sizes} />
            </div>

            <div className="mt-auto pt-4 flex items-baseline">
                <span className="text-2xl font-extrabold text-slate-900">{price.toFixed(2)}</span>
                <span className="ml-1.5 text-sm font-semibold text-slate-500">{currency}</span>
            </div>
        </div>
    );
};

export default ProductInformation;