// backend/controllers/product/functions/getProductFilters.js

import Product from '../../../models/product.model.js';

export const getProductFilters = async (req, res) => {
    try {
        const [colors, sizes, materials, priceRange] = await Promise.all([
            Product.distinct('colors'),
            Product.distinct('sizes'),
            Product.distinct('materials'),
            Product.aggregate([
                { $group: { _id: null, minPrice: { $min: "$price" }, maxPrice: { $max: "$price" } } }
            ])
        ]);
        res.status(200).json({
            colors,
            sizes,
            materials,
            priceRange: priceRange[0] || { minPrice: 0, maxPrice: 0 }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching product filters.', error: error.message });
    }
};