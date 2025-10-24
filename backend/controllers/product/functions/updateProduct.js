// backend/controllers/product/functions/updateProduct.js

import Product from '../../../models/product.model.js';
import Category from '../../../models/category.model.js';
import { parseArrayFields, processAndSaveImage, videoBufferToDataUri, deleteFile } from './helpers.js';

export const updateProduct = async (req, res) => {
    try {
        parseArrayFields(req.body);

        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found.' });
        }

        const { imagesToRemove, videoToRemove } = req.body;
        const files = req.files;

        // --- 1. Handle Secondary Image Deletion ---
        if (imagesToRemove && imagesToRemove.length > 0) {
            const urlsToRemove = new Set(imagesToRemove);
            const imagesToDelete = product.secondaryImageUrls.filter(img => urlsToRemove.has(img.large));
            await Promise.all(imagesToDelete.map(img => deleteFile(img.large)));
            product.secondaryImageUrls = product.secondaryImageUrls.filter(img => !urlsToRemove.has(img.large));
        }

        // --- 2. Handle Main Image Upload ---
        if (files && files.image) {
            await deleteFile(product.imageUrls.large);
            // Pass the entire file object to the helper
            product.imageUrls = await processAndSaveImage(files.image[0]);
        }

        // --- 3. Handle New Secondary Media Uploads ---
        if (files && files.secondaryMedia) {
            const newImageSets = await Promise.all(
                // Pass the entire file object
                files.secondaryMedia.map(file => processAndSaveImage(file))
            );
            product.secondaryImageUrls.push(...newImageSets);
        }
        
        // --- 4. Handle Video Updates ---
        if (videoToRemove === 'true' && product.videoUrl) {
            product.videoUrl = '';
        }
        if (files && files.video) {
            product.videoUrl = videoBufferToDataUri(files.video[0]);
        }

        // --- 5. Update Text-Based and Other Fields ---
        product.name = req.body.name || product.name;
        product.description = req.body.description || product.description;
        product.price = req.body.price || product.price;
        product.currency = req.body.currency || product.currency;
        product.height = req.body.height !== undefined ? req.body.height : product.height;
        product.newArrival = req.body.newArrival === 'true';
        product.gender = req.body.gender || product.gender;
        product.colors = req.body.colors || product.colors;
        product.sizes = req.body.sizes || product.sizes;
        product.materials = req.body.materials || product.materials;
        if (req.body.focusPoint) product.focusPoint = JSON.parse(req.body.focusPoint);
        
        // --- 6. Handle Category Change ---
        const oldCategoryId = product.category.toString();
        const newCategoryId = req.body.categoryId;
        if (newCategoryId && newCategoryId !== oldCategoryId) {
            product.category = newCategoryId;
            await Promise.all([
                Category.findByIdAndUpdate(oldCategoryId, { $inc: { productCount: -1 } }),
                Category.findByIdAndUpdate(newCategoryId, { $inc: { productCount: 1 } })
            ]);
        }
        
        const updatedProduct = await product.save();
        res.status(200).json(updatedProduct);

    } catch (error) {
        console.error("--- UPDATE PRODUCT FAILED ---", error);
        res.status(500).json({ message: 'Server Error: Could not update the product.', error: error.message });
    }
};