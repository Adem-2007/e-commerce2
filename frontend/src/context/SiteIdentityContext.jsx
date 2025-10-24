// src/context/SiteIdentityContext.jsx

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
// --- IMPLEMENTATION: Import the caching utilities ---
import { getCachedData, invalidateCache } from '../utils/clientApiCache';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const SITE_IDENTITY_CACHE_KEY = 'siteIdentity';

const SiteIdentityContext = createContext();

export const useSiteIdentity = () => useContext(SiteIdentityContext);

export const SiteIdentityProvider = ({ children }) => {
    const [siteName, setSiteName] = useState('');
    const [logoUrl, setLogoUrl] = useState('/');

    // --- IMPLEMENTATION: Use useCallback to memoize the fetch function ---
    const fetchIdentity = useCallback(async () => {
        try {
            // Use the caching utility instead of a direct axios call
            const data = await getCachedData(SITE_IDENTITY_CACHE_KEY, () => 
                axios.get(`${API_BASE_URL}/api/logo`)
            );
            
            if (data.name) {
                setSiteName(data.name);
            }
            if (data.imageUrl) {
                setLogoUrl(data.imageUrl);
            }
        } catch (error) {
            console.error('Failed to fetch site identity:', error);
        }
    }, []);

    useEffect(() => {
        fetchIdentity();

        // This function will handle updates from the dashboard
        const handleLogoUpdate = () => {
            // --- IMPLEMENTATION: Invalidate the cache before fetching new data ---
            invalidateCache(SITE_IDENTITY_CACHE_KEY);
            fetchIdentity(); // Fetch the fresh data
        };
        
        window.addEventListener('logoUpdated', handleLogoUpdate);

        return () => {
            window.removeEventListener('logoUpdated', handleLogoUpdate);
        };
    }, [fetchIdentity]);

    return (
        <SiteIdentityContext.Provider value={{ siteName, logoUrl }}>
            {children}
        </SiteIdentityContext.Provider>
    );
};