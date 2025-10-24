import Category from '../../../models/category.model.js';
import { processCategoryImage } from './processCategoryImage.js';

export const updateCategory = async (req, res) => {
    // --- UPDATED: Destructure new fields ---
    const { name, cardTitle, cardSubtitle, cardBgColor, cardTextColor, cardGridClasses } = req.body;
    const { id } = req.params;

    try {
        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found.' });
        }

        if (name) {
            const categoryExists = await Category.findOne({ name: name, _id: { $ne: id } });
            if (categoryExists) {
                return res.status(400).json({ message: 'Another category with this name already exists.' });
            }
            category.name = name;
        }

        // --- UPDATED: Update new fields if they exist ---
        if (cardTitle) category.cardTitle = cardTitle;
        if (cardSubtitle) category.cardSubtitle = cardSubtitle;
        if (cardBgColor) category.cardBgColor = cardBgColor;
        if (cardTextColor) category.cardTextColor = cardTextColor;
        if (cardGridClasses) category.cardGridClasses = cardGridClasses;

        if (req.file) {
            const { imageUrl, thumbnailUrl } = await processCategoryImage(req.file.buffer);
            category.imageUrl = imageUrl;
            category.thumbnailUrl = thumbnailUrl;
        }

        const updatedCategory = await category.save();
        res.status(200).json(updatedCategory);
        
    } catch (error) {
        console.error('--- UPDATE CATEGORY FAILED ---', error);
        res.status(500).json({ message: 'Server Error: Could not update the category.', error: error.message });
    }
};