// src/components/dashboard/RevenueChart.jsx
import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { revenueData } from '../../data/dashboardData';
import './RevenueChart.css';

const RevenueChart = () => {
  const [filter, setFilter] = useState('weekly');
  const [data, setData] = useState(revenueData.weekly);

  const handleFilterChange = (type) => {
    setFilter(type);
    setData(revenueData[type]);
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="chart-tooltip">
          <p className="tooltip-label">{payload[0].payload.date}</p>
          <p className="tooltip-value">${payload[0].value.toLocaleString()}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="revenue-chart-card">
      <div className="chart-header">
        <div>
          <h3>Sales Overview</h3>
          <p className="chart-subtitle">Revenue trends over time</p>
        </div>
        <div className="filter-buttons">
          <button 
            className={`filter-btn ${filter === 'daily' ? 'active' : ''}`}
            onClick={() => handleFilterChange('daily')}
          >
            Daily
          </button>
          <button 
            className={`filter-btn ${filter === 'weekly' ? 'active' : ''}`}
            onClick={() => handleFilterChange('weekly')}
          >
            Weekly
          </button>
          <button 
            className={`filter-btn ${filter === 'monthly' ? 'active' : ''}`}
            onClick={() => handleFilterChange('monthly')}
          >
            Monthly
          </button>
        </div>
      </div>

      <div className="chart-container">
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12, fill: '#94a3b8' }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: '#94a3b8' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#7c3aed"
              strokeWidth={3}
              fill="url(#revenueGradient)"
              name="Revenue"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueChart;