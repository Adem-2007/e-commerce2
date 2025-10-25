// src/pages/Product/Card/components/Information.jsx
import React from 'react';
// The Star icon is no longer needed here
// import { Star } from 'lucide-react';

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

// --- REMOVED: The StarRating component is no longer needed in this file. ---

const ProductInformation = ({ product }) => {
    // --- MODIFIED: Removed rating and reviewCount from destructuring ---
    const {
        name = 'Untitled Product',
        price = 0,
        currency = 'DZD',
        colors = [],
        sizes = []
    } = product || {};

    return (
        <div className="p-4 flex flex-col flex-grow text-start">
            {/* --- MODIFIED: Simplified the header, as it only contains the title now. --- */}
            <h3 
                className="font-bold text-slate-800 text-lg leading-tight truncate mb-2" 
                title={name}
            >
                {name}
            </h3>

            {/* Swatches and Tags */}
            <div className="mt-3 flex flex-wrap items-center gap-2">
                <ColorSwatches colors={colors} />
                <SizeTags sizes={sizes} />
            </div>

            {/* Price section remains the same */}
            <div className="mt-auto pt-4 flex items-baseline">
                <span className="text-2xl font-extrabold text-slate-900">{price.toFixed(2)}</span>
                <span className="ml-1.5 text-sm font-semibold text-slate-500">{currency}</span>
            </div>
        </div>
    );
};

export default ProductInformation;