// src/pages/Dashboard/Orders/components/OrderCardSkeleton.jsx

import React from 'react';
import { ChevronDown } from 'lucide-react';

const OrderCardSkeleton = () => {
    return (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden animate-pulse">
            <div className="p-4 md:p-5 flex justify-between items-center">
                <div className="flex-1 min-w-0 pr-4">
                    <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                    <div className="h-6 bg-gray-300 rounded w-40 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                </div>
                <div className="flex items-center gap-4">
                     <div className="text-right">
                        <div className="h-7 bg-gray-300 rounded w-24 mb-2"></div>
                        <div className="h-5 bg-gray-200 rounded w-16 ml-auto"></div>
                    </div>
                    <ChevronDown className="text-gray-300" size={24} />
                </div>
            </div>
        </div>
    );
};

export default OrderCardSkeleton;