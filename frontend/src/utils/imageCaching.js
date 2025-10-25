// src/utils/imageCaching.js

const DB_NAME = 'ImageCacheDB';
const DB_VERSION = 1;
const STORE_NAME = 'imageCache';
const CACHE_EXPIRATION_MS = 10 * 60 * 1000; // 10 minutes

/**
 * Opens and initializes the IndexedDB database.
 * @returns {Promise<IDBDatabase>} A promise that resolves with the database instance.
 */
const openDB = () => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                // Use 'url' as the keyPath for efficient lookups.
                db.createObjectStore(STORE_NAME, { keyPath: 'url' });
            }
        };

        request.onsuccess = (event) => resolve(event.target.result);
        request.onerror = (event) => reject(event.target.error);
    });
};

/**
 * Clears expired images from the IndexedDB store.
 * This is more efficient than clearing the entire cache.
 */
const clearExpiredImages = async () => {
    try {
        const db = await openDB();
        const transaction = db.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const cursorRequest = store.openCursor();

        cursorRequest.onsuccess = (event) => {
            const cursor = event.target.result;
            if (cursor) {
                const item = cursor.value;
                if (Date.now() - item.timestamp > CACHE_EXPIRATION_MS) {
                    cursor.delete(); // Delete the expired item
                }
                cursor.continue();
            }
        };
    } catch (error) {
        console.error("Failed to clear expired images:", error);
    }
};

/**
 * Caches an image in IndexedDB.
 * @param {string} url - The unique URL of the image.
 * @param {string} base64Data - The Base64 representation of the image.
 */
export const cacheImage = async (url, base64Data) => {
    try {
        const db = await openDB();
        const transaction = db.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);

        const cacheItem = {
            url: url, // The keyPath
            data: base64Data,
            timestamp: Date.now(),
        };

        store.put(cacheItem);
        
        // Occasionally clean up expired items to maintain the cache.
        // This avoids running a potentially slow cleanup on every single image save.
        if (Math.random() < 0.05) { // Run approximately 5% of the time
            await clearExpiredImages();
        }

    } catch (error) {
        console.error("Failed to cache image in IndexedDB:", error);
    }
};

/**
 * Retrieves a cached image from IndexedDB, handling expiration.
 * This is now an async function.
 * @param {string} url - The unique URL of the image.
 * @returns {Promise<string|null>} A promise resolving with the Base64 data URI, or null.
 */
export const getCachedImage = (url) => {
    return new Promise(async (resolve) => {
        try {
            const db = await openDB();
            const transaction = db.transaction(STORE_NAME, 'readonly');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.get(url);

            request.onsuccess = (event) => {
                const item = event.target.result;
                if (!item) {
                    resolve(null);
                    return;
                }

                // Check if the item has expired
                if (Date.now() - item.timestamp > CACHE_EXPIRATION_MS) {
                    resolve(null);
                    // Asynchronously clear this single expired item. No need to block for this.
                    clearExpiredImages();
                } else {
                    resolve(item.data);
                }
            };
            
            request.onerror = () => resolve(null);

        } catch (error) {
            console.error("Failed to retrieve image from IndexedDB:", error);
            resolve(null);
        }
    });
};

/**
 * Converts an image blob to a Base64 data URI. (This function remains unchanged)
 * @param {Blob} blob - The image blob from a fetch response.
 * @returns {Promise<string>} A promise that resolves with the Base64 string.
 */
export const blobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};