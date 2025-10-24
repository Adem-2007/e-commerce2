// src/pages/Dashboard/Delivery/ConfirmationModal.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import { useDashboardLanguage } from '../../../context/DashboardLanguageContext'; // Import hook

export const ConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    title, // Removed default to enforce providing a title
    children
}) => {
    const { t } = useDashboardLanguage(); // Initialize hook
    const backdropVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
        exit: { opacity: 0 },
    };

    const modalVariants = {
        hidden: { opacity: 0, scale: 0.95, y: 20 },
        visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 25 } },
        exit: { opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.2 } },
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    variants={backdropVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    onClick={onClose}
                    className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center p-4"
                >
                    <motion.div
                        variants={modalVariants}
                        onClick={(e) => e.stopPropagation()}
                        className="relative w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200"
                    >
                        <div className="p-6">
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center rounded-full bg-red-100">
                                    <AlertTriangle size={24} className="text-red-600" />
                                </div>
                                <div className="flex-grow">
                                    <h3 className="text-lg font-bold text-slate-800">{title || t('delivery_costs_page.confirm_modal.default_title')}</h3>
                                    <div className="mt-1 text-sm text-slate-500">
                                        {children || <p>{t('delivery_costs_page.confirm_modal.default_body')}</p>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="px-6 py-4 bg-slate-50 flex justify-end items-center gap-3">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 rounded-lg text-sm font-semibold bg-slate-200 text-slate-700 hover:bg-slate-300 transition-colors"
                            >
                                {t('delivery_costs_page.confirm_modal.cancel_button')}
                            </button>
                            <button
                                onClick={onConfirm}
                                className="px-4 py-2 rounded-lg text-sm font-semibold bg-red-600 text-white hover:bg-red-700 transition-colors"
                            >
                                {t('delivery_costs_page.confirm_modal.confirm_button_delete')}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};