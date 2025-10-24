// src/pages/product/main/components/Grid/ProductGrid.jsx

import React from 'react';
import ProductCard from '../../../Card/ProductCard';

const ProductGrid = ({ products, onBuyNow, onFavorite, emptyMessage }) => {
    if (!products || products.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center text-center p-12 sm:p-24 rounded-2xl bg-white shadow-sm h-full">
                <p className="text-xl font-semibold text-slate-600">{emptyMessage}</p>
            </div>
        );
    }

    return (
        <div
            className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 md:gap-6"
        >
            {products.map((product) => (
                <div key={product._id}>
                    <ProductCard
                        product={product}
                        onBuyNow={() => onBuyNow(product)}
                        onFavorite={() => onFavorite(product)}
                    />
                </div>
            ))}
        </div>
    );
};

export default ProductGrid;