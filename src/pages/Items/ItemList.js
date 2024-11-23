import './ItemList.css';

import React, { useEffect, useState } from 'react';
import { deleteItem, fetchItems } from '../../api/adminApi';

import { debounce } from '../../utils/helpers';
import { formatDate } from '../../utils/dateFormatter';

const ItemList = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [selectedItem, setSelectedItem] = useState(null); // For modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchItemData = async () => {
      setLoading(true);
      try {
        const params = {
          search,
          category: categoryFilter,
          page,
          limit,
        };
        const response = await fetchItems(params);
        setItems(response.data.data);
        setTotalItems(response.data.meta.total);
      } catch (error) {
        console.error('Error fetching items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchItemData();
  }, [search, categoryFilter, page, limit]);

  const handleDelete = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await deleteItem(itemId);
        setItems(items.filter((item) => item._id !== itemId));
        alert('Item deleted successfully.');
      } catch (error) {
        console.error('Error deleting item:', error);
      }
    }
  };

  const handleSearchChange = debounce((value) => setSearch(value), 500);

  const handleViewItem = (item) => {
    setSelectedItem(item); // Set the selected item
    setIsModalOpen(true); // Open the modal
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const totalPages = Math.ceil(totalItems / limit);

  return (
    <div className="item-list-container">
      <h2>Item Management</h2>

      {/* Filters */}
      <div className="item-filters">
        <input
          type="text"
          placeholder="Search by name or ID..."
          onChange={(e) => handleSearchChange(e.target.value)}
        />
        <select onChange={(e) => setCategoryFilter(e.target.value)} value={categoryFilter}>
          <option value="">All Categories</option>
          <option value="Fruits">Fruits</option>
          <option value="Vegetables">Vegetables</option>
          <option value="Beverages">Beverages</option>
        </select>
      </div>

      {/* Item Table */}
      {loading ? (
        <p>Loading items...</p>
      ) : (
        <table className="item-table">
          <thead>
            <tr>
              <th>Item ID</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Tags</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.length > 0 ? (
              items.map((item) => (
                <tr key={item._id}>
                  <td>{item._id}</td>
                  <td>{item.name.en}</td>
                  <td>{item.category}</td>
                  <td>${item.price.toFixed(2)}</td>
                  <td>{item.stock}</td>
                  <td>{item.tags.join(', ')}</td>
                  <td>{formatDate(item.createdAt)}</td>
                  <td>
                    <button
                      className="view-button"
                      onClick={() => handleViewItem(item)}
                    >
                      View
                    </button>
                    <button
                      className="edit-button"
                      onClick={() => alert(`Edit feature for item ${item.name.en} coming soon!`)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => handleDelete(item._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8">No items found.</td>
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

      {/* Item Details Modal */}
      {isModalOpen && selectedItem && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-button" onClick={closeModal}>
              &times;
            </span>
            <h3>Item Details</h3>
            <p>
              <strong>Item ID:</strong> {selectedItem._id}
            </p>
            <p>
              <strong>Name:</strong> {selectedItem.name.en}
            </p>
            <p>
              <strong>Category:</strong> {selectedItem.category}
            </p>
            <p>
              <strong>Price:</strong> ${selectedItem.price.toFixed(2)}
            </p>
            <p>
              <strong>Stock:</strong> {selectedItem.stock}
            </p>
            <p>
              <strong>Tags:</strong> {selectedItem.tags.join(', ') || 'No tags'}
            </p>
            <p>
              <strong>Available:</strong> {selectedItem.available ? 'Yes' : 'No'}
            </p>
            <p>
              <strong>Created At:</strong> {formatDate(selectedItem.createdAt)}
            </p>
            <p>
              <strong>Photos:</strong>
              <ul>
                {selectedItem.photos.map((photo, index) => (
                  <li key={index}>
                    <img src={photo} alt={selectedItem.name.en} style={{ width: '50px', height: '50px' }} />
                  </li>
                ))}
              </ul>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemList;
