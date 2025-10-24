// backend/controllers/product/functions/getProductById.js

import Product from '../../../models/product.model.js';

export const getProductById = async (req, res) => {
    try {
        // This endpoint correctly fetches ALL data for a single product view
        const product = await Product.findById(req.params.id).populate('category', 'name');
        if (!product) return res.status(404).json({ message: 'Product not found.' });
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching product.', error: error.message });
    }
};