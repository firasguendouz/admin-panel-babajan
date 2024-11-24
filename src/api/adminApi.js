import axiosInstance from './axiosInstance';

// ==================== AUTH ====================

// Admin login
export const loginAdmin = async (credentials) => {
  return axiosInstance.post('/admin/login', credentials);
};

// Register a new admin (Super Admin only)
export const registerAdmin = async (data) => {
  return axiosInstance.post('/admin/register', data);
};

// ==================== USERS ====================

// Get all users with optional filters and pagination
export const fetchUsers = async (params = {}) => {
  return axiosInstance.get('/admin/users', { params });
};

// Delete a user by ID
export const deleteUser = async (userId) => {
  return axiosInstance.delete(`/admin/users/${userId}`);
};

// Update user information by ID (Admin or Super Admin only)
export const updateUser = async (userId, updateData) => {
  return axiosInstance.patch(`/admin/users/${userId}`, updateData);
};

// ==================== ORDERS ====================

// Get all orders with optional filters and pagination
export const fetchOrders = async (params = {}) => {
  return axiosInstance.get('/admin/orders', { params });
};

// Get order details by ID
export const fetchOrderDetails = async (orderId) => {
  return axiosInstance.get(`/admin/orders/${orderId}`);
};

// Update order details by ID
export const updateOrder = async (orderId, updateData) => {
  return axiosInstance.patch(`/admin/orders/${orderId}`, updateData);
};

// ==================== ITEMS ====================

// Create a new item
export const createItem = async (data) => {
  return axiosInstance.post('/admin/items', data);
};

// Get all items with optional search, filters, and pagination
export const fetchItems = async (params = {}) => {
  return axiosInstance.get('/items', { params });
};

// Update an existing item by ID
export const updateItem = async (itemId, data) => {
  return axiosInstance.put(`/admin/items/${itemId}`, data);
};

// Soft delete an item by ID
export const deleteItem = async (itemId) => {
  return axiosInstance.delete(`/admin/items/${itemId}`);
};

// Restore a soft-deleted item by ID
export const restoreItem = async (itemId) => {
  return axiosInstance.patch(`/admin/items/${itemId}/restore`);
};

// ==================== PROMOTIONS ====================

// Create a new promotion
export const createPromotion = async (data) => {
  return axiosInstance.post('/admin/promotions', data);
};

// Get all promotions with optional filters and pagination
export const fetchPromotions = async (params = {}) => {
  return axiosInstance.get('/admin/promotions', { params });
};

// Update an existing promotion by ID
export const updatePromotion = async (promoId, data) => {
  return axiosInstance.put(`/admin/promotions/${promoId}`, data);
};

// Delete a promotion by ID
export const deletePromotion = async (promoId) => {
  return axiosInstance.delete(`/admin/promotions/${promoId}`);
};

// Toggle promotion active status by ID
export const togglePromotionStatus = async (promoId) => {
  return axiosInstance.patch(`/admin/promotions/${promoId}/status`);
};

// ==================== NOTIFICATIONS ====================

// Create a new notification (to a specific user or all users)
export const createNotification = async (data) => {
  return axiosInstance.post('/notifications', data);
};

// Get all notifications with optional filters and pagination
export const fetchNotifications = async (params = {}) => {
  return axiosInstance.get('/notifications', { params });
};

// Mark a single notification as read by ID
export const markNotificationAsRead = async (notificationId) => {
  return axiosInstance.patch(`/notifications/${notificationId}/read`);
};

// Mark all notifications as read for the logged-in user
export const markAllNotificationsAsRead = async () => {
  return axiosInstance.patch('/notifications/read-all');
};

// Delete a notification by ID
export const deleteNotification = async (notificationId) => {
  return axiosInstance.delete(`/notifications/${notificationId}`);
};

// Fetch unread notifications count for the logged-in user
export const fetchUnreadCount = async () => {
  return axiosInstance.get('/notifications/unread-count');
};

// ==================== ANALYTICS ====================

// Fetch admin analytics data
export const fetchAnalytics = async () => {
  return axiosInstance.get('/admin/analytics');
};
