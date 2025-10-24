// src/pages/product/main/ProductPage.jsx

import React, { useState, useEffect, useCallback, Suspense, lazy, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// --- CONTEXT & COMPONENT IMPORTS ---
import { useLanguage } from '../../../context/LanguageContext';
import ProductGrid from './components/Grid/ProductGrid';
import ProductCardSkeleton from '../../Product/Card/ProductCardSkeleton';
import Pagination from './components/Pagination/Pagination';

// --- LAZY IMPORT ---
const ProductFilterSidebar = lazy(() => import('./components/Sidebar/ProductFilterSidebar'));

// --- ICON IMPORTS ---
import { AlertTriangle } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const PRODUCTS_PER_PAGE = 9;

const SidebarSkeleton = () => (
    <div className="hidden lg:block w-full max-w-xs lg:max-w-sm">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200/80 p-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded-md w-1/3 mb-8"></div>
            <div className="space-y-6">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="space-y-3">
                        <div className="h-4 bg-gray-200 rounded-md w-1/2"></div>
                        <div className="flex flex-wrap gap-2">
                            <div className="h-8 bg-gray-200 rounded-full w-1/4"></div>
                            <div className="h-8 bg-gray-200 rounded-full w-1/3"></div>
                            <div className="h-8 bg-gray-200 rounded-full w-1/4"></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

const ProductPage = () => {
    const { language, t } = useLanguage();
    const navigate = useNavigate();

    // --- STATE MANAGEMENT ---
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [initialFilterOptions, setInitialFilterOptions] = useState({ colors: [], sizes: [], materials: [], priceRange: { maxPrice: 1000 } });
    
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [filters, setFilters] = useState({});
    const [debouncedFilters, setDebouncedFilters] = useState({});
    
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    
    // --- FIX: Use a ref to robustly track if the component has mounted ---
    // This will prevent the update effect from running on the initial render.
    const isMounted = useRef(false);

    // Effect 1: Fetches ALL essential data in parallel on initial component mount.
    // This runs only ONCE.
    useEffect(() => {
        const fetchInitialData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // Run all initial requests in parallel to avoid a request waterfall
                const [categoriesRes, filtersRes, productsRes] = await Promise.all([
                    axios.get(`${API_BASE_URL}/api/categories`),
                    axios.get(`${API_BASE_URL}/api/products/filters`),
                    axios.get(`${API_BASE_URL}/api/products?page=1&limit=${PRODUCTS_PER_PAGE}`)
                ]);
                
                setCategories(categoriesRes.data);
                setInitialFilterOptions(filtersRes.data);
                setProducts(productsRes.data.products);
                setTotalPages(productsRes.data.totalPages);
                
            } catch (err) {
                console.error("Failed to fetch initial page data:", err);
                setError(t('error_load_essentials'));
            } finally {
                setIsLoading(false);
            }
        };

        fetchInitialData();
    }, [t]);

    // Effect 2: Debounces filter changes to prevent excessive API calls.
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedFilters(filters);
            setCurrentPage(1); // Reset to page 1 when filters change
        }, 500);
        return () => clearTimeout(timer);
    }, [filters]);

    // Effect 3: Fetches products when filters or page number change, but SKIPS the initial render.
    useEffect(() => {
        // If the component has not mounted yet, set the ref to true and exit.
        // This ensures this effect block is skipped on the very first render.
        if (!isMounted.current) {
            isMounted.current = true;
            return;
        }

        const fetchFilteredProducts = async () => {
            setIsLoading(true);
            setError(null);
            window.scrollTo(0, 0); // Scroll to top for better UX on page/filter change

            try {
                const params = new URLSearchParams({
                    ...debouncedFilters,
                    page: currentPage,
                    limit: PRODUCTS_PER_PAGE
                });
                
                const response = await axios.get(`${API_BASE_URL}/api/products?${params.toString()}`);
                setProducts(response.data.products);
                setTotalPages(response.data.totalPages);

            } catch (err) {
                console.error("Failed to fetch filtered products:", err);
                setError(t('error_load_products'));
                setProducts([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchFilteredProducts();

    }, [debouncedFilters, currentPage, t]); // Dependencies that trigger updates

    const handleFilterChange = useCallback((newFilters) => {
        setFilters(newFilters);
    }, []);
    
    const handleBuyNow = (product) => navigate('/buy', { state: { product, checkoutMode: 'direct' } });
    const handleFavorite = (product) => console.log("Favorite clicked for:", product.name);
    
    const handlePageChange = (page) => {
        if (page !== currentPage) {
            setCurrentPage(page);
        }
    };

    const renderContent = () => {
        // Show skeletons only on the very first load
        if (isLoading && products.length === 0) {
            return (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {Array.from({ length: PRODUCTS_PER_PAGE }).map((_, index) => (
                        <ProductCardSkeleton key={index} />
                    ))}
                </div>
            );
        }

        if (error && products.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center p-24 rounded-2xl bg-white shadow-sm h-full">
                    <AlertTriangle className="text-red-500" size={48} />
                    <p className="mt-6 text-xl font-semibold text-slate-700">{error}</p>
                </div>
            );
        }
        
        const emptyMessage = (Object.keys(debouncedFilters).length > 0)
            ? t('empty_products_filtered_message')
            : t('empty_products_message');

        return (
            <ProductGrid 
                products={products}
                onBuyNow={handleBuyNow} 
                onFavorite={handleFavorite}
                emptyMessage={emptyMessage}
            />
        );
    };

    return (
        <div className="w-full min-h-screen bg-slate-50 px-4 sm:px-8 py-16" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            <header className="text-center mb-16 max-w-3xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 leading-tight mb-4">
                    {t('explore_collection_title')}
                </h1>
                <p className="text-lg text-slate-500 max-w-xl mx-auto">
                    {t('explore_collection_subtitle')}
                </p>
            </header>

            <div className="max-w-screen-2xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-4 lg:gap-8">
                    <aside className="lg:col-span-1 sticky top-24 h-fit mb-8 lg:mb-0 relative z-20">
                         <Suspense fallback={<SidebarSkeleton />}>
                             <ProductFilterSidebar 
                                categories={categories}
                                availableFilters={{
                                    colors: initialFilterOptions.colors,
                                    sizes: initialFilterOptions.sizes,
                                    materials: initialFilterOptions.materials,
                                    maxPrice: initialFilterOptions.priceRange.maxPrice
                                }}
                                onFilterChange={handleFilterChange}
                            />
                         </Suspense>
                    </aside>
                    
                    <main className="lg:col-span-3 min-h-[500px] relative z-10">
                        {renderContent()}
                        
                        {!isLoading && !error && products.length > 0 && (
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                            />
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default ProductPage;