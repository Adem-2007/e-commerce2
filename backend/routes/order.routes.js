// backend/routes/order.routes.js
import express from 'express';
import {
    createOrder,
    getAllOrders,
    updateOrderStatus,
    deleteOrder,
    getOrderStats // --- 1. IMPORT THE NEW STATS CONTROLLER ---
} from '../controllers/order/index.js';
import { protectStaff } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public route for customers to create an order
router.route('/').post(createOrder);

// --- 2. ADD THE NEW, PROTECTED ROUTE FOR DASHBOARD STATS ---
// This must be before routes with parameters like '/:id'
router.route('/stats').get(protectStaff, getOrderStats);

// Protected routes for staff to manage orders
router.route('/').get(protectStaff, getAllOrders);
router.route('/:id').delete(protectStaff, deleteOrder);
router.route('/:id/status').patch(protectStaff, updateOrderStatus);

export default router;