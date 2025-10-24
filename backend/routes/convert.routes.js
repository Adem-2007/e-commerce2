// backend/routes/convert.routes.js

import express from 'express';
import multer from 'multer';
import sharp from 'sharp';
import axios from 'axios'; // <-- ADD AXIOS TO FETCH THE IMAGE

const router = express.Router();

// ... (keep the existing multer storage and upload configuration)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


// --- NEW ROUTE: Convert an image directly from a URL ---
router.post('/from-url', async (req, res) => {
  const { imageUrl } = req.body;

  if (!imageUrl) {
    return res.status(400).json({ success: false, message: 'No image URL provided.' });
  }

  try {
    // 1. Fetch the image from the provided URL as a buffer
    const response = await axios.get(imageUrl, {
      responseType: 'arraybuffer'
    });
    const imageBuffer = Buffer.from(response.data, 'binary');

    // 2. Use Sharp to convert the fetched buffer to AVIF
    const avifBuffer = await sharp(imageBuffer)
      .avif({ quality: 50 })
      .toBuffer();

    // 3. Send the AVIF data back to the browser as a blob
    res.setHeader('Content-Disposition', 'attachment; filename="converted.avif"');
    res.setHeader('Content-Type', 'image/avif');
    res.send(avifBuffer);

  } catch (error) {
    console.error("Error fetching or converting image from URL:", error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch or convert the image from the URL.' });
  }
});


// --- Existing Route: Convert an image from an upload ---
router.post('/avif', upload.single('image'), async (req, res) => {
// ... (your existing code for this route remains unchanged)
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No image file provided.' });
  }

  try {
    const avifBuffer = await sharp(req.file.buffer)
      .avif({ quality: 50 })
      .toBuffer();

    res.setHeader('Content-Disposition', 'attachment; filename="converted.avif"');
    res.setHeader('Content-Type', 'image/avif');
    res.send(avifBuffer);

  } catch (error) {
    console.error("Error during image conversion:", error);
    res.status(500).json({ success: false, message: 'An error occurred during conversion.' });
  }
});

export default router;