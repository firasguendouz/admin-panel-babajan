import './ItemEditModal.css';

import React, { useState } from 'react';

const ItemEditModal = ({ item = {}, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: item.name || { en: '', de: '' },
    category: item.category || '',
    price: item.price || '',
    stock: item.stock || '',
    available: item.available || true,
    photos: item.photos || [],
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePhotoAdd = () => {
    setFormData((prev) => ({
      ...prev,
      photos: [...prev.photos, ''],
    }));
  };

  const handlePhotoChange = (index, value) => {
    const updatedPhotos = [...formData.photos];
    updatedPhotos[index] = value;
    setFormData((prev) => ({ ...prev, photos: updatedPhotos }));
  };

  const handlePhotoRemove = (index) => {
    const updatedPhotos = formData.photos.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, photos: updatedPhotos }));
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
              <option value="Fruits">Fruits</option>
              <option value="Vegetables">Vegetables</option>
              <option value="Dairy">Dairy</option>
              <option value="Beverages">Beverages</option>
              <option value="Others">Others</option>
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
          <h4>Photos</h4>
          {formData.photos.map((photo, index) => (
            <div key={index}>
              <input
                type="text"
                value={photo}
                onChange={(e) => handlePhotoChange(index, e.target.value)}
                placeholder="Photo URL"
              />
              <button type="button" onClick={() => handlePhotoRemove(index)}>
                Remove
              </button>
            </div>
          ))}
          <button type="button" onClick={handlePhotoAdd}>
            + Add Photo
          </button>
          <button type="button" onClick={handleSubmit}>
            {item._id ? 'Save Changes' : 'Create Item'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ItemEditModal;
