import React from 'react';

const ProductViewModal = ({ product, onClose }) => {
    return (
      <div className="modal">
        <h2>{product.name}</h2>
        <p>SKU: {product.sku}</p>
        <p>Price: {product.price.amount} {product.price.currency}</p>
        <p>Quantity: {product.quantity}</p>
        <button onClick={onClose}>Close</button>
      </div>
    );
  };
  
  export default ProductViewModal;
  