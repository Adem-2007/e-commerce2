// controllers/order/functions/getOrderStats.js
import Order from '../../../models/order.model.js';

/**
 * @desc    Get aggregated statistics for the dashboard overview
 * @route   GET /api/orders/stats
 * @access  Private/Staff
 */
export const getOrderStats = async (req, res) => {
    try {
        const statsPipeline = [
            {
                $facet: {
                    // Pipeline 1: Calculate order counts for each status
                    "statusCounts": [
                        { $group: { _id: "$status", count: { $sum: 1 } } }
                    ],
                    // Pipeline 2: Calculate daily revenue from 'confirmed' and 'delivered' orders
                    "dailyRevenue": [
                        { $match: { status: { $in: ['confirmed', 'delivered'] } } },
                        {
                            $group: {
                                _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                                revenue: { $sum: "$totalPrice" }
                            }
                        },
                        { $sort: { "_id": 1 } }, // Sort by date
                        { $project: { _id: 0, date: "$_id", revenue: 1 } }
                    ],
                    // --- FIX: Pipeline 3 is now modified to group revenue by currency ---
                    "totalRevenue": [
                        { $match: { status: { $in: ['confirmed', 'delivered'] } } },
                        { $group: { _id: "$currency", total: { $sum: "$totalPrice" } } }
                    ]
                }
            }
        ];

        const result = await Order.aggregate(statsPipeline);

        // Process the aggregated data into a clean response object
        const stats = result[0];
        const statusCounts = stats.statusCounts.reduce((acc, item) => {
            acc[item._id] = item.count;
            return acc;
        }, {});

        // --- FIX: Transform the revenue array into an object keyed by currency ---
        const totalRevenue = stats.totalRevenue.reduce((acc, item) => {
            if (item._id) { // Ensure currency is not null
                acc[item._id] = item.total;
            }
            return acc;
        }, {});

        const response = {
            statusCounts,
            revenueChartData: stats.dailyRevenue,
            totalRevenue, // Send the new object
        };

        res.status(200).json(response);
    } catch (error) {
        console.error("--- GET ORDER STATS FAILED ---", error);
        res.status(500).json({ message: 'Server error while fetching order statistics.', error: error.message });
    }
};