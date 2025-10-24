// src/pages/Dashboard/Categories/components/AddProduct/components/ImageResizeControl.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Edit3, Check, X } from 'lucide-react';

const predefinedSizes = [
    { label: 'Original', width: '100%', height: null },
    { label: '150x200', width: 150, height: 200 },
    { label: '200x300', width: 200, height: 300 },
    { label: '300x300', width: 300, height: 300 },
    { label: '300x450', width: 300, height: 450 },
    { label: '400x400', width: 400, height: 400 },
    { label: '400x600', width: 400, height: 600 },
    { label: '500x500', width: 500, height: 500 },
];

const ImageResizeControl = ({ onSizeChange, t }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isCustomizing, setIsCustomizing] = useState(false);
    const [customWidth, setCustomWidth] = useState('');
    const [customHeight, setCustomHeight] = useState('');
    const dropdownRef = useRef(null);

    // This effect handles clicking outside of the dropdown to close it.
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

    // --- MODIFICATION: This effect handles real-time updates for custom size inputs ---
    useEffect(() => {
        if (isCustomizing) {
            const width = parseInt(customWidth, 10);
            const height = parseInt(customHeight, 10);
            // Only trigger the update if both values are valid positive numbers.
            if (!isNaN(width) && !isNaN(height) && width > 0 && height > 0) {
                onSizeChange({ width, height });
            }
        }
    }, [customWidth, customHeight, isCustomizing, onSizeChange]);


    const handleSizeSelect = (size) => {
        onSizeChange({ width: size.width, height: size.height });
        setIsOpen(false);
        setIsCustomizing(false);
    };

    // --- REMOVED: handleCustomApply is no longer needed as updates are real-time. ---

    const handleToggleCustom = (e) => {
        e.stopPropagation();
        setIsCustomizing(!isCustomizing);
        setCustomWidth('');
        setCustomHeight('');
    }

    return (
        <div className="absolute top-2 right-2 z-20" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 bg-slate-800/60 text-white rounded-full backdrop-blur-sm transition-all hover:bg-slate-900 hover:scale-110"
                aria-label="Edit image size"
            >
                <Edit3 size={16} />
            </button>

            {isOpen && (
                <div
                    onClick={(e) => e.stopPropagation()}
                    className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden"
                >
                    <ul className="text-sm text-gray-700 max-h-60 overflow-y-auto">
                        {!isCustomizing ? (
                            <>
                                {predefinedSizes.map((size) => (
                                    <li key={size.label}>
                                        <button
                                            type="button"
                                            onClick={() => handleSizeSelect(size)}
                                            className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors"
                                        >
                                            {size.label}
                                        </button>
                                    </li>
                                ))}
                                <li>
                                    <button
                                        type="button"
                                        onClick={handleToggleCustom}
                                        className="w-full text-left font-semibold px-4 py-2 hover:bg-gray-100 transition-colors text-teal-600"
                                    >
                                        {t('collections.addProductModal.customizeSize', 'Customize...')}
                                    </button>
                                </li>
                            </>
                        ) : (
                            <li className="p-3">
                                <div className="flex items-center gap-2 mb-2">
                                    <input
                                        type="number"
                                        placeholder="W"
                                        value={customWidth}
                                        onChange={(e) => setCustomWidth(e.target.value)}
                                        className="w-full p-1 border border-gray-300 rounded-md text-center"
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                    <span className="text-gray-400">x</span>
                                    <input
                                        type="number"
                                        placeholder="H"
                                        value={customHeight}
                                        onChange={(e) => setCustomHeight(e.target.value)}
                                        className="w-full p-1 border border-gray-300 rounded-md text-center"
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                </div>
                                <div className="flex items-center justify-end gap-2">
                                     <button type="button" onClick={handleToggleCustom} className="p-1.5 text-gray-500 hover:bg-gray-200 rounded-full">
                                        <X size={14} />
                                    </button>
                                    {/* --- REMOVED: The apply button is no longer needed. --- */}
                                </div>
                            </li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default ImageResizeControl;