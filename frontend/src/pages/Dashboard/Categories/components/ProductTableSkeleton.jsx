// src/pages/Dashboard/Categories/components/ProductTableSkeleton.jsx
import React from 'react';
import ProductTableHeader from './header/ProductTableHeader';

const SkeletonRow = () => (
    <div className="grid grid-cols-12 gap-4 items-center px-3 py-2">
        {/* Image & Name */}
        <div className="col-span-4 flex items-center gap-4 min-w-0">
            <div className="w-12 h-12 bg-gray-200 rounded-md flex-shrink-0 animate-pulse"></div>
            <div className="h-4 w-4/5 bg-gray-200 rounded animate-pulse"></div>
        </div>
        {/* Category */}
        <div className="col-span-2 h-4 bg-gray-200 rounded animate-pulse"></div>
        {/* Price */}
        <div className="col-span-2 h-4 bg-gray-200 rounded animate-pulse"></div>
        {/* Amount */}
        <div className="col-span-1 flex justify-center">
            <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse"></div>
        </div>
        {/* Views */}
        <div className="col-span-1 flex justify-center">
            <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse"></div>
        </div>
        {/* Actions */}
        <div className="col-span-2 flex items-center justify-end gap-2 pr-2">
            <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
        </div>
    </div>
);

const ProductTableSkeleton = () => {
    return (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
            <ProductTableHeader />
            <ul className="divide-y divide-gray-200">
                {Array.from({ length: 10 }).map((_, index) => (
                    <li key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                        <SkeletonRow />
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ProductTableSkeleton;