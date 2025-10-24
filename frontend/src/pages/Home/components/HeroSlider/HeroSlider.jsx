// frontend/src/pages/Home/components/HeroSlider/HeroSlider.jsx

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';

import SlideImage from './components/SlideImage';
import SlideContent from './components/SlideContent';
import SlideIndicators from './components/SlideIndicators';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const AUTOPLAY_INTERVAL = 5000;

const getBackgroundStyle = (slide, isPngLayout) => {
    if (!isPngLayout) return { backgroundColor: '#1A1A1A' };
    const background = slide.background;
    if (!background) return { backgroundColor: '#F9FAFB' };
    if (background.type === 'gradient' && background.color1 && background.color2 && background.direction) {
        return { backgroundImage: `linear-gradient(${background.direction}, ${background.color1}, ${background.color2})` };
    }
    return { backgroundColor: background.color1 || '#F9FAFB' };
};

const useDirection = () => { const getInitialDirection = () => { const lang = localStorage.getItem('language') || 'en'; return lang === 'ar' ? 'rtl' : 'ltr'; }; const [dir, setDir] = useState(getInitialDirection()); useEffect(() => { const observer = new MutationObserver((mutations) => { for (const mutation of mutations) { if (mutation.attributeName === 'dir') { const newDir = mutation.target.dir || 'ltr'; if (newDir !== dir) setDir(newDir); } } }); observer.observe(document.documentElement, { attributes: true }); return () => observer.disconnect(); }, [dir]); return dir; };

// --- MODIFICATION: The KenBurnsStyle constant has been removed ---

const Arrow = ({ action, onClick, disabled }) => { const dir = useDirection(); const isRtl = dir === 'rtl'; const isNext = action === 'next'; const positionClass = isNext ? (isRtl ? 'left-4 md:left-6' : 'right-4 md:right-6') : (isRtl ? 'right-4 md:right-6' : 'left-4 md:left-6'); const Icon = isNext ? (isRtl ? ChevronLeft : ChevronRight) : (isRtl ? ChevronRight : ChevronLeft); return ( <button onClick={onClick} disabled={disabled} className={`absolute top-1/2 -translate-y-1/2 z-20 flex h-12 w-12 items-center justify-center rounded-full border-transparent bg-white/60 text-gray-800 backdrop-blur-md transition-all duration-300 hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-30 ${positionClass}`} aria-label={action === 'prev' ? 'Previous Slide' : 'Next Slide'}> <Icon size={28} /> </button> ); };
const SkeletonLoader = () => ( <section className="flex h-screen w-full items-center justify-center p-4 md:p-6 lg:p-6 max-lg:p-0"> <div className="relative h-[90vh] max-lg:h-full w-full max-w-screen-2xl overflow-hidden rounded-2xl max-lg:rounded-none bg-gray-200 animate-pulse"><div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10"><div className="h-2.5 w-6 rounded-full bg-gray-300/80"></div><div className="h-2.5 w-2.5 rounded-full bg-gray-300/50"></div><div className="h-2.5 w-2.5 rounded-full bg-gray-300/50"></div><div className="h-2.5 w-2.5 rounded-full bg-gray-300/50"></div></div><div className="absolute bottom-12 left-12 w-1/2 max-w-xl space-y-4 z-10 max-lg:bottom-8 max-lg:left-6 max-lg:w-3/4"><div className="h-4 w-1/4 rounded-lg bg-gray-300/80"></div><div className="h-12 w-3/4 rounded-lg bg-gray-300/90"></div><div className="h-5 w-full rounded-lg bg-gray-300/70"></div><div className="h-5 w-5/6 rounded-lg bg-gray-300/70"></div><div className="h-12 w-48 rounded-full bg-gray-300/90 mt-4"></div></div></div> </section> );

const HeroSlider = () => {
    const [[slideIndex, direction], setSlide] = useState([0, 0]);
    const [slides, setSlides] = useState([]);
    const [loading, setLoading] = useState(true);
    const dir = useDirection();
    const isRtl = dir === 'rtl';
    const autoplayRef = useRef(null);

    const paginate = useCallback((newDirection) => { setSlide(([prevIndex]) => { let newIndex = prevIndex + newDirection; if (newIndex < 0) newIndex = slides.length - 1; else if (newIndex >= slides.length) newIndex = 0; return [newIndex, newDirection]; }); }, [slides.length]);
    const goToSlide = (index) => { if (index === slideIndex) return; const newDirection = index > slideIndex ? 1 : -1; setSlide([index, newDirection]); };
    const resetAutoplay = useCallback(() => { if (autoplayRef.current) clearInterval(autoplayRef.current); if (slides.length > 1) { autoplayRef.current = setInterval(() => paginate(1), AUTOPLAY_INTERVAL); } }, [paginate, slides.length]);
    useEffect(() => { resetAutoplay(); return () => { if (autoplayRef.current) clearInterval(autoplayRef.current); }; }, [resetAutoplay]);
    const handleManualNavigation = (navFunction) => { if (autoplayRef.current) clearInterval(autoplayRef.current); navFunction(); };
    useEffect(() => { const fetchSlides = async () => { try { const res = await axios.get(`${API_BASE_URL}/api/hero`); if (res.data.length > 0) setSlides(res.data); } catch (error) { console.error("Failed to load hero data", error); } finally { setLoading(false); } }; fetchSlides(); }, []);

    if (loading) { return <SkeletonLoader />; }
    if (!slides.length) { return <div className="flex h-screen items-center justify-center bg-gray-50 text-gray-800"><p>No hero content available.</p></div>; }

    const currentSlide = slides[slideIndex];
    const isPngLayout = currentSlide.imageType === 'png';

    return (
        <>
            {/* --- MODIFICATION: The <style> tag has been removed --- */}
            <section className="flex h-[500px] md:h-screen w-full items-center justify-center p-4 md:p-6 lg:p-6 max-lg:p-0">
                <div
                    className="relative flex h-[90vh] w-full max-w-screen-2xl overflow-hidden rounded-2xl shadow-2xl shadow-black/20 transition-all duration-500 max-lg:h-full max-lg:rounded-none"
                    style={getBackgroundStyle(currentSlide, isPngLayout)}
                    onMouseEnter={() => autoplayRef.current && clearInterval(autoplayRef.current)}
                    onMouseLeave={resetAutoplay}
                >
                    <AnimatePresence initial={false} custom={direction}>
                        <SlideImage
                            slide={currentSlide}
                            direction={direction}
                            isPngLayout={isPngLayout}
                            isRtl={isRtl}
                            isFirstSlide={slideIndex === 0}
                        />
                    </AnimatePresence>
                    <SlideContent slide={currentSlide} isRtl={isRtl} isPngLayout={isPngLayout} />
                    <Arrow action="prev" onClick={() => handleManualNavigation(() => paginate(-1))} disabled={slides.length <= 1} />
                    <Arrow action="next" onClick={() => handleManualNavigation(() => paginate(1))} disabled={slides.length <= 1} />
                    <SlideIndicators slides={slides} currentIndex={slideIndex} goToSlide={(index) => handleManualNavigation(() => goToSlide(index))} />
                </div>
            </section>
        </>
    );
};

export default HeroSlider;