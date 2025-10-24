// src/pages/Home/components/NewProducts/NewProducts.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../../../context/LanguageContext';

import ProductCard from '../../../Product/Card/ProductCard';
import ProductCardSkeleton from '../../../Product/Card/ProductCardSkeleton';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const NewProducts = () => {
    const { language, t } = useLanguage();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const [currentIndex, setCurrentIndex] = useState(0);
    const [slidesPerView, setSlidesPerView] = useState(3);

    useEffect(() => {
        const fetchNewProducts = async () => {
            try {
                // --- FIX: Use the correct 'newArrival' parameter for indexed querying ---
                const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/api/products?newArrival=true&limit=12`;
                const response = await fetch(apiUrl);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                
                // --- FIX: Access the 'products' array from the new paginated response object ---
                setProducts(data.products || []); // Use data.products and fallback to empty array

            } catch (err) {
                setError(err.message);
                console.error("Failed to fetch new products:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchNewProducts();
    }, []);

    useEffect(() => {
        const calculateSlidesPerView = () => {
            if (window.innerWidth < 768) return 1;
            if (window.innerWidth < 1024) return 2;
            return 3;
        };

        const handleResize = () => {
            setSlidesPerView(calculateSlidesPerView());
            setCurrentIndex(0);
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);
    
    const handleBuyNow = (product) => {
        navigate('/buy', {
            state: { product: product, checkoutMode: 'direct' }
        });
    };
    
    const handleFavorite = (product) => {
        console.log("Favorite clicked for:", product.name);
    };

    const maxIndex = products.length > slidesPerView ? products.length - slidesPerView : 0;

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev > 0 ? prev - 1 : 0));
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev < maxIndex ? prev + 1 : maxIndex));
    };
    
    if (isLoading) {
        return (
            <section className="bg-white py-24 sm:py-28">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <h2 className="text-center text-4xl font-bold tracking-tight text-gray-500 sm:text-5xl">
                        {t('newest_products_title')}
                    </h2>
                    <p className="mt-4 text-center text-lg leading-8 text-gray-600">
                        {t('newest_products_subtitle')}
                    </p>
                </div>
                 <div className="mx-auto mt-16 grid max-w-7xl grid-cols-1 gap-8 px-6 sm:grid-cols-2 lg:grid-cols-3 lg:px-8">
                    {[...Array(3)].map((_, i) => (
                       <ProductCardSkeleton key={i} />
                    ))}
                </div>
            </section>
        );
    }
    
    // --- FIX: Separate error state from empty product state for clearer UI ---
    if (error) {
         return (
            <section className="bg-white py-20 sm:py-24">
                <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
                    <h2 className="text-4xl font-bold tracking-tight text-red-500 sm:text-5xl">
                        {t('error_generic_title')}
                    </h2>
                    <p className="mt-4 text-lg leading-8 text-red-600">
                        {t('error_load_products')}
                    </p>
                </div>
            </section>
        );
    }
    
    if (products.length === 0) {
        return (
            <section className="bg-white py-20 sm:py-24">
                <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
                    <h2 className="text-4xl font-bold tracking-tight text-amber-500 sm:text-5xl">
                        Stay Tuned
                    </h2>
                    <p className="mt-4 text-lg leading-8 text-amber-600">
                        Our new collection is being crafted. Check back soon for the latest drops!
                    </p>
                </div>
            </section>
        );
    }
    
    return (
        <section className=" py-24 sm:py-28">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <h2 className="text-center text-4xl font-bold tracking-tight text-gray-500 sm:text-5xl">
                    {t('newest_products_title')}
                </h2>
                <p className="mt-4 text-center text-lg leading-8 text-gray-600">
                    {t('newest_products_subtitle')}
                </p>
            </div>
            
            <div className="relative mx-auto max-w-7xl mt-16 px-6 md:px-12 lg:px-16">
                <div className="overflow-hidden">
                    <div
                        className="flex transition-transform duration-500 ease-in-out"
                        style={{
                            transform: language === 'ar' 
                                ? `translateX(${currentIndex * (100 / slidesPerView)}%)`
                                : `translateX(-${currentIndex * (100 / slidesPerView)}%)`,
                        }}
                        dir={language === 'ar' ? 'rtl' : 'ltr'}
                    >
                        {products.map((product) => (
                            <div
                                key={product._id}
                                className="px-2 sm:px-3 md:px-4 py-4 sm:py-6 md:py-8"
                                style={{ 
                                    flex: `0 0 ${100 / slidesPerView}%`,
                                    minWidth: 0
                                }}
                            >
                                <ProductCard 
                                    product={product} 
                                    variant="public"
                                    onBuyNow={() => handleBuyNow(product)}
                                    onFavorite={() => handleFavorite(product)}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="hidden md:block">
                    <button
                        onClick={handlePrev}
                        disabled={currentIndex === 0}
                        aria-label="Previous Product"
                        className={`absolute top-1/2 z-10 -translate-y-1/2 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-gray-400 text-white transition-colors hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed ${language === 'ar' ? 'right-0' : 'left-0'}`}
                    >
                        {language === 'ar' ? <ArrowRight size={24} /> : <ArrowLeft size={24} />}
                    </button>
                    <button
                        onClick={handleNext}
                        disabled={currentIndex >= maxIndex}
                        aria-label="Next Product"
                        className={`absolute top-1/2 z-10 -translate-y-1/2 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-gray-400 text-white transition-colors hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed ${language === 'ar' ? 'left-0' : 'right-0'}`}
                    >
                        {language === 'ar' ? <ArrowLeft size={24} /> : <ArrowRight size={24} />}
                    </button>
                </div>
            </div>

            <div className="mt-8 flex items-center justify-center gap-4 md:hidden">
                <button
                    onClick={handlePrev}
                    disabled={currentIndex === 0}
                    aria-label="Previous Product"
                    className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-gray-400 text-white transition-colors hover:bg-gray-500 disabled:opacity-50"
                >
                    {language === 'ar' ? <ArrowRight size={24} /> : <ArrowLeft size={24} />}
                </button>
                <button
                    onClick={handleNext}
                    disabled={currentIndex >= maxIndex}
                    aria-label="Next Product"
                    className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-gray-400 text-white transition-colors hover:bg-gray-500 disabled:opacity-50"
                >
                    {language === 'ar' ? <ArrowLeft size={24} /> : <ArrowRight size={24} />}
                </button>
            </div>
        </section>
    );
};

export default NewProducts;