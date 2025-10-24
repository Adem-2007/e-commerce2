// backend/utils/imageUpload.js

// For development, we can store the Base64 string directly in the database.
export const uploadImage = async (base64Image) => {
    if (base64Image) {
        return base64Image;
    }
    return null;
};