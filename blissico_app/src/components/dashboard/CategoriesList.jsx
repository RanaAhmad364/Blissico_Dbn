// src/components/dashboard/CategoriesList.jsx
import React from 'react';
import './CategoriesList.css';

const CategoriesList = ({ categories }) => {
  return (
    <div className="categories-list-card">
      <div className="categories-header">
        <h3>Categories (Recipients)</h3>
      </div>
      <div className="categories-grid">
        {categories.map((category) => (
          <div key={category.id} className="category-item">
            <span className="category-icon">{category.icon}</span>
            <span className="category-name">{category.name}</span>
            <span className="category-count">{category.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoriesList;