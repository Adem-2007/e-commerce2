// controllers/message/functions/getUnreadCount.js
import Message from '../../../models/message.model.js';

// @desc    Get the count of unread messages
// @route   GET /api/messages/unread-count
// @access  Private/Admin
export const getUnreadCount = async (req, res) => {
    try {
        const count = await Message.countDocuments({ isRead: false });
        res.status(200).json({ count });
    } catch (error) {
        console.error('Error in getUnreadCount controller:', error);
        res.status(500).json({ success: false, message: 'Server error. Failed to get unread count.' });
    }
};