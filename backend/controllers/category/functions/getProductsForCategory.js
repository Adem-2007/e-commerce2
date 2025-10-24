import Product from '../../../models/product.model.js';

export const getProductsForCategory = async (req, res) => {
    try {
        const products = await Product.find({ category: req.params.id })
            .sort({ createdAt: -1 })
            .limit(2);
        res.status(200).json(products);
    } catch (error) {
        console.error('--- GET PRODUCTS FOR CATEGORY FAILED ---', error);
        res.status(500).json({ 
            message: 'Server Error: Could not fetch products for this category.',
            error: error.message 
        });
    }
};