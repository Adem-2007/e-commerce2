import React from 'react';

// Keyframes are defined as a string to be injected in a <style> tag.
const shimmerKeyframes = `
  @keyframes shimmer {
    100% { transform: translateX(100%); }
  }
`;

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
            <style>{shimmerKeyframes}</style>
            <div className="bg-gray-50 pb-16 font-sans">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-10">
                    <div className="grid grid-cols-1 lg:grid-cols-[100px_1fr] xl:grid-cols-[100px_1fr_1.1fr] gap-8 bg-white p-4 sm:p-8 rounded-2xl shadow-lg border border-gray-200">
                        
                        {/* Thumbnail Skeleton */}
                        <div className="order-2 lg:order-1 flex flex-row lg:flex-col gap-4">
                            {[...Array(4)].map((_, i) => (
                               <SkeletonBox key={i} className="aspect-square w-20 h-20 lg:w-full lg:h-auto rounded-lg shrink-0" />
                            ))}
                        </div>

                        {/* Main Image Skeleton */}
                        <div className="order-1 lg:order-2">
                            <SkeletonBox className="aspect-square w-full rounded-xl" />
                        </div>

                        {/* Info Panel Skeleton */}
                        <div className="order-3 lg:col-span-2 xl:col-span-1 p-2 sm:p-4 flex flex-col gap-6">
                            <SkeletonBox className="w-32 h-8 rounded-full" />
                            <div className="space-y-3">
                               <SkeletonBox className="w-4/5 h-9" />
                               <SkeletonBox className="w-3/5 h-9" />
                            </div>
                             <div className="space-y-2">
                               <SkeletonBox className="w-full h-5" />
                               <SkeletonBox className="w-full h-5" />
                               <SkeletonBox className="w-3/4 h-5" />
                            </div>
                            
                            <SkeletonBox className="w-40 h-10" />
                            
                            <div className="border-t border-gray-200 pt-6 space-y-3">
                               <SkeletonBox className="w-24 h-5 mb-2" />
                               <div className="flex gap-3">
                                    {[...Array(4)].map((_, i) => (
                                        <SkeletonBox key={i} className="w-9 h-9 rounded-full" />
                                    ))}
                               </div>
                            </div>

                            <div className="border-t border-gray-200 pt-6 space-y-3">
                               <SkeletonBox className="w-20 h-5 mb-2" />
                               <div className="flex gap-3">
                                    {[...Array(3)].map((_, i) => (
                                        <SkeletonBox key={i} className="w-16 h-10 rounded-lg" />
                                    ))}
                               </div>
                            </div>
                            
                            <div className="flex flex-col sm:flex-row gap-4 mt-2">
                                <SkeletonBox className="h-14 w-full sm:w-36 rounded-lg" />
                                <SkeletonBox className="h-14 grow rounded-lg" />
                                <SkeletonBox className="h-14 grow rounded-lg" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProductDetailSkeleton;