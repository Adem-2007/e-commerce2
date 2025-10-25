// backend/controllers/product/functions/getProductById.js

import Product from '../../../models/product.model.js';

export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('category', 'name');
        
        if (!product) {
            return res.status(404).json({ message: 'Product not found.' });
        }

        // --- SOLUTION: Check if the current user's IP has already rated ---
        const ip = req.ip;

        // Convert the Mongoose document to a plain JavaScript object to add a new property
        const productObject = product.toObject();

        // Add a new field `userHasRated` which is true if the IP is in the ratedBy array
        productObject.userHasRated = product.ratedBy.includes(ip);
        
        // Send the modified object back to the client
        res.status(200).json(productObject);

    } catch (error) {
        res.status(500).json({ message: 'Error fetching product.', error: error.message });
    }
};