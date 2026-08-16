// src/components/dashboard/ActiveDiscounts.jsx
import React from 'react';
import './ActiveDiscounts.css';

const ActiveDiscounts = ({ discounts }) => {
  return (
    <div className="active-discounts-card">
      <div className="card-header">
        <h3>Active Discounts</h3>
        <button className="view-all-btn">View All</button>
      </div>
      <div className="discounts-list">
        {discounts.map((discount) => (
          <div key={discount.id} className="discount-item">
            <div className="discount-top">
              <span className="discount-code">{discount.code}</span>
              <span className={`discount-status ${discount.usage > 0 ? 'active' : 'inactive'}`}>
                {discount.usage > 0 ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div className="discount-info">
              <span className="discount-desc">{discount.description}</span>
              <span className="discount-usage">{discount.usage} used</span>
            </div>
            <div className="discount-bar-wrapper">
              <div 
                className="discount-bar"
                style={{ width: `${Math.min(discount.usage / 5, 100)}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActiveDiscounts;