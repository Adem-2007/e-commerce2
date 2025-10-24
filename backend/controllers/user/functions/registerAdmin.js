// backend/controllers/user/registerAdmin.js

import User from '../../../models/user.model.js';
import { getInitialPermissionsForRole } from '../utils/permissions.js'; // Assuming helpers are in utils
import { generateToken } from '../utils/auth.js'; // Assuming helpers are in utils

/**
 * @desc    Register the first and only admin user
 * @route   POST /api/users/register
 * @access  Public
 */
export const registerAdmin = async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        if (userCount > 0) {
            return res.status(403).json({ message: 'Administrator account already exists. Registration is disabled.' });
        }

        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please provide all required fields.' });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists.' });
        }

        const user = new User({
            name,
            email,
            password,
            role: 'admin',
            permissions: getInitialPermissionsForRole('admin')
        });
        await user.save();

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            permissions: user.permissions,
            token: generateToken(user._id, user.role),
        });

    } catch (error) {
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};