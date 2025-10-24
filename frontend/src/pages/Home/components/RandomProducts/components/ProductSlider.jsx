// src/pages/Home/components/RandomProducts/components/ProductSlider.jsx

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from '../../../../../pages/Product/Card/ProductCard';
import { useLanguage } from '../../../../../context/LanguageContext';

const ProductSlider = ({ products }) => {
    const { language, t } = useLanguage();
    const [currentSlide, setCurrentSlide] = useState(0);

    // --- State for Touch Controls ---
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);
    // Minimum swipe distance in pixels
    const minSwipeDistance = 50;

    // --- Responsive Cards Per Slide ---
    const [cardsPerSlide, setCardsPerSlide] = useState(window.innerWidth < 768 ? 2 : 4);

    useEffect(() => {
        const handleResize = () => {
            setCardsPerSlide(window.innerWidth < 768 ? 2 : 4);
        };

        window.addEventListener('resize', handleResize);
        // Cleanup listener on component unmount
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    
    const totalSlides = Math.ceil(products.length / cardsPerSlide);

    const next = () => {
        setCurrentSlide(prevSlide => (prevSlide + 1) % totalSlides);
    };

    const prev = () => {
        setCurrentSlide(prevSlide => (prevSlide - 1 + totalSlides) % totalSlides);
    };

    // --- Touch Event Handlers ---
    const onTouchStart = (e) => {
        setTouchEnd(null); // Reset touch end on new touch
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe) {
            next();
        } else if (isRightSwipe) {
            prev();
        }
        
        // Reset touch positions
        setTouchStart(null);
        setTouchEnd(null);
    };

    return (
        <div className="relative md:p-5 group">
            {/* Slider Container */}
            <div 
                className="overflow-hidden"
                // Add touch event listeners to the container
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
            >
                <div 
                    className="flex transition-transform duration-500 ease-in-out" 
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                    {products.map(product => (
                        <div key={product._id} className="flex-shrink-0 w-1/2 md:w-1/4 p-2">
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Navigation Arrows (Only show if there is more than one slide) */}
            {totalSlides > 1 && (
                <>
                    <button
                        onClick={prev}
                        className="absolute top-1/2 -left-4 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:block"
                        aria-label={t('aria_prev_product')}
                    >
                        {language === 'ar' ? <ChevronRight size={24} /> : <ChevronLeft size={24} />}
                    </button>
                    <button
                        onClick={next}
                        className="absolute top-1/2 -right-4 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:block"
                        aria-label={t('aria_next_product')}
                    >
                        {language === 'ar' ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
                    </button>
                </>
            )}
        </div>
    );
};

export default ProductSlider;