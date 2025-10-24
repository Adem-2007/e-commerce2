// src/common/Navbar/navbar_components/MonolithSearch.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, Search, ArrowRight, Loader } from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const getImageUrl = (url) => {
    if (!url) return '';
    return url.startsWith('data:') ? url : `${API_BASE_URL}${url}`;
};

const MonolithSearch = ({ onClose }) => {
    const { t } = useLanguage();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const response = await fetch(`${API_BASE_URL}/api/products`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                
                // --- FIX: Access the 'products' array from the paginated response ---
                if (data && Array.isArray(data.products)) {
                    setAllProducts(data.products);
                    setResults(data.products.slice(0, 5)); 
                } else {
                    throw new Error("Invalid data structure from API");
                }

            } catch (err) {
                setError(t('search_modal.error_message'));
                console.error("Search fetch error:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, [t]);

    useEffect(() => {
        if (query.trim() === '') {
            setResults(allProducts.slice(0, 5));
            return;
        }
        
        const filteredResults = allProducts.filter(product => 
            product.name.toLowerCase().includes(query.toLowerCase())
        );
        setResults(filteredResults);

    }, [query, allProducts]);

    const renderResultsContent = () => {
        if (isLoading) {
            return (
                <div className="flex items-center justify-center h-full pt-10">
                    <Loader size={32} className="animate-spin text-blue-600" />
                </div>
            );
        }

        if (error) {
            return <p className="p-4 text-red-500">{error}</p>;
        }

        const isFeatured = query.trim() === '' && results.length > 0;

        if (results.length > 0) {
            return (
                <>
                    {isFeatured && <h3 className="px-3 pt-2 pb-1 text-sm font-semibold text-gray-500">{t('search_modal.featured_title')}</h3>}
                    {results.map((result) => (
                        <div key={result._id}>
                          <Link 
                            to={`/product/${result._id}`}
                            onClick={onClose}
                            className="group flex items-center gap-4 rounded-xl p-3 border border-transparent transition-all duration-300 ease-in-out hover:translate-y-[-4px] hover:bg-white hover:shadow-2xl hover:shadow-blue-500/10 hover:border-blue-500/10"
                          >
                              {/* --- FIX: Access the correct image property: imageUrls.thumbnail --- */}
                              <img src={getImageUrl(result.imageUrls?.thumbnail)} alt={result.name} className="h-14 w-14 shrink-0 rounded-lg border border-gray-200 object-cover bg-slate-200" />
                              <div className="flex-grow min-w-0">
                                  <p className="font-semibold text-slate-800 truncate">{result.name}</p>
                                  <p className="text-sm text-gray-500">{result.category?.name || t('search_modal.uncategorized')}</p>
                              </div>
                              <div className="ml-auto flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-400 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:scale-110 group-hover:bg-blue-600/10 group-hover:text-blue-600">
                                  <ArrowRight size={20} />
                              </div>
                          </Link>
                        </div>
                    ))}
                </>
            );
        }

        if (query) {
            return <p className="p-4 text-gray-500">{t('search_modal.no_results').replace('{query}', query)}</p>;
        }
        
        return null;
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-gray-50/50 backdrop-blur-xl" onClick={onClose} />
            
            <div className="relative flex flex-col w-full max-w-2xl h-[600px] max-h-[90vh] overflow-hidden bg-white border border-blue-500/10 rounded-2xl shadow-2xl shadow-blue-500/10">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-20 flex h-12 w-12 items-center justify-center rounded-full border border-blue-500/10 bg-gray-50 text-gray-500 transition-colors duration-300 hover:border-blue-600 hover:text-blue-600"
                >
                    <X size={24} />
                </button>
                
                <div className="relative border-b border-blue-500/10 px-6 sm:px-8 py-4">
                    <Search className="pointer-events-none absolute left-6 sm:left-8 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
                    <input
                        type="text"
                        placeholder={t('search_modal.placeholder')}
                        className="w-full bg-transparent text-xl sm:text-2xl font-medium text-gray-800 placeholder-gray-400/80 outline-none caret-blue-600 transition-all duration-300 pl-12 focus:pl-14 pr-4 py-2"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        autoFocus
                    />
                </div>

                <div className="h-full overflow-y-auto px-4 sm:px-6 pb-8 pt-4">
                    <div className="flex flex-col gap-2">
                        {renderResultsContent()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MonolithSearch;