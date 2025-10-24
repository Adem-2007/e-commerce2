// src/pages/Dashboard/Orders/OrdersPage.jsx

import React, { useState, useEffect, useMemo, useCallback, lazy, Suspense } from 'react';
import { FiArchive, FiChevronLeft, FiChevronRight } from 'react-icons/fi'; // MODIFIED: Replaced lucide-react with react-icons
import * as XLSX from 'xlsx';
import { subDays, format } from 'date-fns';
import { useDashboardLanguage } from '../../../context/DashboardLanguageContext';

import DashboardHeader from './components/DashboardHeader';
import OrderCard from './components/OrderCard';
import OrderCardSkeleton from './components/OrderCardSkeleton';
import OrdersSummarySkeleton from './components/OrdersSummarySkeleton';

// --- PERFORMANCE: Lazily load the OrdersSummary component ---
const OrdersSummary = lazy(() => import('./components/OrdersSummary'));

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const ORDERS_PER_PAGE = 10;

const formatProductsForExcel = (order) => {
    if (!order.products || order.products.length === 0) return 'No products';
    return order.products.map(p => `${p.product.name} (Qty: ${p.quantity}, Price: ${p.price})`).join('; ');
};

const OrdersPage = () => {
    const [allOrders, setAllOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [view, setView] = useState('details');
    const { t, dir } = useDashboardLanguage();
    
    const [currentPage, setCurrentPage] = useState(1);
    const [openOrderId, setOpenOrderId] = useState(null);
    
    const [dateRange, setDateRange] = useState({
        startDate: subDays(new Date(), 30),
        endDate: new Date()
    });

    const token = localStorage.getItem('token');
    
    const fetchOrders = useCallback(async () => {
        try {
            setError(null);
            setLoading(true);
            const authHeader = { 'Authorization': `Bearer ${token}` };
            const response = await fetch(`${API_BASE_URL}/api/orders?limit=2000`, { headers: authHeader });
            if (!response.ok) throw new Error('Failed to fetch orders.');
            const data = await response.json();
            setAllOrders(data.orders);
        } catch (err) { 
            setError(err.message); 
        } finally { 
            setLoading(false); 
        }
    }, [token]);

    useEffect(() => { 
        fetchOrders(); 
    }, [fetchOrders]);
    
    const filteredOrders = useMemo(() => {
        return allOrders.filter(order => {
            if (!order.createdAt) return false;
            const orderDate = new Date(order.createdAt);
            const startDate = new Date(dateRange.startDate);
            const endDate = new Date(dateRange.endDate);
            startDate.setHours(0, 0, 0, 0);
            endDate.setHours(23, 59, 59, 999);
            return orderDate >= startDate && orderDate <= endDate;
        });
    }, [allOrders, dateRange]);

    const totalPages = Math.ceil(filteredOrders.length / ORDERS_PER_PAGE);
    const currentOrders = useMemo(() => {
        const startIndex = (currentPage - 1) * ORDERS_PER_PAGE;
        const endIndex = startIndex + ORDERS_PER_PAGE;
        return filteredOrders.slice(startIndex, endIndex);
    }, [filteredOrders, currentPage]);

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(1);
        }
    }, [currentPage, totalPages]);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };
    
    const handleToggleCard = (orderId) => {
        setOpenOrderId(prevOpenId => (prevOpenId === orderId ? null : orderId));
    };

    const handleUpdateStatus = async (orderId, status) => {
        try {
            const authHeader = { 'Authorization': `Bearer ${token}` };
            const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', ...authHeader },
                body: JSON.stringify({ status })
            });
            if (!response.ok) throw new Error('Failed to update order status.');
            const updatedOrder = await response.json();
            setAllOrders(prev => prev.map(o => o._id === updatedOrder._id ? updatedOrder : o));
            // --- MODIFICATION: Dispatch event on status update ---
            window.dispatchEvent(new CustomEvent('ordersUpdated'));
        } catch (error) {
            console.error(error);
            alert(t('error_updating_status'));
        }
    };

    const handleDeleteOrder = async (orderId) => {
        if (window.confirm(t('confirm_delete'))) {
            try {
                const authHeader = { 'Authorization': `Bearer ${token}` };
                const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}`, {
                    method: 'DELETE',
                    headers: authHeader,
                });
                if (!response.ok) throw new Error('Failed to delete order.');
                await fetchOrders();
                
                // --- MODIFICATION: Dispatch a custom event after deletion is successful ---
                window.dispatchEvent(new CustomEvent('ordersUpdated'));
            } catch (error) {
                console.error(error);
                alert(t('error_deleting_order'));
            }
        }
    };

    const handleDownloadExcel = (statusKey) => {
        const ordersToExport = statusKey === 'all' 
            ? filteredOrders 
            : filteredOrders.filter(order => order.status === statusKey);

        if (ordersToExport.length === 0) {
            alert(t('no_orders_to_export'));
            return;
        }

        const dataForExcel = ordersToExport.map(order => ({
            [t('order_date')]: format(new Date(order.createdAt), 'yyyy-MM-dd HH:mm'),
            [t('customer')]: `${order.firstName} ${order.lastName}`,
            [t('phone')]: `${order.phone1}${order.phone2 ? ` / ${order.phone2}` : ''}`,
            [t('address')]: order.orderType === 'delivery' ? `${order.address}, ${order.municipality}, ${order.wilaya}` : 'N/A',
            [t('products')]: formatProductsForExcel(order),
            [t('total')]: order.totalPrice,
            [t('status')]: t(`status_labels.${order.status}`),
            [t('order_type')]: t(order.orderType),
        }));
        
        const worksheet = XLSX.utils.json_to_sheet(dataForExcel);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");
        
        const fileName = `Orders_${statusKey}_${format(new Date(), 'yyyy-MM-dd')}.xlsx`;
        XLSX.writeFile(workbook, fileName);
    };

    return (
        <div className="h-full flex flex-col" dir={dir}>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">{t('orders')}</h1>
            <div className="flex-1 flex flex-col bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden min-w-0">
                <DashboardHeader
                    onDateChange={setDateRange}
                    onDownload={handleDownloadExcel}
                    currentView={view}
                    onToggleView={() => setView(v => v === 'details' ? 'summary' : 'details')}
                />
                <div className="flex-1 overflow-y-auto bg-gray-50">
                    {loading && (view === 'details' ? <div className="p-4 md:p-6 space-y-4">{[...Array(5)].map((_, index) => <OrderCardSkeleton key={index} />)}</div> : <OrdersSummarySkeleton />)}
                    {error && <div className="text-center py-12 text-red-600">{t('error')}: {error}</div>}
                    {!loading && !error && (
                        view === 'details' ? (
                            <>
                                <div className="p-4 md:p-6 space-y-4">
                                    {currentOrders.length > 0 ? (
                                        currentOrders.map(order => (
                                            <OrderCard 
                                                key={order._id} 
                                                order={order} 
                                                onUpdateStatus={handleUpdateStatus} 
                                                onDelete={handleDeleteOrder}
                                                isOpen={openOrderId === order._id}
                                                onToggle={() => handleToggleCard(order._id)}
                                            />
                                        ))
                                    ) : (
                                        <div className="text-center py-20 px-6 text-gray-500">
                                            <FiArchive size={48} className="mx-auto text-gray-400" />
                                            <h3 className="mt-4 text-lg font-semibold text-gray-800">{t('no_orders_found')}</h3>
                                            <p className="mt-1 text-sm">{t('no_orders_match')}</p>
                                        </div>
                                    )}
                                </div>
                                {totalPages > 1 && (
                                    <div className="p-4 border-t border-gray-200 flex justify-center items-center gap-4">
                                        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}
                                            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                                            {dir === 'rtl' ? <FiChevronRight size={16} /> : <FiChevronLeft size={16} />} {t('previous')}
                                        </button>
                                        <span className="text-sm font-bold text-gray-600">
                                            {t('page')} {currentPage} {t('of')} {totalPages}
                                        </span>
                                        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}
                                            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                                            {t('next')} {dir === 'rtl' ? <FiChevronLeft size={16} /> : <FiChevronRight size={16} />}
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : ( 
                            <Suspense fallback={<OrdersSummarySkeleton />}>
                                <OrdersSummary orders={filteredOrders} onGoBack={() => setView('details')} />
                            </Suspense>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrdersPage;