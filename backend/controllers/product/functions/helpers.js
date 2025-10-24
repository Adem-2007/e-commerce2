// backend/controllers/product/functions/helpers.js

/**
 * Parses fields that are stringified by FormData.
 */
export const parseArrayFields = (body) => {
    const fieldsToParse = ['colors', 'sizes', 'materials', 'gender', 'imagesToRemove'];
    for (const field of fieldsToParse) {
        if (body[field] && typeof body[field] === 'string') {
            try {
                body[field] = JSON.parse(body[field]);
            } catch (e) {
                console.error(`Failed to parse JSON for field ${field}:`, body[field], e);
                body[field] = [];
            }
        }
    }
};

/**
 * --- MODIFIED FUNCTION ---
 * Converts an image file buffer into a Base64 Data URI string for storage in MongoDB.
 * This change means images are no longer saved to the 'uploads/products' directory
 * but are instead stored directly within the product's database document.
 */
export const processAndSaveImage = async (file) => {
    try {
        if (!file || !file.buffer || !file.mimetype) {
            throw new Error("Invalid file object provided for processing.");
        }
        
        const dataUri = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;

        // Return the object structure the schema expects, with all properties pointing to the same Data URI.
        return {
            large: dataUri,
            medium: dataUri,
            thumbnail: dataUri
        };
    } catch (error) {
        console.error("Error converting image to Data URI:", error);
        throw new Error("Image processing failed.");
    }
};


/**
 * --- MODIFIED FUNCTION ---
 * This function is now a "no-op" (no-operation).
 * Since images are stored as Data URIs directly in the database, there are no
 * physical files to delete from the server's file system. This function is kept
 * to prevent errors in the controllers that call it, maintaining compatibility with the
 * existing code structure.
 */
export const deleteFile = async (filePath) => {
    // No action needed. Images are self-contained within the database document.
    return;
};

/**
 * Converts a video buffer to a Base64 Data URI.
 */
export const videoBufferToDataUri = (file) => {
    return `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
};