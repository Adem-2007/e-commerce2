// src/pages/product/main/components/Sidebar/ProductFilterSidebar.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import { useLanguage } from '../../../../../context/LanguageContext';

// Import the filter section components
import CategoryFilter from './components/CategoryFilter';
import GenderFilter from './components/GenderFilter';
import PriceFilter from './components/PriceFilter';
import HeightFilter from './components/HeightFilter';
import ColorFilter from './components/ColorFilter';
import SizeFilter from './components/SizeFilter';
import MaterialFilter from './components/MaterialFilter';

const FilterContent = ({ categories, availableFilters, onFilterChange, clearFilters, hasActiveFilters, isLoading, t }) => {
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedColors, setSelectedColors] = useState([]);
    const [selectedSizes, setSelectedSizes] = useState([]);
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [selectedGender, setSelectedGender] = useState('');
    const [selectedMaterials, setSelectedMaterials] = useState([]);
    const [minHeight, setMinHeight] = useState('');
    const [maxHeight, setMaxHeight] = useState('');

    const stableOnFilterChange = useCallback(onFilterChange, []);

    useEffect(() => {
        const filters = {};
        if (selectedCategories.length > 0) filters.categories = selectedCategories.join(',');
        if (selectedColors.length > 0) filters.colors = selectedColors.join(',');
        if (selectedSizes.length > 0) filters.sizes = selectedSizes.join(',');
        if (minPrice) filters.minPrice = minPrice;
        if (maxPrice) filters.maxPrice = maxPrice;
        if (selectedGender) filters.gender = selectedGender;
        if (selectedMaterials.length > 0) filters.materials = selectedMaterials.join(',');
        if (minHeight) filters.minHeight = minHeight;
        if (maxHeight) filters.maxHeight = maxHeight;
        stableOnFilterChange(filters);
    }, [selectedCategories, selectedColors, selectedSizes, minPrice, maxPrice, selectedGender, selectedMaterials, minHeight, maxHeight, stableOnFilterChange]);

    const handleClearFilters = () => {
        setSelectedCategories([]);
        setSelectedColors([]);
        setSelectedSizes([]);
        setMinPrice('');
        setMaxPrice('');
        setSelectedGender('');
        setSelectedMaterials([]);
        setMinHeight('');
        setMaxHeight('');
        clearFilters();
    };

    const handlePriceChange = useCallback((newMin, newMax) => {
        setMinPrice(newMin);
        setMaxPrice(newMax);
    }, []);

    const handleCategoryToggle = (id) => setSelectedCategories(p => p.includes(id) ? p.filter(i => i !== id) : [...p, id]);
    const handleColorToggle = (hex) => setSelectedColors(p => p.includes(hex) ? p.filter(h => h !== hex) : [...p, hex]);
    const handleSizeToggle = (size) => setSelectedSizes(p => p.includes(size) ? p.filter(s => s !== size) : [...p, size]);
    const handleMaterialToggle = (mat) => setSelectedMaterials(p => p.includes(mat) ? p.filter(m => m !== mat) : [...p, mat]);

    return (
        <div className="flex flex-col h-full">
            <div className="flex justify-between items-center px-6 pt-6 pb-4 border-b border-gray-200">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <SlidersHorizontal size={20} />
                    <span>{t('filters')}</span>
                </h2>
                {hasActiveFilters && (
                    <button onClick={handleClearFilters} className="text-sm font-semibold text-gray-600 hover:text-blue-600 flex items-center gap-1">
                        <X size={14} /> {t('clear')}
                    </button>
                )}
            </div>
            <div className="px-6 overflow-y-auto flex-grow">
                <CategoryFilter categories={categories} selectedCategories={selectedCategories} onCategoryToggle={handleCategoryToggle} t={t} />
                <GenderFilter selectedGender={selectedGender} onGenderChange={setSelectedGender} t={t} />
                <PriceFilter 
                    minPrice={minPrice} 
                    maxPrice={maxPrice} 
                    onPriceChange={handlePriceChange}
                    defaultMaxPrice={availableFilters?.maxPrice}
                    t={t}
                />
                <HeightFilter minHeight={minHeight} maxHeight={maxHeight} onMinHeightChange={setMinHeight} onMaxHeightChange={setMaxHeight} t={t} />
                <ColorFilter availableColors={availableFilters?.colors} selectedColors={selectedColors} onColorToggle={handleColorToggle} t={t} />
                <SizeFilter availableSizes={availableFilters?.sizes} selectedSizes={selectedSizes} onSizeToggle={handleSizeToggle} t={t} />
                <MaterialFilter availableMaterials={availableFilters?.materials} selectedMaterials={selectedMaterials} onMaterialToggle={handleMaterialToggle} t={t} />
            </div>
        </div>
    );
};


const ProductFilterSidebar = ({ categories, onFilterChange, availableFilters, isLoading }) => {
    const { language, t } = useLanguage();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [hasActiveFilters, setHasActiveFilters] = useState(false);

    const handleFilterChange = (filters) => {
        setHasActiveFilters(Object.keys(filters).length > 0);
        onFilterChange(filters);
    };
    
    const handleClearFilters = () => {
        setHasActiveFilters(false);
    };

    return (
        <>
            {/* --- DESKTOP: Sidebar visible on large screens and up --- */}
            <aside className="hidden lg:block w-full max-w-xs lg:max-w-sm">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200/80 flex flex-col h-[calc(100vh-8rem)]">
                    <FilterContent 
                        categories={categories}
                        availableFilters={availableFilters}
                        onFilterChange={handleFilterChange}
                        clearFilters={handleClearFilters}
                        hasActiveFilters={hasActiveFilters}
                        isLoading={isLoading}
                        t={t}
                    />
                </div>
            </aside>

            {/* --- MOBILE & TABLET: Fixed Button & Modal hidden on large screens and up --- */}
            <div className={`lg:hidden fixed bottom-4 z-40 ${language === 'ar' ? 'left-4' : 'right-4'}`}>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white font-semibold rounded-full shadow-lg hover:bg-blue-700 transition-transform hover:scale-105"
                >
                    <SlidersHorizontal size={20} />
                    <span>{t('filters')}</span>
                    {hasActiveFilters && <span className={`absolute -top-1 border-2 border-blue-600 w-4 h-4 bg-red-500 rounded-full ${language === 'ar' ? '-left-1' : '-right-1'}`}></span>}
                </button>
            </div>

            {isModalOpen && (
                <div className="lg:hidden fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}>
                    <div className="relative bg-white w-full h-full flex flex-col" onClick={e => e.stopPropagation()}>
                        <div className="flex-grow overflow-y-hidden">
                            <FilterContent 
                                categories={categories}
                                availableFilters={availableFilters}
                                onFilterChange={handleFilterChange}
                                clearFilters={() => {
                                    handleClearFilters();
                                    setIsModalOpen(false);
                                }}
                                hasActiveFilters={hasActiveFilters}
                                isLoading={isLoading}
                                t={t}
                            />
                        </div>
                         <div className="p-4 border-t border-gray-200">
                             <button onClick={() => setIsModalOpen(false)} className="w-full py-3 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-900 transition-colors">
                                {t('done')}
                            </button>
                         </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ProductFilterSidebar;