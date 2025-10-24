// controllers/pixel/functions/getPixels.js
import Pixel from '../../../models/pixel.model.js';

/**
 * @desc    Get all pixels, optionally filtered by platform
 * @route   GET /api/pixels
 * @access  Private
 */
export const getPixels = async (req, res) => {
    try {
        const filter = req.query.platform ? { platform: req.query.platform } : {};
        const pixels = await Pixel.find(filter).sort({ createdAt: -1 });
        res.status(200).json(pixels);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching pixels: ' + error.message });
    }
};