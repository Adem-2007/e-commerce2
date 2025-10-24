// src/pages/Product/BuyPage/components/Summary/Summary.jsx

import React from 'react';
import { useLanguage } from '../../../../../context/LanguageContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const getFullImageUrl = (urlPath) => {
    if (!urlPath) return '/placeholder.png'; // Provide a fallback image
    return `${API_BASE_URL}${urlPath}`;
};

const Summary = ({
    productForDisplay,
    checkoutMode,
    cartItems,
    subtotal,
    deliveryCost,
    totalPrice,
    selectedWilaya,
    selectedCompany,
    displayCurrency
}) => {
    const { t, language, direction } = useLanguage();

    const formatName = (name) => {
        if (typeof name === 'string' && name.length > 40) {
            return `${name.substring(0, 40)}...`;
        }
        return name;
    };

    return (
        <div className="h-full flex flex-col" dir={direction} key={language}>
            <div>
                <h3 className="text-2xl font-bold text-slate-800 leading-tight break-words mb-4">
                    {checkoutMode === 'cart' ? t('buy_modal.summary_panel.items_in_cart', { count: cartItems.length }) : productForDisplay.name}
                </h3>
                
                {checkoutMode === 'cart' ? (
                    <div className="my-4 space-y-4 overflow-y-auto max-h-60 pr-2 custom-scrollbar">
                        {cartItems.map(item => (
                            <div key={item.cartItemId} className="flex items-start gap-4">
                                {/* --- ADDED ---
                                    The <img> tag for the cart item is now restored.
                                */}
                                <img 
                                    src={getFullImageUrl(item.imageUrls?.thumbnail)} 
                                    alt={item.name}
                                    className="w-16 h-16 rounded-lg object-cover bg-slate-200 flex-shrink-0"
                                />
                                <div className="flex-grow min-w-0">
                                    <p className="font-semibold text-slate-700 leading-tight break-words" title={item.name}>
                                        {formatName(item.name)}
                                    </p>
                                    <p className="text-sm text-slate-500 mt-1">{t('buy_modal.summary_panel.quantity')}: {item.quantity}</p>
                                    <div className="flex items-center gap-4 mt-2 text-sm">
                                        {item.selectedColor && (
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium text-slate-500">{t('buy_modal.summary_panel.color')}:</span>
                                                <div className="w-4 h-4 rounded-full border border-slate-300" style={{ backgroundColor: item.selectedColor }} title={item.selectedColor} />
                                            </div>
                                        )}
                                        {item.selectedSize && (
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium text-slate-500">{t('buy_modal.summary_panel.size')}:</span>
                                                <span className="font-semibold text-slate-800">{item.selectedSize}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <>
                        {/* --- ADDED ---
                            The <img> tag for the single product display is now restored.
                        */}
                        <img 
                            src={getFullImageUrl(productForDisplay.imageUrls?.medium)} 
                            alt={productForDisplay.name}
                            className="w-full aspect-[3/4] rounded-xl object-cover bg-slate-200 mb-4"
                        />
                        <p className="text-base text-slate-500 my-1">{productForDisplay.category?.name || t('buy_modal.summary_panel.uncategorized')}</p>
                    </>
                )}
            </div>

            <div className="w-full mt-auto">
                {selectedCompany && (
                    <div className="mt-6 pt-6 border-t border-slate-200">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">{t('buy_modal.summary_panel.delivery_partner')}</p>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-slate-200 border-2 border-white shadow-sm overflow-hidden flex-shrink-0">
                                <img src={selectedCompany.logoUrl} alt={selectedCompany.companyName} className="w-full h-full object-cover" />
                            </div>
                            <span className="font-semibold text-slate-700">{selectedCompany.companyName}</span>
                        </div>
                    </div>
                )}
                <div className="w-full pt-6 border-t border-slate-200 mt-6 hidden lg:block">
                    <div className="flex justify-between items-center text-base text-slate-600 mb-3">
                        <span>{t('buy_modal.summary_panel.subtotal')}</span>
                        <span className="font-semibold text-slate-800">{subtotal.toFixed(2)} {displayCurrency}</span>
                    </div>
                    <div className="flex justify-between items-center text-base text-slate-600 mb-3">
                        <span>{t('buy_modal.summary_panel.delivery')}</span>
                        <span className="font-semibold text-slate-800">
                            {deliveryCost > 0 ? `${deliveryCost.toFixed(2)} ${selectedCompany?.currency || displayCurrency}` : (selectedWilaya ? t('buy_modal.summary_panel.select_option_placeholder') : t('buy_modal.summary_panel.select_wilaya_placeholder'))}
                        </span>
                    </div>
                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-dashed border-slate-200">
                        <span className="text-2xl font-bold text-blue-500">{t('buy_modal.summary_panel.total')}</span>
                        <span className="text-2xl font-bold text-blue-500">{totalPrice.toFixed(2)} {displayCurrency}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Summary;