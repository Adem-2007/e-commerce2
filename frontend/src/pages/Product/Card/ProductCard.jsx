// src/pages/Product/Card/ProductCard.jsx

import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { useProductCache } from '../../../context/ProductCacheContext'; // Import cache
import { Link } from 'react-router-dom';
import { Eye, Star } from 'lucide-react';

import ProductImage from './components/Image';
import ProductButtons from './components/Buttons';

// --- Recreated based on your image ---
const ProductInformation = ({ product, isRatingLoading }) => {
    const { t } = useLanguage();
    const averageRating = product.averageRating || 0;
    const reviewCount = product.reviewCount || 0;

    return (
        <div className="p-4 flex flex-col flex-grow">
            <h3 className="text-lg font-bold text-slate-800 truncate">{product.name}</h3>
            
            {/* --- RATING SECTION WITH LOADING STATE --- */}
            <div className="flex items-center gap-2 my-2 h-6"> {/* Fixed height to prevent layout shift */}
                {isRatingLoading ? (
                    <div className="flex items-center gap-2 animate-pulse">
                        <div className="h-4 w-24 bg-gray-200 rounded-md"></div>
                        <div className="h-4 w-12 bg-gray-200 rounded-md"></div>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                    key={i}
                                    size={18}
                                    className={`transition-all ${
                                        averageRating > i ? "text-yellow-400 fill-current" : "text-gray-300"
                                    }`}
                                />
                            ))}
                        </div>
                        <span className="text-sm text-gray-500 font-semibold">
                            ({reviewCount})
                        </span>
                    </>
                )}
            </div>

            <div className="mt-auto">
                <p className="text-xl font-extrabold text-slate-900">
                    {product.price.toFixed(2)}
                    <span className="ml-1.5 text-base font-medium text-slate-500">{product.currency}</span>
                </p>
            </div>
        </div>
    );
};

const ProductCardUI = ({ product, t, language, imageSize }) => {
    const cardLink = `/product/${product._id}`;
    const { lastUpdatedProductId, setLastUpdatedProductId } = useProductCache();
    const [isRatingLoading, setIsRatingLoading] = useState(false);

    // Effect to trigger and cleanup the loading animation
    useEffect(() => {
        // If this card is the one that was just updated
        if (lastUpdatedProductId === product._id) {
            setIsRatingLoading(true);

            // Start a timer to turn off the loading animation after a short period
            const timer = setTimeout(() => {
                setIsRatingLoading(false);
                // Reset the global state so the animation doesn't re-run on a page refresh
                setLastUpdatedProductId(null); 
            }, 1500); // Animation lasts 1.5 seconds

            // Cleanup function to clear the timer if the component unmounts
            return () => clearTimeout(timer);
        }
    }, [lastUpdatedProductId, product._id, setLastUpdatedProductId]);

    return (
        <div className="group bg-white w-full max-w-sm mx-auto rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 ease-in-out overflow-hidden flex flex-col" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            <Link to={cardLink} className="flex flex-col flex-grow">
                <ProductImage 
                    product={product} 
                    t={t} 
                    language={language} 
                    imageSize={imageSize}
                />
                <ProductInformation product={product} isRatingLoading={isRatingLoading} />
            </Link>

            <div className="px-4 pb-4">
                <Link to={cardLink} className="sm:hidden flex items-center justify-center w-full px-4 py-2.5 bg-slate-100 text-slate-800 font-bold rounded-lg hover:bg-slate-200 transition-colors">
                    <Eye size={18} className="mr-2" />
                    {t('view_details', 'View Details')}
                </Link>
                
                <div className="hidden sm:block">
                    {/* Assuming you have a Buttons component */}
                    <Link to={cardLink} className="flex items-center justify-center w-full px-4 py-2.5 bg-slate-100 text-slate-800 font-bold rounded-lg hover:bg-slate-200 transition-colors">
                       <Eye size={18} className="mr-2" />
                       {t('view_details', 'View Details')}
                    </Link>
                </div>
            </div>
        </div>
    );
};

const ProductCard = ({ product, ...props }) => {
    const { language, t } = useLanguage();
    if (!product) return null;
    return <ProductCardUI product={product} language={language} t={t} {...props} />;
};

export default ProductCard;