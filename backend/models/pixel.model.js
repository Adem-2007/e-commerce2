// backend/models/pixel.model.js

import mongoose from 'mongoose';

const pixelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name for the pixel'],
        trim: true,
    },
    pixelId: {
        type: String,
        required: [true, 'Pixel ID is required'],
        unique: true, // Ensures no duplicate pixel IDs are stored
        trim: true,
    },
    apiToken: {
        type: String,
        trim: true, // API token is optional
    },
    status: {
        type: String,
        required: true,
        enum: ['active', 'inactive'], // Restricts the value to 'active' or 'inactive'
        default: 'active',
    },
    platform: {
        type: String,
        required: [true, 'Platform is required'],
        enum: ['facebook', 'tiktok', 'snapchat'], // Identifies the pixel's platform
    },
}, {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` timestamps
});

const Pixel = mongoose.model('Pixel', pixelSchema);

export default Pixel;