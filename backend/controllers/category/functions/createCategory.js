// category/functions/createCategory.js
import Category from '../../../models/category.model.js';
import { processCategoryImage } from './processCategoryImage.js';

export const createCategory = async (req, res) => {
    // --- UPDATED: Destructure new fields from request body ---
    const { name, cardTitle, cardSubtitle, cardBgColor, cardTextColor, cardGridClasses } = req.body;

    if (!req.file) {
        return res.status(400).json({ message: 'Category image is required.' });
    }
    if (!name || !cardTitle || !cardSubtitle) {
        return res.status(400).json({ message: 'Category name, card title, and subtitle are required.' });
    }
    try {
        const categoryExists = await Category.findOne({ name });
        if (categoryExists) {
            return res.status(400).json({ message: 'A category with this name already exists.' });
        }
        const { imageUrl, thumbnailUrl } = await processCategoryImage(req.file.buffer);
        
        // --- UPDATED: Include new fields in the create operation ---
        const category = await Category.create({ 
            name, 
            cardTitle,
            cardSubtitle,
            cardBgColor,
            cardTextColor,
            cardGridClasses,
            imageUrl, 
            thumbnailUrl 
        });

        res.status(201).json(category);
    } catch (error) {
        console.error('--- CREATE CATEGORY FAILED ---', error);
        res.status(500).json({ message: 'Server Error: Could not create the category.', error: error.message });
    }
};