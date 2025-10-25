// backend/models/product.model.js
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: [true, 'Product name is required.'], trim: true },
        description: { type: String, required: [true, 'Product description is required.'] },
        price: { type: Number, required: [true, 'Product price is required.'], index: true },
        originalPrice: { type: Number },
        currency: { type: String, required: [true, 'Currency is required.'], enum: ['DZD', 'EUR', 'USD'], default: 'DZD' },
        category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
        colors: { type: [String], required: true, validate: [val => val.length > 0, 'At least one color is required.'], index: true },
        sizes: { type: [String], default: [], index: true },
        newArrival: { type: Boolean, default: false, index: true },
        imageUrls: {
            large: { type: String, required: true },
            medium: { type: String, required: true },
            thumbnail: { type: String, required: true },
        },
        secondaryImageUrls: [{
            large: { type: String, required: true },
            medium: { type: String, required: true },
            thumbnail: { type: String, required: true },
        }],
        videoUrl: { type: String },
        focusPoint: {
            x: { type: Number, default: 0.5 },
            y: { type: Number, default: 0.5 },
        },
        gender: {
            type: [String],
            required: [true, 'Gender is required.'],
            validate: [val => val.length > 0, 'At least one gender is required.'],
            enum: ['man', 'woman', 'baby'],
            index: true
        },
        height: { type: Number, index: true },
        materials: { type: [String], required: true, validate: [val => val.length > 0, 'At least one material is required.'], index: true },
        views: { type: Number, default: 0 },
        viewedBy: [{ type: String }],
        
        // --- NEW RATING FIELDS ---
        reviewCount: { type: Number, default: 0 },
        totalRatingSum: { type: Number, default: 0 },
        ratedBy: [{ type: String }] // Stores IP addresses of users who have rated
    },
    {
        timestamps: true,
        toObject: { virtuals: true },
        toJSON: { virtuals: true }
    }
);

// --- VIRTUAL for calculating average rating ---
productSchema.virtual('averageRating').get(function() {
    if (this.reviewCount === 0) {
        return 0;
    }
    return this.totalRatingSum / this.reviewCount;
});

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

export default Product;