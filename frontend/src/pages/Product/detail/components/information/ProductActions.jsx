// src/pages/Product/ProductDetailPage/components/information/ProductActions.jsx

import React from 'react';
import { Minus, Plus, ShoppingCart, Check, CreditCard } from 'lucide-react';
import { useLanguage } from '../../../../../context/LanguageContext';

const ProductActions = ({ quantity, onQuantityChange, onAddToCart, onBuyNow, isAdded, price, originalPrice, currency }) => {
    const { t } = useLanguage();
    
    const handleQuantity = (amount) => {
        const newQuantity = Math.max(1, Math.min(10, quantity + amount));
        onQuantityChange(newQuantity);
    };

    return (
        <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center sm:justify-between gap-4 mt-4 border-t border-gray-200 pt-5">
            {/* Quantity Selector */}
            <div className="flex items-center self-start bg-gray-100 border border-gray-200 rounded-lg">
                <button onClick={() => handleQuantity(-1)} disabled={quantity <= 1} className="p-3 text-gray-500 transition-colors hover:text-gray-900 disabled:text-gray-300 disabled:cursor-not-allowed"><Minus size={18}/></button>
                <span className="px-4 text-lg font-bold text-gray-800">{quantity}</span>
                <button onClick={() => handleQuantity(1)} disabled={quantity >= 10} className="p-3 text-gray-500 transition-colors hover:text-gray-900 disabled:text-gray-300 disabled:cursor-not-allowed"><Plus size={18}/></button>
            </div>
            
            {/* --- Action Group: Price & Buttons --- */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                {/* Price Display */}
                <div className="flex items-baseline gap-2 text-right sm:text-left">
                    <span className="text-3xl font-bold text-blue-600">{price?.toFixed(2)} {currency}</span>
                    {originalPrice && <span className="text-xl text-gray-400 line-through">{originalPrice.toFixed(2)} {currency}</span>}
                </div>

                {/* Mobile & Small Screen Buttons (with text) */}
                <div className="flex flex-1 sm:hidden gap-3">
                    <button 
                        onClick={onAddToCart} 
                        disabled={isAdded} 
                        className={`w-full flex items-center justify-center gap-3 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 ease-in-out shadow-md hover:shadow-lg hover:-translate-y-0.5 ${isAdded ? 'bg-green-500' : 'bg-blue-600'}`}
                    >
                        {isAdded ? ( <><Check size={22} /><span>{t('added')}</span></> ) : ( <><ShoppingCart size={22} /><span>{t('add_to_cart')}</span></> )}
                    </button>
                    <button 
                        onClick={onBuyNow} 
                        className="w-full flex items-center justify-center gap-3 bg-teal-500 text-white font-bold py-3 px-4 rounded-lg shadow-md transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-0.5"
                    >
                        <CreditCard size={22} /><span>{t('buy_now')}</span>
                    </button>
                </div>

                {/* Medium+ Screen Icon Buttons */}
                <div className="hidden sm:flex items-center gap-3">
                     <button
                        onClick={onAddToCart}
                        disabled={isAdded}
                        title={isAdded ? t('added') : t('add_to_cart')}
                        aria-label={isAdded ? t('added') : t('add_to_cart')}
                        className={`flex items-center justify-center w-14 h-14 rounded-xl text-white shadow-lg transition-all duration-300 ease-in-out hover:-translate-y-0.5 disabled:shadow-md disabled:translate-y-0 disabled:cursor-not-allowed ${isAdded ? 'bg-green-500' : 'bg-blue-600 hover:bg-blue-700'}`}
                    >
                        {isAdded ? <Check size={24} /> : <ShoppingCart size={24} />}
                    </button>
                    <button
                        onClick={onBuyNow}
                        title={t('buy_now')}
                        aria-label={t('buy_now')}
                        className="flex items-center justify-center w-14 h-14 rounded-xl bg-teal-500 text-white shadow-lg transition-all duration-300 ease-in-out hover:-translate-y-0.5"
                    >
                        <CreditCard size={24} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductActions;