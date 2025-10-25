// backend/controllers/product/functions/rateProduct.js

import Product from '../../../models/product.model.js';

export const rateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { rating } = req.body;
        const ip = req.ip; // Express automatically provides the user's IP address

        // --- 1. Validation ---
        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'Invalid rating. Please provide a rating between 1 and 5.' });
        }

        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found.' });
        }

        // --- 2. Check if IP address has already rated ---
        if (product.ratedBy.includes(ip)) {
            return res.status(403).json({ message: 'You have already rated this product.' });
        }

        // --- 3. Update Product with New Rating ---
        product.reviewCount += 1;
        product.totalRatingSum += rating;
        product.ratedBy.push(ip);

        await product.save();

        // --- 4. Send back the updated product with the new average rating ---
        res.status(200).json({
            message: 'Thank you for your review!',
            product // The product object will include the new 'averageRating' virtual
        });

    } catch (error) {
        console.error("Error in rateProduct:", error);
        res.status(500).json({ message: 'Server error while processing your rating.', error: error.message });
    }
};