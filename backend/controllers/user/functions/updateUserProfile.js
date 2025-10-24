// backend/controllers/user/updateUserProfile.js

import User from '../../../models/user.model.js';
import { uploadImage } from '../utils/imageUpload.js'; // Assuming you move this helper to utils

/**
 * @desc    Update current user's own profile
 * @route   PUT /api/users/me
 * @access  Private
 */
export const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const { name, email, avatar } = req.body;

        if (email && email !== user.email) {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: 'Email is already in use.' });
            }
        }

        let avatarUrl = user.avatar;
        if (avatar && avatar.startsWith('data:image')) {
            avatarUrl = await uploadImage(avatar);
        }

        user.name = name || user.name;
        user.email = email || user.email;
        user.avatar = avatarUrl;

        const updatedUser = await user.save();

        const userResponse = updatedUser.toObject();
        delete userResponse.password;

        res.status(200).json(userResponse);

    } catch (error) {
        console.error("--- UPDATE PROFILE FAILED ---", error);
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};