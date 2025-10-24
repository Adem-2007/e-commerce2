// controllers/hero/helpers/imageHelpers.js

// This constant is still useful for validation before processing.
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

/**
 * Converts an image buffer into a Base64 data URI.
 * This allows storing the image directly in the database.
 * @param {Buffer} buffer - The image file buffer from multer.
 * @param {string} mimetype - The MIME type of the file (e.g., 'image/png').
 * @returns {string} A data URI string (e.g., "data:image/png;base64,iVBORw0KGgo...").
 */
export const convertToBase64 = (buffer, mimetype) => `data:${mimetype};base64,${buffer.toString('base64')}`;

/**
 * Since we are no longer saving files to the filesystem, this function
 * doesn't need to do anything. It's kept for structural consistency
 * in the controllers but is now an empty operation.
 */
export const deleteImageFile = () => {
    // No operation needed as files are not stored on the disk.
};