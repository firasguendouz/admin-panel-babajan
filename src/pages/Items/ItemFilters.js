import './ItemFilters.css';

import React, { useState } from 'react';

import { debounce } from '../../utils/helpers';

const ItemFilters = ({ onFiltersChange, onCreateNewItem }) => {
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    availability: '',
  });

  const handleInputChange = (field, value) => {
    const updatedFilters = { ...filters, [field]: value };
    setFilters(updatedFilters);

    // Pass the updated filters to the parent component
    onFiltersChange(updatedFilters);
  };

  const debouncedSearch = debounce((value) => handleInputChange('search', value), 500);

  return (
    <div className="item-filters">
      {/* Search Input */}
      <input
        type="text"
        placeholder="Search by name or ID..."
        onChange={(e) => debouncedSearch(e.target.value)}
      />

      {/* Category Filter */}
      <select
        onChange={(e) => handleInputChange('category', e.target.value)}
        value={filters.category}
      >
        <option value="">All Categories</option>
        <option value="Fruits">Fruits</option>
        <option value="Vegetables">Vegetables</option>
        <option value="Dairy">Dairy</option>
        <option value="Beverages">Beverages</option>
        <option value="Others">Others</option>
      </select>

      {/* Availability Filter */}
      <select
        onChange={(e) => handleInputChange('availability', e.target.value)}
        value={filters.availability}
      >
        <option value="">All Availability</option>
        <option value="true">Available</option>
        <option value="false">Unavailable</option>
      </select>

      {/* Add New Item */}
      <button onClick={onCreateNewItem}>+ Add New Item</button>
    </div>
  );
};

export default ItemFilters;
