// backend/routes/logo.routes.js
import express from 'express';
// --- UPDATED: Import controllers and middleware from their new locations ---
import { getLogo, updateLogo } from '../controllers/logo/index.js';
import { logoUploadMiddleware, processLogoImage } from '../controllers/logo/middleware/index.js';
import { protect, adminAndPager } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public route to get the logo
router.get('/', getLogo);


router.put('/', protect, logoUploadMiddleware, processLogoImage, updateLogo);

export default router;