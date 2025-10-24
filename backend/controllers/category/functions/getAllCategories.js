import Category from '../../../models/category.model.js';

export const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find({}).sort({ createdAt: -1 });
        res.status(200).json(categories);
    } catch (error)
    {
        console.error('--- GET ALL CATEGORIES FAILED ---', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};