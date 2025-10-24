// controllers/order/functions/getAllOrders.js
import Order from '../../../models/order.model.js';
import { getOrderAggregationPipeline } from './getOrderAggregationPipeline.js';

/**
 * @desc    Get orders (paginated) for all staff
 * @route   GET /api/orders
 * @access  Private/Staff
 */
export const getAllOrders = async (req, res) => {
    try {
        // Pagination parameters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 15; // Set a default limit for orders per page
        const skip = (page - 1) * limit;

        const isOverview = req.query.overview === 'true';

        // Use the same aggregation pipeline for all authenticated staff
        let aggregationPipeline = getOrderAggregationPipeline();
        let countPipeline = [{ $count: 'total' }];
        
        // Add pagination stages if not for overview
        if (!isOverview) {
            aggregationPipeline.push({ $skip: skip });
            aggregationPipeline.push({ $limit: limit });
        }

        const [orders, totalResult] = await Promise.all([
            Order.aggregate(aggregationPipeline),
            Order.aggregate(countPipeline)
        ]);

        const totalOrders = totalResult[0]?.total || 0;
        const totalPages = Math.ceil(totalOrders / limit);

        res.status(200).json({ 
            orders, 
            totalPages: isOverview ? 1 : totalPages, 
            currentPage: isOverview ? 1 : page 
        });

    } catch (error) {
        console.error("--- GET ALL ORDERS FAILED ---", error);
        res.status(500).json({ message: 'Server error while fetching orders.', error: error.message });
    }
};