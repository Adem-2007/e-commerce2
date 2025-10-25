// src/components/CachedImage/CachedImage.jsx

import React, { useState, useEffect } from 'react';
import { getCachedImage, cacheImage, blobToBase64 } from '../../utils/imageCaching';

const CachedImage = ({ src, alt, ...props }) => {
    // We can no longer check the cache synchronously.
    // Start with a null source and a loading state.
    const [imageSrc, setImageSrc] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const loadImage = async () => {
            if (!src) {
                if (isMounted) setIsLoading(false);
                return;
            }

            // 1. Asynchronously check IndexedDB for a cached image.
            const cachedData = await getCachedImage(src);

            if (isMounted && cachedData) {
                setImageSrc(cachedData);
                setIsLoading(false);
                return; // Found in cache, we're done.
            }

            // 2. If not in cache, fetch the image from the network.
            try {
                const response = await fetch(src);
                if (!response.ok) throw new Error('Image fetch failed');
                
                const blob = await response.blob();
                const base64 = await blobToBase64(blob);
                
                if (isMounted) {
                    setImageSrc(base64);
                    cacheImage(src, base64); // Attempt to cache the new image in IndexedDB
                }
            } catch (error) {
                console.error(`Failed to load or cache image: ${src}`, error);
                if (isMounted) {
                    // Fallback to the original URL on error so the browser can try to load it.
                    setImageSrc(src);
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        loadImage();

        return () => {
            isMounted = false;
        };
    }, [src]); // The effect only needs to re-run if the src prop changes.

    if (isLoading) {
        return <div className="w-full h-full bg-slate-200 rounded-md animate-pulse" {...props}></div>;
    }

    if (!imageSrc) {
        return <div className="w-full h-full bg-slate-200 rounded-md flex items-center justify-center text-slate-500 text-xs" {...props}>No Image</div>;
    }

    return <img src={imageSrc} alt={alt} {...props} />;
};

export default CachedImage;