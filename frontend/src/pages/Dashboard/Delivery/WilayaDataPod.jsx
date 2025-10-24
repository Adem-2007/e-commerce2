// src/pages/Dashboard/Delivery/WilayaDataPod.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Truck, AlertTriangle, Home, Briefcase, Image as ImageIcon } from 'lucide-react';
import { useDashboardLanguage } from '../../../context/DashboardLanguageContext'; // Import hook

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const WilayaDataPod = ({ wilaya, onEdit }) => {
    const { t } = useDashboardLanguage(); // Import hook
    const companies = wilaya.details?.companies || [];
    const activeCompanies = companies.filter(c => c.isActive);

    const getPriceRange = () => {
        if (activeCompanies.length === 0) return t('delivery_costs_page.wilaya_pod.not_available');
        
        const allPrices = activeCompanies
            .flatMap(c => [
                { price: c.priceHome, currency: c.currency || 'DZD' },
                { price: c.priceOffice, currency: c.currency || 'DZD' }
            ])
            .filter(p => typeof p.price === 'number' && p.price > 0);

        if (allPrices.length === 0) return t('delivery_costs_page.wilaya_pod.no_price');
        
        const minPriceInfo = allPrices.reduce((min, p) => p.price < min.price ? p : min, allPrices[0]);
        // --- MODIFIED: Use translation key that supports price and currency ---
        return t('delivery_costs_page.wilaya_pod.starts_at').replace('{price}', `${minPriceInfo.price} ${minPriceInfo.currency}`);
    };

    const podVariants = {
        initial: { opacity: 0, y: 30, scale: 0.95 },
        animate: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 200, damping: 25 } },
        exit: { opacity: 0, y: -20, scale: 0.98 }
    };
    
    return (
        <motion.div
            layout
            variants={podVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="group relative bg-white border border-slate-200 rounded-2xl p-5 transition-all duration-300 hover:shadow-xl hover:border-blue-500 hover:-translate-y-1 flex flex-col"
        >
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-4">
                     <div className={`h-12 w-12 rounded-xl flex items-center justify-center border-4 flex-shrink-0 ${activeCompanies.length > 0 ? 'bg-blue-100 border-blue-200' : 'bg-slate-100 border-slate-200'}`}>
                        <Truck size={22} className={activeCompanies.length > 0 ? 'text-blue-600' : 'text-slate-500'} />
                    </div>
                    <div>
                        <p className="font-bold text-lg text-slate-800">{wilaya.code} - {wilaya.name}</p>
                        <p className="text-sm font-semibold text-blue-600">{getPriceRange()}</p>
                    </div>
                </div>
            </div>
            
            <div className="flex-grow py-4 space-y-3">
                {activeCompanies.length === 0 ? (
                     <div className="h-full flex flex-col items-center justify-center text-center text-slate-500">
                        <AlertTriangle size={24} className="mb-2" />
                        <p className="text-sm font-semibold">{t('delivery_costs_page.wilaya_pod.no_active_couriers')}</p>
                        <p className="text-xs">{t('delivery_costs_page.wilaya_pod.click_to_manage')}</p>
                    </div>
                ) : (
                    <>
                        {activeCompanies.slice(0, 2).map(company => (
                             <div key={company._id} className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                                     {company.logoUrl ? (
                                        // --- MODIFIED: Use company.logoUrl directly ---
                                        <img src={company.logoUrl} alt={company.companyName} className="w-full h-full object-cover" />
                                     ) : (
                                        <ImageIcon size={18} className="text-slate-400" />
                                     )}
                                </div>
                                <div className="flex-grow overflow-hidden">
                                     <p className="font-semibold text-sm text-slate-700 truncate">{company.companyName || 'Unnamed'}</p>
                                     <div className="flex items-center gap-2 text-xs text-slate-500">
                                         {/* --- MODIFIED: Display currency --- */}
                                         <span className="flex items-center gap-1" title={t('delivery_costs_page.wilaya_pod.delivery_home_title')}><Home size={12}/> {company.priceHome || 0} {company.currency || 'DZD'}</span>
                                         <span className="flex items-center gap-1" title={t('delivery_costs_page.wilaya_pod.delivery_office_title')}><Briefcase size={12}/> {company.priceOffice || 0} {company.currency || 'DZD'}</span>
                                     </div>
                                </div>
                            </div>
                        ))}
                        {activeCompanies.length > 2 && (
                             <p className="text-xs font-semibold text-slate-500 pt-1 text-center">
                                {t('delivery_costs_page.wilaya_pod.more_couriers').replace('{count}', activeCompanies.length - 2)}
                            </p>
                        )}
                    </>
                )}
            </div>

            <div className="pt-4 border-t border-slate-100">
                <button 
                    onClick={() => onEdit(wilaya)} 
                    className="w-full bg-slate-100 text-slate-700 px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-600 hover:text-white transition-all transform group-hover:opacity-100"
                    title={t('delivery_costs_page.wilaya_pod.manage_button')}
                >
                   {t('delivery_costs_page.wilaya_pod.manage_button')}
                </button>
            </div>
        </motion.div>
    );
};

export default WilayaDataPod;