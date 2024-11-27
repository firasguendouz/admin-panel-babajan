import React from 'react';

const Filters = ({ categories, setSelectedCategory, setSelectedSubcategory }) => {
    return (
      <div>
        <h3>Categories</h3>
        <ul>
          {categories.map((category) => (
            <li key={category.id}>
              <span onClick={() => setSelectedCategory(category.id)}>
                {category.title}
              </span>
              <ul>
                {category.subcategories.map((subcategory) => (
                  <li
                    key={subcategory.id}
                    onClick={() => setSelectedSubcategory(subcategory.id)}
                  >
                    {subcategory.name}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    );
  };
  
  export default Filters;
  