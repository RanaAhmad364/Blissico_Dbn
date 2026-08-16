// src/components/dashboard/BestSellingCards.jsx
import React from 'react';
import './BestSellingCards.css';

const BestSellingCards = ({ cards }) => {
  return (
    <div className="best-selling-card">
      <div className="card-header">
        <h3>Best Selling Cards</h3>
        <button className="view-all-btn">View All</button>
      </div>
      <div className="cards-list">
        {cards.map((card, index) => (
          <div key={card.id} className="card-item">
            <div className="card-rank">{index + 1}</div>
            <div className="card-info">
              <span className="card-name">{card.name}</span>
            </div>
            <div className="card-right">
              <span className="card-sales">{card.sales} Sales</span>
              <span className="card-revenue">{card.revenue}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BestSellingCards;