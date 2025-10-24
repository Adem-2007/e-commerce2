// src/pages/Dashboard/overview/components/DashboardSkeleton.jsx

import React from 'react';

const SkeletonCard = () => (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-gray-200 animate-pulse flex-shrink-0"></div>
        <div className="flex-grow">
            <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse mb-2"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse"></div>
        </div>
    </div>
);

const SkeletonChart = () => (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm h-96">
        <div className="h-6 bg-gray-200 rounded w-1/4 mb-4 animate-pulse"></div>
        <div className="h-full bg-gray-200 rounded animate-pulse"></div>
    </div>
);


const DashboardSkeleton = () => {
    return (
        <div className="space-y-12">
            <div>
                <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mt-2 animate-pulse"></div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                {Array.from({ length: 10 }).map((_, index) => (
                    <SkeletonCard key={index} />
                ))}
            </div>

            <div className="grid grid-cols-1 gap-8">
                <SkeletonChart />
                <SkeletonChart />
            </div>
        </div>
    );
};

export default DashboardSkeleton;