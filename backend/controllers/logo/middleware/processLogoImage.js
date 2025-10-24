// controllers/logo/middleware/processLogoImage.js
import sharp from 'sharp';

export const processLogoImage = async (req, res, next) => {
    // If no new image was uploaded, skip this middleware.
    if (!req.file) {
        return next();
    }

    try {
        // Process the image with Sharp and convert it to a buffer in memory.
        const imageBuffer = await sharp(req.file.buffer)
            .resize(200, 200, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
            .toFormat('webp', { quality: 85 })
            .toBuffer();

        // Convert the optimized buffer to a Base64 Data URI.
        const imageDataUri = `data:image/webp;base64,${imageBuffer.toString('base64')}`;

        // Attach the data URI to the request object for the next controller.
        req.processedImage = { path: imageDataUri };
        next();
    } catch (error) {
        console.error("Image processing error:", error);
        res.status(500).json({ message: 'Error processing image.', error: error.message });
    }
};