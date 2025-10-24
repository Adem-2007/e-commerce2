import Category from '../../../models/category.model.js';
import Product from '../../../models/product.model.js';

export const deleteCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const category = await Category.findById(categoryId);

        if (!category) {
            return res.status(404).json({ message: 'Category not found.' });
        }

        await Product.deleteMany({ category: categoryId });
        await Category.findByIdAndDelete(categoryId);
        res.status(200).json({ message: 'Category and all associated products were deleted successfully.' });

    } catch (error) {
        console.error('--- DELETE CATEGORY FAILED ---', error);
        res.status(500).json({
            message: 'Server Error: Could not delete the category and its products.',
            error: error.message,
        });
    }
};