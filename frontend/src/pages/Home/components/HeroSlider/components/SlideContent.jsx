// frontend/src/pages/Home/components/HeroSlider/components/SlideContent.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../../../../context/LanguageContext';

const SlideContent = ({ slide, isRtl, isPngLayout }) => {
    const { t, language } = useLanguage();

    const category = slide.category?.[language] || slide.category?.en || 'Inspiration';
    const title = slide.title?.[language] || slide.title?.en || 'Discover Our New Collection';
    const description = slide.description?.[language] || slide.description?.en || 'Explore the latest trends and find your perfect style.';

    const textColor = isPngLayout ? 'text-gray-900' : 'text-white';
    const categoryColor = isPngLayout ? 'text-indigo-600' : 'text-indigo-300';
    const descriptionColor = isPngLayout ? 'text-gray-600' : 'text-gray-200';
    const buttonClasses = isPngLayout
        ? 'border-black/20 bg-black/5 text-gray-800 backdrop-blur-none hover:text-white'
        : 'border-white/20 bg-white/10 text-white backdrop-blur-md hover:text-white';
    
    // --- MODIFICATION: On mobile, the content container is positioned at the bottom, taking up 40% of the height. ---
    const containerPosition = isPngLayout
        ? `absolute bottom-0 md:top-0 h-[45%] md:h-full w-full md:w-1/2 flex flex-col justify-center md:justify-end ${isRtl ? 'right-0' : 'left-0'}`
        : `relative mt-auto w-full md:w-3/4 lg:w-1/2`;

    return (
        <div className={`z-10 p-6 md:p-12 ${containerPosition} ${isRtl ? 'text-right' : 'text-left'}`}>
            <motion.div
                key={slide._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
                <p className={`font-semibold uppercase tracking-widest ${categoryColor}`}>{category}</p>
                <h1 className={`mt-2 text-4xl font-bold tracking-tighter md:text-7xl ${textColor} ${!isPngLayout && 'drop-shadow-[0_4px_15px_rgba(0,0,0,0.5)]'}`}>{title}</h1>
                <p className={`mt-3 max-w-prose text-sm md:text-base ${descriptionColor}`}>{description}</p>
                <Link
                    to="/shop"
                    className={`group relative mt-6 inline-flex items-center gap-3 overflow-hidden rounded-full px-6 py-3 text-sm font-bold uppercase tracking-wider transition-colors duration-300 ease-in-out md:px-8 md:py-4 md:text-base ${buttonClasses}`}
                >
                    <span className="absolute inset-0 -z-10 h-full w-0 bg-indigo-500 transition-all duration-300 ease-out group-hover:w-full"></span>
                    {t('explore')}
                    <span className="grid place-items-center transition-transform duration-300 ease-in-out group-hover:rotate-45">
                        {isRtl ? <ArrowLeft /> : <ArrowRight />}
                    </span>
                </Link>
            </motion.div>
        </div>
    );
};

export default SlideContent;
