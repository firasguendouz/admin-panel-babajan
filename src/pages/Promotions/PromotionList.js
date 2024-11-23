import './PromotionList.css';

import React, { useEffect, useState } from 'react';
import {
  deletePromotion,
  fetchPromotions,
  togglePromotionStatus,
} from '../../api/adminApi';

import { debounce } from '../../utils/helpers';
import { formatDate } from '../../utils/dateFormatter';

const PromotionList = () => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPromotions, setTotalPromotions] = useState(0);
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchPromotionData = async () => {
      setLoading(true);
      try {
        const params = {
          search,
          status: statusFilter,
          page,
          limit,
        };
        const response = await fetchPromotions(params);
        setPromotions(response.data.data);
        setTotalPromotions(response.data.pagination.total);
      } catch (error) {
        console.error('Error fetching promotions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPromotionData();
  }, [search, statusFilter, page, limit]);

  const handleSearchChange = debounce((value) => setSearch(value), 500);

  const handleDelete = async (promoId) => {
    if (window.confirm('Are you sure you want to delete this promotion?')) {
      try {
        await deletePromotion(promoId);
        setPromotions(promotions.filter((promo) => promo._id !== promoId));
        alert('Promotion deleted successfully.');
      } catch (error) {
        console.error('Error deleting promotion:', error);
      }
    }
  };

  const handleToggleStatus = async (promoId) => {
    try {
      await togglePromotionStatus(promoId);
      setPromotions(
        promotions.map((promo) =>
          promo._id === promoId ? { ...promo, active: !promo.active } : promo
        )
      );
      alert('Promotion status updated successfully.');
    } catch (error) {
      console.error('Error toggling promotion status:', error);
    }
  };

  const handleViewPromotion = (promotion) => {
    setSelectedPromotion(promotion);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPromotion(null);
  };

  const totalPages = Math.ceil(totalPromotions / limit);

  return (
    <div className="promotion-list-container">
      <h2>Promotion Management</h2>

      {/* Filters */}
      <div className="promotion-filters">
        <input
          type="text"
          placeholder="Search by name or description..."
          onChange={(e) => handleSearchChange(e.target.value)}
        />
        <select onChange={(e) => setStatusFilter(e.target.value)} value={statusFilter}>
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Promotion Table */}
      {loading ? (
        <p>Loading promotions...</p>
      ) : (
        <table className="promotion-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Type</th>
              <th>Discount</th>
              <th>Status</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {promotions.length > 0 ? (
              promotions.map((promo) => (
                <tr key={promo._id}>
                  <td>{promo._id}</td>
                  <td>{promo.title}</td>
                  <td>{promo.type}</td>
                  <td>{promo.discount}</td>
                  <td>{promo.active ? 'Active' : 'Inactive'}</td>
                  <td>{formatDate(promo.startDate)}</td>
                  <td>{formatDate(promo.endDate)}</td>
                  <td>
                    <button
                      className="view-button"
                      onClick={() => handleViewPromotion(promo)}
                    >
                      View
                    </button>
                    <button
                      className="edit-button"
                      onClick={() => alert(`Edit feature for promotion ${promo.title} coming soon!`)}
                    >
                      Edit
                    </button>
                    <button
                      className="status-button"
                      onClick={() => handleToggleStatus(promo._id)}
                    >
                      {promo.active ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => handleDelete(promo._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8">No promotions found.</td>
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

      {/* Promotion Details Modal */}
      {isModalOpen && selectedPromotion && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-button" onClick={closeModal}>
              &times;
            </span>
            <h3>Promotion Details</h3>
            <p>
              <strong>ID:</strong> {selectedPromotion._id}
            </p>
            <p>
              <strong>Title:</strong> {selectedPromotion.title}
            </p>
            <p>
              <strong>Description:</strong> {selectedPromotion.description}
            </p>
            <p>
              <strong>Type:</strong> {selectedPromotion.type}
            </p>
            <p>
              <strong>Discount:</strong> {selectedPromotion.discount}
            </p>
            <p>
              <strong>Status:</strong> {selectedPromotion.active ? 'Active' : 'Inactive'}
            </p>
            <p>
              <strong>Start Date:</strong> {formatDate(selectedPromotion.startDate)}
            </p>
            <p>
              <strong>End Date:</strong> {formatDate(selectedPromotion.endDate)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PromotionList;
