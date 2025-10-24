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
        <div className="flex flex-wrap items-center gap-x-6 gap-y-4 mt-4 border-t border-gray-200 pt-5">
            {/* --- Left Side: Quantity & Price --- */}
            <div className="flex items-center gap-x-4 sm:gap-x-6">
                {/* Quantity Selector */}
                <div className="flex items-center justify-between sm:justify-start bg-gray-100 border border-gray-200 rounded-lg">
                    <button onClick={() => handleQuantity(-1)} disabled={quantity <= 1} className="p-3 text-gray-500 transition-colors hover:text-gray-900 disabled:text-gray-300 disabled:cursor-not-allowed"><Minus size={18}/></button>
                    <span className="px-4 text-lg font-bold">{quantity}</span>
                    <button onClick={() => handleQuantity(1)} disabled={quantity >= 10} className="p-3 text-gray-500 transition-colors hover:text-gray-900 disabled:text-gray-300 disabled:cursor-not-allowed"><Plus size={18}/></button>
                </div>

                {/* Price Display */}
                <div className="flex items-baseline gap-2">
                    <span className="text-2xl lg:text-3xl font-bold text-blue-600">{price?.toFixed(2)} {currency}</span>
                    {originalPrice && <span className="text-base lg:text-xl text-gray-400 line-through">{originalPrice.toFixed(2)} {currency}</span>}
                </div>
            </div>
            
            {/* --- Right Side: Action Buttons --- */}
            <div className="w-full sm:w-auto sm:ml-auto">
                {/* Mobile & Small Screen Buttons (with text) */}
                <div className="flex flex-1 flex-col sm:flex-row md:hidden gap-3">
                    <button 
                        onClick={onAddToCart} 
                        disabled={isAdded} 
                        className={`w-full flex items-center justify-center gap-3 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 ease-in-out shadow-md hover:shadow-lg hover:-translate-y-0.5 ${isAdded ? 'bg-green-500' : 'bg-gradient-to-r from-blue-500 to-blue-600'}`}
                    >
                        {isAdded ? ( <><Check size={22} /><span>{t('added')}</span></> ) : ( <><ShoppingCart size={22} /><span>{t('add_to_cart')}</span></> )}
                    </button>
                    <button 
                        onClick={onBuyNow} 
                        className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-teal-400 to-cyan-500 text-white font-bold py-3 px-4 rounded-lg shadow-md transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-0.5"
                    >
                        <CreditCard size={22} /><span>{t('buy_now')}</span>
                    </button>
                </div>

                {/* Medium & Large Screen Icon Buttons (with tooltip) */}
                <div className="hidden md:flex items-center gap-4">
                     <button
                        onClick={onAddToCart}
                        disabled={isAdded}
                        title={isAdded ? t('added') : t('add_to_cart')}
                        aria-label={isAdded ? t('added') : t('add_to_cart')}
                        className={`flex items-center justify-center w-14 h-14 rounded-xl text-white shadow-md transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-0.5 disabled:shadow-none disabled:translate-y-0 disabled:cursor-not-allowed ${isAdded ? 'bg-green-500' : 'bg-blue-600 hover:bg-blue-700'}`}
                    >
                        {isAdded ? <Check size={24} /> : <ShoppingCart size={24} />}
                    </button>
                    <button
                        onClick={onBuyNow}
                        title={t('buy_now')}
                        aria-label={t('buy_now')}
                        className="flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-teal-400 to-cyan-500 text-white shadow-md transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-0.5"
                    >
                        <CreditCard size={24} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductActions;