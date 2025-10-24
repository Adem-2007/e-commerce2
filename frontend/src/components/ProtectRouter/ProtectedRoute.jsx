// src/components/ProtectRouter/ProtectedRoute.jsx

import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getHomeRouteForRole, isRouteAllowed } from '../../utils/rolePermissions';

const ProtectedRoute = () => {
    const { token, user } = useAuth();
    const location = useLocation();

    // 1. Check for token
    if (!token) {
        return <Navigate to="/auth" state={{ from: location }} replace />;
    }

    // 2. Wait for user data to load
    if (!user || !user.permissions) {
        return <div>Loading...</div>;
    }

    // 3. ADMIN OVERRIDE: If the user is an admin, grant immediate access.
    if (user.role === 'admin') {
        return <Outlet />; // Render the requested page
    }

    // 4. STANDARD USERS: For any other role, perform the permission check.
    const isAuthorized = isRouteAllowed(location.pathname, user.permissions);
    if (!isAuthorized) {
        // If not allowed, redirect them to their default home page.
        const homeRoute = getHomeRouteForRole(user.permissions);
        return <Navigate to={homeRoute} replace />;
    }

    // 5. If the standard user is authorized, render the requested page.
    return <Outlet />;
};

export default ProtectedRoute;