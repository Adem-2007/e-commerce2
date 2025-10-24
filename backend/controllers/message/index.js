// controllers/message/index.js
import { sendMessage } from './functions/sendMessage.js';
import { getAllMessages } from './functions/getAllMessages.js';
import { getUnreadCount } from './functions/getUnreadCount.js';
import { markMessageAsRead } from './functions/markMessageAsRead.js';
import { deleteMessage } from './functions/deleteMessage.js';
import { replyToMessage } from './functions/replyToMessage.js';

export {
    sendMessage,
    getAllMessages,
    getUnreadCount,
    markMessageAsRead,
    deleteMessage,
    replyToMessage
};