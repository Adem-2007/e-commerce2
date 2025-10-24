// controllers/order/functions/deleteOrder.js
import Order from '../../../models/order.model.js';

/**
 * @desc    Delete an order
 * @route   DELETE /api/orders/:id
 * @access  Private/Staff
 */
export const deleteOrder = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedOrder = await Order.findByIdAndDelete(id);
        if (!deletedOrder) {
            return res.status(404).json({ message: 'Order not found.' });
        }
        res.status(200).json({ message: 'Order deleted successfully.', deletedOrderId: id });
    } catch (error) {
        console.error("--- DELETE ORDER FAILED ---", error);
        res.status(500).json({ message: 'Server error while deleting order.', error: error.message });
    }
};