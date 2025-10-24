// backend/controllers/product/functions/createProduct.js

import Product from '../../../models/product.model.js';
import Category from '../../../models/category.model.js';
import { parseArrayFields, processAndSaveImage, videoBufferToDataUri } from './helpers.js';

export const createProduct = async (req, res) => {
    try {
        parseArrayFields(req.body);

        const { name, description, price, currency, categoryId, colors, sizes, newArrival, focusPoint, gender, height, materials } = req.body;
        const files = req.files;

        if (!name || !price || !categoryId || !gender || !files || !files.image) {
            return res.status(400).json({ message: 'Missing required fields: name, price, category, gender, and main image are required.' });
        }

        // --- CORRECTED LOGIC ---
        // Pass the entire file object to the helper, not just the buffer.
        const mainImageFile = files.image[0];
        const imageUrls = await processAndSaveImage(mainImageFile);

        let secondaryImageUrls = [];
        if (files.secondaryMedia && files.secondaryMedia.length > 0) {
            secondaryImageUrls = await Promise.all(
                files.secondaryMedia.map(file => processAndSaveImage(file)) // Pass the full file object
            );
        }

        let videoUrl = '';
        if (files.video && files.video.length > 0) {
            videoUrl = videoBufferToDataUri(files.video[0]);
        }

        const newProduct = new Product({
            name, description, price, currency,
            category: categoryId,
            colors, sizes, gender, materials, height,
            newArrival: newArrival === 'true',
            focusPoint: focusPoint ? JSON.parse(focusPoint) : { x: 0.5, y: 0.5 },
            imageUrls,
            secondaryImageUrls,
            videoUrl
        });

        const savedProduct = await newProduct.save();
        await Category.findByIdAndUpdate(categoryId, { $inc: { productCount: 1 } });
        
        res.status(201).json(savedProduct);

    } catch (error) {
        console.error("--- CREATE PRODUCT FAILED ---", error);
        res.status(500).json({ message: 'Server Error: Could not create the product.', error: error.message });
    }
};