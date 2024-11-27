import './ItemEditModal.css';

import React, { useEffect, useState } from 'react';

import { fetchCategories } from '../../api/adminApi';

const ItemEditModal = ({ item = {}, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: item.name || { en: '', de: '' },
    category: item.category || '',
    subcategory: item.subcategory || '',
    price: item.price || '',
    stock: item.stock || '',
    available: item.available || true,
    photos: item.photos || [],
  });

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await fetchCategories();
        setCategories(response.data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };

    loadCategories();
  }, []);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!formData.name.en || !formData.category || !formData.price) {
      alert('Name, Category, and Price are required.');
      return;
    }
    onSave(formData);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close-button" onClick={onClose}>
          &times;
        </span>
        <h3>{item._id ? 'Edit Item' : 'Create New Item'}</h3>
        <form>
          <label>
            Name (EN):
            <input
              type="text"
              value={formData.name.en}
              onChange={(e) => handleInputChange('name', { ...formData.name, en: e.target.value })}
            />
          </label>

          <label>
            Category:
            <select
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.slug} value={category.slug}>
                  {category.title}
                </option>
              ))}
            </select>
          </label>

          <label>
            Subcategory:
            <select
              value={formData.subcategory}
              onChange={(e) => handleInputChange('subcategory', e.target.value)}
            >
              <option value="">Select a subcategory</option>
              {categories
                .find((cat) => cat.slug === formData.category)?.subcategories.map((subcat) => (
                  <option key={subcat.slug} value={subcat.slug}>
                    {subcat.name}
                  </option>
                ))}
            </select>
          </label>

          <label>
            Price:
            <input
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => handleInputChange('price', parseFloat(e.target.value))}
            />
          </label>

          <label>
            Stock:
            <input
              type="number"
              value={formData.stock}
              onChange={(e) => handleInputChange('stock', parseInt(e.target.value))}
            />
          </label>

          <label>
            Available:
            <input
              type="checkbox"
              checked={formData.available}
              onChange={(e) => handleInputChange('available', e.target.checked)}
            />
          </label>

          <button type="button" onClick={handleSubmit}>
            {item._id ? 'Save Changes' : 'Create Item'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ItemEditModal;
