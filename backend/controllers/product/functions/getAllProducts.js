// backend/controllers/product/functions/getAllProducts.js

import Product from '../../../models/product.model.js';

export const getAllProducts = async (req, res) => {
    try {
        // --- 1. PAGINATION & SORTING SETUP ---
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 9;
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
                .lean()
                // --- FIX: Add `reviewCount` and `totalRatingSum` to the selection ---
                .select('name price currency newArrival imageUrls.thumbnail reviewCount totalRatingSum') 
                .populate('category', 'name'),
            
            Product.countDocuments(query)
        ]);

        // --- 4. MANUALLY CALCULATE AVERAGE RATING (since .lean() disables Mongoose virtuals) ---
        const productsWithRating = products.map(product => {
            const averageRating = product.reviewCount > 0 ? product.totalRatingSum / product.reviewCount : 0;
            return {
                ...product,
                averageRating
            };
        });

        // --- 5. SEND PAGINATED RESPONSE ---
        res.status(200).json({
            // --- FIX: Send the new array that includes the calculated averageRating ---
            products: productsWithRating,
            totalPages: Math.ceil(totalProducts / limit),
            currentPage: page,
            totalProducts
        });
        
    } catch (error) {
        console.error("Error in getAllProducts:", error);
        res.status(500).json({ message: 'Error fetching products.', error: error.message });
    }
};