// frontend/src/api/api.js

// 1. Read the API base URL from the environment variables.
// This will be 'http://34.63.219.79:5000' in production 
// and 'http://localhost:5000' in development.
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 2. Export specific endpoints for cleaner imports in your components.
export const HERO_API_URL = `${API_BASE_URL}/api/hero`;
export const PRODUCTS_API_URL = `${API_BASE_URL}/api/products`;
// --- NEW: Add the categories endpoint ---
export const CATEGORIES_API_URL = `${API_BASE_URL}/api/categories`;
// --- FIX: Add the info endpoint ---
export const INFO_API_URL = `${API_BASE_URL}/api/info`;
// Add other endpoints here as you need them...