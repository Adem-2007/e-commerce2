// backend/models/product.model.js
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: [true, 'Product name is required.'], trim: true },
        description: { type: String, required: [true, 'Product description is required.'] },
        price: { type: Number, required: [true, 'Product price is required.'], index: true }, // <-- ADDED INDEX
        originalPrice: { type: Number },
        currency: {
            type: String,
            required: [true, 'Currency is required.'],
            enum: ['DZD', 'EUR', 'USD'],
            default: 'DZD'
        },
        category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true, index: true }, // <-- ADDED INDEX
        colors: { type: [String], required: true, validate: [val => val.length > 0, 'At least one color is required.'], index: true }, // <-- ADDED INDEX
        sizes: { type: [String], default: [], index: true }, // <-- ADDED INDEX
        newArrival: { type: Boolean, default: false, index: true }, // <-- ADDED INDEX

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
            index: true // <-- ADDED INDEX
        },
        height: { type: Number, index: true }, // <-- ADDED INDEX
        materials: { type: [String], required: true, validate: [val => val.length > 0, 'At least one material is required.'], index: true }, // <-- ADDED INDEX
        views: { type: Number, default: 0 },
        viewedBy: [{ type: String }]
    },
    {
        timestamps: true, // This automatically adds an index to createdAt
        toObject: { virtuals: true },
        toJSON: { virtuals: true }
    }
);

// --- VIRTUALS to prevent accidental use of old fields ---
productSchema.virtual('imageUrl').get(function() {
    console.warn('`imageUrl` is deprecated. Please use `imageUrls.large` or another size.');
    return this.imageUrls?.large;
});

productSchema.virtual('thumbnailUrl').get(function() {
    console.warn('`thumbnailUrl` is deprecated. Please use `imageUrls.thumbnail`.');
    return this.imageUrls?.thumbnail;
});


const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

export default Product;