// src/pages/Dashboard/overview/DashboardOverview.jsx

import React, { useState, useEffect } from 'react';
import { DollarSign, Users } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useDashboardLanguage } from '../../../context/DashboardLanguageContext'; // Import the language hook

// Import child components
import StatCard from './components/StatCard';
import OrdersStatusChart from './components/OrdersStatusChart';
import RevenueChart from './components/RevenueChart';
import DashboardSkeleton from './components/DashboardSkeleton'; // --- IMPORT THE SKELETON COMPONENT ---

// Import the single source of truth for status styles
import { statusConfig } from '../Orders/components/StatusBadge';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const DashboardOverview = () => {
    const { user } = useAuth();
    const { t } = useDashboardLanguage(); // Use the translation function
    // State to hold the aggregated data from the new API endpoint
    const [stats, setStats] = useState(null);
    const [userCount, setUserCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- MODIFICATION: Extracted fetch logic into a reusable function ---
    const fetchDashboardData = async () => {
        try {
            // No need to set loading to true every time for background updates,
            // but for the initial load it's managed outside this function.
            setError(null);
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error("Authentication token not found. Please log in again.");
            }
            
            const authHeader = { 'Authorization': `Bearer ${token}` };

            const apiRequests = [
                fetch(`${API_BASE_URL}/api/orders/stats`, { headers: authHeader })
            ];

            if (user?.role === 'admin') {
                apiRequests.push(fetch(`${API_BASE_URL}/api/users`, { headers: authHeader }));
            }

            const [statsResponse, usersResponse] = await Promise.all(apiRequests);

            if (!statsResponse.ok) {
                throw new Error('Failed to fetch dashboard statistics.');
            }
            const statsData = await statsResponse.json();
            setStats(statsData);

            if (user?.role === 'admin' && usersResponse?.ok) {
                const usersData = await usersResponse.json();
                setUserCount(usersData.totalUsers);
            }

        } catch (err) {
            setError(err.message);
        } finally {
            // Set loading to false only after the initial fetch completes
            if (loading) {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        // --- MODIFICATION: Set up initial fetch and event listener ---
        setLoading(true);
        fetchDashboardData();

        // Listen for the custom event and refetch data when it occurs
        window.addEventListener('ordersUpdated', fetchDashboardData);

        // Cleanup: Remove the event listener when the component unmounts
        return () => {
            window.removeEventListener('ordersUpdated', fetchDashboardData);
        };
    }, [user]); // Re-fetch if the user changes

    // --- RENDER STATES ---

    if (loading) {
        return <DashboardSkeleton />;
    }

    if (error) {
        return <div className="text-center p-8 text-red-600 bg-red-50 rounded-lg">{t('error')}: {error}</div>;
    }

    // --- DATA PREPARATION (now with translations) ---

    const statusChartData = Object.keys(statusConfig)
        .filter(key => key !== 'default')
        .map(key => ({
            name: t(`status_labels.${key}`), // Use translated status label
            count: stats?.statusCounts[key] || 0,
    }));

    const statCards = [];
    if (stats?.totalRevenue && typeof stats.totalRevenue === 'object') {
        Object.entries(stats.totalRevenue).forEach(([currency, amount]) => {
            statCards.push({ 
                icon: <DollarSign size={24} />, 
                title: `${t('total_revenue')} (${currency})`,
                value: new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: currency,
                    minimumFractionDigits: 2
                }).format(amount),
                bgColor: 'bg-green-100',
                textColor: 'text-green-600',
                key: `revenue-${currency}`
            });
        });
    }

    if (user?.role === 'admin') {
        statCards.push({ 
            icon: <Users size={24} />, 
            title: t('total_users'), // Translated title
            value: userCount,
            bgColor: 'bg-indigo-100',
            textColor: 'text-indigo-600',
            key: 'total-users'
        });
    }

    Object.keys(statusConfig)
        .filter(key => key !== 'default') // Exclude the 'default' fallback status
        .forEach(statusKey => {
            const config = statusConfig[statusKey];
            const [bgColorClass] = config.classes.split(' ').filter(c => c.startsWith('bg-'));
            
            statCards.push({
                icon: config.icon,
                title: t(`status_labels.${statusKey}`), // Use translated title
                value: stats?.statusCounts[statusKey] || 0, // Default to 0 if no count is available
                bgColor: bgColorClass || 'bg-gray-100',
                textColor: config.textColor,
                key: `status-${statusKey}`
            });
        });

    return (
        <div className="space-y-12">
            <div>
                <h1 className="text-3xl font-bold text-gray-800">{t('dashboard_overview_title')}</h1>
                <p className="text-base text-gray-500 mt-1">{t('dashboard_overview_desc')}</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                {statCards.map(card => (
                    <StatCard 
                        key={card.key}
                        icon={card.icon}
                        title={card.title}
                        value={card.value}
                        iconBgColor={card.bgColor}
                        iconTextColor={card.textColor}
                    />
                ))}
            </div>

            <div className="grid grid-cols-1 gap-8">
                <div>
                     <RevenueChart 
                        data={stats?.revenueChartData || []} 
                        title={t('daily_revenue')} 
                        chartLabel={t('revenue')}
                     />
                </div>
                <div>
                    <OrdersStatusChart 
                        data={statusChartData} 
                        title={t('orders_by_status')}
                        chartLabel={t('order_count')}
                    />
                </div>
            </div>
        </div>
    );
};

export default DashboardOverview;