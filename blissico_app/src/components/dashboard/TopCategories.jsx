// src/components/dashboard/TopCategories.jsx
import React from 'react';
import './TopCategories.css';

const TopCategories = ({ categories }) => {
  const total = categories.reduce((sum, cat) => sum + cat.count, 0);

  return (
    <div className="top-categories-card">
      <div className="card-header">
        <h3>Top Categories</h3>
      </div>
      <div className="categories-list">
        {categories.map((category) => (
          <div key={category.id} className="category-item">
            <div className="category-info">
              <div 
                className="category-dot" 
                style={{ background: category.color }}
              ></div>
              <span className="category-name">{category.name}</span>
            </div>
            <div className="category-bar-wrapper">
              <div 
                className="category-bar"
                style={{ 
                  width: `${(category.count / total) * 100}%`,
                  background: category.color 
                }}
              ></div>
            </div>
            <span className="category-count">{category.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopCategories;