// src/pages/Dashboard/Categories/components/header/Header.jsx
import React from 'react';
import { Layers, Package } from 'lucide-react';

const Header = ({ t, onAddCategory, onAddProduct }) => {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Page Title and Description */}
            <div className="border-l-4 border-blue-500 pl-4">
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{t('collections.header_title')}</h1>
                <p className="mt-1 text-slate-500">{t('collections.header_desc')}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 self-start sm:self-center">
                {/* --- FIX: "New Category" button is now correctly included --- */}
                <button
                    onClick={onAddCategory}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-blue-600 bg-blue-100 rounded-full hover:bg-blue-200 transition-colors"
                >
                    <Layers size={16} /> {t('collections.new_category_button')}
                </button>

                <button
                    onClick={onAddProduct}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-colors shadow-sm"
                >
                    <Package size={16} /> {t('collections.new_product_button')}
                </button>
            </div>
        </div>
    );
};

export default Header;