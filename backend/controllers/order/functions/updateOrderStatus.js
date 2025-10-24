// controllers/order/functions/updateOrderStatus.js
import mongoose from 'mongoose';
import Order from '../../../models/order.model.js';
import { getOrderAggregationPipeline } from './getOrderAggregationPipeline.js';

/**
 * @desc    Update order status
 * @route   PATCH /api/orders/:id/status
 * @access  Private/Staff
 */
export const updateOrderStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ['pending', 'confirmed', 'no-answer', 'ready', 'postponed', 'on-the-way', 'delivered', 'canceled-staff', 'canceled-customer', 'returned'];
    if (!status || !allowedStatuses.includes(status)) {
        return res.status(400).json({ message: 'Invalid status provided.' });
    }

    try {
        const orderToUpdate = await Order.findById(id);
        if (!orderToUpdate) {
            return res.status(404).json({ message: 'Order not found.' });
        }

        orderToUpdate.status = status;
        await orderToUpdate.save();

        // Fetch the updated, fully populated order using our efficient pipeline
        const matchId = new mongoose.Types.ObjectId(id);
        const updatedOrderPipeline = getOrderAggregationPipeline({ _id: matchId });
        const result = await Order.aggregate(updatedOrderPipeline);

        if (result.length === 0) {
             return res.status(404).json({ message: 'Order not found after update.' });
        }

        res.status(200).json(result[0]); // Return the single, populated order object

    } catch (error) {
        console.error("--- UPDATE ORDER STATUS FAILED ---", error);
        res.status(500).json({ message: 'Server error while updating order status.', error: error.message });
    }
};