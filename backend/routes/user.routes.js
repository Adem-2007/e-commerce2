// backend/routes/user.routes.js

import express from 'express';
import { 
    registerAdmin, 
    loginAdmin, 
    checkUserExists, 
    createUser, 
    getUsers,
    updateUser, 
    deleteUser, 
    checkUserStatus, 
    forgotPassword,
    verifyAndResetPassword,
    updateUserProfile, 
    updateUserPermissions,
    getUserProfile 
} from '../controllers/user/index.js'; // <-- UPDATED IMPORT PATH
import { protect, protectAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public Authentication Routes
router.get('/exists', checkUserExists);
router.post('/register', registerAdmin);
router.post('/login', loginAdmin);

// Password Reset Routes
router.post('/forgot-password', forgotPassword);
router.post('/verify-and-reset', verifyAndResetPassword);

// Protected Route for the current user's profile and status
router.route('/me')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);

router.get('/me/status', protect, checkUserStatus);

router.route('/:id/permissions')
    .put(protectAdmin, updateUserPermissions);

// PROTECTED ADMIN-ONLY MANAGEMENT ROUTES
router.route('/')
    .post(protectAdmin, createUser)
    .get(protectAdmin, getUsers);

router.route('/:id')
    .put(protectAdmin, updateUser)
    .delete(protectAdmin, deleteUser);

export default router;