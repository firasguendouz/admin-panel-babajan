import React, { useState } from 'react';

const ProductEditModal = ({ product, onClose }) => {
    const [formData, setFormData] = useState(product);
  
    const handleSubmit = (e) => {
      e.preventDefault();
      const method = product.id ? 'PATCH' : 'POST';
      const url = product.id
        ? `/api/items/${product.category}/${product.subcategory}/${product.id}`
        : `/api/items/${formData.category}/${formData.subcategory}`;
      
      fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData),
      })
        .then((res) => res.json())
        .then(() => onClose())
        .catch((err) => console.error('Error saving product:', err));
    };
  
    return (
      <div className="modal">
        <h2>{product.id ? 'Edit Product' : 'Add New Product'}</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Name:
            <input
              type="text"
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </label>
          <label>
            SKU:
            <input
              type="text"
              value={formData.sku || ''}
              onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
            />
          </label>
          <label>
            Price:
            <input
              type="number"
              value={formData.price?.amount || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  price: { ...formData.price, amount: e.target.value },
                })
              }
            />
          </label>
          <label>
            Quantity:
            <input
              type="number"
              value={formData.quantity || ''}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
            />
          </label>
          <button type="submit">Save</button>
          <button onClick={onClose}>Cancel</button>
        </form>
      </div>
    );
  };
  
  export default ProductEditModal;
  