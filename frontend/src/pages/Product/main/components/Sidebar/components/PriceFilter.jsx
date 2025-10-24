// src/pages/product/main/components/Sidebar/components/PriceFilter.jsx

import React, { useState, useEffect } from 'react';

const formatPrice = (value) => {
    const number = parseFloat(value);
    return isNaN(number) ? '' : `$${Math.round(number)}`;
};

const PriceFilter = ({ minPrice, maxPrice, onPriceChange, defaultMaxPrice = 1000, t }) => {
    const [internalMin, setInternalMin] = useState(minPrice);
    const [internalMax, setInternalMax] = useState(maxPrice);

    // Syncs the component's internal state if filters are cleared from the parent
    useEffect(() => {
        setInternalMin(minPrice);
        setInternalMax(maxPrice);
    }, [minPrice, maxPrice]);

    // Lifts the state up to the parent component automatically on any change
    useEffect(() => {
        onPriceChange(internalMin, internalMax);
    }, [internalMin, internalMax, onPriceChange]);

    const handleMaxChange = (e) => {
        let value = e.target.value;
        if (defaultMaxPrice && Number(value) > defaultMaxPrice) {
            value = defaultMaxPrice.toString();
        }
        setInternalMax(value);
    };

    return (
        <div className="py-6 border-b border-gray-200">
            <h3 className="text-base font-semibold text-gray-800 mb-3">{t('price_range')}</h3>
            <div className="flex justify-between items-center mb-2 px-1">
                <label className="text-xs text-slate-500">{t('price_min_label')} <span className="font-semibold text-slate-700">$0</span></label>
                <label className="text-xs text-slate-500">{t('price_max_label')} <span className="font-semibold text-slate-700">{formatPrice(defaultMaxPrice)}</span></label>
            </div>
            <div className="flex items-center gap-2">
                <input type="number" placeholder={`${t('min')} ($0)`} value={internalMin} onChange={(e) => setInternalMin(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" min="0" />
                <span className="text-gray-400 font-semibold">–</span>
                <input type="number" placeholder={`${t('max')} (${formatPrice(defaultMaxPrice)})`} value={internalMax} onChange={handleMaxChange}
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" min="0" max={defaultMaxPrice} />
            </div>
        </div>
    );
};

export default PriceFilter;