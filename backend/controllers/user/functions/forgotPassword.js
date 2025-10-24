// backend/controllers/user/forgotPassword.js

import User from '../../../models/user.model.js';
import sendEmail from '../../../utils/sendEmail.js';

/**
 * @desc    Process forgot password request
 * @route   POST /api/users/forgot-password
 * @access  Public
 */
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'An account with this email does not exist.' });
        }

        const resetCode = user.getResetPasswordCode();
        await user.save({ validateBeforeSave: false });

        const message = `
            <h1>Password Reset Request</h1>
            <p>Your verification code is:</p>
            <h2 style="font-size: 2rem; letter-spacing: 5px; text-align: center;">${resetCode}</h2>
            <p>This code will expire in 10 minutes.</p>`;

        await sendEmail({
            email: user.email,
            subject: 'Your Password Reset Verification Code',
            message,
        });

        res.status(200).json({ message: 'A verification code has been sent to your email.' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to send the verification email. Please try again.' });
    }
};