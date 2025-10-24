// backend/controllers/user/checkUserExists.js

import User from '../../../models/user.model.js';

/**
 * @desc    Check if an admin user exists
 * @route   GET /api/users/exists
 * @access  Public
 */
export const checkUserExists = async (req, res) => {
    try {
        const count = await User.countDocuments();
        res.status(200).json({ exists: count > 0 });
    } catch (error) {
        res.status(500).json({ message: 'Server error while checking for user.' });
    }
};