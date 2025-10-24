// backend/controllers/user/updateUser.js

import User from '../../../models/user.model.js';
import { getInitialPermissionsForRole } from '../utils/permissions.js'; // Assuming helpers are in utils

/**
 * @desc    Update a user's details (by admin)
 * @route   PUT /api/users/:id
 * @access  Private/Admin
 */
export const updateUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const { name, email, role, password } = req.body;

        if (email && email !== user.email) {
            const existingUser = await User.findOne({ email });
            if (existingUser && existingUser._id.toString() !== req.params.id) {
                return res.status(400).json({ message: 'Email is already in use.' });
            }
        }

        user.name = name || user.name;
        user.email = email || user.email;

        if (role && role !== user.role) {
            user.role = role;
            user.permissions = getInitialPermissionsForRole(role);
        }

        if (password) {
            user.password = password;
        }

        user.forceReloginAt = Date.now();
        const updatedUser = await user.save();

        const userResponse = updatedUser.toObject();
        delete userResponse.password;

        res.status(200).json(userResponse);
    } catch (error) {
        console.error("--- ADMIN UPDATE USER FAILED ---", error);
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};