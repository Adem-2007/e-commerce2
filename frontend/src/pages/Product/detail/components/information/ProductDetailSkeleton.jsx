// src/pages/Product/ProductDetailPage/components/information/ProductDetailSkeleton.jsx

import React from 'react';
import { ChevronLeft } from 'lucide-react';

// Keyframes are defined as a string to be injected in a <style> tag.
const shimmerKeyframes = `
  @keyframes shimmer {
    100% { transform: translateX(100%); }
  }
`;

// A reusable SkeletonBox component with the shimmer animation
const SkeletonBox = ({ className }) => (
    <div className={`bg-gray-200 rounded-lg relative overflow-hidden ${className}`}>
        {/* The shimmer effect element */}
        <div 
            className="absolute inset-0" 
            style={{
                background: 'linear-gradient(90deg, transparent, #e5e7eb, transparent)',
                transform: 'translateX(-100%)',
                animation: 'shimmer 1.5s infinite'
            }}
        ></div>
    </div>
);

const ProductDetailSkeleton = () => {
    return (
        <>
            {/* Inject the keyframes into the document's head */}
            <style>{shimmerKeyframes}</style>
            
            <div className="bg-gray-50 pb-16 font-sans">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-10">
                    {/* Back to Collection Link Skeleton */}
                    <div className="inline-flex items-center gap-2 mb-6">
                        <ChevronLeft size={20} className="text-gray-300" />
                        <SkeletonBox className="w-32 h-6" />
                    </div>

                    {/* Main Content Grid Skeleton */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 lg:items-start gap-8 lg:gap-16 bg-white p-4 sm:p-8 rounded-2xl shadow-lg border border-gray-200">
                        
                        {/* --- Column 1: Image Gallery Skeleton --- */}
                        <div className="flex flex-col gap-4 lg:sticky lg:top-24">
                            {/* Main Image */}
                            <SkeletonBox className="w-full aspect-square rounded-xl" />
                            
                            {/* Thumbnails */}
                            <div className="flex gap-2">
                                {[...Array(4)].map((_, i) => (
                                    <SkeletonBox key={i} className="w-20 h-20 rounded-lg shrink-0" />
                                ))}
                            </div>
                        </div>

                        {/* --- Column 2: Product Information Skeleton --- */}
                        <div className="flex flex-col gap-6">
                            {/* Header */}
                            <div>
                                <SkeletonBox className="w-4/5 h-9 mb-3" />
                                <SkeletonBox className="w-1/2 h-7" />
                            </div>

                            {/* Description/Attributes */}
                            <div className="space-y-2">
                               <SkeletonBox className="w-full h-5" />
                               <SkeletonBox className="w-full h-5" />
                               <SkeletonBox className="w-3/4 h-5" />
                            </div>
                            
                            {/* Color Options */}
                            <div className="space-y-3">
                               <SkeletonBox className="w-16 h-5 mb-2" />
                               <div className="flex gap-3">
                                    {[...Array(4)].map((_, i) => (
                                        <SkeletonBox key={i} className="w-9 h-9 rounded-full" />
                                    ))}
                               </div>
                            </div>

                            {/* Size Options */}
                            <div className="space-y-3">
                               <SkeletonBox className="w-12 h-5 mb-2" />
                               <div className="flex gap-3">
                                    {[...Array(3)].map((_, i) => (
                                        <SkeletonBox key={i} className="w-16 h-10 rounded-lg" />
                                    ))}
                               </div>
                            </div>
                            
                            {/* Actions */}
                            <div className="border-t border-gray-200 pt-6 space-y-4">
                               <SkeletonBox className="w-40 h-12 self-start" />
                               <div className="flex flex-col sm:flex-row gap-4">
                                   <SkeletonBox className="h-14 w-full sm:w-36 rounded-lg" />
                                   <SkeletonBox className="h-14 flex-grow rounded-lg" />
                               </div>
                           </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProductDetailSkeleton;