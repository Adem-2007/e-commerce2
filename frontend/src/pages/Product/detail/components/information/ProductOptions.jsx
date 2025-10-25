// src/pages/Product/ProductDetailPage/components/information/ProductOptions.jsx

import React from 'react';
import { Check } from 'lucide-react';
import { useLanguage } from '../../../../../context/LanguageContext';
import OptionGrid from '../common/OptionGrid'; // Import the new component

const isColorLight = (hex) => {
    if (!hex || typeof hex !== 'string' || hex.length < 7) return false;
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return (r * 0.299 + g * 0.587 + b * 0.114) > 186;
};

const formatSize = (size) => size.length > 10 ? `${size.substring(0, 10)}...` : size;

const ProductOptions = ({ colors, sizes, selectedColor, selectedSize, onColorSelect, onSizeSelect }) => {
    const { t } = useLanguage();

    // Define render functions to pass to the OptionGrid
    const renderColorOption = (hex) => (
        <button 
            key={hex} 
            onClick={() => onColorSelect(hex)} 
            className={`w-9 h-9 shrink-0 rounded-full border-2 flex items-center justify-center transition-all duration-300 ease-in-out shadow-sm ${selectedColor === hex ? 'border-blue-600 scale-110' : 'border-transparent'}`} 
            style={{ backgroundColor: hex }}
            aria-label={`Select color ${hex}`}
        >
            {selectedColor === hex && <Check size={18} className={isColorLight(hex) ? 'text-black' : 'text-white'} />}
        </button>
    );

    const renderSizeOption = (size) => (
        <button 
            key={size} 
            title={size} 
            onClick={() => onSizeSelect(size)} 
            className={`h-9 shrink-0 px-4 py-2 border-2 rounded-lg font-semibold text-sm transition-colors duration-200 ${selectedSize === size ? 'bg-gray-900 border-gray-900 text-white' : 'border-gray-300 text-gray-700 hover:border-blue-600 hover:text-blue-600'}`}
        >
            {formatSize(size)}
        </button>
    );

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 border-t border-gray-200 pt-5">
            {/* Color Section */}
            <div>
                <h3 className="text-sm font-semibold text-gray-600 mb-2">{t('color_label')}:</h3>
                <OptionGrid
                    options={colors}
                    renderOption={renderColorOption}
                    type="color"
                />
            </div>
            
            {/* Size Section */}
            {/* Use a border for a cleaner separation than a manual divider */}
            <div className="md:border-l md:border-gray-200 md:pl-6">
                <h3 className="text-sm font-semibold text-gray-600 mb-2">{t('size_label')}: <span className="text-gray-900 font-bold">{selectedSize}</span></h3>
                <OptionGrid
                    options={sizes}
                    renderOption={renderSizeOption}
                    type="size"
                />
            </div>
        </div>
    );
};

export default ProductOptions;