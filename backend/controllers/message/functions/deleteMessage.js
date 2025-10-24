// controllers/message/functions/deleteMessage.js
import Message from '../../../models/message.model.js';

// @desc    Delete a message
// @route   DELETE /api/messages/:id
// @access  Private/Admin
export const deleteMessage = async (req, res) => {
    try {
        const message = await Message.findByIdAndDelete(req.params.id);

        if (!message) {
            return res.status(404).json({ success: false, message: 'Message not found.' });
        }

        res.status(200).json({ success: true, message: 'Message deleted successfully.' });
    } catch (error) {
        console.error('Error in deleteMessage controller:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ success: false, message: 'Invalid message ID format.' });
        }
        res.status(500).json({ success: false, message: 'Server error. Failed to delete message.' });
    }
};