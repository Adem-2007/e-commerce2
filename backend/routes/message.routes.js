// routes/message.routes.js
import express from 'express';
// --- UPDATED: Import from the new modular directory ---
import {
    sendMessage,
    getAllMessages,
    getUnreadCount,
    markMessageAsRead,
    deleteMessage,
    replyToMessage
} from '../controllers/message/index.js';
// Example: import { protectAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public route to send a message
router.post('/send', sendMessage);

// --- The following routes should be protected ---
// Example: router.get('/', protectAdmin, getAllMessages);
router.get('/', getAllMessages);
router.get('/unread-count', getUnreadCount);
router.patch('/:id/read', markMessageAsRead);
router.delete('/:id', deleteMessage);
router.post('/:id/reply', replyToMessage);

export default router;