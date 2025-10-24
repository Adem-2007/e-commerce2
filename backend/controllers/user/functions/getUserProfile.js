// backend/controllers/user/getUserProfile.js

import User from '../../../models/user.model.js';

/**
 * @desc    Get current user's profile
 * @route   GET /api/users/me
 * @access  Private
 */
export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.status(200).json(user);

    } catch (error) {
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};