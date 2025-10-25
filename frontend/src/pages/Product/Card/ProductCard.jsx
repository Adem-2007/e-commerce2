// src/pages/Product/Card/ProductCard.jsx

import React from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';

// Import the sub-components
import ProductImage from './components/Image'; // <-- CORRECTED: Use the dedicated Image component
import ProductInformation from './components/Information';
import ProductButtons from './components/Buttons';

// A dedicated StarRating component for the card overlay
const StarRating = ({ rating = 0, reviewCount = 0 }) => {
    const numericRating = Math.max(0, Math.min(5, Number(rating)));

    return (
        <div className="flex items-center gap-1.5 bg-black/50 text-white rounded-full px-3 py-1 text-xs font-bold">
            <Star size={14} className="text-amber-400 fill-amber-400" />
            <span>{numericRating.toFixed(1)}</span>
            <span className="text-gray-300 font-medium">({reviewCount})</span>
        </div>
    );
};


// The UI component
const ProductCardUI = ({ product, t, language, imageSize }) => {
    const cardLink = `/product/${product._id}`;

    return (
        <Link to={cardLink} className="group ring-1 ring-blue-100 bg-[#d5edf543] w-full max-w-sm mx-auto rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 ease-in-out overflow-hidden flex flex-col relative" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            
            {/* Conditionally render the StarRating overlay */}
            {product.reviewCount > 0 && (
                <div className={`absolute top-3 z-10 ${language === 'ar' ? 'right-3' : 'left-3'}`}>
                    <StarRating rating={product.averageRating} reviewCount={product.reviewCount} />
                </div>
            )}
            
            {/* --- CORRECTED LOGIC: Delegate image rendering to the ProductImage component --- */}
            <ProductImage 
                product={product} 
                t={t} 
                language={language} 
                imageSize={imageSize}
            />
            
            <ProductInformation product={product} />

            <div className="hidden sm:block">
                <ProductButtons t={t} />
            </div>

        </Link>
    );
};

// The main exported component
const ProductCard = ({ product, ...props }) => {
    const { language, t } = useLanguage();
    
    if (!product) return null;

    return <ProductCardUI product={product} language={language} t={t} {...props} />;
};

export default ProductCard;