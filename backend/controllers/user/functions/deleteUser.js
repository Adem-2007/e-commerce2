// backend/controllers/user/deleteUser.js

import User from '../../../models/user.model.js';

/**
 * @desc    Delete a user (by admin)
 * @route   DELETE /api/users/:id
 * @access  Private/Admin
 */
export const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        if (req.user.id === user._id.toString()) {
            return res.status(400).json({ message: 'You cannot delete your own admin account.' });
        }

        await user.deleteOne();

        res.status(200).json({ message: 'User deleted successfully.' });

    } catch (error) {
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};