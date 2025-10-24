// controllers/order/index.js
import { createOrder } from './functions/createOrder.js';
import { deleteOrder } from './functions/deleteOrder.js';
import { getAllOrders } from './functions/getAllOrders.js';
import { getOrderStats } from './functions/getOrderStats.js';
import { updateOrderStatus } from './functions/updateOrderStatus.js';

export {
    createOrder,
    deleteOrder,
    getAllOrders,
    getOrderStats,
    updateOrderStatus
};