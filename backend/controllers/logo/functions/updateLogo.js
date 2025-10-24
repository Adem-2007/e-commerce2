// controllers/logo/functions/updateLogo.js
import Logo from '../../../models/logo.model.js';

export const updateLogo = async (req, res) => {
    try {
        let logo = await Logo.getSingleton();
        // If no logo document exists yet, create a new one.
        if (!logo) {
            logo = new Logo();
        }
        
        // Update fields from the request body.
        logo.name = req.body.name || logo.name;
        if (req.processedImage) {
            // The 'path' now contains the Base64 Data URI from the processing middleware.
            logo.imageUrl = req.processedImage.path;
        }

        const updatedLogo = await logo.save();
        res.status(200).json({ message: 'Brand identity updated successfully!', logo: updatedLogo });
    } catch (error) {
        res.status(500).json({ message: 'Error updating logo configuration.', error: error.message });
    }
};