// src/pages/Product/BuyPage/components/Form/Step2.jsx

import React from 'react';
import { MapPin, Building, Home, Truck, Briefcase, AlertCircle } from 'lucide-react';
import ProductFeatures from './ProductFeatures';
import { useLanguage } from '../../../../../context/LanguageContext';

const Step2 = ({
    prevStep,
    formData, handleInputChange, formErrors,
    selectedWilaya, handleWilayaChange,
    municipalities, isLoadingCosts, fetchError,
    activeWilayasForDropdown, availableCompanies,
    selectedCompany, handleCompanyChange,
    selectedDeliveryType, handleDeliveryTypeChange,
    isAddressRequired, checkoutMode, product,
    selectedColor, setSelectedColor, selectedSize, setSelectedSize
}) => {
    const { t } = useLanguage();
    
    const inputBaseClasses = "w-full py-2.5 px-3.5 rounded-lg border text-base text-slate-700 bg-white transition duration-200 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-70";
    const getInputClasses = (fieldName) => `${inputBaseClasses} ${formErrors[fieldName] ? 'border-red-500' : 'border-slate-300'}`;

    return (
        <div className="flex flex-col gap-4">
            {checkoutMode !== 'cart' && (
                <ProductFeatures 
                    product={product}
                    selectedColor={selectedColor}
                    setSelectedColor={setSelectedColor}
                    selectedSize={selectedSize}
                    setSelectedSize={setSelectedSize}
                    formErrors={formErrors}
                />
            )}

            {fetchError && (
                <div className="p-3 bg-red-100 text-red-700 text-sm font-medium rounded-lg flex items-center gap-2">
                    <AlertCircle size={16} /> {fetchError}
                </div>
            )}
            <div className="grid grid-cols-2 gap-4 max-lg:grid-cols-1">
                <div className="flex flex-col">
                    <label htmlFor="wilaya" className="flex items-center gap-1.5 text-sm font-semibold text-slate-600 mb-1.5">
                        <MapPin size={14} className="text-slate-400" />
                        <span>{t('buy_modal.form.wilaya')}<span className="text-red-600 font-bold ml-0.5">*</span></span>
                    </label>
                    <select id="wilaya" name="wilaya" value={selectedWilaya} onChange={handleWilayaChange} required className={getInputClasses('wilaya')} disabled={isLoadingCosts || fetchError}>
                        <option value="">{isLoadingCosts ? t('buy_modal.form.wilaya_loading') : t('buy_modal.form.wilaya_placeholder')}</option>
                        {activeWilayasForDropdown.map(wilaya => (<option key={wilaya.code} value={wilaya.code}>{`${wilaya.code} - ${wilaya.name}`}</option>))}
                    </select>
                </div>
                <div className="flex flex-col">
                    <label htmlFor="municipality" className="flex items-center gap-1.5 text-sm font-semibold text-slate-600 mb-1.5">
                        <Building size={14} className="text-slate-400" />
                        <span>{t('buy_modal.form.municipality')}<span className="text-red-600 font-bold ml-0.5">*</span></span>
                    </label>
                    <select id="municipality" name="municipality" value={formData.municipality} onChange={handleInputChange} required disabled={!selectedWilaya} className={getInputClasses('municipality')}>
                        <option value="">{t('buy_modal.form.municipality_placeholder')}</option>
                        {municipalities.map(m => <option key={m.name} value={m.name}>{m.name}</option>)}
                    </select>
                </div>
            </div>

            {availableCompanies.length > 0 && (
                <div data-error-key="deliveryCompany" className={`flex flex-col p-1 rounded-lg ${formErrors.deliveryCompany ? 'ring-2 ring-red-500' : ''}`}>
                    <label className="flex items-center gap-1.5 text-sm font-semibold text-slate-600 mb-1.5"><Truck size={14} className="text-slate-400" /><span>{t('buy_modal.form.courier')}<span className="text-red-600 font-bold ml-0.5">*</span></span></label>
                    <div className="flex flex-col gap-2.5 mt-1">
                        {availableCompanies.map((company) => (<label key={company._id} htmlFor={`courier-${company._id}`} className={`flex items-center gap-3 p-3 border-2 rounded-lg bg-white cursor-pointer transition-all duration-200 ${selectedCompany?._id === company._id ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500/20' : 'border-slate-200 hover:border-slate-400'}`}><input type="radio" id={`courier-${company._id}`} name="deliveryCompany" value={company._id} checked={selectedCompany?._id === company._id} onChange={() => handleCompanyChange(company)} className="sr-only" /><div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-slate-100"><img src={company.logoUrl} alt={company.companyName} className="w-full h-full object-cover"/></div><div className="flex flex-col flex-grow"><span className="text-sm font-semibold text-slate-800">{company.companyName}</span><span className="text-sm text-slate-600">{t('buy_modal.form.courier_price_placeholder')}</span></div></label>))}
                    </div>
                </div>
            )}

            {selectedCompany && (
                <div data-error-key="deliveryType" className={`flex flex-col p-1 rounded-lg ${formErrors.deliveryType ? 'ring-2 ring-red-500' : ''}`}>
                    <label className="flex items-center gap-1.5 text-sm font-semibold text-slate-600 mb-1.5"><Home size={14} className="text-slate-400" /><span>{t('buy_modal.form.delivery_option')}<span className="text-red-600 font-bold ml-0.5">*</span></span></label>
                    <div className="grid grid-cols-2 gap-3 mt-1 max-lg:grid-cols-1">
                        <label htmlFor="delivery-home" className={`flex items-center gap-3 p-4 px-3 border-2 rounded-lg bg-white cursor-pointer transition-all duration-200 text-left ${selectedDeliveryType === 'home' ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500/20' : 'border-slate-200 hover:border-slate-400'}`}><input type="radio" id="delivery-home" name="deliveryType" value="home" checked={selectedDeliveryType === 'home'} onChange={() => handleDeliveryTypeChange('home')} className="sr-only"/><Home size={18} className={`flex-shrink-0 transition-colors duration-200 ${selectedDeliveryType === 'home' ? 'text-blue-500' : 'text-slate-500'}`}/><div className="flex flex-col"><span className="text-sm font-medium text-slate-600">{t('buy_modal.form.delivery_option_home')}</span><strong className="text-base font-bold text-slate-800 mt-0.5">{selectedCompany.priceHome} {selectedCompany.currency || 'DZD'}</strong></div></label>
                        <label htmlFor="delivery-office" className={`flex items-center gap-3 p-4 px-3 border-2 rounded-lg bg-white cursor-pointer transition-all duration-200 text-left ${selectedDeliveryType === 'office' ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500/20' : 'border-slate-200 hover:border-slate-400'}`}><input type="radio" id="delivery-office" name="deliveryType" value="office" checked={selectedDeliveryType === 'office'} onChange={() => handleDeliveryTypeChange('office')} className="sr-only"/><Briefcase size={18} className={`flex-shrink-0 transition-colors duration-200 ${selectedDeliveryType === 'office' ? 'text-blue-500' : 'text-slate-500'}`}/><div className="flex flex-col"><span className="text-sm font-medium text-slate-600">{t('buy_modal.form.delivery_option_office')}</span><strong className="text-base font-bold text-slate-800 mt-0.5">{selectedCompany.priceOffice} {selectedCompany.currency || 'DZD'}</strong></div></label>
                    </div>
                </div>
            )}
             {/* Note: The Full Address field logic has been moved to Step 1 as requested */}

            <div className="flex items-center gap-4 mt-6">
                <button type="button" onClick={prevStep} className="w-auto bg-slate-200 text-slate-700 py-3 px-6 text-sm font-semibold rounded-lg cursor-pointer transition-colors duration-200 hover:bg-slate-300">
                    {t('buy_modal.form.back_button', 'Back')}
                </button>
                <button type="submit" className="w-full bg-blue-600 text-white py-3 px-6 text-sm font-semibold rounded-lg cursor-pointer transition-all duration-300 ease-in-out hover:bg-blue-700 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-600/20 disabled:bg-slate-400 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none">
                    {t('buy_modal.form.place_order_button')}
                </button>
            </div>
        </div>
    );
};

export default Step2;