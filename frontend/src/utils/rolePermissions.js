// src/utils/rolePermissions.js

/**
 * --- REVISED ---
 * Determines the user's home route based on their specific permissions.
 * It returns the first permission in their list, which acts as their default landing page.
 * @param {string[]} permissions - The user's array of allowed route paths.
 * @returns {string} The path to the user's home route or '/auth' if none exist.
 */
export const getHomeRouteForRole = (permissions) => {
    if (permissions && permissions.length > 0) {
        // The user's default page is the first one in their permissions list.
        return permissions[0];
    }
    // If a user has no permissions, they cannot access the dashboard.
    return '/auth'; 
};

/**
 * --- NEW & RECOMMENDED ---
 * Checks if a user is allowed to access a given route path.
 * This should be used in any client-side route guards instead of the old logic.
 * @param {string} path - The route path to check (e.g., '/dashboard/orders').
 * @param {string[]} permissions - The user's array of allowed route paths.
 * @returns {boolean} - True if access is allowed, false otherwise.
 */
export const isRouteAllowed = (path, permissions) => {
    if (!permissions) {
        return false;
    }
    return permissions.includes(path);
};

/**
 * --- DEPRECATED ---
 * This function is no longer the source of truth for route access.
 * It relied on a static, role-based list which has been replaced by user-specific permissions.
 */
export const getValidRoutesForRole = (role) => {
    // This logic is no longer reliable and should not be used for access control.
    return [];
};