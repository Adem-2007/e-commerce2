// backend/routes/product.routes.js

import express from 'express';
import multer from 'multer';
import apicache from 'apicache'; // --- IMPLEMENTATION: Import apicache ---
import { 
    createProduct, 
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    getProductFilters,
    incrementProductView,
    rateProduct 
} from '../controllers/product/index.js';

const router = express.Router();

// --- IMPLEMENTATION: Initialize apicache ---
const cache = apicache.middleware;
const cacheSuccesses = cache('5 minutes'); // Cache successful responses for 5 minutes

const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 }
});

const uploadFields = upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'secondaryMedia', maxCount: 15 },
    { name: 'video', maxCount: 1 }
]);

// --- IMPLEMENTATION: Apply cache middleware to read-only routes ---
router.get('/filters', cacheSuccesses, getProductFilters);

router.route('/')
    .post(uploadFields, createProduct)
    .get(cacheSuccesses, getAllProducts); // Apply cache here

router.route('/:id')
    .get(getProductById) // No cache here, as a single product view might need to be fresh
    .put(uploadFields, updateProduct)
    .delete(deleteProduct);

router.route('/:id/view').post(incrementProductView);
router.post('/:id/rate', rateProduct);
export default router;