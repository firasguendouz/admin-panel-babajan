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

// Get all users
export const fetchUsers = async (params) => {
  return axiosInstance.get('/admin/users', { params });
};

// Delete a user
export const deleteUser = async (userId) => {
  return axiosInstance.delete(`/admin/users/${userId}`);
};

// Update user information (Admin or Super Admin only)
export const updateUser = async (userId, updateData) => {
  return axiosInstance.patch(`/admin/users/${userId}`, updateData);
};

// ==================== ORDERS ====================

// Get all orders
export const fetchOrders = async (params) => {
  return axiosInstance.get('/admin/orders', { params });
};

// Update order status
export const updateOrderStatus = async (data) => {
  return axiosInstance.patch('/admin/orders/status', data);
};

// ==================== ITEMS ====================

// Create a new item
export const createItem = async (data) => {
  return axiosInstance.post('/admin/items', data);
};

// Update an item
export const updateItem = async (itemId, data) => {
  return axiosInstance.put(`/admin/items/${itemId}`, data);
};

// Delete an item
export const deleteItem = async (itemId) => {
  return axiosInstance.delete(`/admin/items/${itemId}`);
};

// Restore a soft-deleted item
export const restoreItem = async (itemId) => {
  return axiosInstance.patch(`/admin/items/${itemId}/restore`);
};

// ==================== PROMOTIONS ====================

// Create a new promotion
export const createPromotion = async (data) => {
  return axiosInstance.post('/admin/promotions', data);
};

// Get all promotions
export const fetchPromotions = async (params) => {
  return axiosInstance.get('/admin/promotions', { params });
};

// Update a promotion
export const updatePromotion = async (promoId, data) => {
  return axiosInstance.put(`/admin/promotions/${promoId}`, data);
};

// Delete a promotion
export const deletePromotion = async (promoId) => {
  return axiosInstance.delete(`/admin/promotions/${promoId}`);
};

// Toggle promotion status
export const togglePromotionStatus = async (promoId) => {
  return axiosInstance.patch(`/admin/promotions/${promoId}/status`);
};

// ==================== NOTIFICATIONS ====================

// Create a new notification
export const createNotification = async (data) => {
  return axiosInstance.post('/notifications', data);
};

// Get all notifications for a user
export const fetchNotifications = async (params) => {
  return axiosInstance.get('/notifications', { params });
};

// Mark a notification as read
export const markNotificationAsRead = async (notificationId) => {
  return axiosInstance.patch(`/notifications/${notificationId}/read`);
};

// Mark all notifications as read
export const markAllNotificationsAsRead = async () => {
  return axiosInstance.patch('/notifications/read-all');
};

// Delete a notification
export const deleteNotification = async (notificationId) => {
  return axiosInstance.delete(`/notifications/${notificationId}`);
};

// Fetch unread notifications count
export const fetchUnreadCount = async () => {
  return axiosInstance.get('/notifications/unread-count');
};

// ==================== ANALYTICS ====================

// Fetch admin analytics
export const fetchAnalytics = async () => {
  return axiosInstance.get('/admin/analytics');
};
// Get all items (supports search, filter, and pagination)
export const fetchItems = async (params) => {
  return axiosInstance.get('/items', { params });
};
