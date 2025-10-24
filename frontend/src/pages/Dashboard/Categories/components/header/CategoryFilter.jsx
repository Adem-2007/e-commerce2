// src/pages/Dashboard/Categories/components/header/CategoryFilter.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Edit, Trash2, ChevronDown } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const CategoryFilter = ({ categories, selectedCategory, onFilterChange, onEditCategory, onDeleteCategory }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Custom hook to close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSelectCategory = (categoryId) => {
        onFilterChange(categoryId);
        setIsOpen(false);
    };

    const selectedCategoryName =
        selectedCategory === 'all'
            ? 'All Categories'
            : categories.find(c => c._id === selectedCategory)?.name || 'Select Category';

    return (
        <div className="mt-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Category
            </label>
            <div className="relative w-full max-w-sm" ref={dropdownRef}>
                {/* Dropdown Button */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center justify-between w-full p-3 bg-white border border-gray-300 rounded-lg shadow-sm text-left focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <span className="font-semibold text-gray-800">{selectedCategoryName}</span>
                    <ChevronDown
                        size={20}
                        className={`text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                    />
                </button>

                {/* Dropdown Panel */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute z-10 mt-1 w-full border border-gray-200 rounded-lg shadow-lg bg-white"
                        >
                            <ul className="divide-y divide-gray-200 max-h-60 overflow-y-auto">
                                <li
                                    onClick={() => handleSelectCategory('all')}
                                    className={`p-3 font-semibold cursor-pointer transition-colors duration-200 ${
                                        selectedCategory === 'all' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
                                    }`}
                                >
                                    All Categories
                                </li>
                                {categories.map(cat => {
                                    const isActive = selectedCategory === cat._id;
                                    return (
                                        <li
                                            key={cat._id}
                                            onClick={() => handleSelectCategory(cat._id)}
                                            className={`flex items-center justify-between p-3 cursor-pointer group transition-colors duration-200 ${
                                                isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
                                            }`}
                                        >
                                            <span className="font-semibold">{cat.name}</span>
                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); onDeleteCategory(cat); }}
                                                    className="p-2 text-gray-400 rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-100 hover:text-red-600 transition-all"
                                                    aria-label={`Remove ${cat.name}`}
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); onEditCategory(cat._id); }}
                                                    className="p-2 text-gray-400 rounded-full opacity-0 group-hover:opacity-100 hover:bg-yellow-100 hover:text-yellow-600 transition-all"
                                                    aria-label={`Edit ${cat.name}`}
                                                >
                                                    <Edit size={16} />
                                                </button>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default CategoryFilter;