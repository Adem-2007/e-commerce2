// controllers/hero/functions/createSlide.js
import Hero from '../../../models/hero.model.js';
// --- MODIFICATION: Import new Base64 converter ---
import { MAX_FILE_SIZE, convertToBase64 } from '../helpers/imageHelpers.js';
import { buildBackgroundObject } from '../helpers/backgroundHelper.js';

export const createSlide = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'Image file is required.' });
    }
    if (req.file.size > MAX_FILE_SIZE) {
        return res.status(400).json({ message: `Image is too large.` });
    }

    try {
        const { title_en, title_fr, title_ar, category_en, category_fr, category_ar, description_en, description_fr, description_ar } = req.body;
        
        // --- MODIFICATION: Convert image to Base64 ---
        const imageAsBase64 = convertToBase64(req.file.buffer, req.file.mimetype);
        const imageType = req.file.mimetype === 'image/png' ? 'png' : 'other';
        
        const slideData = {
            title: { en: title_en, fr: title_fr, ar: title_ar },
            category: { en: category_en, fr: category_fr, ar: category_ar },
            description: { en: description_en, fr: description_fr, ar: description_ar },
            // --- MODIFICATION: Store Base64 string directly ---
            // We use the same field for both full image and thumbnail to simplify the model.
            imageUrl: imageAsBase64,
            thumbnailUrl: imageAsBase64, 
            imageType,
            background: imageType === 'png' ? buildBackgroundObject(req.body) : undefined
        };
        
        const newSlide = new Hero(slideData);
        await newSlide.save();
        res.status(201).json(newSlide);

    } catch (error) {
        console.error("Error creating slide:", error);
        res.status(500).json({ message: "Server Error: Could not create the slide.", error: error.message });
    }
};