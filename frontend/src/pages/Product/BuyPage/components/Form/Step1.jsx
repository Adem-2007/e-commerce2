// src/pages/Product/BuyPage/components/Form/Step1.jsx

import React from 'react';
import { User, Mail, Phone, Home } from 'lucide-react';
import { useLanguage } from '../../../../../context/LanguageContext';

const Step1 = ({ formData, handleInputChange, formErrors, nextStep }) => {
    const { t } = useLanguage();
    
    const inputBaseClasses = "w-full py-2.5 px-3.5 rounded-lg border text-base text-slate-700 bg-white transition duration-200 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20";
    const getInputClasses = (fieldName) => `${inputBaseClasses} ${formErrors[fieldName] ? 'border-red-500' : 'border-slate-300'}`;

    return (
        <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4 max-lg:grid-cols-1">
                <div className="flex flex-col">
                    <label htmlFor="firstName" className="flex items-center gap-1.5 text-sm font-semibold text-slate-600 mb-1.5">
                        <User size={14} className="text-slate-400" />
                        <span>{t('buy_modal.form.first_name')}<span className="text-red-600 font-bold ml-0.5">*</span></span>
                    </label>
                    <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleInputChange} required className={getInputClasses('firstName')} />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="lastName" className="flex items-center gap-1.5 text-sm font-semibold text-slate-600 mb-1.5">
                        <User size={14} className="text-slate-400" />
                        <span>{t('buy_modal.form.last_name')}<span className="text-red-600 font-bold ml-0.5">*</span></span>
                    </label>
                    <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleInputChange} required className={getInputClasses('lastName')} />
                </div>
            </div>
            <div className="flex flex-col">
                <label htmlFor="email" className="flex items-center gap-1.5 text-sm font-semibold text-slate-600 mb-1.5">
                    <Mail size={14} className="text-slate-400" />
                    <span>{t('buy_modal.form.email')}</span>
                </label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} className={getInputClasses('email')} />
            </div>
            <div className="grid grid-cols-2 gap-4 max-lg:grid-cols-1">
                <div className="flex flex-col">
                    <label htmlFor="phone1" className="flex items-center gap-1.5 text-sm font-semibold text-slate-600 mb-1.5">
                        <Phone size={14} className="text-slate-400" />
                        <span>{t('buy_modal.form.phone1')}<span className="text-red-600 font-bold ml-0.5">*</span></span>
                    </label>
                    <input type="tel" id="phone1" name="phone1" value={formData.phone1} onChange={handleInputChange} required minLength="10" maxLength="10" pattern="\d{10}" title={t('buy_modal.form.phone_validation_title')} className={getInputClasses('phone1')} />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="phone2" className="flex items-center gap-1.5 text-sm font-semibold text-slate-600 mb-1.5">
                        <Phone size={14} className="text-slate-400" />
                        <span>{t('buy_modal.form.phone2')}</span>
                    </label>
                    <input type="tel" id="phone2" name="phone2" value={formData.phone2} onChange={handleInputChange} minLength="10" maxLength="10" pattern="\d{10}" title={t('buy_modal.form.phone_validation_title')} className={getInputClasses('phone2')} />
                </div>
            </div>
             <div className="flex flex-col">
               <label htmlFor="address" className="flex items-center gap-1.5 text-sm font-semibold text-slate-600 mb-1.5">
                   <Home size={14} className="text-slate-400" />
                   <span>{t('buy_modal.form.address')}</span>
                </label>
               <input type="text" id="address" name="address" placeholder={t('buy_modal.form.address_placeholder')} value={formData.address} onChange={handleInputChange} className={getInputClasses('address')} />
            </div>
            <div className="flex justify-end mt-6">
                <button type="button" onClick={nextStep} className="w-full bg-blue-600 text-white py-3 px-6 text-sm font-semibold rounded-lg cursor-pointer transition-all duration-300 ease-in-out hover:bg-blue-700 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-600/20">
                    {t('buy_modal.form.next_button', 'Next Step')}
                </button>
            </div>
        </div>
    );
};

export default Step1;