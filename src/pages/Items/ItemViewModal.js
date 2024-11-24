import './ItemViewModal.css';

import React from 'react';
import { formatDate } from '../../utils/dateFormatter';

const ItemViewModal = ({ item, onClose }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close-button" onClick={onClose}>
          &times;
        </span>
        <h3>Item Details</h3>
        <p>
          <strong>Item ID:</strong> {item._id}
        </p>
        <p>
          <strong>Name:</strong> {item.name.en}
        </p>
        <p>
          <strong>Category:</strong> {item.category}
        </p>
        <p>
          <strong>Price:</strong> ${item.price.toFixed(2)}
        </p>
        <p>
          <strong>Stock:</strong> {item.stock}
        </p>
        <p>
          <strong>Available:</strong> {item.available ? 'Yes' : 'No'}
        </p>
        <p>
          <strong>Created At:</strong> {formatDate(item.createdAt)}
        </p>
        <h4>Tags</h4>
        <p>{item.tags.join(', ') || 'No tags'}</p>
        <h4>Photos</h4>
        <ul>
          {item.photos.map((photo, index) => (
            <li key={index}>
              <img src={photo} alt={item.name.en} style={{ width: '100px', height: '100px' }} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ItemViewModal;
