// controllers/order/functions/createOrder.js
import Order from '../../../models/order.model.js';

/**
 * @desc    Create a new order
 * @route   POST /api/orders
 * @access  Public
 */
export const createOrder = async (req, res) => {
    // --- FIX: Destructure `currency` from the request body ---
    const { 
        products, orderType, totalPrice, currency, ...customerInfo 
    } = req.body;

    if (!products || !Array.isArray(products) || products.length === 0) {
        return res.status(400).json({ message: 'Order must contain at least one product.' });
    }
    if (totalPrice === undefined) {
        return res.status(400).json({ message: 'Total price is missing.' });
    }
    // --- FIX: Add validation for currency ---
    if (!currency) {
        return res.status(400).json({ message: 'Currency is missing.' });
    }

    // --- VALIDATION FOR PHONE NUMBERS ---
    if (!customerInfo.phone1 || !/^\d{10}$/.test(customerInfo.phone1)) {
        return res.status(400).json({ message: 'Primary phone number must be exactly 10 digits.' });
    }
    // Only validate phone2 if it's provided and not just an empty string
    if (customerInfo.phone2 && customerInfo.phone2.trim() && !/^\d{10}$/.test(customerInfo.phone2)) {
         return res.status(400).json({ message: 'Optional phone number must be exactly 10 digits.' });
    }

    try {
        // --- FIX: Add `currency` to the new Order object ---
        const newOrder = new Order({ products, totalPrice, currency, orderType, ...customerInfo });
        const savedOrder = await newOrder.save();
        res.status(201).json(savedOrder);
    } catch (error) {
        console.error("--- CREATE ORDER FAILED ---", error);
        // Handle Mongoose validation errors specifically
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Server error while creating order.', error: error.message });
    }
};