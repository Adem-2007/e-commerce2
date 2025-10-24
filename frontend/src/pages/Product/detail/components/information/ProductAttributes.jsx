import React from 'react';
import { User, Ruler, Leaf } from 'lucide-react';
import { useLanguage } from '../../../../../context/LanguageContext';

const ProductAttributes = ({ product }) => {
    const { t } = useLanguage();
    
    return (
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="space-y-4">
                {Array.isArray(product.gender) && product.gender.length > 0 && (
                    <div className="flex items-center gap-3 text-sm">
                        <User size={16} className="text-gray-500 shrink-0" />
                        <span className="font-semibold text-gray-600 whitespace-nowrap">{t('gender')}:</span>
                        <div className="flex flex-wrap items-center gap-2">
                            {product.gender.map(g => (
                                <span key={g} className="rounded-full bg-gray-200 px-2.5 py-1 text-xs font-medium capitalize text-gray-700">{g}</span>
                            ))}
                        </div>
                    </div>
                )}
                {product.height && (
                    <div className="flex items-center gap-3 text-sm"><Ruler size={16} className="text-gray-500 shrink-0" /><span className="font-semibold text-gray-600">{t('height')}:</span><span className="text-gray-800">{product.height} cm</span></div>
                )}
                {product.materials?.length > 0 && (
                    <div className="flex items-start gap-3 text-sm"><Leaf size={16} className="text-gray-500 shrink-0 mt-0.5" /><span className="font-semibold text-gray-600">{t('materials')}:</span><span className="text-gray-800 leading-relaxed">{product.materials.join(', ')}</span></div>
                )}
            </div>
        </div>
    );
};

export default ProductAttributes;