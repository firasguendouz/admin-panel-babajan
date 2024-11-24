import './ItemList.css';

import React, { useEffect, useState } from 'react';
import { createItem, deleteItem, fetchItems, updateItem } from '../../api/adminApi';

import ItemEditModal from './ItemEditModal';
import ItemFilters from './ItemFilters';
import ItemViewModal from './ItemViewModal';

const ItemList = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', category: '', availability: '' });
  const [selectedItem, setSelectedItem] = useState(null);
  const [editableItem, setEditableItem] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  // Fetch items from API
  useEffect(() => {
    const fetchItemData = async () => {
      setLoading(true);
      try {
        const params = { ...filters, page, limit };
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
  }, [filters, page, limit]);

  // Handle filter changes
  const handleFiltersChange = (updatedFilters) => {
    setFilters(updatedFilters);
    setPage(1); // Reset to the first page on filter change
  };

  const handleDelete = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await deleteItem(itemId);
        setItems((prev) => prev.filter((item) => item._id !== itemId));
        alert('Item deleted successfully.');
      } catch (error) {
        console.error('Error deleting item:', error);
      }
    }
  };

  const handleSaveEdit = async (itemId, updatedData) => {
    try {
      const response = await updateItem(itemId, updatedData);
      setItems((prev) =>
        prev.map((item) => (item._id === itemId ? { ...item, ...response.data.data } : item))
      );
      setEditableItem(null);
      alert('Item updated successfully.');
    } catch (error) {
      console.error('Error updating item:', error);
      alert('Failed to update item.');
    }
  };

  const handleCreateItem = async (newItemData) => {
    try {
      const response = await createItem(newItemData);
      setItems((prev) => [response.data.data, ...prev]);
      alert('New item created successfully.');
    } catch (error) {
      console.error('Error creating item:', error);
      alert('Failed to create item.');
    }
  };

  const totalPages = Math.ceil(totalItems / limit);

  return (
    <div className="item-list-container">
      <h2>Item Management</h2>

      <ItemFilters onFiltersChange={handleFiltersChange} onCreateNewItem={() => setEditableItem({})} />

      {loading ? (
        <p>Loading items...</p>
      ) : (
        <table className="item-table">
          <thead>
            <tr>
              <th>Photo</th>
              <th>Item ID</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Available</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.length > 0 ? (
              items.map((item) => (
                <tr key={item._id}>
                  <td>
                    {item.photos.length > 0 ? (
                      <img
                        src={item.photos[0]}
                        alt={item.name.en}
                        style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                      />
                    ) : (
                      'No Photo'
                    )}
                  </td>
                  <td>{item._id}</td>
                  <td>{item.name.en}</td>
                  <td>{item.category}</td>
                  <td>${item.price.toFixed(2)}</td>
                  <td>{item.stock}</td>
                  <td>{item.available ? 'Yes' : 'No'}</td>
                  <td>
                    <button onClick={() => setSelectedItem(item)}>View</button>
                    <button onClick={() => setEditableItem(item)}>Edit</button>
                    <button onClick={() => handleDelete(item._id)}>Delete</button>
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

      <div className="pagination">
        <button disabled={page === 1} onClick={() => setPage((prev) => prev - 1)}>
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button disabled={page === totalPages} onClick={() => setPage((prev) => prev + 1)}>
          Next
        </button>
      </div>

      {selectedItem && <ItemViewModal item={selectedItem} onClose={() => setSelectedItem(null)} />}
      {editableItem && (
        <ItemEditModal
          item={editableItem}
          onSave={(updatedData) =>
            editableItem._id ? handleSaveEdit(editableItem._id, updatedData) : handleCreateItem(updatedData)
          }
          onClose={() => setEditableItem(null)}
        />
      )}
    </div>
  );
};

export default ItemList;
