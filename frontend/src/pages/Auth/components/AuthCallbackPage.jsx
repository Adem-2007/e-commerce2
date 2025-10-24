// src/pages/Auth/components/AuthCallbackPage.jsx

import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useLanguage } from '../../../context/LanguageContext';
import { getHomeRouteForRole } from '../../../utils/rolePermissions';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const AuthCallbackPage = () => {
    const { login, user } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const { t, dir } = useLanguage();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');

        const authenticateUser = async (authToken) => {
            try {
                // --- FIX: Use the token to fetch the user profile from the new endpoint ---
                const res = await fetch(`${API_BASE_URL}/api/users/me`, {
                    headers: {
                        'Authorization': `Bearer ${authToken}`
                    }
                });

                if (!res.ok) {
                    throw new Error('Failed to fetch user data.');
                }

                const userData = await res.json();
                
                // Now that we have the data, call the main login function
                login(userData, authToken);

            } catch (error) {
                console.error("Authentication failed:", error);
                navigate('/auth', { state: { error: 'Authentication failed. Please try again.' }, replace: true });
            }
        };

        if (token) {
            authenticateUser(token);
        } else {
            // If no token is found, redirect back to the login page.
            navigate('/auth', { state: { error: 'Authentication failed. Missing credentials.' }, replace: true });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // This effect should only run once on mount

    useEffect(() => {
        // This second effect correctly waits for the user object to be set in the context
        // before redirecting to the appropriate dashboard page.
        if (user) {
            const homeRoute = getHomeRouteForRole(user.permissions);
            navigate(homeRoute, { replace: true });
        }
    }, [user, navigate]);

    // Display a loading indicator while the authentication process is in progress
    return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 font-sans" dir={dir}>
            <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 rounded-full bg-blue-600 animate-pulse" style={{ animationDelay: '-0.3s' }}></div>
                <div className="w-4 h-4 rounded-full bg-blue-600 animate-pulse" style={{ animationDelay: '-0.15s' }}></div>
                <div className="w-4 h-4 rounded-full bg-blue-600 animate-pulse"></div>
            </div>
            <p className="mt-4 text-gray-600">{t('auth_callback.authenticating') || 'Authenticating, please wait...'}</p>
        </div>
    );
};

export default AuthCallbackPage;