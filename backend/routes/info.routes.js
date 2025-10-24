// backend/routes/info.routes.js
import express from 'express';
// --- UPDATED: Import from the new modular directory ---
import { getOrCreateInfo, updateInfo } from '../controllers/info/index.js';

const router = express.Router();

// GET route for fetching info
router.get('/', getOrCreateInfo);

// PUT route for updating info
// Note: You might want to add admin protection middleware here in the future
router.put('/', updateInfo);

export default router;