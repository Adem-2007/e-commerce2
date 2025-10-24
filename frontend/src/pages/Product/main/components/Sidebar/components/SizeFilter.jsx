import React from 'react';

const SizeFilter = ({ availableSizes, selectedSizes, onSizeToggle, t }) => {
    
    // Helper function to truncate text longer than 10 characters
    const formatSize = (size) => {
        if (size.length > 10) {
            return `${size.substring(0, 10)}...`;
        }
        return size;
    };

    return (
        <div className="py-6 border-b border-gray-200">
            <h3 className="text-base font-semibold text-gray-800 mb-4">{t('product_sizes')}</h3>
            <div className="flex flex-wrap gap-2">
                {availableSizes?.map(size => (
                    <button 
                        key={size} 
                        onClick={() => onSizeToggle(size)}
                        title={size} // Show full size name on hover
                        className={`h-10 px-4 text-sm font-semibold rounded-lg border flex items-center justify-center transition-all duration-200 ${selectedSizes.includes(size) ? 'bg-gray-800 text-white border-gray-800' : 'bg-white text-gray-700 border-gray-300 hover:border-gray-800'}`}
                    >
                        {formatSize(size)}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default SizeFilter;