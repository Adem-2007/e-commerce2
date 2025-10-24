// src/pages/Cart/components/CartItem.jsx

import React from 'react';
import { useCart } from '../../../context/CartContext';
import { useLanguage } from '../../../context/LanguageContext';
import { Minus, Plus, X } from 'lucide-react';

const getImageUrl = (url) => {
    // --- FIX: Return null instead of an empty string to prevent the warning ---
    if (!url) return null;
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
    return url.startsWith('data:') ? url : `${API_BASE_URL}${url}`;
};

const CartItem = ({ item, hasError }) => {
    const { removeFromCart, updateQuantity, updateItemOptions } = useCart();
    const { t } = useLanguage();
    
    const imageUrl = getImageUrl(item.thumbnailUrl);

    const formatSize = (size) => {
        if (typeof size === 'string' && size.length > 10) {
            return `${size.substring(0, 10)}...`;
        }
        return size;
    };

    return (
        <div className={`flex items-start gap-4 lg:gap-6 bg-white p-4 rounded-2xl shadow-sm border ${hasError ? 'border-red-500' : 'border-gray-200'} transition-colors duration-300`}>
            {/* Image */}
            <div className="flex-shrink-0 w-24 h-24 lg:w-28 lg:h-28 bg-gray-100 rounded-xl overflow-hidden">
                {/* --- FIX: Provide a fallback div if the image URL is not available --- */}
                {imageUrl ? (
                    <img src={imageUrl} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full bg-slate-200 flex items-center justify-center">
                        <span className="text-xs text-slate-500">{t('no_image', 'No Image')}</span>
                    </div>
                )}
            </div>

            <div className="flex-1 flex flex-col gap-3 min-w-0">
                <div className="flex justify-between items-start">
                    <h3 
                        className="truncate text-lg font-semibold text-gray-800 leading-tight pr-4"
                        title={item.name}
                    >
                        {item.name}
                    </h3>
                    <button
                        className="hidden md:block flex-shrink-0 p-1 text-gray-400 transition-colors hover:text-red-500"
                        onClick={() => removeFromCart(item.cartItemId)}
                        aria-label={t('cart_item.remove_label')}
                    >
                        <X size={20} />
                    </button>
                </div>
                
                <div className={`p-3 rounded-lg transition-colors duration-300 ${hasError ? 'bg-red-50' : 'bg-gray-50/70'}`}>
                    {/* Color Selector */}
                    {item.availableColors && item.availableColors.length > 0 && (
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-medium text-gray-600 w-12">{t('color', 'Color')}:</span>
                            <div className="flex flex-wrap gap-2">
                                {item.availableColors.map(color => (
                                    <button
                                        key={color}
                                        type="button"
                                        onClick={() => updateItemOptions(item.cartItemId, { selectedColor: color })}
                                        className={`w-6 h-6 rounded-full border-2 transition-transform duration-200 ${item.selectedColor === color ? 'border-blue-500 scale-110' : 'border-white hover:border-gray-300'}`}
                                        style={{ backgroundColor: color }}
                                        aria-label={`Select color ${color}`}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                    
                    {/* Size Selector */}
                    {item.availableSizes && item.availableSizes.length > 0 && (
                        <div className="flex items-center gap-3 mt-3">
                            <span className="text-sm font-medium text-gray-600 w-12">{t('size', 'Size')}:</span>
                            <div className="flex flex-wrap gap-2">
                                {item.availableSizes.map(size => (
                                    <button
                                        key={size}
                                        type="button"
                                        onClick={() => updateItemOptions(item.cartItemId, { selectedSize: size })}
                                        title={size}
                                        className={`px-3 py-1 rounded-md border text-xs font-semibold transition-colors duration-200 ${item.selectedSize === size ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}`}
                                    >
                                        {formatSize(size)}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-between mt-2">
                    {/* Quantity Control */}
                    <div className="flex items-center bg-gray-100 border border-gray-200 rounded-full p-1">
                        <button
                            onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="w-8 h-8 flex items-center justify-center rounded-full text-gray-600 transition-colors hover:bg-white hover:text-gray-800 disabled:opacity-50"
                        >
                            <Minus size={16} />
                        </button>
                        <span className="px-3 text-base font-medium text-gray-800">{item.quantity}</span>
                        <button
                            onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center rounded-full text-gray-600 transition-colors hover:bg-white hover:text-gray-800"
                        >
                            <Plus size={16} />
                        </button>
                    </div>
                    {/* Price */}
                    <p className="text-lg font-semibold text-gray-900 text-right">
                        {(item.price * item.quantity).toFixed(2)} DZD
                    </p>
                    {/* Mobile Remove Button */}
                    <button
                        className="md:hidden p-1 text-gray-400 transition-colors hover:text-red-500"
                        onClick={() => removeFromCart(item.cartItemId)}
                        aria-label={t('cart_item.remove_label')}
                    >
                        <X size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CartItem;