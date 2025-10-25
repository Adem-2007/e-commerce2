// src/pages/Product/Card/ProductCardSkeleton.jsx
import React from 'react';

const ProductCardSkeleton = () => {
    return (
        <div className="group ring-1 ring-blue-100 bg-white w-full max-w-sm mx-auto rounded-2xl shadow-md overflow-hidden flex flex-col">
            <div className="p-3">
                {/* Image Placeholder */}
                <div className="w-full h-48 xs:h-56 sm:h-64 bg-gray-200 rounded-xl animate-pulse"></div>
            </div>

            <div className="px-5 pb-5 flex flex-col flex-grow">
                {/* Title Placeholder */}
                <div className="h-6 w-4/5 bg-gray-200 rounded animate-pulse mb-1"></div>

                {/* --- CORRECTED: Skeleton now mimics the stars + rating number layout --- */}
                <div className="flex items-center gap-2 h-7">
                    <div className="h-5 w-24 bg-gray-200 rounded animate-pulse"></div> {/* Stars placeholder */}
                    <div className="h-5 w-16 bg-gray-200 rounded animate-pulse"></div> {/* Number and count placeholder */}
                </div>
                
                {/* Tags Placeholder */}
                <div className="mt-2 flex flex-wrap items-center gap-2">
                    <div className="h-8 w-1/4 bg-gray-200 rounded-lg animate-pulse"></div>
                    <div className="h-8 w-1/3 bg-gray-200 rounded-lg animate-pulse"></div>
                </div>

                <div className="flex-grow"></div>

                {/* Price Placeholder */}
                <div className="mt-4 pt-4 h-8 w-1/3 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>

            <div className="px-4 pb-4">
                {/* Mobile Skeleton Button */}
                <div className="sm:hidden h-11 bg-gray-200 rounded-lg animate-pulse"></div>
                
                {/* Desktop Skeleton Buttons */}
                <div className="hidden sm:grid grid-cols-3 gap-3">
                    <div className="col-span-1 h-12 bg-gray-200 rounded-lg animate-pulse"></div>
                    <div className="col-span-2 h-12 bg-gray-300 rounded-lg animate-pulse"></div>
                </div>
            </div>
        </div>
    );
};

export default ProductCardSkeleton;