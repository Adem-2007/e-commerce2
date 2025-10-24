import React from 'react';
import ProductCard from '../../../Card/ProductCard';
import { useLanguage } from '../../../../../context/LanguageContext';

const ProductCardSkeleton = () => (
    <div className="w-full sm:w-auto sm:basis-[calc(50%-1rem)] lg:basis-[calc(25%-1.5rem)] max-w-xs sm:max-w-none">
        <div className="bg-gray-200 rounded-lg relative overflow-hidden animate-pulse">
            <div className="aspect-[3/4] bg-gray-300"></div>
            <div className="p-4 space-y-2">
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-6 bg-gray-300 rounded w-1/2"></div>
            </div>
        </div>
    </div>
);

const RelatedProducts = ({ products, isLoading, onBuyNow }) => {
    const { t } = useLanguage();

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-16">
                <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-10 animate-pulse"></div>
                <div className="flex flex-wrap justify-center items-stretch gap-8">
                    {[...Array(4)].map((_, index) => <ProductCardSkeleton key={index} />)}
                </div>
            </div>
        );
    }
    if (!products || products.length === 0) return null;

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-16">
            <h2 className="text-3xl font-extrabold text-gray-800 text-center mb-10">
                {t('you_might_also_like')}
            </h2>
            <div className="flex flex-wrap justify-center items-stretch gap-8">
                {products.map(product => (
                    <div key={product._id} className="w-full sm:w-auto sm:basis-[calc(50%-1rem)] lg:basis-[calc(25%-1.5rem)] max-w-xs sm:max-w-none">
                        <ProductCard product={product} onBuyNow={onBuyNow} />
                    </div>
                ))}
            </div>
        </div>
    );
};
export default RelatedProducts;