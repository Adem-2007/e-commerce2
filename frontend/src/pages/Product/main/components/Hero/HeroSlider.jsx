// src/pages/product/main/components/Hero/HeroSlider.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import './HeroSlider.css';

// --- REMOVED: API_BASE_URL is no longer needed here if the URL is a full Data URI ---
const AUTOPLAY_DELAY = 7000;

const HeroSlider = ({ categories, isLoading, error }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [contentKey, setContentKey] = useState(0); 

    const activeCategory = categories?.[activeIndex];

    const handleSlideChange = useCallback((newIndex) => {
        setActiveIndex(newIndex);
        setContentKey(prevKey => prevKey + 1); 
    }, []);

    const goToNext = useCallback(() => {
        if (!categories || categories.length === 0) return;
        const newIndex = (activeIndex + 1) % categories.length;
        handleSlideChange(newIndex);
    }, [activeIndex, categories, handleSlideChange]);

    const goToPrev = () => {
        if (!categories || categories.length === 0) return;
        const newIndex = (activeIndex - 1 + categories.length) % categories.length;
        handleSlideChange(newIndex);
    };

    useEffect(() => {
        let timeoutId;
        if (!isPaused && categories && categories.length > 0) {
            timeoutId = setTimeout(goToNext, AUTOPLAY_DELAY);
        }
        return () => clearTimeout(timeoutId);
    }, [activeIndex, isPaused, categories, goToNext]);

    if (isLoading || error || !categories || categories.length === 0) {
        return <div className="hero-wrapper"><div className="hero-slider-container hero-slider-placeholder"></div></div>;
    }

    return (
        <div className="hero-wrapper">
            <div className="hero-slider-container" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
                <div className="slides-wrapper">
                    {categories.map((category, index) => (
                        <div className={`hero-slide ${index === activeIndex ? 'slide-active' : ''}`} key={category._id}>
                            {/* --- FIX: Use the image URL directly without the base URL --- */}
                            <div className="slide-background" style={{ backgroundImage: `url(${category.imageUrl})` }} />
                            <div className="slide-overlay" />
                        </div>
                    ))}
                </div>
                <div className="slide-content" key={contentKey}>
                    <div className="content-wrapper">
                        <p className="slide-category">{activeCategory?.name}</p>
                    </div>
                </div>
                <div className="autoplay-progress-line">
                    <div key={activeIndex} className="progress-bar" style={{ animationDuration: `${AUTOPLAY_DELAY}ms`, animationPlayState: isPaused ? 'paused' : 'running' }}></div>
                </div>
                <button onClick={goToPrev} className="nav-arrow prev-arrow" aria-label="Previous slide"><ChevronLeft size={24} /></button>
                <button onClick={goToNext} className="nav-arrow next-arrow" aria-label="Next slide"><ChevronRight size={24} /></button>
            </div>
        </div>
    );
};

export default HeroSlider;