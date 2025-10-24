// src/pages/Product/BuyPage/components/Form/ProductFeatures.jsx

import React from 'react';
import { Palette, Ruler } from 'lucide-react';
import { useLanguage } from '../../../../../context/LanguageContext';

const ProductFeatures = ({ product, selectedColor, setSelectedColor, selectedSize, setSelectedSize, formErrors }) => {
    const { t } = useLanguage();

    return (
        <div className="p-4 border border-slate-200 rounded-lg bg-white mt-2 grid grid-cols-2 gap-x-6 gap-y-4">
            {product?.colors?.length > 0 && (
                <div 
                    data-error-key="selectedColor"
                    className={`p-2 rounded-md transition-all duration-200 ${formErrors.selectedColor ? 'ring-2 ring-red-500' : ''}`}
                >
                    <label className="flex items-center gap-1.5 text-sm font-semibold text-slate-600 mb-2">
                        <Palette size={14} className="text-slate-400" />
                        <span>{t('buy_modal.summary_panel.color', 'Color')}<span className="text-red-600 font-bold ml-0.5">*</span></span>
                    </label>
                    <div className="flex flex-wrap gap-2 pt-1">
                        {product.colors.map(color => (
                            <button
                                key={color}
                                type="button"
                                onClick={() => setSelectedColor(color)}
                                className={`w-8 h-8 rounded-full border-2 transition-transform duration-200 ${selectedColor === color ? 'border-blue-500 scale-110 ring-2 ring-blue-500/20' : 'border-slate-300 hover:border-slate-400'}`}
                                style={{ backgroundColor: color }}
                                aria-label={`Select color ${color}`}
                            />
                        ))}
                    </div>
                </div>
            )}
            {product?.sizes?.length > 0 && (
                <div 
                    data-error-key="selectedSize"
                    className={`p-2 rounded-md transition-all duration-200 ${formErrors.selectedSize ? 'ring-2 ring-red-500' : ''}`}
                >
                    <label className="flex items-center gap-1.5 text-sm font-semibold text-slate-600 mb-2">
                        <Ruler size={14} className="text-slate-400" />
                        <span>{t('buy_modal.summary_panel.size', 'Size')}<span className="text-red-600 font-bold ml-0.5">*</span></span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {product.sizes.map(size => (
                            <button
                                key={size}
                                type="button"
                                onClick={() => setSelectedSize(size)}
                                className={`px-4 py-1.5 rounded-lg border text-sm font-medium transition-colors duration-200 whitespace-nowrap ${selectedSize === size ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'}`}
                            >
                                {size.length > 10 ? `${size.substring(0, 10)}...` : size}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductFeatures;