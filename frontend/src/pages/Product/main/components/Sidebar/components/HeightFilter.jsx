import React from 'react';

const HeightFilter = ({ minHeight, maxHeight, onMinHeightChange, onMaxHeightChange, t }) => (
    <div className="py-6 border-b border-gray-200">
        <h3 className="text-base font-semibold text-gray-800 mb-4">{t('height_cm')}</h3>
        <div className="flex items-center gap-2">
            <input type="number" placeholder={t('min')} value={minHeight} onChange={e => onMinHeightChange(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
            <span className="text-gray-400 font-semibold">–</span>
            <input type="number" placeholder={t('max')} value={maxHeight} onChange={e => onMaxHeightChange(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
        </div>
    </div>
);
export default HeightFilter;