// backend/routes/category.routes.js
import express from 'express';
import multer from 'multer';
// Import functions from the new modular category controller directory
import { 
    createCategory, 
    getAllCategories, 
    updateCategory, 
    deleteCategory, 
    getProductsForCategory 
} from '../controllers/category/index.js';

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB file size limit
});

router.route('/')
    .post(upload.single('image'), createCategory)
    .get(getAllCategories);

router.route('/:id/products')
    .get(getProductsForCategory);

// This general route now handles both PUT (update) and DELETE requests
router.route('/:id')
    .put(upload.single('image'), updateCategory)
    .delete(deleteCategory);

export default router;