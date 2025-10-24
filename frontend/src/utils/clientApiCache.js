// src/utils/clientApiCache.js

const cache = new Map();

/**
 * Fetches data from the API with caching.
 */
export const getCachedData = async (key, apiCall, ttl = 5 * 60 * 1000) => {
    const now = Date.now();
    const cachedItem = cache.get(key);

    if (cachedItem && now < cachedItem.expiry) {
        return cachedItem.data;
    }

    const response = await apiCall();
    const data = response.data;

    cache.set(key, { data, expiry: now + ttl });
    return data;
};

/**
 * Invalidates a specific key in the cache.
 */
export const invalidateCache = (key) => {
    cache.delete(key);
};