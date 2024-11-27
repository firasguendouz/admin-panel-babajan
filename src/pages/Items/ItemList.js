import './ItemList.css';

import React, { useEffect, useState } from 'react';
import { createItem, deleteItem, fetchItems, updateItem } from '../../api/adminApi';

import ItemEditModal from './ItemEditModal';
import ItemFilters from './ItemFilters';
import ItemViewModal from './ItemViewModal';

const ItemList = () => {
  const [items, setItems] = useState([]);
  const [filters, setFilters] = useState({ search: '', category: '', availability: '' });
  const [loading, setLoading] = useState(true);
  const [editableItem, setEditableItem] = useState(null);

  useEffect(() => {
    const fetchItemData = async () => {
      try {
        const response = await fetchItems(filters);
        setItems(response.data.data);
      } catch (error) {
        console.error('Error fetching items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchItemData();
  }, [filters]);

  return (
    <div className="item-list-container">
      <h2>Item Management</h2>
      <ItemFilters
        onFiltersChange={setFilters}
        onCreateNewItem={() => setEditableItem({})}
      />
      {/* Table rendering logic remains unchanged */}
    </div>
  );
};

export default ItemList;
