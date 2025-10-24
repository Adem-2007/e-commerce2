// src/pages/Dashboard/Categories/CategoriesProducts.jsx

import React, { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import axios from 'axios';
import { useDashboardLanguage } from '../../../context/DashboardLanguageContext';

// --- Lazily import modal components ---
const CategoryModal = lazy(() => import('./components/AddCategory/CategoryModal'));
const ConfirmationModal = lazy(() => import('../common/ConfirmationModal'));
const AddProductModal = lazy(() => import('./components/AddProduct/AddProductModal'));

// Import Child Components
import Header from './components/header/Header';
import CategoryFilter from './components/header/CategoryFilter';
import ProductTableHeader from './components/header/ProductTableHeader';
import Pagination from './components/common/Pagination';
import ProductTableSkeleton from './components/ProductTableSkeleton';

// Import API and Icons
import { CATEGORIES_API_URL, PRODUCTS_API_URL, API_BASE_URL } from '../../../api/api';
import { AlertTriangle, RefreshCw, Package, Edit, Trash2 } from 'lucide-react';

const ModalLoader = () => null; // Simple loader for suspense
const PRODUCTS_PER_PAGE = 15;

/**
 * --- NEW HELPER FUNCTION ---
 * Determines the correct image source.
 * - If the path is a Base64 Data URI, it returns it directly.
 * - If it's a regular path, it prepends the API base URL.
 * - If there's no path, it returns a placeholder.
 */
const getProductImageUrl = (imagePath) => {
    if (!imagePath) return '/placeholder-image.png';

    if (imagePath.startsWith('data:')) {
        return imagePath; // It's a Base64 string, use it as is.
    }

    // It's a file path, build the full URL.
    return `${API_BASE_URL}${imagePath}`;
};


const CategoriesProducts = () => {
    const { t } = useDashboardLanguage();
    
    // --- STATE MANAGEMENT ---
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [categoryToEdit, setCategoryToEdit] = useState(null);
    const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
    const [productToEdit, setProductToEdit] = useState(null);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('all');
    
    // --- NEW: State for server-side pagination ---
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    // --- REFACTORED: Data fetching for server-side pagination ---
    const fetchCategories = useCallback(async () => {
        try {
            const categoriesResponse = await axios.get(CATEGORIES_API_URL);
            setCategories(categoriesResponse.data);
        } catch (err) {
            setError(err.response?.data?.message || t('collections.error_failed_to_connect'));
        }
    }, [t]);

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams({
                page: currentPage,
                limit: PRODUCTS_PER_PAGE,
            });

            if (selectedCategory !== 'all') {
                params.append('categoryId', selectedCategory);
            }
            
            const productsResponse = await axios.get(`${PRODUCTS_API_URL}?${params.toString()}`);
            
            setProducts(productsResponse.data.products);
            setTotalPages(productsResponse.data.totalPages);

        } catch (err) {
            setError(err.response?.data?.message || t('collections.error_failed_to_connect'));
        } finally {
            setLoading(false);
        }
    }, [t, currentPage, selectedCategory]);

    // Fetch categories once on mount, and products whenever the filters/page change
    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);


    // --- EVENT HANDLERS & OTHER LOGIC (mostly unchanged) ---
    const handleCategoryFilterChange = (categoryId) => {
        setSelectedCategory(categoryId);
        setCurrentPage(1); // Reset to page 1 when category changes
    };

    const handleDeleteRequest = (item, type) => {
        setItemToDelete({ item, type });
        setIsConfirmModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!itemToDelete) return;
        setIsDeleting(true);
        setError(null);
        const { item, type } = itemToDelete;
        try {
            if (type === 'category') {
                await axios.delete(`${CATEGORIES_API_URL}/${item._id}`);
                await fetchCategories(); // Just refetch categories
            } else if (type === 'product') {
                await axios.delete(`${PRODUCTS_API_URL}/${item._id}`);
                await fetchProducts(); // Refetch current page of products
            }
        } catch (err) {
            setError(err.response?.data?.message || `Could not delete ${type}`);
        } finally {
            setIsDeleting(false);
            setIsConfirmModalOpen(false);
            setItemToDelete(null);
        }
    };

    const handleCategorySaved = () => { fetchCategories(); };
    const handleSaveProduct = async (formData, productId) => {
        try {
            if (productId) {
                await axios.put(`${PRODUCTS_API_URL}/${productId}`, formData);
            } else {
                await axios.post(PRODUCTS_API_URL, formData);
            }
            await fetchProducts(); // Refetch products
            setIsAddProductModalOpen(false);
            setProductToEdit(null);
        } catch (error) {
            const errorMessage = error.response?.data?.message || t('collections.error_could_not_save_product');
            setError(errorMessage);
            throw new Error(errorMessage);
        }
    };

    const handleAddCategoryRequest = () => { setCategoryToEdit(null); setIsCategoryModalOpen(true); };
    const handleEditCategoryRequest = (categoryId) => { const category = categories.find(c => c._id === categoryId); if (category) { setCategoryToEdit(category); setIsCategoryModalOpen(true); } };
    const handleCloseCategoryModal = () => { setIsCategoryModalOpen(false); setCategoryToEdit(null); };
    const handleAddProductRequest = () => { setProductToEdit(null); setIsAddProductModalOpen(true); };
    const handleEditProductRequest = async (product) => { try { const response = await axios.get(`${PRODUCTS_API_URL}/${product._id}`); setProductToEdit(response.data); setIsAddProductModalOpen(true); } catch (err) { setError(err.response?.data?.message || 'Failed to load product details for editing.'); } };

    // --- REMOVED: All client-side filtering and slicing logic. The server now handles this. ---

    const renderProductList = () => {
        if (loading) return <ProductTableSkeleton />;
        if (error && products.length === 0) return ( <div className="text-center p-10 bg-red-50 rounded-lg"> <AlertTriangle className="mx-auto text-red-500" size={40} /> <p className="mt-4 font-semibold text-red-700">{error}</p> <button onClick={fetchProducts} className="mt-4 px-4 py-2 text-sm font-semibold text-blue-600 bg-blue-100 rounded-full hover:bg-blue-200 transition-colors flex items-center gap-2 mx-auto"> <RefreshCw size={16} /> {t('retry')} </button> </div> );
        
        return (
            <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                <ProductTableHeader />
                {products.length > 0 ? ( // Use 'products' directly
                    <>
                        <ul className="divide-y divide-gray-200">
                            {products.map(product => { // Use 'products' directly
                                
                                // --- THIS IS THE FIX ---
                                // Use the new helper function to get the correct image source.
                                const imageUrl = getProductImageUrl(product.imageUrls?.thumbnail);

                                return (
                                    <li key={product._id} className="grid grid-cols-12 gap-4 items-center px-3 py-2 transition-colors duration-200 odd:bg-white even:bg-slate-50 hover:bg-blue-50">
                                        <div className="col-span-4 flex items-center gap-4 min-w-0">
                                            <img src={imageUrl} alt={product.name} className="w-12 h-12 object-cover rounded-md bg-gray-100 flex-shrink-0"/>
                                            <p className="font-semibold text-gray-900 truncate">{product.name}</p>
                                        </div>
                                        <div className="col-span-2 text-gray-600">{product.category?.name || 'Uncategorized'}</div>
                                        <div className="col-span-2 text-gray-700">{product.price} {product.currency}</div>
                                        <div className="col-span-1 text-gray-500 text-center">N/A</div>
                                        <div className="col-span-1 text-gray-500 text-center">{product.views || 0}</div>
                                        <div className="col-span-2 flex items-center justify-end gap-1 pr-2">
                                            <button onClick={() => handleEditProductRequest(product)} className="p-2 text-yellow-600 hover:bg-yellow-100 rounded-full transition-colors" aria-label="Edit Product"><Edit size={18} /></button>
                                            <button onClick={() => handleDeleteRequest(product, 'product')} className="p-2 text-red-600 hover:bg-red-100 rounded-full transition-colors" aria-label="Delete Product"><Trash2 size={18} /></button>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                    </>
                ) : (
                    <div className="p-10 text-center text-gray-500">
                        <Package size={32} className="mx-auto text-slate-400" />
                        <p className="mt-2 font-semibold">No products found.</p>
                        <p className="text-sm">There are no products in this category.</p>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div>
            <Suspense fallback={<ModalLoader />}>
                {isCategoryModalOpen && ( <CategoryModal isOpen={isCategoryModalOpen} onClose={handleCloseCategoryModal} onSave={handleCategorySaved} categoryToEdit={categoryToEdit} /> )}
                {isAddProductModalOpen && ( <AddProductModal isOpen={isAddProductModalOpen} onClose={() => { setIsAddProductModalOpen(false); setProductToEdit(null); }} onSave={handleSaveProduct} categories={categories} productToEdit={productToEdit} /> )}
                {isConfirmModalOpen && ( <ConfirmationModal isOpen={isConfirmModalOpen} onClose={() => setIsConfirmModalOpen(false)} onConfirm={confirmDelete} title={t('collections.delete_item_title', { context: itemToDelete?.type ?? 'item' })} message={t('collections.delete_item_message', { context: itemToDelete?.type ?? 'item' })} confirmText={t('collections.delete_confirm_text')} isLoading={isDeleting} /> )}
            </Suspense>

            <header className="mb-8">
                <Header t={t} onAddProduct={handleAddProductRequest} onAddCategory={handleAddCategoryRequest} />
                <CategoryFilter categories={categories} selectedCategory={selectedCategory} onFilterChange={handleCategoryFilterChange} onEditCategory={handleEditCategoryRequest} onDeleteCategory={(item) => handleDeleteRequest(item, 'category')} />
            </header>

            <main>
                {error && products.length > 0 && <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50" role="alert">{error}</div>}
                {renderProductList()}
            </main>
        </div>
    );
};

export default CategoriesProducts;