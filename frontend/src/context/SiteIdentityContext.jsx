// src/context/SiteIdentityContext.jsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const SiteIdentityContext = createContext();

export const useSiteIdentity = () => useContext(SiteIdentityContext);

export const SiteIdentityProvider = ({ children }) => {
    const [siteName, setSiteName] = useState(''); // Your default title
    const [logoUrl, setLogoUrl] = useState('/'); // Your default favicon

    const fetchIdentity = async () => {
        try {
            const { data } = await axios.get(`${API_BASE_URL}/api/logo`);
            if (data.name) {
                setSiteName(data.name);
            }
            if (data.imageUrl) {
                // Use the full URL for the favicon link
                setLogoUrl(data.imageUrl);
            }
        } catch (error) {
            console.error('Failed to fetch site identity:', error);
        }
    };

    useEffect(() => {
        fetchIdentity();

        // Listen for the custom event dispatched from LogoControl to update in real-time
        const handleLogoUpdate = () => fetchIdentity();
        window.addEventListener('logoUpdated', handleLogoUpdate);

        // Cleanup the event listener
        return () => {
            window.removeEventListener('logoUpdated', handleLogoUpdate);
        };
    }, []);

    return (
        <SiteIdentityContext.Provider value={{ siteName, logoUrl }}>
            {children}
        </SiteIdentityContext.Provider>
    );
};