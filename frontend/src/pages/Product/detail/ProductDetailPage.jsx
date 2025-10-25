// src/pages/Product/detail/ProductDetailPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ChevronLeft } from 'lucide-react';
import { useCart } from '../../../context/CartContext';
import { useProductCache } from '../../../context/ProductCacheContext';
import { useLanguage } from '../../../context/LanguageContext';

import ProductDetailSkeleton from './components/information/ProductDetailSkeleton';
import RelatedProducts from './components/common/RelatedProducts';
import ProductMediaGallery from './components/image/ProductMediaGallery';
import ProductHeader from './components/information/ProductHeader';
import ProductAttributes from './components/information/ProductAttributes';
import ProductOptions from './components/information/ProductOptions';
import ProductActions from './components/information/ProductActions';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const fadeInAnimation = `@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`;

const ProductDetailPage = () => {
    const { productId } = useParams();
    const { addToCart } = useCart();
    const { updateProductInCache, setLastUpdatedProductId } = useProductCache(); // Get the new function
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
            setHasRated(fetchedProduct.userHasRated || false);

            if (fetchedProduct.colors?.length > 0) setSelectedColor(fetchedProduct.colors[0]);
            if (fetchedProduct.sizes?.length > 0) setSelectedSize(fetchedProduct.sizes[0]);
        } catch (err) {
            setError(t('error_product_not_found'));
            console.error("Failed to fetch product:", err);
        } finally {
            setLoading(false);
        }
    }, [productId, t]);

    useEffect(() => {
        fetchProduct();
    }, [fetchProduct]);

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
            const updatedProduct = response.data.product;
            
            setProduct(updatedProduct);
            updateProductInCache(productId, updatedProduct);
            setLastUpdatedProductId(productId); // New: Set this product as the last one updated
            setHasRated(true);
        } catch (err) {
            if (err.response && err.response.status === 403) {
                setHasRated(true);
            } else {
                console.error("Failed to submit rating:", err);
            }
        }
    }, [productId, updateProductInCache, setLastUpdatedProductId]);

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
    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                <h2 className="text-2xl font-semibold text-red-600 mb-4">{t('an_error_occurred')}</h2>
                <p className="text-gray-600">{error}</p>
                <Link to="/shop" className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    {t('back_to_collection')}
                </Link>
            </div>
        );
    }
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
                    <div
                        className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 bg-white p-4 sm:p-8 rounded-2xl shadow-lg border border-gray-200"
                        style={{ animation: `fadeIn 0.5s ease-out forwards` }}
                    >
                        <ProductMediaGallery product={product} />
                        <div className="flex flex-col gap-4 min-w-0">
                            <ProductHeader product={product} onSubmitRating={handleSubmitRating} hasRated={hasRated} />
                            <ProductAttributes product={product} />
                            <ProductOptions colors={product.colors} sizes={product.sizes} selectedColor={selectedColor} selectedSize={selectedSize} onColorSelect={setSelectedColor} onSizeSelect={setSelectedSize} />
                            <ProductActions quantity={quantity} onQuantityChange={setQuantity} onAddToCart={handleAddToCart} onBuyNow={handleBuyNow} isAdded={isAdded} price={product.price} originalPrice={product.originalPrice} currency={product.currency} />
                        </div>
                    </div>
                </div>
                <RelatedProducts products={relatedProducts} isLoading={isRelatedLoading} />
            </div>
        </>
    );
};

export default ProductDetailPage;