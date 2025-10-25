// src/pages/product/detail/components/information/ProductHeader.jsx

import React from 'react';
import { Layers, Eye } from 'lucide-react';
import { useLanguage } from '../../../../../context/LanguageContext';
import StarRating from './StarRating';

// Accept onSubmitRating and hasRated as props
const ProductHeader = ({ product, onSubmitRating, hasRated }) => {
    const { t } = useLanguage();

    return (
        <div>
            {/* ... (no changes to this part) ... */}
            <div className="flex justify-between items-center mb-2">
                 <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-600 px-3 py-1.5 rounded-full text-sm font-semibold">
                    <Layers size={14} /> <span>{product.category?.name || 'Uncategorized'}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500 font-medium text-sm">
                    <Eye size={16} />
                    <span>{product.views || 0} {t('views')}</span>
                </div>
            </div>

            <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-800 leading-tight" title={product.name}>
                {product.name}
            </h1>
            
            <div className="mt-3">
                <StarRating
                    // Use the product's averageRating from the backend
                    rating={product.averageRating} 
                    reviewCount={product.reviewCount}
                    isInteractive={true}
                    // Pass the submission handler and status down
                    onSubmitRating={onSubmitRating}
                    isSubmitted={hasRated}
                />
            </div>
            
            <p className="mt-4 text-gray-600 leading-relaxed">{product.description}</p>
        </div>
    );
};

export default ProductHeader;