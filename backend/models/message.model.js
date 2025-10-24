// models/message.model.js

import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required.'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required.'],
        trim: true,
        lowercase: true,
        match: [/\S+@\S+\.\S+/, 'Please use a valid email address.'],
    },
    message: {
        type: String,
        required: [true, 'Message is required.'],
        trim: true,
    },
    isRead: {
        type: Boolean,
        default: false,
    },
    // --- NEW FIELDS ---
    // Stores the text of your reply
    reply: {
        type: String,
        trim: true,
    },
    // Stores the date when the reply was sent
    repliedAt: {
        type: Date,
    },
}, {
    timestamps: true,
});

const Message = mongoose.model('Message', messageSchema);

export default Message;