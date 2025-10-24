// src/pages/Product/Modal/ProductModal.jsx

import React, { useState, useEffect } from 'react';
import { X, ShoppingBag, PlusCircle, Loader, Inbox } from 'lucide-react';
import { useDashboardLanguage } from '../../../context/DashboardLanguageContext';
import ProductCard from '../Card/ProductCard';
import ConfirmationPanel from '../../Dashboard/Categories/components/confirm/ConfirmationPanel';

const ProductModal = ({ isOpen, onClose, category, products, isLoading, onAddProductClick, onProductDelete, onEditProduct }) => {
    const { t } = useDashboardLanguage();
    
    const [view, setView] = useState('list');
    const [productToConfirm, setProductToConfirm] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    
    // State to manage the mounting and animations
    const [isRendered, setIsRendered] = useState(false);
    const [showContent, setShowContent] = useState(false);

    useEffect(() => {
        // Handle mounting and unmounting for animations
        if (isOpen) {
            setIsRendered(true);
            setTimeout(() => setShowContent(true), 50); // Delay to trigger transition
        } else {
            setShowContent(false);
            setTimeout(() => {
                setIsRendered(false);
                // Reset internal state after closing animation
                setView('list');
                setProductToConfirm(null);
                setIsDeleting(false);
            }, 300); // This duration should match the transition duration
        }

        const handleEsc = (event) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleEsc);

        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);
    
    // --- FIX: Check for both isRendered and the existence of the category prop ---
    // If the modal is told to open but doesn't have a category, don't render it.
    if (!isRendered || !category) return null;

    const handleDeleteRequest = (product) => {
        setProductToConfirm(product);
        setView('confirm_delete');
    };

    const handleCancelDelete = () => {
        setView('list');
        setProductToConfirm(null);
    };

    const handleConfirmDelete = async () => {
        if (!productToConfirm) return;
        setIsDeleting(true);
        await onProductDelete(productToConfirm._id, category._id);
        setIsDeleting(false);
        setView('list'); 
        setProductToConfirm(null);
    };

    const renderContent = () => {
        if (view === 'confirm_delete') {
            return (
                <ConfirmationPanel
                    product={productToConfirm}
                    onConfirm={handleConfirmDelete}
                    onCancel={handleCancelDelete}
                    isDeleting={isDeleting}
                />
            );
        }

        if (isLoading) {
            return (
                <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
                    <Loader className="h-12 w-12 text-gray-400 animate-spin"/>
                    <h3 className="mt-4 text-xl font-medium text-gray-700">{t('collections.loading_products')}</h3>
                </div>
            );
        }

        if (products && products.length > 0) {
            return (
                <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-7">
                    {products.map((prod, index) => (
                        <div 
                            key={prod._id}
                            className={`transform transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${showContent ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-8 scale-95 opacity-0'}`}
                            style={{ transitionDelay: `${index * 80}ms` }}
                        >
                            <ProductCard 
                                product={prod} 
                                variant="dashboard"
                                onEdit={() => onEditProduct(prod)}
                                onDelete={() => handleDeleteRequest(prod)}
                            />
                        </div>
                    ))}
                </div>
            );
        }

        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
                <Inbox className="h-16 w-16 text-gray-300"/>
                <h3 className="mt-4 text-xl font-medium text-gray-700">{t('collections.empty_products_title')}</h3>
                <p className="mt-2 text-md text-gray-500">{t('collections.empty_products_desc')}</p>
                <button 
                    onClick={onAddProductClick}
                    className="mt-6 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-transform transform hover:scale-105"
                >
                    <PlusCircle className="-ml-1 mr-2 h-5 w-5" />
                    {t('collections.add_first_product')}
                </button>
            </div>
        );
    };

    return (
        <div
            className={`fixed inset-0 bg-slate-800/50 backdrop-blur-md flex items-center justify-center z-[1000] p-4 transition-opacity duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${showContent ? 'opacity-100' : 'opacity-0'}`}
            onClick={onClose}
        >
            <div
                className={`bg-gradient-to-b from-white to-slate-50 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col relative border border-white/50 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${showContent ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
                onClick={e => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 bg-slate-100 rounded-full w-10 h-10 flex items-center justify-center cursor-pointer text-slate-500 z-10 transition-all duration-300 hover:bg-red-500 hover:text-white hover:rotate-180 hover:scale-110"
                    aria-label={t('close')}
                >
                    <X size={24} />
                </button>
                
                <header className="flex items-center justify-center gap-4 px-8 py-6 border-b border-slate-200 shrink-0">
                    <ShoppingBag className="w-8 h-8 text-blue-600"/>
                    <h2 className="text-2xl font-semibold text-slate-800">
                        {t('collections.product_modal_title')} 
                        {/* --- FIX: Use optional chaining as an extra safeguard --- */}
                        <span className="font-bold text-blue-600">{category?.name}</span>
                    </h2>
                </header>

                <div className="p-8 overflow-y-auto grow">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default ProductModal;