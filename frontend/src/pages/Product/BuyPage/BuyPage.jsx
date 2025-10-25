// src/pages/Product/BuyPage/BuyPage.jsx

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { algerianWilayasMunicipalities, getMunicipalitiesForWilaya } from '../../../data/algerianWilayasMunicipalities';
import ConfirmModal from './ConfirmModal';
import { useLanguage } from '../../../context/LanguageContext';
import { useCart } from '../../../context/CartContext';
import Summary from './components/Summary/Summary';
import OrderForm from './components/Form/OrderForm';
import { X } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const getFullImageUrl = (urlPath) => {
    if (!urlPath) return '/placeholder.png'; 
    return `${API_BASE_URL}${urlPath}`;
};


const BuyPage = () => {
    const { t } = useLanguage();
    const location = useLocation();
    const navigate = useNavigate();
    const { cartItems, clearCart } = useCart();

    const { product, checkoutMode, quantity: directQuantity, selectedColor: initialColor, selectedSize: initialSize } = location.state || {};

    const [currentStep, setCurrentStep] = useState(1);
    const [selectedColor, setSelectedColor] = useState(initialColor || null);
    const [selectedSize, setSelectedSize] = useState(initialSize || null);
    const [allDeliveryCosts, setAllDeliveryCosts] = useState({});
    const [isLoadingCosts, setIsLoadingCosts] = useState(true);
    const [fetchError, setFetchError] = useState(null);
    const [deliveryCost, setDeliveryCost] = useState(0);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [availableCompanies, setAvailableCompanies] = useState([]);
    const [selectedDeliveryType, setSelectedDeliveryType] = useState(null);
    const [formData, setFormData] = useState({
        firstName: '', lastName: '', email: '',
        phone1: '', phone2: '', wilaya: '',
        municipality: '', address: ''
    });
    const [selectedWilaya, setSelectedWilaya] = useState('');
    const [municipalities, setMunicipalities] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const formRef = useRef(null);

    const handleClose = () => {
        navigate(-1); 
    };

    useEffect(() => {
        if (checkoutMode === 'direct' && !product) navigate('/shop');
        if (checkoutMode === 'cart' && (!cartItems || cartItems.length === 0)) navigate('/cart');
    }, [product, cartItems, checkoutMode, navigate]);

    useEffect(() => {
        if (checkoutMode === 'direct' && product) {
            if (!selectedColor && product.colors?.length > 0) setSelectedColor(product.colors[0]);
            if (!selectedSize && product.sizes?.length > 0) setSelectedSize(product.sizes[0]);
        }
    }, [product, checkoutMode, selectedColor, selectedSize]);

    const sortedWilayas = useMemo(() =>
        Object.entries(algerianWilayasMunicipalities)
            .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
            .map(([code, data]) => ({ code, name: data.name }))
    , []);

    const activeWilayasForDropdown = useMemo(() => {
        return sortedWilayas.filter(wilaya => {
            const details = allDeliveryCosts[wilaya.code];
            return details && Array.isArray(details.companies) && details.companies.some(company => company.isActive);
        });
    }, [sortedWilayas, allDeliveryCosts]);

    useEffect(() => {
        const fetchCosts = async () => {
            setIsLoadingCosts(true);
            setFetchError(null);
            try {
                const response = await fetch(`${API_BASE_URL}/api/delivery-costs`);
                if (!response.ok) throw new Error('Could not load delivery fees.');
                const data = await response.json();
                setAllDeliveryCosts(data.costs || {});
            } catch (error) {
                console.error("Failed to fetch delivery costs:", error);
                setFetchError(t('buy_modal.errors.delivery_costs_unavailable'));
            } finally {
                setIsLoadingCosts(false);
            }
        };
        fetchCosts();
    }, [t]);

    useEffect(() => {
        if (orderSuccess) {
            if (checkoutMode === 'cart') clearCart();
            const timer = setTimeout(() => navigate('/shop'), 3000);
            return () => clearTimeout(timer);
        }
    }, [orderSuccess, navigate, checkoutMode, clearCart]);

    useEffect(() => {
        if (selectedWilaya) {
            setMunicipalities(getMunicipalitiesForWilaya(selectedWilaya));
            setFormData(prev => ({ ...prev, wilaya: selectedWilaya, municipality: '' }));
        } else {
            setMunicipalities([]);
            setFormData(prev => ({...prev, wilaya: '', municipality: ''}));
        }
    }, [selectedWilaya]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (formErrors[name]) setFormErrors(prev => ({ ...prev, [name]: false }));
    };

    const handleWilayaChange = (e) => {
        const wilayaCode = e.target.value;
        setSelectedWilaya(wilayaCode);
        setFormData(prev => ({ ...prev, wilaya: wilayaCode, municipality: '' }));
        setAvailableCompanies([]);
        setSelectedCompany(null);
        setSelectedDeliveryType(null);
        setDeliveryCost(0);
        if (wilayaCode) {
            const details = allDeliveryCosts[wilayaCode];
            const companiesForWilaya = (details?.companies || []).filter(c => c.isActive);
            setAvailableCompanies(companiesForWilaya);
        }
        if (formErrors.wilaya) setFormErrors(prev => ({ ...prev, wilaya: false }));
    };
    
    const handleCompanyChange = (company) => {
        setSelectedCompany(company);
        setSelectedDeliveryType(null);
        setDeliveryCost(0);
        if (formErrors.deliveryCompany) setFormErrors(prev => ({ ...prev, deliveryCompany: false }));
    };

    const handleDeliveryTypeChange = (type) => {
        if (!selectedCompany) return;
        setSelectedDeliveryType(type);
        const cost = type === 'home' ? selectedCompany.priceHome : selectedCompany.priceOffice;
        setDeliveryCost(cost);
        if (formErrors.deliveryType) setFormErrors(prev => ({ ...prev, deliveryType: false }));
    };

    const handleSetSelectedColor = (color) => {
        setSelectedColor(color);
        if (formErrors.selectedColor) setFormErrors(prev => ({ ...prev, selectedColor: false }));
    };

    const handleSetSelectedSize = (size) => {
        setSelectedSize(size);
        if (formErrors.selectedSize) setFormErrors(prev => ({ ...prev, selectedSize: false }));
    };
    
    const nextStep = () => {
        const newErrors = {};
        if (!formData.firstName.trim()) newErrors.firstName = true;
        if (!formData.lastName.trim()) newErrors.lastName = true;
        if (!formData.phone1.trim() || !/^\d{10}$/.test(formData.phone1)) newErrors.phone1 = true;
        setFormErrors(newErrors);
        if (Object.keys(newErrors).length === 0) {
            setCurrentStep(prev => prev + 1);
        } else {
            const firstErrorKey = Object.keys(newErrors)[0];
            const errorElement = formRef.current?.querySelector(`[name="${firstErrorKey}"]`);
            if (errorElement) errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    const prevStep = () => setCurrentStep(prev => prev - 1);

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = {};
        if (!formData.firstName.trim()) newErrors.firstName = true;
        if (!formData.lastName.trim()) newErrors.lastName = true;
        if (!formData.phone1.trim() || !/^\d{10}$/.test(formData.phone1)) newErrors.phone1 = true;
        if (!selectedWilaya) newErrors.wilaya = true;
        if (!formData.municipality) newErrors.municipality = true;
        if (availableCompanies.length > 0 && !selectedCompany) newErrors.deliveryCompany = true;
        if (selectedCompany && !selectedDeliveryType) newErrors.deliveryType = true;
        if (selectedDeliveryType === 'home' && !formData.address.trim()) newErrors.address = true;
        if (checkoutMode !== 'cart') {
            if (product?.colors?.length > 0 && !selectedColor) newErrors.selectedColor = true;
            if (product?.sizes?.length > 0 && !selectedSize) newErrors.selectedSize = true;
        }
        setFormErrors(newErrors);
        if (Object.keys(newErrors).length === 0) {
            setIsConfirmModalVisible(true);
        } else {
            const firstErrorKey = Object.keys(newErrors)[0];
            const errorElement = formRef.current?.querySelector(`[name="${firstErrorKey}"], [data-error-key="${firstErrorKey}"]`);
            if (errorElement) errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    const handleConfirmOrder = async () => {
        setIsSubmitting(true);
        const productsForOrder = checkoutMode === 'cart'
            ? cartItems.map(item => ({ product: item.productId, quantity: item.quantity, price: item.price, selectedSize: item.selectedSize, selectedColor: item.selectedColor }))
            : [{ product: product._id, quantity: directQuantity || 1, price: product.price, selectedSize: selectedSize, selectedColor: selectedColor }];

        const orderPayload = {
            ...formData,
            products: productsForOrder,
            subtotal, deliveryCost, totalPrice,
            orderType: 'delivery', deliveryType: selectedDeliveryType,
            status: 'pending', currency: displayCurrency,
            deliveryCompany: selectedCompany ? { companyName: selectedCompany.companyName, price: deliveryCost } : null,
        };

        try {
            const response = await fetch(`${API_BASE_URL}/api/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderPayload),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Order submission failed.');
            }
            setOrderSuccess(true);
        } catch (error) {
            console.error('Order submission failed:', error);
            alert(`Error: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- UPDATED: Ensure the full product object is used for display ---
    const productForDisplay = checkoutMode === 'cart' ? (cartItems?.[0] || {}) : (product || {});
    
    const subtotal = useMemo(() => {
        if (checkoutMode === 'cart' && cartItems?.length > 0) {
            return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
        }
        return (product?.price || 0) * (directQuantity || 1);
    }, [cartItems, product, checkoutMode, directQuantity]);
    
    const totalPrice = subtotal + deliveryCost;

    const displayCurrency = useMemo(() => {
        if (checkoutMode === 'cart' && cartItems?.length > 0) return cartItems[0].currency || 'DZD';
        return product?.currency || 'DZD';
    }, [product, cartItems, checkoutMode]);
    
    if ((checkoutMode === 'direct' && !product) || (checkoutMode === 'cart' && cartItems.length === 0)) {
        return null;
    }

    return (
        <>
            <div className="min-h-screen bg-white md:bg-slate-50 md:p-6 lg:p-12">
                
                <div className="lg:hidden p-4">
                    <div className="flex items-center gap-4 max-w-6xl mx-auto">
                        <img 
                            src={getFullImageUrl(productForDisplay.imageUrls?.thumbnail)} 
                            alt={productForDisplay.name}
                            className="w-20 h-20 rounded-lg object-cover bg-slate-200"
                        />
                        <div>
                            <h2 className="font-bold text-slate-800 leading-tight">
                                {checkoutMode === 'cart' 
                                    ? t('buy_modal.summary_panel.items_in_cart', { count: cartItems.length }) 
                                    : productForDisplay.name}
                            </h2>
                            <p className="text-sm text-slate-500 mt-1">
                                {t('buy_modal.summary_panel.proceeding_to_checkout')}
                            </p>
                        </div>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-5 max-w-6xl mx-auto bg-white overflow-hidden md:rounded-3xl md:shadow-2xl md:shadow-slate-200 lg:gap-10 relative">
                    
                    <button 
                        onClick={handleClose}
                        className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors text-slate-600 hover:text-slate-800"
                        aria-label={t('buy_modal.close_button_aria_label', 'Close checkout')}
                    >
                        <X size={24} />
                    </button>

                    <div className="order-1 lg:col-span-2 bg-slate-100 p-4 sm:p-6 lg:p-10 border-b border-slate-200 lg:border-b-0 lg:border-r">
                        <Summary 
                            productForDisplay={productForDisplay}
                            checkoutMode={checkoutMode}
                            cartItems={cartItems}
                            subtotal={subtotal}
                            deliveryCost={deliveryCost}
                            totalPrice={totalPrice}
                            selectedWilaya={selectedWilaya}
                            selectedCompany={selectedCompany}
                            displayCurrency={displayCurrency}
                            directQuantity={directQuantity}
                        />
                    </div>
                    <div className="order-2 lg:col-span-3 p-4 sm:p-6 lg:p-10 lg:py-10">
                        <OrderForm 
                            currentStep={currentStep}
                            nextStep={nextStep}
                            prevStep={prevStep}
                            formRef={formRef}
                            handleSubmit={handleSubmit}
                            formData={formData}
                            handleInputChange={handleInputChange}
                            selectedWilaya={selectedWilaya}
                            handleWilayaChange={handleWilayaChange}
                            municipalities={municipalities}
                            isLoadingCosts={isLoadingCosts}
                            fetchError={fetchError}
                            activeWilayasForDropdown={activeWilayasForDropdown}
                            availableCompanies={availableCompanies}
                            selectedCompany={selectedCompany}
                            handleCompanyChange={handleCompanyChange}
                            selectedDeliveryType={selectedDeliveryType}
                            handleDeliveryTypeChange={handleDeliveryTypeChange}
                            isAddressRequired={selectedDeliveryType === 'home'}
                            checkoutMode={checkoutMode}
                            product={product}
                            selectedColor={selectedColor}
                            setSelectedColor={handleSetSelectedColor}
                            selectedSize={selectedSize}
                            setSelectedSize={handleSetSelectedSize}
                            formErrors={formErrors}
                        />
                    </div>
                </div>
                
                <div className="lg:hidden p-4 bg-white fixed bottom-0 left-0 right-0 border-t border-slate-200">
                    <div className="space-y-2">
                        <div className="flex justify-between items-center text-base text-slate-600">
                            <span>{t('buy_modal.summary_panel.subtotal')}</span>
                            <span className="font-semibold text-slate-800">{subtotal.toFixed(2)} {displayCurrency}</span>
                        </div>
                        <div className="flex justify-between items-center text-base text-slate-600">
                            <span>{t('buy_modal.summary_panel.delivery')}</span>
                            <span className="font-semibold text-slate-800">{deliveryCost > 0 ? `${deliveryCost.toFixed(2)} ${selectedCompany?.currency || displayCurrency}` : (selectedWilaya ? t('buy_modal.summary_panel.select_option_placeholder') : t('buy_modal.summary_panel.select_wilaya_placeholder'))}</span>
                        </div>
                    </div>
                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-dashed border-slate-200">
                        <span className="text-xl font-bold text-blue-500">{t('buy_modal.summary_panel.total')}</span>
                        <span className="text-xl font-bold text-blue-500">{totalPrice.toFixed(2)} {displayCurrency}</span>
                    </div>
                </div>
            </div>
            {isConfirmModalVisible && (
                <ConfirmModal
                    onClose={() => setIsConfirmModalVisible(false)}
                    onConfirm={handleConfirmOrder}
                    isSubmitting={isSubmitting}
                    isSuccess={orderSuccess}
                />
            )}
        </>
    );
};

export default BuyPage;