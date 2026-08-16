// src/components/dashboard/TopOccasions.jsx
import React from 'react';
import './TopOccasions.css';

const TopOccasions = ({ occasions }) => {
  const total = occasions.reduce((sum, occ) => sum + occ.count, 0);

  return (
    <div className="top-occasions-card">
      <div className="card-header">
        <h3>Top Occasions</h3>
      </div>
      <div className="occasions-list">
        {occasions.map((occasion) => (
          <div key={occasion.id} className="occasion-item">
            <span className="occasion-rank">{occasion.id}</span>
            <span className="occasion-name">{occasion.name}</span>
            <div className="occasion-bar-wrapper">
              <div 
                className="occasion-bar"
                style={{ width: `${(occasion.count / total) * 100}%` }}
              ></div>
            </div>
            <span className="occasion-count">{occasion.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopOccasions;