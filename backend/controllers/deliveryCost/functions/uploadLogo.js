// controllers/deliveryCost/functions/uploadLogo.js
import sharp from 'sharp';

export const uploadLogo = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded.' });
    }

    try {
        // Process the image directly from buffer
        const imageBuffer = await sharp(req.file.buffer)
            .resize(100, 100, { 
                fit: 'contain', 
                background: { r: 255, g: 255, b: 255, alpha: 0 } 
            })
            .webp({ quality: 80 })
            .toBuffer();

        // Convert buffer to base64 data URL
        const base64Image = `data:image/webp;base64,${imageBuffer.toString('base64')}`;
        
        // Return the base64 data URL to the frontend
        res.json({ logoUrl: base64Image });

    } catch (error) {
        console.error('Error processing image:', error);
        res.status(500).json({ message: 'Error processing image.' });
    }
};