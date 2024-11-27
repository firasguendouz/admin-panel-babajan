import React, { useEffect, useState } from 'react';

import Filters from './Filters';
import MenuActions from './MenuActions';
import ProductEditModal from './ProductEditModal';
import ProductViewModal from './ProductViewModal';
import ProductsList from './ProductsList';

const ItemScreen = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [viewProduct, setViewProduct] = useState(null);
  const [editProduct, setEditProduct] = useState(null);

  // Fetch categories and subcategories
  useEffect(() => {
    fetch('/api/categories', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
      .then((res) => res.json())
      .then((data) => setCategories(data.data))
      .catch((err) => console.error('Error fetching categories:', err));
  }, []);

  // Fetch products based on selected category and subcategory
  useEffect(() => {
    if (selectedCategory && selectedSubcategory) {
      fetch(`/api/items/${selectedCategory}/${selectedSubcategory}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
        .then((res) => res.json())
        .then((data) => setProducts(data.data))
        .catch((err) => console.error('Error fetching products:', err));
    }
  }, [selectedCategory, selectedSubcategory]);

  return (
    <div>
      <MenuActions setEditProduct={setEditProduct} />
      <Filters
        categories={categories}
        setSelectedCategory={setSelectedCategory}
        setSelectedSubcategory={setSelectedSubcategory}
      />
      <ProductsList
        products={products}
        setViewProduct={setViewProduct}
        setEditProduct={setEditProduct}
      />
      {viewProduct && (
        <ProductViewModal product={viewProduct} onClose={() => setViewProduct(null)} />
      )}
      {editProduct && (
        <ProductEditModal product={editProduct} onClose={() => setEditProduct(null)} />
      )}
    </div>
  );
};

export default ItemScreen;
