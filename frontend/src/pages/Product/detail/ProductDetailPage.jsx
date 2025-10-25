// src/pages/Product/ProductDetailPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AlertTriangle, ChevronLeft } from 'lucide-react';
import { useCart } from '../../../context/CartContext';
import { useLanguage } from '../../../context/LanguageContext';

import ProductDetailSkeleton from './components/information/ProductDetailSkeleton';
import RelatedProducts from './components/common/RelatedProducts';
import ProductMediaGallery from './components/image/ProductMediaGallery'; // <-- REVERTED: Use the correct gallery component
import ProductHeader from './components/information/ProductHeader';
import ProductAttributes from './components/information/ProductAttributes';
import ProductOptions from './components/information/ProductOptions';
import ProductActions from './components/information/ProductActions';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const fadeInAnimation = `@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`;

const ProductDetailPage = () => {
    const { productId } = useParams();
    const { addToCart } = useCart();
    const { language, t } = useLanguage();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [isRelatedLoading, setIsRelatedLoading] = useState(true);
    
    const [selectedColor, setSelectedColor] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [isAdded, setIsAdded] = useState(false);
    const [hasRated, setHasRated] = useState(false);

    const fetchProduct = useCallback(async () => {
        window.scrollTo(0, 0);
        setLoading(true);
        setError(null);
        try {
            await axios.post(`${API_BASE_URL}/api/products/${productId}/view`);
            const response = await axios.get(`${API_BASE_URL}/api/products/${productId}`);
            const fetchedProduct = response.data;
            setProduct(fetchedProduct);

            if (fetchedProduct.colors?.length > 0) setSelectedColor(fetchedProduct.colors[0]);
            if (fetchedProduct.sizes?.length > 0) setSelectedSize(fetchedProduct.sizes[0]);
        } catch (err) {
            setError(t('error_product_not_found'));
            console.error("Failed to fetch product:", err);
        } finally {
            setLoading(false);
        }
    }, [productId, t]);

    useEffect(() => { fetchProduct(); }, [fetchProduct]);

    useEffect(() => {
        const fetchRelatedProducts = async () => {
            if (!product?._id) return;
            setIsRelatedLoading(true);
            try {
                const params = { categoryId: product.category._id, limit: 4, excludeId: product._id };
                const response = await axios.get(`${API_BASE_URL}/api/products`, { params });
                if (response.data?.products) {
                    setRelatedProducts(response.data.products.filter(p => p._id !== product._id));
                }
            } catch (err) {
                console.error("Failed to fetch related products:", err);
            } finally {
                setIsRelatedLoading(false);
            }
        };
        fetchRelatedProducts();
    }, [product]);

    const handleSubmitRating = useCallback(async (rating) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/api/products/${productId}/rate`, { rating });
            setProduct(response.data.product);
            setHasRated(true);
        } catch (err) {
            if (err.response && err.response.status === 403) {
                setHasRated(true);
            } else {
                console.error("Failed to submit rating:", err);
            }
        }
    }, [productId]);

    const handleAddToCart = () => {
        if (!product || isAdded) return;
        addToCart(product, quantity, selectedColor, selectedSize);
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
    };

    const handleBuyNow = () => {
        if (!product) return;
        navigate('/buy', {
            state: { product, quantity, selectedColor, selectedSize, checkoutMode: 'direct' }
        });
    };

    if (loading) return <ProductDetailSkeleton />;

    if (error) { /* ... Error UI ... */ }
    
    if (!product) return null;

    return (
        <>
            <style>{fadeInAnimation}</style>
            <div className="bg-gray-50 pb-16 font-sans" dir={language === 'ar' ? 'rtl' : 'ltr'}>
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-10">
                    <Link to="/shop" className="inline-flex items-center gap-2 mb-6 text-gray-600 font-medium transition-colors hover:text-blue-600">
                        <ChevronLeft size={20} className={language === 'ar' ? 'rotate-180' : ''} />
                        <span>{t('back_to_collection')}</span>
                    </Link>
                    <div className="grid grid-cols-1 lg:grid-cols-[100px_1fr] xl:grid-cols-[100px_1fr_1.1fr] gap-8 bg-white p-4 sm:p-8 rounded-2xl shadow-lg border border-gray-200" style={{ animation: `fadeIn 0.5s ease-out forwards` }}>
                        
                        {/* --- REVERTED: This is the key to fixing the layout --- */}
                        <ProductMediaGallery product={product} />

                        <div className="order-3 lg:col-span-2 xl:col-span-1 p-2 sm:p-4 flex flex-col gap-5 min-w-0">
                            <ProductHeader 
                                product={product}
                                onSubmitRating={handleSubmitRating}
                                hasRated={hasRated}
                            />
                            <ProductAttributes product={product} />
                            <ProductOptions 
                                colors={product.colors}
                                sizes={product.sizes}
                                selectedColor={selectedColor}
                                selectedSize={selectedSize}
                                onColorSelect={setSelectedColor}
                                onSizeSelect={setSelectedSize}
                            />
                            <ProductActions 
                                quantity={quantity}
                                onQuantityChange={setQuantity}
                                onAddToCart={handleAddToCart}
                                onBuyNow={handleBuyNow}
                                isAdded={isAdded}
                                price={product.price}
                                originalPrice={product.originalPrice}
                                currency={product.currency}
                            />
                        </div>
                    </div>
                </div>
                <RelatedProducts products={relatedProducts} isLoading={isRelatedLoading} />
            </div>
        </>
    );
};

export default ProductDetailPage;