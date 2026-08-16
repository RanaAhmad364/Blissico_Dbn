// src/components/dashboard/RecentOrders.jsx
import React from 'react';
import './RecentOrders.css';

const RecentOrders = ({ orders }) => {
  return (
    <div className="recent-orders-card">
      <div className="card-header">
        <h3>Recent Orders</h3>
        <button className="view-all-btn">View All</button>
      </div>
      <div className="orders-list">
        {orders.map((order, index) => (
          <div key={index} className="order-item">
            <div className="order-left">
              <span className="order-id">{order.id}</span>
              <span className="order-date">{order.date}</span>
              <span className="order-customer">{order.customer}</span>
            </div>
            <div className="order-right">
              <span className="order-amount">{order.amount}</span>
              <span className={`status-badge ${order.status.toLowerCase()}`}>
                {order.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentOrders;