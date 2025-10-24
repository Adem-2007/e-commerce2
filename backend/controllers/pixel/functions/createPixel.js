// controllers/pixel/functions/createPixel.js
import Pixel from '../../../models/pixel.model.js';

/**
 * @desc    Create a new pixel
 * @route   POST /api/pixels
 * @access  Private
 */
export const createPixel = async (req, res) => {
    try {
        const { name, pixelId, apiToken, status, platform } = req.body;

        if (!name || !pixelId || !platform) {
            return res.status(400).json({ message: 'Name, Pixel ID, and Platform are mandatory fields.' });
        }

        const pixelExists = await Pixel.findOne({ pixelId });
        if (pixelExists) {
            return res.status(400).json({ message: 'A pixel with this ID already exists.' });
        }

        const pixel = new Pixel({ name, pixelId, apiToken, status, platform });
        const createdPixel = await pixel.save();

        res.status(201).json(createdPixel);
    } catch (error) {
        res.status(500).json({ message: 'Error creating pixel: ' + error.message });
    }
};