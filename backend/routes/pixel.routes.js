// backend/routes/pixel.routes.js

import express from 'express';
// --- UPDATED: Import from the new modular directory ---
import {
    createPixel,
    getPixels,
    updatePixel,
    deletePixel,
} from '../controllers/pixel/index.js';

// Later, you can add authentication middleware here to protect these routes.
// import { protect, admin } from '../middleware/auth.middleware.js';

const router = express.Router();

// Route: /api/pixels
// You would add middleware like: .post(protect, admin, createPixel)
router.route('/')
    .post(createPixel)
    .get(getPixels);

// Route: /api/pixels/:id
router.route('/:id')
    .put(updatePixel)
    .delete(deletePixel);

export default router;