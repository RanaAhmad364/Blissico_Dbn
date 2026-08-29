import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const periods = [
  { key: 'today', label: 'Today' },
  { key: 'week', label: 'This Week' },
  { key: 'month', label: 'This Month' },
];

const TrendChart = ({ title, subtitle, fetcher, color, valuePrefix = '' }) => {
  const [period, setPeriod] = useState('week');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetcher(period).then(setData).finally(() => setLoading(false));
  }, [period]);

  return (
    <div style={{ background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
        <div>
          <h3 style={{ margin: 0 }}>{title}</h3>
          <p style={{ margin: '4px 0 0', color: '#888', fontSize: 13 }}>{subtitle}</p>
        </div>
        <div style={{ display: 'flex', background: '#f5f5f9', borderRadius: 8, padding: 4 }}>
          {periods.map((p) => (
            <button
              key={p.key}
              onClick={() => setPeriod(p.key)}
              style={{
                border: 'none', padding: '6px 14px', borderRadius: 6, cursor: 'pointer', fontSize: 13,
                background: period === p.key ? '#7c3aed' : 'transparent',
                color: period === p.key ? '#fff' : '#666',
                fontWeight: period === p.key ? 600 : 400,
              }}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa' }}>Loading...</div>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={`grad-${title}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.35} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#999' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: '#999' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${valuePrefix}${v}`} />
            <Tooltip formatter={(value) => [`${valuePrefix}${value}`, '']} />
            <Legend verticalAlign="bottom" height={30} formatter={(value) => (value === 'previous' ? 'Previous period' : title)} />
            <Area type="monotone" dataKey="previous" stroke="#c4b5fd" strokeDasharray="4 4" fill="none" dot={false} />
            <Area type="monotone" dataKey="current" name={title} stroke={color} strokeWidth={2.5} fill={`url(#grad-${title})`} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default TrendChart;

