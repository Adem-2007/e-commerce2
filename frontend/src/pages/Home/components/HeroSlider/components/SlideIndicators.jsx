// frontend/src/pages/Home/components/HeroSlider/components/SlideIndicators.jsx
import React from 'react';

const SlideIndicators = ({ slides, currentIndex, goToSlide }) => {
    if (slides.length <= 1) return null;
    
    return (
        <div className="absolute bottom-6 left-1/2 z-20 -translate-x-1/2 flex gap-2">
            {slides.map((_, index) => (
                <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
                        index === currentIndex ? 'w-6 bg-slate-800' : 'bg-slate-800/40 hover:bg-slate-800/70'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                />
            ))}
        </div>
    );
};

export default SlideIndicators;