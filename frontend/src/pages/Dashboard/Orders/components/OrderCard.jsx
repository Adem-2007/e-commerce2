// src/pages/Dashboard/Orders/components/OrderCard.jsx

import React, { useState, useRef, useEffect, useMemo } from 'react';
// MODIFIED: Replaced all lucide icons with react-icons/fi
import { FiUser, FiMail, FiPhone, FiMapPin, FiTruck, FiTrash2, FiCalendar, FiChevronDown, FiBriefcase, FiHome } from 'react-icons/fi';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import StatusBadge, { statusConfig } from './StatusBadge';
import { useDashboardLanguage } from '../../../../context/DashboardLanguageContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const InfoItem = ({ icon, label, children, className = '' }) => (
    <div className={`flex items-start gap-3 text-sm ${className}`}>
        <div className="flex-shrink-0 text-gray-400 mt-1">{icon}</div>
        <div className="flex-1 min-w-0">
            <strong className="font-semibold text-gray-800 block">{label}</strong>
            <span className="text-gray-600 break-words">{children}</span>
        </div>
    </div>
);

const OrderCard = React.memo(({ order, onUpdateStatus, onDelete, isOpen, onToggle }) => {
    const { t } = useDashboardLanguage();
    const [isStatusMenuOpen, setIsStatusMenuOpen] = useState(false);
    const statusMenuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (statusMenuRef.current && !statusMenuRef.current.contains(event.target)) {
                setIsStatusMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleStatusChange = (newStatus) => {
        onUpdateStatus(order._id, newStatus);
        setIsStatusMenuOpen(false);
    };

    const displayPrice = useMemo(() => {
        return order.products?.reduce((sum, item) => sum + ((item.price ?? 0) * (item.quantity ?? 1)), 0) || 0;
    }, [order.products]);

    const formattedDate = order.createdAt ? format(new Date(order.createdAt), 'PPpp') : 'N/A';
    
    return (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden transition-shadow hover:shadow-lg">
            <div className="p-4 md:p-5 flex flex-wrap justify-between items-center cursor-pointer hover:bg-gray-50/50" onClick={onToggle}>
                <div className="flex-1 min-w-0 pr-4">
                    <h4 className="font-bold text-lg text-gray-800 truncate">{order.firstName} {order.lastName}</h4>
                    <p className="text-sm text-gray-500">{format(new Date(order.createdAt), 'MMMM dd, yyyy')}</p>
                </div>
                <div className="flex items-center gap-4 mt-2 sm:mt-0">
                    <div className="text-right">
                        <p className="text-xl font-bold text-gray-800">{displayPrice.toFixed(2)} {order.currency}</p>
                        <StatusBadge status={order.status} />
                    </div>
                    <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
                        <FiChevronDown className="text-gray-400 flex-shrink-0" size={24} />
                    </motion.div>
                </div>
            </div>

            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.section
                        key="content"
                        initial="collapsed"
                        animate="open"
                        exit="collapsed"
                        variants={{
                            open: { opacity: 1, height: 'auto' },
                            collapsed: { opacity: 0, height: 0 }
                        }}
                        transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                        className="overflow-hidden"
                    >
                        <div className="border-t border-gray-200 bg-gray-50/75">
                            <div className="p-4 md:p-5 grid grid-cols-1 gap-8">
                                
                                <div>
                                    <h5 className="font-bold text-gray-800">{t('products')} ({order.products?.length || 0})</h5>
                                    <div className="mt-4 space-y-3 max-h-80 overflow-y-auto pr-2">
                                        {order.products && order.products.length > 0 ? order.products.map((item, index) => {
                                            const imageUrl = item.product.thumbnailUrl?.startsWith('data:') 
                                                ? item.product.thumbnailUrl 
                                                : `${API_BASE_URL}${item.product.thumbnailUrl}`;
                                            return (
                                                <div key={index} className="flex items-start gap-4 bg-white p-3 rounded-lg border">
                                                    <img
                                                        src={imageUrl}
                                                        alt={item.product.name}
                                                        className="w-16 h-16 rounded-md object-cover bg-gray-100 flex-shrink-0"
                                                    />
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-semibold text-gray-900 truncate mb-1">{item.product.name}</p>
                                                        <p className="text-sm text-gray-500 mb-2">
                                                            {t('quantity')}: {item.quantity} &middot; {((item.price ?? 0) * (item.quantity ?? 1)).toFixed(2)} {order.currency}
                                                        </p>
                                                        <div className="flex items-center gap-4 text-xs">
                                                            {item.selectedSize && (
                                                                <div className="flex items-center gap-1.5">
                                                                    <span className="font-medium text-gray-500">{t('size')}:</span>
                                                                    <span className="font-semibold text-gray-800 bg-gray-100 px-2 py-0.5 rounded-md">{item.selectedSize}</span>
                                                                </div>
                                                            )}
                                                            {item.selectedColor && (
                                                                <div className="flex items-center gap-1.5">
                                                                    <span className="font-medium text-gray-500">{t('color')}:</span>
                                                                    <div
                                                                        className="w-4 h-4 rounded-full border border-gray-300"
                                                                        style={{ backgroundColor: item.selectedColor }}
                                                                        title={item.selectedColor}
                                                                    />
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        }) : <p className="text-sm text-gray-500">{t('no_products_in_order')}</p>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-gray-200 pt-6">
                                    <div className="space-y-4">
                                        <InfoItem icon={<FiUser size={16} />} label={t('customer')}>{order.firstName} {order.lastName}</InfoItem>
                                        <InfoItem icon={<FiMail size={16} />} label={t('email')}>{order.email}</InfoItem>
                                        <InfoItem icon={<FiPhone size={16} />} label={t('phone')}>{order.phone1} {order.phone2 && `/ ${order.phone2}`}</InfoItem>
                                    </div>
                                    <div className="space-y-4">
                                        <InfoItem icon={<FiTruck size={16} />} label={t('order_type')}><span className="capitalize">{order.orderType}</span></InfoItem>
                                        {order.orderType === 'delivery' && (
                                            <>
                                                {order.deliveryType && (<InfoItem icon={order.deliveryType === 'home' ? <FiHome size={16} /> : <FiBriefcase size={16} />} label={t('delivery_option')}><span className="capitalize">{t(order.deliveryType === 'home' ? 'to_home' : 'to_office')}</span></InfoItem>)}
                                                {order.deliveryCompany?.companyName && (<InfoItem icon={<FiBriefcase size={16} />} label={t('delivery_partner')}>{order.deliveryCompany.companyName}</InfoItem>)}
                                                <InfoItem icon={<FiMapPin size={16} />} label={t('address')} className="col-span-full">{order.address}, {order.municipality}, {order.wilaya}</InfoItem>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 bg-white border-t flex flex-wrap justify-between items-center gap-4">
                                <InfoItem icon={<FiCalendar size={16} />} label={t('order_date')}>
                                {formattedDate}
                                </InfoItem>

                                <div className="flex items-center gap-3">
                                    <div className="relative" ref={statusMenuRef}>
                                        <button onClick={() => setIsStatusMenuOpen(prev => !prev)} className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                            {t('update_status')}
                                            <FiChevronDown size={16} className={`transition-transform ${isStatusMenuOpen ? 'rotate-180' : ''}`} />
                                        </button>
                                        {isStatusMenuOpen && (
                                            <div className="absolute bottom-full right-0 mb-2 w-56 bg-white border border-gray-200 rounded-lg shadow-xl z-20 overflow-hidden max-h-72 overflow-y-auto">
                                                {Object.entries(statusConfig).filter(([key]) => key !== 'default').map(([key, config]) => (
                                                    <button 
                                                        key={key} 
                                                        onClick={() => handleStatusChange(key)} 
                                                        className={`w-full text-left px-4 py-3 text-sm font-medium flex items-center gap-3 transition-colors disabled:opacity-50 disabled:bg-transparent disabled:cursor-not-allowed ${config.textColor} hover:bg-gray-100`}
                                                        disabled={order.status === key}
                                                    >
                                                        {config.icon}
                                                        <span>{t(config.labelKey)}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <button title={t('delete_order')} className="inline-flex items-center justify-center p-2 text-red-700 bg-red-100 rounded-lg hover:bg-red-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500" onClick={() => onDelete(order._id)}>
                                        <FiTrash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.section>
                )}
            </AnimatePresence>
        </div>
    );
});

export default OrderCard;