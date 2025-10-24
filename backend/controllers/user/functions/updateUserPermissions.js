// backend/controllers/user/updateUserPermissions.js

import User from '../../../models/user.model.js';

/**
 * @desc    Update a user's specific permissions (by admin)
 * @route   PUT /api/users/:id/permissions
 * @access  Private/Admin
 */
export const updateUserPermissions = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const { permissions } = req.body;

        if (!Array.isArray(permissions)) {
            return res.status(400).json({ message: 'Permissions must be an array of strings.' });
        }

        user.permissions = permissions;
        user.forceReloginAt = Date.now();

        await user.save();

        const userResponse = user.toObject();
        delete userResponse.password;

        res.status(200).json(userResponse);
    } catch (error) {
        console.error("--- ADMIN UPDATE PERMISSIONS FAILED ---", error);
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};