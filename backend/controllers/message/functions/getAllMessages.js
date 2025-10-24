// controllers/message/functions/getAllMessages.js
import Message from '../../../models/message.model.js';

// @desc    Get all messages
// @route   GET /api/messages
// @access  Private/Admin
export const getAllMessages = async (req, res) => {
    try {
        const messages = await Message.find({}).sort({ createdAt: -1 });
        res.status(200).json(messages);
    } catch (error) {
        console.error('Error in getAllMessages controller:', error);
        res.status(500).json({ success: false, message: 'Server error. Failed to retrieve messages.' });
    }
};