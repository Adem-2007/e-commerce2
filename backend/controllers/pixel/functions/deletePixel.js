// controllers/pixel/functions/deletePixel.js
import Pixel from '../../../models/pixel.model.js';

/**
 * @desc    Delete a pixel by its ID
 * @route   DELETE /api/pixels/:id
 * @access  Private
 */
export const deletePixel = async (req, res) => {
    try {
        const pixel = await Pixel.findById(req.params.id);

        if (!pixel) {
            return res.status(404).json({ message: 'Pixel not found.' });
        }

        await pixel.deleteOne();
        res.status(200).json({ message: 'Pixel removed successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting pixel: ' + error.message });
    }
};