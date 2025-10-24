// controllers/message/functions/markMessageAsRead.js
import Message from '../../../models/message.model.js';

// @desc    Mark a message as read
// @route   PATCH /api/messages/:id/read
// @access  Private/Admin
export const markMessageAsRead = async (req, res) => {
    try {
        const message = await Message.findById(req.params.id);
        if (!message) {
            return res.status(404).json({ success: false, message: 'Message not found.' });
        }
        
        if (message.isRead) {
            return res.status(200).json(message);
        }

        message.isRead = true;
        await message.save();
        res.status(200).json(message);
    } catch (error) {
        console.error('Error in markMessageAsRead controller:', error);
        res.status(500).json({ success: false, message: 'Server error. Failed to update message.' });
    }
};