import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../../../../../context/LanguageContext';

const ImageModal = ({ isOpen, onClose, images = [], initialImage, altText }) => {
  const { language, t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Set the starting image index when the modal opens
  useEffect(() => {
    if (isOpen && initialImage) {
      const startIndex = images.indexOf(initialImage);
      setCurrentIndex(startIndex >= 0 ? startIndex : 0);
    }
  }, [isOpen, initialImage, images]);

  const goToNext = useCallback(() => {
    if (images.length <= 1) return;
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  }, [images.length]);

  const goToPrevious = useCallback(() => {
    if (images.length <= 1) return;
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  }, [images.length]);

  // Handle keyboard navigation and body scroll
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }
      
      const isLtr = language !== 'ar';
      if (event.key === 'ArrowRight') {
        isLtr ? goToNext() : goToPrevious();
      }
      if (event.key === 'ArrowLeft') {
        isLtr ? goToPrevious() : goToNext();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose, goToNext, goToPrevious, language]);

  return (
    <AnimatePresence>
      {isOpen && images.length > 0 && (
        <div 
          className="fixed inset-0  z-[5000] flex items-center justify-center p-2 sm:p-4"
          // Using onMouseDown to prevent mis-clicks when dragging
          onMouseDown={onClose} 
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Close Button */}
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 400, damping: 25 }}
            className="fixed top-4 right-4 z-[5002] flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-all duration-300 hover:scale-110 hover:bg-white/20 hover:rotate-90"
            onClick={onClose}
            aria-label={t('close_esc')}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <X size={26} />
          </motion.button>
          
          {/* Main Content: Image and Controls */}
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="relative z-[5001] w-full max-w-5xl max-h-[90vh] flex items-center justify-center"
            onMouseDown={(e) => e.stopPropagation()} // Prevent closing when clicking on the image/controls
          >
            {/* Image Display with Animation */}
            <AnimatePresence mode="wait">
              <motion.img
                key={currentIndex}
                src={images[currentIndex]}
                alt={`${altText} ${currentIndex + 1}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: 'easeInOut' }}
                className="block bg-white max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl pointer-events-none"
              />
            </AnimatePresence>
            
            {images.length > 1 && (
              <>
                {/* Navigation Controls Container */}
                <div className="absolute bottom-4 right-4 z-10 flex gap-2 md:inset-0 md:items-center md:justify-between md:px-4">
                    {/* Previous Button */}
                    <button 
                      onClick={language === 'ar' ? goToNext : goToPrevious} 
                      title={t('previous_arrow')}
                      className="flex h-12 w-12 items-center justify-center rounded-full bg-black/30 text-white transition-all duration-300 hover:scale-105 hover:bg-black/50 backdrop-blur-sm"
                    >
                      {language === 'ar' ? <ChevronRight size={28} /> : <ChevronLeft size={28} />}
                    </button>
                    
                    {/* Next Button */}
                    <button 
                      onClick={language === 'ar' ? goToPrevious : goToNext} 
                      title={t('next_arrow')}
                      className="flex h-12 w-12 items-center justify-center rounded-full bg-black/30 text-white transition-all duration-300 hover:scale-105 hover:bg-black/50 backdrop-blur-sm"
                    >
                      {language === 'ar' ? <ChevronLeft size={28} /> : <ChevronRight size={28} />}
                    </button>
                </div>
                
                {/* Image Counter (Visible on larger screens) */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 hidden rounded-full bg-black/40 px-3 py-1 text-sm font-medium text-white backdrop-blur-sm md:block">
                  {currentIndex + 1} / {images.length}
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ImageModal;