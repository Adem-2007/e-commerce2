// backend/controllers/user/createUser.js

import User from '../../../models/user.model.js';
import { getInitialPermissionsForRole } from '../utils/permissions.js'; // Assuming you move helpers to a utils folder

/**
 * @desc    Create a new user (by admin)
 * @route   POST /api/users
 * @access  Private/Admin
 */
export const createUser = async (req, res) => {
    const { name, email, password, role, permissions } = req.body;

    if (!name || !email || !password || !role) {
        return res.status(400).json({ message: 'Please provide name, email, password, and role.' });
    }

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User with this email already exists.' });
        }

        const allowedRoles = ['pager', 'creator', 'admin'];
        if (!allowedRoles.includes(role)) {
            return res.status(400).json({ message: 'The specified role is invalid.' });
        }

        const newUser = new User({
            name,
            email,
            password,
            role,
            permissions: permissions || getInitialPermissionsForRole(role)
        });
        const createdUser = await newUser.save();

        const userResponse = createdUser.toObject();
        delete userResponse.password;

        res.status(201).json(userResponse);

    } catch (error) {
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};