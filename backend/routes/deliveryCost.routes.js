// backend/routes/deliveryCost.routes.js
import express from 'express';
import multer from 'multer';
import { 
    getCosts, 
    updateCosts, 
    uploadLogo, 
    deleteLogo 
} from '../controllers/deliveryCost/index.js'; // <-- UPDATED IMPORT PATH

const router = express.Router();

// --- Multer Configuration for Memory Storage ---
const upload = multer({ storage: multer.memoryStorage() });
// --- End Multer Configuration ---


// Public route to GET the costs
router.route('/').get(getCosts);

// Protected route for ADMINS to POST (update) the costs with JSON data.
// Note: You may want to add your admin protection middleware here.
router.route('/').post(updateCosts);

// --- Route for handling single logo image uploads ---
// The 'logo' string must match the FormData key from the frontend
router.post('/upload-logo', upload.single('logo'), uploadLogo);

// --- Route for deleting a logo image (based on original logic) ---
router.delete('/delete-logo', deleteLogo);


export default router;