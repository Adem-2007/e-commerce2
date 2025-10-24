// backend/routes/hero.routes.js
import express from 'express';
import multer from 'multer';
// --- UPDATED: Import from the new modular directory ---
import { getSlides, createSlide, updateSlide, deleteSlide } from '../controllers/hero/index.js';

const router = express.Router();

// Use multer for memory storage. The controller will handle the file buffer.
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get('/', getSlides);
router.post('/', upload.single('image'), createSlide); // 'image' is the field name from the form
router.put('/:id', upload.single('image'), updateSlide);
router.delete('/:id', deleteSlide);

export default router;