// src/pages/Product/BuyPage/components/Form/OrderForm.jsx

import React from 'react';
import Step1 from './Step1';
import Step2 from './Step2';
import { useLanguage } from '../../../../../context/LanguageContext';

const OrderForm = (props) => {
    const { t } = useLanguage();
    const { currentStep } = props;

    return (
        <div className="form-panel">
            <div className="form-header">
                <h2 className="text-3xl font-bold text-slate-800 text-center mb-2 max-lg:text-2xl">{t('buy_modal.title')}</h2>
                <p className="text-base text-slate-500 text-center mb-6">{t('buy_modal.subtitle')}</p>
            </div>
            
            {/* Step Indicator */}
            <div className="w-full bg-slate-200 rounded-full h-1.5 mb-8">
                <div
                    className="bg-blue-600 h-1.5 rounded-full transition-all duration-500"
                    style={{ width: currentStep === 1 ? '50%' : '100%' }}
                ></div>
            </div>

            <form ref={props.formRef} onSubmit={props.handleSubmit} className="flex flex-col gap-4" noValidate>
                <div className={currentStep === 1 ? 'block' : 'hidden'}>
                    <Step1 {...props} />
                </div>
                <div className={currentStep === 2 ? 'block' : 'hidden'}>
                    <Step2 {...props} />
                </div>
            </form>
        </div>
    );
};

export default OrderForm;