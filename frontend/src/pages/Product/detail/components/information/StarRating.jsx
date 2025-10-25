import React, { useState, useEffect } from 'react'; // Import useEffect
import { Star } from 'lucide-react';
import { useLanguage } from '../../../../../context/LanguageContext';

const StarRating = ({ rating: initialRating = 0, reviewCount = 0, isInteractive = false, onSubmitRating, isSubmitted = false }) => {
    const { t } = useLanguage();
    const [rating, setRating] = useState(initialRating);
    const [hoverRating, setHoverRating] = useState(0);

    // --- NEW: Sync local state with props from the backend ---
    // This ensures that after a rating is submitted and the parent's product state
    // updates, the stars visually reflect the new average rating.
    useEffect(() => {
        setRating(initialRating);
    }, [initialRating]);

    const canInteract = isInteractive && !isSubmitted;

    const handleRatingClick = (rate) => {
        if (!canInteract) return;
        setRating(rate); // Provide immediate visual feedback on click
        if (onSubmitRating) {
            onSubmitRating(rate);
        }
    };

    const handleMouseEnter = (rate) => {
        if (!canInteract) return;
        setHoverRating(rate);
    };

    const handleMouseLeave = () => {
        if (!canInteract) return;
        setHoverRating(0);
    };

    const stars = Array.from({ length: 5 }, (_, i) => {
        const ratingValue = i + 1;
        const currentRating = hoverRating || rating;

        return (
            <Star
                key={i}
                size={20}
                className={`transition-all duration-200 ${canInteract ? 'cursor-pointer' : 'cursor-default'} ${
                    currentRating >= ratingValue ? "text-yellow-400 fill-current" : "text-gray-300"
                }`}
                onClick={() => handleRatingClick(ratingValue)}
                onMouseEnter={() => handleMouseEnter(ratingValue)}
                onMouseLeave={handleMouseLeave}
            />
        );
    });

    return (
        <div className="flex items-center gap-2" title={`${initialRating.toFixed(1)} out of 5 stars`}>
            <div className="flex items-center">{stars}</div>
            <span className="font-bold text-gray-800">
                {initialRating.toFixed(1)}
            </span>
            <span className="text-sm text-gray-500">
                ({reviewCount} {t('reviews')})
            </span>
        </div>
    );
};

export default StarRating;