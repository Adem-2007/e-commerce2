// src/pages/Home/components/RandomProducts/components/SkeletonLoader.jsx

import React from 'react';

const SkeletonCard = () => (
    <div className="w-full p-2">
        <div className="bg-gray-200 rounded-2xl shadow-md w-full h-96 animate-pulse">
            <div className="w-full h-2/3 bg-gray-300 rounded-t-2xl"></div>
            <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                <div className="h-8 bg-gray-300 rounded w-1/3 mt-4"></div>
            </div>
        </div>
    </div>
);

const SkeletonRow = () => (
    <div className="flex">
        {/* Show 2 cards for mobile view skeleton */}
        <div className="w-1/2 md:hidden">
            <SkeletonCard />
        </div>
        <div className="w-1/2 md:hidden">
            <SkeletonCard />
        </div>

        {/* Show 4 cards for larger screens */}
        <div className="hidden md:flex md:w-1/4">
            <SkeletonCard />
        </div>
        <div className="hidden md:flex md:w-1/4">
            <SkeletonCard />
        </div>
        <div className="hidden md:flex md:w-1/4">
            <SkeletonCard />
        </div>
        <div className="hidden md:flex md:w-1/4">
            <SkeletonCard />
        </div>
    </div>
);

const SkeletonLoader = () => (
    <section className="bg-gray-50 py-24 px-4">
        <div className="max-w-7xl mx-auto">
            {/* Title Skeleton */}
            <div className="text-center mb-14">
                <div className="h-10 bg-gray-200 rounded-lg w-1/2 mx-auto animate-pulse"></div>
                <div className="h-6 bg-gray-200 rounded-lg w-2/3 mx-auto mt-4 animate-pulse"></div>
            </div>

            {/* Two Rows of Skeleton Cards */}
            <div className="space-y-8">
                <SkeletonRow />
                <SkeletonRow />
            </div>
        </div>
    </section>
);

export default SkeletonLoader;