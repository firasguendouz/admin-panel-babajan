import React from 'react';

const ProductsList = ({ products, setViewProduct, setEditProduct }) => {
    return (
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>SKU</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{product.sku}</td>
              <td>{product.price.amount} {product.price.currency}</td>
              <td>
                <button onClick={() => setViewProduct(product)}>View</button>
                <button onClick={() => setEditProduct(product)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };
  
  export default ProductsList;
  