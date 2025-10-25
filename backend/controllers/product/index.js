// backend/controllers/product/index.js

import { createProduct } from './functions/createProduct.js';
import { deleteProduct } from './functions/deleteProduct.js';
import { getAllProducts } from './functions/getAllProducts.js';
import { getProductById } from './functions/getProductById.js';
import { getProductFilters } from './functions/getProductFilters.js';
import { updateProduct } from './functions/updateProduct.js';
import { incrementProductView } from './functions/incrementProductView.js';
import { rateProduct } from './functions/rateProduct.js'; // <-- IMPORT aDDED

export {
    createProduct,
    deleteProduct,
    getAllProducts,
    getProductById,
    getProductFilters,
    updateProduct,
    incrementProductView,
    rateProduct // <-- EXPORT ADDED
};