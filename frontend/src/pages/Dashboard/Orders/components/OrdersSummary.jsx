// src/pages/Dashboard/Orders/components/OrdersSummary.jsx

import React, { useState, useMemo } from 'react';
import { FiArrowLeft, FiArrowRight, FiArchive, FiX, FiSliders } from 'react-icons/fi'; // MODIFIED: Replaced lucide-react with react-icons
import { format } from 'date-fns';
import { useDashboardLanguage } from '../../../../context/DashboardLanguageContext';
import { statusConfig } from './StatusBadge';

const OrdersSummary = ({ orders, onGoBack }) => {
    const [activeFilter, setActiveFilter] = useState('pending');
    const [isFilterVisible, setIsFilterVisible] = useState(false);
    const { t, dir } = useDashboardLanguage();

    const { statusCounts, filteredOrders } = useMemo(() => {
        const counts = {};
        Object.keys(statusConfig).forEach(key => {
            if (key !== 'default') counts[key] = 0;
        });
        orders.forEach(order => {
            if (counts[order.status] !== undefined) counts[order.status]++;
        });
        return { statusCounts: counts, filteredOrders: orders.filter(o => o.status === activeFilter) };
    }, [orders, activeFilter]);

    return (
        <div className="flex flex-col md:flex-row md:h-full relative" dir={dir}>
            {isFilterVisible && <div className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden" onClick={() => setIsFilterVisible(false)} aria-hidden="true"></div>}
            
            <div className={`
                ${isFilterVisible ? 'translate-x-0' : dir === 'rtl' ? 'translate-x-full' : '-translate-x-full'} 
                fixed ${dir === 'rtl' ? 'right-0' : 'left-0'} top-0 h-full w-64 bg-white z-40 p-4 space-y-1 transition-transform duration-300 ease-in-out 
                md:relative md:translate-x-0 md:h-auto md:w-64 md:border-r md:border-b-0 md:bg-gray-50 md:z-auto border-b border-gray-200 flex-shrink-0
            `}>
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-bold text-gray-800 px-2">{t('order_status_title')}</h3>
                    <button onClick={() => setIsFilterVisible(false)} className="md:hidden p-1 rounded-full text-gray-500 hover:bg-gray-200"><FiX size={20} /></button>
                </div>
                
                {Object.entries(statusConfig).filter(([key]) => key !== 'default').map(([key, config]) => (
                    <button key={key} onClick={() => { setActiveFilter(key); setIsFilterVisible(false); }}
                        className={`w-full flex justify-between items-center px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${activeFilter === key ? 'bg-blue-100 text-blue-700' : `${config.textColor} hover:bg-gray-100`}`}>
                        <div className="flex items-center gap-3">
                            {config.icon}
                            <span>{t(config.labelKey)}</span>
                        </div>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${activeFilter === key ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}>{statusCounts[key]}</span>
                    </button>
                ))}
                 <button onClick={onGoBack} className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                    {dir === 'rtl' ? <FiArrowRight size={16} /> : <FiArrowLeft size={16} />}
                    {t('back_to_details')}
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 md:p-6">
                <div className="md:hidden mb-4">
                    <button onClick={() => setIsFilterVisible(true)} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors w-full justify-center">
                        <FiSliders size={16} />
                        <span>{t('show_filters')}</span>
                    </button>
                </div>

                <div className="border border-gray-200 rounded-lg overflow-hidden">
                     <div className="grid grid-cols-10 gap-4 px-4 py-3 bg-gray-50 text-start text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        <div className="col-span-4">{t('client')}</div>
                        <div className="col-span-4">{t('date')}</div>
                        <div className="col-span-2 text-end">{t('total')}</div>
                    </div>
                    {filteredOrders.length > 0 ? (
                        <div className="divide-y divide-gray-200">
                            {filteredOrders.map(order => (
                                <div key={order._id} className="grid grid-cols-10 gap-4 px-4 py-4 hover:bg-gray-50 transition-colors items-center">
                                    <div className="col-span-4 font-medium text-gray-800 text-sm truncate">{order.firstName} {order.lastName}</div>
                                    <div className="col-span-4 text-sm text-gray-600">{order.createdAt ? format(new Date(order.createdAt), 'MMM dd, yyyy') : 'N/A'}</div>
                                    <div className="col-span-2 text-end font-mono text-sm text-gray-700">${(order.totalPrice || 0).toFixed(2)}</div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 px-6 text-gray-500">
                            <FiArchive size={40} className="mx-auto text-gray-400" />
                            <h3 className="mt-3 text-md font-semibold text-gray-700">{t('no_orders_found')}</h3>
                            <p className="mt-1 text-sm">{t('no_orders_with_status')} "{t(statusConfig[activeFilter]?.labelKey)}" {t('in_date_range')}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrdersSummary;