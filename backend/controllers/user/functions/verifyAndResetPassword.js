// backend/controllers/user/verifyAndResetPassword.js

import User from '../../../models/user.model.js';

/**
 * @desc    Verify code and reset user's password
 * @route   POST /api/users/verify-and-reset
 * @access  Public
 */
export const verifyAndResetPassword = async (req, res) => {
    try {
        const { email, code, password } = req.body;

        if (!email || !code || !password) {
            return res.status(400).json({ message: 'Please provide email, code, and a new password.' });
        }

        const user = await User.findOne({
            email,
            resetPasswordToken: code,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ message: 'Verification code is invalid or has expired.' });
        }

        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        res.status(200).json({ message: 'Password reset successfully. Please log in.' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'A server error occurred while resetting the password.' });
    }
};