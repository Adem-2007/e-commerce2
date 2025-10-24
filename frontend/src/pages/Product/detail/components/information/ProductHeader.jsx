import React from 'react';
import { Layers, Eye } from 'lucide-react';
import { useLanguage } from '../../../../../context/LanguageContext';

const ProductHeader = ({ product }) => {
    const { t } = useLanguage();

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-600 px-3 py-1.5 rounded-full text-sm font-semibold">
                    <Layers size={14} /> <span>{product.category?.name || 'Uncategorized'}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500 font-medium text-sm">
                    <Eye size={16} />
                    <span>{product.views || 0} {t('views')}</span>
                </div>
            </div>
            <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-800 leading-tight truncate" title={product.name}>
                {product.name}
            </h1>
            <p className="mt-4 text-gray-600 leading-relaxed">{product.description}</p>
        </div>
    );
};

export default ProductHeader;