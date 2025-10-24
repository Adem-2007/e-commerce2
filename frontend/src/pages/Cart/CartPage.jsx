// src/pages/Cart/CartPage.jsx

import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // --- FIX: Import useNavigate ---
import { useCart } from '../../context/CartContext';
import { useLanguage } from '../../context/LanguageContext';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import CartItem from './components/CartItem';
// --- FIX: Removed the import for the old BuyModal ---
// import BuyModal from '../Product/BuyModal/BuyModal';

const CartPage = () => {
    const { cartItems, totalPrice, cartCount } = useCart(); // --- FIX: Removed clearCart as it's not used here ---
    const { t } = useLanguage();
    const navigate = useNavigate(); // --- FIX: Initialize the navigate hook ---
    
    // --- FIX: Removed state for managing the modal ---
    // const [isCheckingOut, setIsCheckingOut] = useState(false);
    
    const [validationErrors, setValidationErrors] = useState({});

    const isCheckoutDisabled = useMemo(() => {
        return cartItems.some(item => !item.selectedColor || !item.selectedSize);
    }, [cartItems]);

    const handleProceedToCheckout = () => {
        const errors = {};
        let hasErrors = false;
        cartItems.forEach(item => {
            if (!item.selectedColor || !item.selectedSize) {
                errors[item.cartItemId] = true;
                hasErrors = true;
            }
        });

        setValidationErrors(errors);

        // --- FIX: Instead of opening a modal, navigate to the Buy Page ---
        if (!hasErrors) {
            navigate('/buy', {
                state: {
                    checkoutMode: 'cart'
                    // No need to pass cartItems, BuyPage will get them from CartContext
                }
            });
        }
    };

    // --- FIX: Removed handlers related to the modal ---
    // const handleCloseModal = () => setIsCheckingOut(false);
    // const handleCheckoutSuccess = () => clearCart();

    if (cartItems.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center text-center min-h-[60vh] p-8">
                <ShoppingBag size={80} className="text-gray-400 mb-6" />
                <h2 className="text-3xl font-bold text-gray-800">{t('cart_page.empty_title')}</h2>
                <p className="text-gray-500 mt-2 mb-8">{t('cart_page.empty_subtitle')}</p>
                <Link
                    to="/shop"
                    className="bg-blue-500 text-white px-6 py-3 rounded-full font-semibold transition-all duration-200 ease-in-out hover:bg-blue-600 hover:shadow-lg"
                >
                    {t('cart_page.continue_shopping')}
                </Link>
            </div>
        );
    }

    // --- FIX: This is no longer needed ---
    // const productForModalDisplay = cartItems[0].product;

    return (
        <>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <header className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-gray-900">{t('cart_page.main_title')}</h1>
                    <p className="text-lg text-gray-600 mt-2">
                        {cartCount === 1 
                            ? t('cart_page.item_count_one') 
                            : t('cart_page.item_count_other').replace('{count}', cartCount)}
                    </p>
                </header>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-start">
                    <div className="lg:col-span-2 flex flex-col gap-6 max-h-[850px] overflow-y-auto pr-2">
                        {cartItems.map(item => (
                            <CartItem 
                                key={item.cartItemId} 
                                item={item} 
                                hasError={!!validationErrors[item.cartItemId]}
                            />
                        ))}
                    </div>
                    <div className="bg-white border border-gray-200 rounded-2xl p-6 lg:p-8 sticky top-28 shadow-sm">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">{t('cart_page.summary_title')}</h2>
                        
                        <div className="h-px bg-gray-200 my-6"></div>
                        <div className="flex justify-between items-center text-xl font-bold text-gray-900">
                            <span>{t('cart_page.total')}</span>
                            <span>{totalPrice.toFixed(2)} DZD</span>
                        </div>

                        {isCheckoutDisabled && (
                            <p className="text-center text-red-600 text-sm mt-6 -mb-2">
                                {t('cart_page.select_options_prompt')}
                            </p>
                        )}

                        <button
                            className="w-full mt-8 flex items-center justify-center gap-3 bg-teal-500 text-white text-lg font-bold rounded-lg p-4 transition-transform duration-300 hover:scale-[1.02] hover:shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none"
                            onClick={handleProceedToCheckout}
                            disabled={isCheckoutDisabled}
                        >
                            <span>{t('cart_page.checkout_button')}</span>
                            <ArrowRight size={20} />
                        </button>
                    </div>
                </div>
            </div>

            {/* --- FIX: Removed the modal component from the JSX --- */}
        </>
    );
};

export default CartPage;