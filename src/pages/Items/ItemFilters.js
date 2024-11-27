import './ItemFilters.css';

import React, { useEffect, useState } from 'react';

import { debounce } from '../../utils/helpers';
import { fetchCategories } from '../../api/adminApi';

const ItemFilters = ({ onFiltersChange, onCreateNewItem }) => {
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    availability: '',
  });
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await fetchCategories();
        if (Array.isArray(response.data)) {
          setCategories(response.data);
        } else {
          console.error('Invalid categories response:', response.data);
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };

    loadCategories();
  }, []);

  const handleInputChange = (field, value) => {
    const updatedFilters = { ...filters, [field]: value };
    setFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  };

  const debouncedSearch = debounce((value) => handleInputChange('search', value), 500);

  return (
    <div className="item-filters">
      <input
        type="text"
        placeholder="Search by name or ID..."
        onChange={(e) => debouncedSearch(e.target.value)}
      />

      <select
        onChange={(e) => handleInputChange('category', e.target.value)}
        value={filters.category}
      >
        <option value="">All Categories</option>
        {Array.isArray(categories) &&
          categories.map((category) => (
            <optgroup key={category.slug} label={category.title}>
              {category.subcategories.map((subcategory) => (
                <option key={subcategory.slug} value={subcategory.slug}>
                  {subcategory.name}
                </option>
              ))}
            </optgroup>
          ))}
      </select>

      <select
        onChange={(e) => handleInputChange('availability', e.target.value)}
        value={filters.availability}
      >
        <option value="">All Availability</option>
        <option value="true">Available</option>
        <option value="false">Unavailable</option>
      </select>

      <button onClick={onCreateNewItem}>+ Add New Item</button>
    </div>
  );
};

export default ItemFilters;
