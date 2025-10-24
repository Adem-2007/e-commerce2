// src/hooks/useImageFocus.js

import { useState, useCallback } from 'react';

/**
 * A hook to manage and apply a focal point to an image.
 * This ensures that the most important part of the image remains visible
 * when it's displayed within a container that might crop it.
 *
 * @param {object} initialFocus - The initial focus point, e.g., { x: 0.5, y: 0.5 }.
 * @returns {object} - Contains the focus point, a function to set it, and the calculated style.
 */
export const useImageFocus = (initialFocus = { x: 0.5, y: 0.5 }) => {
    const [focusPoint, setFocusPoint] = useState(initialFocus);

    /**
     * Sets the focal point based on a click event on an image element.
     * It calculates the relative coordinates (0 to 1) of the click.
     */
    const handleSetFocus = useCallback((e) => {
        const { naturalWidth, naturalHeight, getBoundingClientRect } = e.target;
        const { left, top, width, height } = getBoundingClientRect();

        // Calculate click position relative to the image, not the viewport
        const clickX = e.clientX - left;
        const clickY = e.clientY - top;

        // Normalize the coordinates to a 0-1 scale
        const focusX = clickX / width;
        const focusY = clickY / height;

        setFocusPoint({ x: focusX, y: focusY });
    }, []);

    // Memoize the style calculation to prevent unnecessary re-renders
    const focusStyle = {
        objectPosition: `${focusPoint.x * 100}% ${focusPoint.y * 100}%`
    };

    return {
        focusPoint,
        setFocusPoint,
        handleSetFocus,
        focusStyle,
    };
};