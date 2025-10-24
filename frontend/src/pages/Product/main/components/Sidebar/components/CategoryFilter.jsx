import React from 'react';

const CategoryFilter = ({ categories, selectedCategories, onCategoryToggle, t }) => (
    <div className="py-6 border-b border-gray-200">
        <h3 className="text-base font-semibold text-gray-800 mb-4">{t('category')}</h3>
        <div className="flex flex-wrap gap-2">
            {categories.map(category => (
                <button 
                    key={category._id} 
                    onClick={() => onCategoryToggle(category._id)}
                    className={`px-3 py-1.5 text-sm font-medium rounded-full border transition-all duration-200 ${
                        selectedCategories.includes(category._id) 
                        ? 'bg-blue-600 text-white border-blue-600' 
                        : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500 hover:text-blue-600'
                    }`}
                >
                    {category.name}
                </button>
            ))}
        </div>
    </div>
);

export default CategoryFilter;