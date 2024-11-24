import './NotificationList.css';

import React, { useEffect, useState } from 'react';
import {
  deleteNotification,
  fetchNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from '../../api/adminApi';

import { formatDate } from '../../utils/dateFormatter';

const NotificationList = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalNotifications, setTotalNotifications] = useState(0);

  useEffect(() => {
    const fetchNotificationData = async () => {
      setLoading(true);
      try {
        const params = {
          page,
          limit,
        };
        const response = await fetchNotifications(params);
        setNotifications(response.data.data);
        setTotalNotifications(response.data.pagination.total);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotificationData();
  }, [page, limit]);

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markNotificationAsRead(notificationId);
      setNotifications(
        notifications.map((notification) =>
          notification._id === notificationId
            ? { ...notification, read: true }
            : notification
        )
      );
      alert('Notification marked as read.');
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications(
        notifications.map((notification) => ({ ...notification, read: true }))
      );
      alert('All notifications marked as read.');
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    if (window.confirm('Are you sure you want to delete this notification?')) {
      try {
        await deleteNotification(notificationId);
        setNotifications(
          notifications.filter((notification) => notification._id !== notificationId)
        );
        alert('Notification deleted successfully.');
      } catch (error) {
        console.error('Error deleting notification:', error);
      }
    }
  };

  const totalPages = Math.ceil(totalNotifications / limit);

  return (
    <div className="notification-list-container">
      <h2>Notifications</h2>
      <div className="notification-actions">
        <button onClick={handleMarkAllAsRead} disabled={notifications.every((n) => n.read)}>
          Mark All as Read
        </button>
      </div>
      {loading ? (
        <p>Loading notifications...</p>
      ) : (
        <table className="notification-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Message</th>
              <th>Status</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <tr key={notification._id}>
                  <td>{notification._id}</td>
                  <td>{notification.title}</td>
                  <td>{notification.message}</td>
                  <td>{notification.read ? 'Read' : 'Unread'}</td>
                  <td>{formatDate(notification.createdAt)}</td>
                  <td>
                    {!notification.read && (
                      <button
                        className="mark-as-read-button"
                        onClick={() => handleMarkAsRead(notification._id)}
                      >
                        Mark as Read
                      </button>
                    )}
                    <button
                      className="delete-button"
                      onClick={() => handleDeleteNotification(notification._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No notifications found.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {/* Pagination */}
      <div className="pagination">
        <button
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
        >
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage((prev) => prev + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default NotificationList;
