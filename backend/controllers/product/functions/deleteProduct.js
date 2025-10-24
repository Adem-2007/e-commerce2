// backend/controllers/product/functions/deleteProduct.js

import Product from '../../../models/product.model.js';
import Category from '../../../models/category.model.js';
import { deleteFile } from './helpers.js'; // Make sure deleteFile is imported

export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found.' });
        }

        // --- FIX: Logic to delete all associated image files from storage ---
        const deletionPromises = [];
        
        // Add the main image to the deletion queue
        if (product.imageUrls && product.imageUrls.large) {
            deletionPromises.push(deleteFile(product.imageUrls.large));
        }
        
        // Add all secondary images to the deletion queue
        if (product.secondaryImageUrls && product.secondaryImageUrls.length > 0) {
            // Loop through the array of image objects and pass the URL string to deleteFile
            product.secondaryImageUrls.forEach(imgObj => {
                if (imgObj && imgObj.large) {
                    deletionPromises.push(deleteFile(imgObj.large));
                }
            });
        }

        // Wait for all file deletions to complete
        await Promise.all(deletionPromises);
        
        // --- End of fix ---

        // Now, delete the product document from the database
        await Product.findByIdAndDelete(req.params.id);

        // Decrement the product count in the associated category.
        await Category.findByIdAndUpdate(product.category, { $inc: { productCount: -1 } });

        res.status(200).json({ message: 'Product and associated images deleted successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting product.', error: error.message });
    }
};