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

const StarRating = ({ rating = 0, reviewCount = 0 }) => {
    const numericRating = Math.max(0, Math.min(5, Number(rating)));

    // flex-shrink-0 prevents the rating from being squished on larger screens
    return (
        <div className="flex flex-shrink-0 items-center gap-2">
            <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, index) => (
                    <Star
                        key={index}
                        size={16}
                        className={index < numericRating ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}
                    />
                ))}
            </div>
            {reviewCount > 0 && (
                <span className="text-xs text-slate-500 font-medium">({reviewCount})</span>
            )}
        </div>
    );
};

const ProductInformation = ({ product }) => {
    const {
        name = 'Untitled Product',
        price = 0,
        currency = 'DZD',
        rating = 0,
        reviewCount = 0,
        colors = [],
        sizes = []
    } = product || {};

    return (
        <div className="p-4 flex flex-col flex-grow text-start">
            {/* --- RESPONSIVE HEADER --- */}
            {/* On mobile (default): flex-col to stack title and rating */}
            {/* On medium screens (md:): flex-row to place them side-by-side */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-start md:gap-4">
                <h3 
                    className="font-bold text-slate-800 text-lg leading-tight truncate mb-2 md:mb-0" 
                    title={name}
                >
                    {name}
                </h3>
                <StarRating rating={rating} reviewCount={reviewCount} />
            </div>

            {/* Swatches and Tags */}
            <div className="mt-3 flex flex-wrap items-center gap-2">
                <ColorSwatches colors={colors} />
                <SizeTags sizes={sizes} />
            </div>

            {/* --- RESPONSIVE PRICE --- */}
            {/* mt-auto pushes the price to the bottom of the card in all screen sizes */}
            <div className="mt-auto pt-4 flex items-baseline">
                <span className="text-2xl font-extrabold text-slate-900">{price.toFixed(2)}</span>
                <span className="ml-1.5 text-sm font-semibold text-slate-500">{currency}</span>
            </div>
        </div>
    );
};

export default ProductInformation;