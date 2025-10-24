// src/pages/Product/Card/ProductCardSkeleton.jsx
import React from 'react';

const ProductCardSkeleton = () => {
    return (
        <div className="group ring-1 ring-blue-100 bg-white w-full max-w-sm mx-auto rounded-2xl shadow-md overflow-hidden flex flex-col">
            <div className="p-3">
                {/* Image Placeholder */}
                <div className="w-full h-48 xs:h-56 sm:h-64 md:h-72 bg-gray-200 rounded-xl animate-pulse"></div>
            </div>

            <div className="px-5 pb-5 flex flex-col flex-grow">
                <div className="h-6 w-4/5 bg-gray-200 rounded animate-pulse"></div>

                {/* Reduced margin-top */}
                <div className="mt-2 h-8 w-1/3 bg-gray-200 rounded-lg animate-pulse"></div>

                {/* Tags Placeholder */}
                <div className="mt-2 flex flex-wrap items-center gap-2">
                    <div className="h-8 w-1/4 bg-gray-200 rounded-lg animate-pulse"></div>
                    <div className="h-8 w-1/3 bg-gray-200 rounded-lg animate-pulse"></div>
                </div>

                <div className="flex-grow"></div>

                {/* --- UPDATED --- Rating and Price Placeholder Section */}
                {/* Reduced margin and changed to a vertical stack */}
                <div className="mt-3 pt-1 flex flex-col items-start gap-2">
                    <div className="h-5 w-1/2 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-7 w-1/4 bg-gray-200 rounded animate-pulse"></div>
                </div>
            </div>

            {/* Buttons Placeholder */}
            <div className="px-5 pb-5">
                <div className="pt-2">
                    <div className="grid grid-cols-3 gap-3">
                        <div className="col-span-1 h-12 bg-gray-200 rounded-lg animate-pulse"></div>
                        <div className="col-span-2 h-12 bg-gray-300 rounded-lg animate-pulse"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCardSkeleton;