// backend/models/category.model.js

import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Category name is required.'],
        trim: true,
        unique: true,
    },
    cardTitle: {
        type: String,
        required: [true, 'Card title is required.'],
        trim: true,
    },
    cardSubtitle: {
        type: String,
        required: [true, 'Card subtitle is required.'],
        trim: true,
    },
    cardBgColor: {
        type: String,
        // --- UPDATED: Default is now a hex color code ---
        default: '#E5E7EB', // Default background color (light gray)
        trim: true,
    },
    cardTextColor: {
        type: String,
        default: 'text-black', // Default text color
        trim: true,
    },
    cardGridClasses: {
        type: String,
        default: 'col-span-1 row-span-1', // Default layout
        trim: true,
    },
    imageUrl: {
        type: String,
        required: [true, 'Main image URL is required.'],
    },
    thumbnailUrl: {
        type: String,
        required: [true, 'Thumbnail image URL is required.'],
    },
    productCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});


const Category = mongoose.model('Category', categorySchema);

export default Category;