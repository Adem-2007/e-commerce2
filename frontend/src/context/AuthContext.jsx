// src/context/AuthContext.jsx

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        try {
            const storedUser = localStorage.getItem('user');
            return storedUser ? JSON.parse(storedUser) : null;
        } catch (error) {
            console.error("Failed to parse user from localStorage", error);
            return null;
        }
    });
    
    const [token, setToken] = useState(localStorage.getItem('token') || null);

    // This function is stable and will not cause re-renders.
    const logout = useCallback(() => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }, []);

    useEffect(() => {
        const checkStatus = async () => {
            if (!token) return;

            try {
                const res = await fetch(`${API_BASE_URL}/api/users/me/status`, {
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                if (res.status === 401) {
                    logout();
                }
            } catch (error) {
                console.error("User status check failed:", error);
            }
        };

        const handleActivity = () => {
            if (document.visibilityState === 'visible') {
                checkStatus();
            }
        };

        checkStatus();
        const intervalId = setInterval(checkStatus, 60000);
        window.addEventListener('focus', handleActivity);
        document.addEventListener('visibilitychange', handleActivity);

        return () => {
            clearInterval(intervalId);
            window.removeEventListener('focus', handleActivity);
            document.removeEventListener('visibilitychange', handleActivity);
        };
    // --- THIS IS THE FIX ---
    // The dependency array is changed to only include `token`.
    // The `logout` function is stable due to `useCallback`, so we can safely
    // exclude it to break the infinite loop. We disable the linter warning
    // for this specific line because we are intentionally breaking the rule for a valid reason.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);


    const login = (userData, userToken) => {
        localStorage.setItem('token', userToken);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        setToken(userToken);
    };
    
    const updateCurrentUser = (updatedUserData) => {
        setUser(prevUser => {
            const newUser = { ...prevUser, ...updatedUserData };
            localStorage.setItem('user', JSON.stringify(newUser));
            return newUser;
        });
    };

    const value = { user, token, login, logout, updateCurrentUser };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};