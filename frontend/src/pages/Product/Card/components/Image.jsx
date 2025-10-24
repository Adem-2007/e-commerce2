// src/pages/Product/Card/components/Image.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * --- MODIFIED FUNCTION ---
 * This function now correctly handles both Base64 Data URIs and traditional URL paths.
 * - If the 'imageIdentifier' starts with 'data:', it's recognized as a self-contained
 *   Base64 image and is returned directly. The <img> tag can render this immediately.
 * - If it's not a Data URI, it's treated as a relative path, and the API base URL
 *   is prepended to create a full, fetchable URL.
 */
const getFullImageUrl = (imageIdentifier) => {
    if (!imageIdentifier) return null;

    // Check if the identifier is a Base64 Data URI.
    if (imageIdentifier.startsWith('data:')) {
        return imageIdentifier;
    }

    // Otherwise, assume it's a file path and build the full URL.
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
    return `${API_BASE_URL}${imageIdentifier}`;
};

const ProductImage = ({ product, t, language, imageSize }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);
    const minSwipeDistance = 50;

    const sliderImages = useMemo(() => {
        if (!product?.imageUrls) return [];
        const mainImage = product.imageUrls.medium;
        const secondaryImages = (product.secondaryImageUrls || []).map(img => img.medium);
        return [mainImage, ...secondaryImages].filter(Boolean);
    }, [product]);

    useEffect(() => {
        if (sliderImages.length > 0 && currentIndex >= sliderImages.length) {
            setCurrentIndex(0);
        }
    }, [sliderImages, currentIndex]);

    const imageContainerStyle = useMemo(() => {
        if (!imageSize || !imageSize.width || imageSize.height === null) {
            return { width: '100%', paddingTop: '100%' };
        }
        return {
            width: `${imageSize.width}px`,
            height: `${imageSize.height}px`,
            maxWidth: '100%',
        };
    }, [imageSize]);

    const prevSlide = (e) => { e.stopPropagation(); e.preventDefault(); const isFirstSlide = currentIndex === 0; const newIndex = isFirstSlide ? sliderImages.length - 1 : currentIndex - 1; setCurrentIndex(newIndex); };
    const nextSlide = (e) => { e.stopPropagation(); e.preventDefault(); const isLastSlide = currentIndex === sliderImages.length - 1; const newIndex = isLastSlide ? 0 : currentIndex + 1; setCurrentIndex(newIndex); };
    const goToSlide = (e, slideIndex) => { e.stopPropagation(); e.preventDefault(); setCurrentIndex(slideIndex); };
    
    const handleTouchStart = (e) => { setTouchEnd(null); setTouchStart(e.targetTouches[0].clientX); };
    const handleTouchMove = (e) => { setTouchEnd(e.targetTouches[0].clientX); };
    const handleTouchEnd = (e) => { if (!touchStart || !touchEnd) return; const distance = touchStart - touchEnd; const isLeftSwipe = distance > minSwipeDistance; const isRightSwipe = distance < -minSwipeDistance; if (isLeftSwipe || isRightSwipe) { e.stopPropagation(); e.preventDefault(); if (isLeftSwipe) { nextSlide(new Event('swipe')); } else { prevSlide(new Event('swipe')); } } setTouchStart(null); setTouchEnd(null); };

    return (
        <div className="p-2 sm:p-3">
            <div
                className="relative w-full rounded-xl overflow-hidden group/slider cursor-pointer"
                style={imageContainerStyle}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                {sliderImages.length > 0 ? sliderImages.map((imagePath, index) => (
                    <div key={index} className="absolute inset-0">
                        <img
                            src={getFullImageUrl(imagePath)}
                            alt={`${product.name} - view ${index + 1}`}
                            style={{ objectPosition: `${(product.focusPoint?.x || 0.5) * 100}% ${(product.focusPoint?.y || 0.5) * 100}%` }}
                            className={`absolute h-full bg-slate-200 w-full object-cover transition-opacity duration-500 ease-in-out ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
                            draggable="false"
                            loading="lazy"
                        />
                    </div>
                )) : (
                    <div className="absolute inset-0 bg-slate-200 flex items-center justify-center">
                        <span className="text-slate-500">{t('no_image', 'No Image')}</span>
                    </div>
                )}

                {sliderImages.length > 1 && (
                    <>
                        <button onClick={prevSlide} className="absolute top-1/2 -translate-y-1/2 left-2 z-10 p-2 bg-white/50 rounded-full text-slate-800 backdrop-blur-sm opacity-0 group-hover/slider:opacity-100 transition-opacity duration-300 md:flex hidden hover:bg-white/80"> <ChevronLeft size={20} /> </button>
                        <button onClick={nextSlide} className="absolute top-1/2 -translate-y-1/2 right-2 z-10 p-2 bg-white/50 rounded-full text-slate-800 backdrop-blur-sm opacity-0 group-hover/slider:opacity-100 transition-opacity duration-300 md:flex hidden hover:bg-white/80"> <ChevronRight size={20} /> </button>
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex space-x-2">
                            {sliderImages.map((_, slideIndex) => (
                                <button key={slideIndex} onClick={(e) => goToSlide(e, slideIndex)} className={`h-2 w-2 rounded-full transition-colors duration-300 ${slideIndex === currentIndex ? 'bg-white' : 'bg-white/50'}`} aria-label={`Go to slide ${slideIndex + 1}`} />
                            ))}
                        </div>
                    </>
                )}

                {product.newArrival && (
                    <div className={`absolute top-3 z-10 flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 px-3 py-1.5 text-xs font-bold text-yellow-900 shadow-lg ${language === 'ar' ? 'right-3' : 'left-3'}`}>
                        <Sparkles size={12} />
                        <span>{t('new_arrival')}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductImage;