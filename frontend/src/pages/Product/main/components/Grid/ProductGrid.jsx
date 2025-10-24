// src/pages/product/main/components/Grid/ProductGrid.jsx

import React from 'react';
import { motion } from 'framer-motion';
import ProductCard from '../../../Card/ProductCard';

// Framer Motion animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: "easeOut",
        },
    },
};

const ProductGrid = ({ products, onBuyNow, onFavorite, emptyMessage }) => {
    if (!products || products.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center text-center p-12 sm:p-24 rounded-2xl bg-white shadow-sm h-full">
                <p className="text-xl font-semibold text-slate-600">{emptyMessage}</p>
            </div>
        );
    }

    return (
        <motion.div
            // --- THIS IS THE MODIFIED LINE ---
            className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 md:gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {products.map((product) => (
                <motion.div key={product._id} variants={itemVariants}>
                    <ProductCard
                        product={product}
                        onBuyNow={() => onBuyNow(product)}
                        onFavorite={() => onFavorite(product)}
                    />
                </motion.div>
            ))}
        </motion.div>
    );
};

export default ProductGrid;