import React from 'react';

const SkeletonCard = ({ className }) => (
  <div className={`relative overflow-hidden rounded-3xl p-6 md:p-8 flex flex-col justify-between h-48 md:h-64 bg-gray-200 animate-pulse ${className}`}>
    <div className="relative z-10">
      <div className="h-4 bg-gray-300 rounded w-1/3 mb-2"></div>
      <div className="h-8 bg-gray-300 rounded w-2/3"></div>
    </div>
    <div className="relative z-10">
      <div className="h-10 bg-gray-300 rounded-full w-24"></div>
    </div>
  </div>
);

const CategoriesSectionSkeleton = () => {
  return (
    <div className="h-full flex items-center justify-center p-4 sm:p-6 lg:p-10 font-sans">
      <div className="w-full max-w-7xl">
        {/* ---------- ADDED SKELETON FOR TITLE AND DESCRIPTION ---------- */}
        <div className="mb-10 flex flex-col items-center">
          <div className="h-9 md:h-10 bg-gray-300 rounded w-1/3 animate-pulse mb-3"></div>
          <div className="h-6 bg-gray-300 rounded w-1/4 animate-pulse"></div>
        </div>
        {/* ------------------------------------------------------------ */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:h-[700px]">
          <SkeletonCard className="lg:col-span-2" />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard className="lg:col-span-2" />
        </div>
      </div>
    </div>
  );
};

export default CategoriesSectionSkeleton;