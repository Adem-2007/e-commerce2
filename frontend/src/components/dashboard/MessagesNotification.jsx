import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { MessageSquare } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const MessagesNotification = () => {
    const [unreadCount, setUnreadCount] = useState(0);
    const { user } = useAuth();

    useEffect(() => {
        if (user?.role !== 'admin') return;

        const fetchUnreadCount = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.get(`${API_BASE_URL}/api/messages/unread-count`, config);
                setUnreadCount(data.count);
            } catch (error) {
                console.error("Failed to fetch unread message count:", error);
            }
        };

        fetchUnreadCount(); // Fetch immediately on mount
        const intervalId = setInterval(fetchUnreadCount, 15000); // And poll every 15 seconds

        return () => clearInterval(intervalId); // Cleanup on unmount
    }, [user]);

    // Don't render the icon if the user is not an admin
    if (user?.role !== 'admin') {
        return null;
    }

    return (
        <NavLink 
            to="/dashboard/messages"
            className="relative p-2 rounded-full text-gray-600 hover:bg-gray-100 hover:text-gray-800 transition-colors"
            aria-label={`${unreadCount} unread messages`}
        >
            <MessageSquare size={22} />
            {unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
            )}
        </NavLink>
    );
};

export default MessagesNotification;