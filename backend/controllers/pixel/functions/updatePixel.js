// controllers/pixel/functions/updatePixel.js
import Pixel from '../../../models/pixel.model.js';

/**
 * @desc    Update a pixel by its ID
 * @route   PUT /api/pixels/:id
 * @access  Private
 */
export const updatePixel = async (req, res) => {
    try {
        const { name, apiToken, status } = req.body;
        const pixel = await Pixel.findById(req.params.id);

        if (!pixel) {
            return res.status(404).json({ message: 'Pixel not found.' });
        }

        pixel.name = name || pixel.name;
        pixel.apiToken = apiToken !== undefined ? apiToken : pixel.apiToken;
        pixel.status = status || pixel.status;

        const updatedPixel = await pixel.save();
        res.status(200).json(updatedPixel);
    } catch (error) {
        res.status(500).json({ message: 'Error updating pixel: ' + error.message });
    }
};