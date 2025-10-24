// category/functions/processCategoryImage.js
import sharp from 'sharp';

export const processCategoryImage = async (buffer) => {
    const imageBuffer = await sharp(buffer)
        .resize(1280, 720, { fit: 'inside', withoutEnlargement: true })
        .toFormat('webp', { quality: 65 }) // UPDATED: Lowered quality for better compression
        .toBuffer();
    const imageUrl = `data:image/webp;base64,${imageBuffer.toString('base64')}`;

    const thumbBuffer = await sharp(buffer)
        .resize(400, 400, { fit: 'cover' })
        .toFormat('webp', { quality: 40 }) // UPDATED: More aggressive compression for thumbnails
        .toBuffer();
    const thumbnailUrl = `data:image/webp;base64,${thumbBuffer.toString('base64')}`;
        
    return { imageUrl, thumbnailUrl };
};