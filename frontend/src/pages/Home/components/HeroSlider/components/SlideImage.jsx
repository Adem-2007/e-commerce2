// frontend/src/pages/Home/components/HeroSlider/components/SlideImage.jsx
import React from 'react';
import { motion } from 'framer-motion';

// This is no longer strictly necessary if all images are Base64,
// but it doesn't hurt to keep for potential fallback or future use.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const variants = {
    enter: (direction) => ({ x: direction > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { zIndex: 1, x: 0, opacity: 1 },
    exit: (direction) => ({ zIndex: 0, x: direction < 0 ? '100%' : '-100%', opacity: 0 }),
};

const SlideImage = ({ slide, direction, isPngLayout, isRtl, isFirstSlide }) => {
    /**
     * This function is the reason no changes are needed.
     * It checks if the `url` starts with 'http' (for external links) or 'data:' (for Base64 strings).
     * If it does, it uses the URL as-is.
     * This means the Base64 data coming from your updated backend will be rendered correctly.
     */
    const getFinalImageUrl = (url) => {
        if (!url) return '';
        return (url.startsWith('http') || url.startsWith('data:'))
            ? url
            : `${API_BASE_URL}${url}`;
    };
    
    const finalImageUrl = getFinalImageUrl(slide.imageUrl);

    // --- Preloading the first image for faster initial load ---
    const PreloadLink = isFirstSlide ? <link rel="preload" as="image" href={finalImageUrl} /> : null;

    const loadingAttr = isFirstSlide ? 'eager' : 'lazy';
    const fetchPriorityAttr = isFirstSlide ? 'high' : 'auto';

    return (
        <>
            {PreloadLink} 
            <motion.div
                key={slide._id}
                className="absolute h-full w-full"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ x: { type: 'spring', stiffness: 300, damping: 30 }, opacity: { duration: 0.3 } }}
            >
                {isPngLayout ? (
                    <div className={`absolute top-0 h-[60%] md:h-full w-full md:w-1/2 flex items-end md:items-center justify-center p-4 md:p-8 ${isRtl ? 'left-0' : 'right-0'}`}>
                        <img
                            src={finalImageUrl}
                            alt={slide.title?.en || 'Slide Image'}
                            className="max-h-[90%] md:max-h-full max-w-full object-contain drop-shadow-2xl"
                            width="800"
                            height="800"
                            loading={loadingAttr}
                            fetchPriority={fetchPriorityAttr}
                            decoding="async"
                        />
                    </div>
                ) : (
                    <>
                        {/* Ken Burns effect container for full-bleed images */}
                        <div className="absolute h-full w-full overflow-hidden">
                            <div
                                className="animate-kenburns absolute h-full w-full bg-cover bg-center [filter:contrast(1.05)]"
                                // The background-image property also works perfectly with Base64 data URIs
                                style={{ backgroundImage: `url(${finalImageUrl})` }}
                            />
                        </div>
                        {/* Gradient overlay for text readability */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    </>
                )}
            </motion.div>
        </>
    );
};

export default SlideImage;