import './OrderList.css';

import React, { useEffect, useState } from 'react';
import { fetchOrders, updateOrderStatus } from '../../api/adminApi';

import { debounce } from '../../utils/helpers';
import { formatDate } from '../../utils/dateFormatter';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalOrders, setTotalOrders] = useState(0);
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null); // For modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchOrderData = async () => {
      setLoading(true);
      try {
        const params = {
          search,
          status: statusFilter,
          page,
          limit,
        };
        const response = await fetchOrders(params);
        setOrders(response.data.data);
        setTotalOrders(response.data.pagination.total);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderData();
  }, [search, statusFilter, page, limit]);

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await updateOrderStatus({ orderId, status: newStatus });
      setOrders(
        orders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
      alert('Order status updated successfully.');
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const handleSearchChange = debounce((value) => setSearch(value), 500);

  const handleViewOrder = (order) => {
    setSelectedOrder(order); // Set the selected order
    setIsModalOpen(true); // Open the modal
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const totalPages = Math.ceil(totalOrders / limit);

  return (
    <div className="order-list-container">
      <h2>Order Management</h2>

      {/* Filters */}
      <div className="order-filters">
        <input
          type="text"
          placeholder="Search by customer name, email, or ID..."
          onChange={(e) => handleSearchChange(e.target.value)}
        />
        <select onChange={(e) => setStatusFilter(e.target.value)} value={statusFilter}>
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Order Table */}
      {loading ? (
        <p>Loading orders...</p>
      ) : (
        <table className="order-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Total</th>
              <th>Status</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>
                    {order.userId.name.firstName} {order.userId.name.lastName} <br />
                    <small>{order.userId.email}</small>
                  </td>
                  <td>${order.finalAmount.toFixed(2)}</td>
                  <td>{order.status}</td>
                  <td>{formatDate(order.createdAt)}</td>
                  <td>
                    <button
                      className="view-button"
                      onClick={() => handleViewOrder(order)}
                    >
                      View
                    </button>
                    {order.status === 'pending' && (
                      <button
                        className="complete-button"
                        onClick={() => handleStatusUpdate(order._id, 'completed')}
                      >
                        Complete
                      </button>
                    )}
                    {order.status !== 'cancelled' && (
                      <button
                        className="cancel-button"
                        onClick={() => handleStatusUpdate(order._id, 'cancelled')}
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No orders found.</td>
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

      {/* Order Details Modal */}
      {isModalOpen && selectedOrder && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-button" onClick={closeModal}>
              &times;
            </span>
            <h3>Order Details</h3>
            <p>
              <strong>Order ID:</strong> {selectedOrder._id}
            </p>
            <p>
              <strong>Customer Name:</strong> {selectedOrder.userId.name.firstName}{' '}
              {selectedOrder.userId.name.lastName}
            </p>
            <p>
              <strong>Email:</strong> {selectedOrder.userId.email}
            </p>
            <p>
              <strong>Delivery Address:</strong> {selectedOrder.deliveryInfo.address}
            </p>
            <p>
              <strong>Total Amount:</strong> ${selectedOrder.finalAmount.toFixed(2)}
            </p>
            <p>
              <strong>Status:</strong> {selectedOrder.status}
            </p>
            <p>
              <strong>Payment Method:</strong> {selectedOrder.paymentDetails.method}
            </p>
            <p>
              <strong>Paid At:</strong>{' '}
              {selectedOrder.paymentDetails.paidAt
                ? formatDate(selectedOrder.paymentDetails.paidAt)
                : 'Not Paid'}
            </p>
            <h4>Items</h4>
            <ul>
              {selectedOrder.items.map((item) => (
                <li key={item._id}>
                  Item ID: {item.itemId}, Quantity: {item.quantity}, Total: ${item.total.toFixed(2)}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderList;
