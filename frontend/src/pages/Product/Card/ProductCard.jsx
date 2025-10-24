// src/pages/Product/Card/ProductCard.jsx
import React from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { Link } from 'react-router-dom';

// Import the sub-components
import ProductImage from './components/Image';
import ProductInformation from './components/Information';
import ProductButtons from './components/Buttons';

// --- THE SIMPLIFIED UI COMPONENT ---
const ProductCardUI = ({ product, t, language, imageSize }) => {
    const cardLink = `/product/${product._id}`;

    // This Link component is the single source of navigation for the card.
    return (
        <Link to={cardLink} className="group ring-1 ring-blue-100 bg-[#d5edf543] w-full max-w-sm mx-auto rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 ease-in-out overflow-hidden flex flex-col relative" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            
            <ProductImage 
                product={product} 
                t={t} 
                language={language} 
                imageSize={imageSize}
            />
            
            <ProductInformation product={product} />

            {/* This div correctly hides the buttons on small screens */}
            <div className="hidden sm:block">
                <ProductButtons
                    t={t}
                />
            </div>

        </Link>
    );
};

// --- THE MAIN EXPORTED COMPONENT ---
const ProductCard = ({ product, ...props }) => {
    const { language, t } = useLanguage();
    
    if (!product) return null;

    return <ProductCardUI product={product} language={language} t={t} {...props} />;
};

export default ProductCard;