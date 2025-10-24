// src/pages/Product/Card/components/Buttons.jsx
import React from 'react';
import { Eye } from 'lucide-react';

// No longer needs product or cardLink props
const ProductButtons = ({ t }) => {
    return (
        <div className="relative px-5 pb-5">
            <div className="pt-2">
                <div className="grid grid-cols-1 gap-3 text-center text-sm font-semibold">
                    {/* Replaced Link with a div to prevent nesting <a> tags */}
                    <div className="col-span-1 flex items-center justify-center py-3 px-2 rounded-lg bg-slate-200 text-slate-800 transition-colors group-hover:bg-slate-300">
                        <Eye size={20} />
                        <span className="truncate ml-2">{t('view_details')}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductButtons;