// backend/controllers/user/checkUserStatus.js

/**
 * @desc    Check the status of the logged-in user
 * @route   GET /api/users/me/status
 * @access  Private
 */
export const checkUserStatus = async (req, res) => {
    try {
        res.status(200).json({ message: 'User is active.' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};