import React from 'react';

const ColorFilter = ({ availableColors, selectedColors, onColorToggle, t }) => (
    <div className="py-6 border-b border-gray-200">
        <h3 className="text-base font-semibold text-gray-800 mb-4">{t('colors')}</h3>
        <div className="flex flex-wrap gap-3">
            {availableColors?.map(hex => (
                <button key={hex} title={hex} style={{ backgroundColor: hex }} onClick={() => onColorToggle(hex)}
                    className={`w-7 h-7 rounded-full border-2 transition-all duration-200 ${selectedColors.includes(hex) ? 'border-blue-600 ring-2 ring-offset-1 ring-blue-500 scale-110' : 'border-gray-200 hover:scale-110'}`} />
            ))}
        </div>
    </div>
);
export default ColorFilter;