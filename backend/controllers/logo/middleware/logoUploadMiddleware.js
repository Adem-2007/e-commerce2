// controllers/logo/middleware/logoUploadMiddleware.js
import multer from 'multer';

// Using memoryStorage is efficient as it avoids writing the temporary file to disk.
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|svg|webp/;
        const mimeType = allowedTypes.test(file.mimetype);
        const extName = allowedTypes.test(file.originalname.toLowerCase().split('.').pop());
        if (mimeType && extName) {
            return cb(null, true);
        }
        cb(new Error("Error: File upload only supports JPEG, PNG, SVG, and WEBP formats."));
    },
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB file size limit
});

// Export the multer upload instance to be used in the route definition.
export const logoUploadMiddleware = upload.single('logoImage');