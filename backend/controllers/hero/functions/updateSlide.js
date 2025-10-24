// controllers/hero/functions/updateSlide.js
import Hero from '../../../models/hero.model.js';
// --- MODIFICATION: Import new Base64 converter ---
import { MAX_FILE_SIZE, convertToBase64 } from '../helpers/imageHelpers.js';
import { buildBackgroundObject } from '../helpers/backgroundHelper.js';

export const updateSlide = async (req, res) => {
    const { id } = req.params;
    
    try {
        if (req.file && req.file.size > MAX_FILE_SIZE) {
            return res.status(400).json({ message: `Image is too large.` });
        }
        
        const slideToUpdate = await Hero.findById(id);
        if (!slideToUpdate) {
            return res.status(404).json({ message: 'Slide not found.' });
        }
        
        const { title_en, title_fr, title_ar, category_en, category_fr, category_ar, description_en, description_fr, description_ar } = req.body;
        
        const updatedData = {
            title: { en: title_en, fr: title_fr, ar: title_ar },
            category: { en: category_en, fr: category_fr, ar: category_ar },
            description: { en: description_en, fr: description_fr, ar: description_ar },
        };
        
        let imageType = slideToUpdate.imageType;
        if (req.file) {
            // --- MODIFICATION: Convert new image to Base64 ---
            const newImageAsBase64 = convertToBase64(req.file.buffer, req.file.mimetype);
            updatedData.imageUrl = newImageAsBase64;
            updatedData.thumbnailUrl = newImageAsBase64;
            imageType = req.file.mimetype === 'image/png' ? 'png' : 'other';
            updatedData.imageType = imageType;
        }

        updatedData.background = imageType === 'png' ? buildBackgroundObject(req.body) : undefined;
        
        const updatedSlide = await Hero.findByIdAndUpdate(id, updatedData, { new: true });
        res.status(200).json(updatedSlide);

    } catch (error) {
        console.error("Error updating slide:", error);
        res.status(500).json({ message: "Server Error: Could not update the slide.", error: error.message });
    }
};