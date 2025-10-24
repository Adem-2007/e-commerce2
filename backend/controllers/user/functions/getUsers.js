// backend/controllers/user/getUsers.js

import User from '../../../models/user.model.js';

/**
 * @desc    Get all users with server-side pagination and search
 * @route   GET /api/users
 * @access  Private/Admin
 * @query   page, limit, search
 */
export const getUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 9;
        const searchTerm = req.query.search || '';

        const query = searchTerm
            ? {
                $or: [
                    { name: { $regex: searchTerm, $options: 'i' } },
                    { email: { $regex: searchTerm, $options: 'i' } },
                ],
            }
            : {};

        const totalUsers = await User.countDocuments(query);
        const users = await User.find(query)
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip((page - 1) * limit)
            .select('-password')
            .lean();

        res.status(200).json({
            users,
            page,
            totalPages: Math.ceil(totalUsers / limit),
            totalUsers,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};