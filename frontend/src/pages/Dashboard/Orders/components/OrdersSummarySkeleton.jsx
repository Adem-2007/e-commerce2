// src/pages/Dashboard/Orders/components/OrdersSummarySkeleton.jsx

import React from 'react';
import { ArrowLeft } from 'lucide-react'; // Assuming LTR for skeleton

const OrdersSummarySkeleton = () => {
    return (
        <div className="flex flex-col md:flex-row md:h-full animate-pulse">
            {/* Sidebar Skeleton */}
            <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-gray-200 flex-shrink-0 p-4 space-y-2">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="flex justify-between items-center py-2">
                        <div className="flex items-center gap-3 w-full">
                            <div className="w-5 h-5 bg-gray-200 rounded"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        </div>
                        <div className="h-5 bg-gray-200 rounded w-6"></div>
                    </div>
                ))}
                <div className="h-9 bg-gray-200 rounded-lg mt-4"></div>
            </div>

            {/* Main Content Skeleton */}
            <div className="flex-1 p-4 md:p-6">
                <div className="md:hidden mb-4 h-10 bg-gray-200 rounded-lg"></div>
                <div className="border border-gray-200 rounded-lg">
                    <div className="grid grid-cols-10 gap-4 px-4 py-3 bg-gray-50">
                        <div className="col-span-4 h-4 bg-gray-200 rounded"></div>
                        <div className="col-span-4 h-4 bg-gray-200 rounded"></div>
                        <div className="col-span-2 h-4 bg-gray-200 rounded"></div>
                    </div>
                    <div className="divide-y divide-gray-200">
                        {[...Array(10)].map((_, i) => (
                            <div key={i} className="grid grid-cols-10 gap-4 px-4 py-4 items-center">
                                <div className="col-span-4 h-5 bg-gray-200 rounded"></div>
                                <div className="col-span-4 h-5 bg-gray-200 rounded"></div>
                                <div className="col-span-2 h-5 bg-gray-200 rounded"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrdersSummarySkeleton;