// backend/routes/product.routes.js

import express from 'express';
import multer from 'multer';
import { 
    createProduct, 
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    getProductFilters,
    incrementProductView
} from '../controllers/product/index.js';

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 } // Increased limit for video
});

const uploadFields = upload.fields([
    { name: 'image', maxCount: 1 },
    // --- THE FIX: Increased the maximum count for secondary media to 15 ---
    { name: 'secondaryMedia', maxCount: 15 },
    { name: 'video', maxCount: 1 }
]);

router.get('/filters', getProductFilters);

router.route('/')
    .post(uploadFields, createProduct)
    .get(getAllProducts);

router.route('/:id')
    .get(getProductById) 
    .put(uploadFields, updateProduct)
    .delete(deleteProduct);

// --- NEW: Route to increment the view count for a product ---
router.route('/:id/view').post(incrementProductView);

export default router;