// src/pages/Dashboard/Categories/components/header/ProductTableHeader.jsx
import React from 'react';
import { Package, Tag, BarChart2, Eye, Layers, Settings } from 'lucide-react';

const ProductTableHeader = () => {
    return (
        <div className="grid grid-cols-12 gap-4 items-center p-4 font-semibold text-sm text-gray-600 bg-gray-50 border-b border-gray-200">
            <div className="col-span-4 flex items-center gap-2"><Package size={16} /> Product Name</div>
            <div className="col-span-2 flex items-center gap-2"><Layers size={16} /> Category</div>
            <div className="col-span-2 flex items-center gap-2"><Tag size={16} /> Price</div>
            {/* --- FIX: Centered header for better alignment --- */}
            <div className="col-span-1 flex items-center justify-center gap-2"><BarChart2 size={16} /> Amount</div>
            {/* --- FIX: Centered header for better alignment --- */}
            <div className="col-span-1 flex items-center justify-center gap-2"><Eye size={16} /> Views</div>
            <div className="col-span-2 flex items-center justify-end gap-2 pr-2"><Settings size={16} /> Actions</div>
        </div>
    );
};

export default ProductTableHeader;