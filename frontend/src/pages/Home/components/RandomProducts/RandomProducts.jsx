// src/pages/Home/components/RandomProducts/RandomProducts.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AlertTriangle } from 'lucide-react';
import { useLanguage } from '../../../../context/LanguageContext';

import SkeletonLoader from './components/SkeletonLoader';
import ProductSlider from './components/ProductSlider';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const RandomProducts = () => {
    const { language, t } = useLanguage();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // Fetch 16 products for the new layout
                const { data } = await axios.get(`${API_BASE_URL}/api/products?limit=16`);
                
                if (data && data.products && data.products.length > 0) {
                    setProducts(data.products);
                } else { 
                    setError(t('error_no_items')); 
                }
            } catch (err) { 
                setError(t('error_unavailable'));
            } finally { 
                setLoading(false); 
            }
        };
        fetchProducts();
    }, [t]);

    if (loading) return <SkeletonLoader />;
    if (error || products.length === 0) return (
        <div className="min-h-[50vh] flex justify-center items-center gap-4 text-gray-600 bg-gray-50">
            <AlertTriangle className="text-orange-500" size={40} />
            <p>{error || t('error_empty')}</p>
        </div>
    );

    // Split the products into two rows of 8
    const firstRowProducts = products.slice(0, 8);
    const secondRowProducts = products.slice(8, 16);

    return (
        <section className="bg-gray-50 py-7  px-4 overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-14">
                    <h2 className="text-[2.75rem] font-bold text-gray-800 tracking-tight">{t('showcase_title')}</h2>
                    <p className="text-lg text-gray-500 mt-2">{t('showcase_subtitle')}</p>
                </div>

                {/* Render two separate sliders */}
                <div className="space-y-8">
                    {firstRowProducts.length > 0 && <ProductSlider products={firstRowProducts} />}
                    {secondRowProducts.length > 0 && <ProductSlider products={secondRowProducts} />}
                </div>
            </div>
        </section>
    );
};

export default RandomProducts;