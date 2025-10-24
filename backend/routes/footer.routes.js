// backend/routes/footer.routes.js

import express from 'express';
// --- UPDATED: Import from the new modular directory ---
import { getFooter, updateFooter } from '../controllers/footer/index.js';
import { protectAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

// @route   GET /api/footer
// @desc    Get footer data
// @access  Public
router.get('/', getFooter);

// @route   PUT /api/footer
// @desc    Update footer data
// @access  Private/Admin
router.put('/', protectAdmin, updateFooter);

export default router;