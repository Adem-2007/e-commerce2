// backend/controllers/product/functions/getAllProducts.js

import Product from '../../../models/product.model.js';

export const getAllProducts = async (req, res) => {
    try {
        // --- 1. PAGINATION & SORTING SETUP ---
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 9; // Set default limit to 9 to match frontend
        const skip = (page - 1) * limit;

        // --- 2. BUILD THE QUERY OBJECT ---
        const query = {};
        if (req.query.categoryId) query.category = req.query.categoryId;
        if (req.query.categories) query.category = { $in: req.query.categories.split(',') };
        if (req.query.colors) query.colors = { $in: req.query.colors.split(',') };
        if (req.query.sizes) query.sizes = { $in: req.query.sizes.split(',') };
        if (req.query.materials) query.materials = { $in: req.query.materials.split(',') };
        if (req.query.gender) query.gender = req.query.gender;
        if (req.query.newArrival) query.newArrival = req.query.newArrival === 'true';

        if (req.query.minPrice || req.query.maxPrice) {
            query.price = {};
            if (req.query.minPrice) query.price.$gte = Number(req.query.minPrice);
            if (req.query.maxPrice) query.price.$lte = Number(req.query.maxPrice);
        }
        if (req.query.minHeight || req.query.maxHeight) {
            query.height = {};
            if (req.query.minHeight) query.height.$gte = Number(req.query.minHeight);
            if (req.query.maxHeight) query.height.$lte = Number(req.query.maxHeight);
        }

        // --- 3. EXECUTE QUERIES IN PARALLEL FOR EFFICIENCY ---
        const [products, totalProducts] = await Promise.all([
            Product.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean() // Use .lean() for faster, read-only queries
                .select('name price currency imageUrls newArrival') // Select only needed fields for the grid
                .populate('category', 'name'),
            
            Product.countDocuments(query) // Get the total count for pagination
        ]);

        // --- 4. SEND PAGINATED RESPONSE ---
        res.status(200).json({
            products,
            totalPages: Math.ceil(totalProducts / limit),
            currentPage: page,
            totalProducts
        });
        
    } catch (error) {
        console.error("Error in getAllProducts:", error);
        res.status(500).json({ message: 'Error fetching products.', error: error.message });
    }
};