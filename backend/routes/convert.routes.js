// backend/routes/convert.routes.js

import express from 'express';
import multer from 'multer';
import sharp from 'sharp'; // Sharp is still needed for AVIF/WebP conversion

const router = express.Router();

// Configure multer for in-memory file storage and validation
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Please upload an image file.'), false);
    }
  }
});

/**
 * @route   POST /api/convert/:format
 * @desc    Convert an uploaded image to the specified format (avif or webp).
 * @access  Public
 */
router.post('/:format', upload.single('image'), async (req, res) => {
  const format = req.params.format.toLowerCase();
  if (format !== 'avif' && format !== 'webp') {
    return res.status(400).json({ success: false, message: 'Invalid format specified.' });
  }

  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No image file provided.' });
  }

  try {
    // --- FORMAT CONVERSION STEP ---
    let outputBuffer;
    let contentType;

    console.log(`Converting image to ${format}...`);
    if (format === 'avif') {
      outputBuffer = await sharp(req.file.buffer)
        .avif({ quality: 50 })
        .toBuffer();
      contentType = 'image/avif';
    } else { // format === 'webp'
      outputBuffer = await sharp(req.file.buffer)
        .webp({ quality: 80 })
        .toBuffer();
      contentType = 'image/webp';
    }
    console.log('Conversion successful.');

    // --- SEND RESPONSE ---
    const filename = `converted.${format}`;
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', contentType);
    res.send(outputBuffer);

  } catch (error)
 {
    // --- ERROR HANDLING ---
    const errorMessage = 'An error occurred during image conversion.';
    console.error(`ERROR: ${errorMessage}`, error);
    res.status(500).json({ success: false, message: errorMessage });
  }
});

export default router;