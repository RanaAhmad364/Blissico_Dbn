import React, { useState, useEffect, useMemo } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { getAllDownloads } from '../../api/admin';
import { assetUrl } from '../../api/catalog';

const isWithinRange = (isoDate, range) => {
  if (!isoDate || range === 'all') return true;
  const date = new Date(isoDate);
  const now = new Date();
  if (range === 'today') return date.toDateString() === now.toDateString();
  if (range === 'week') return now - date <= 7 * 24 * 60 * 60 * 1000;
  if (range === 'month') return now - date <= 30 * 24 * 60 * 60 * 1000;
  return true;
};

const AdminDownloads = () => {
  const [downloads, setDownloads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [exactDate, setExactDate] = useState('');
  const [range, setRange] = useState('all');

  useEffect(() => {
    getAllDownloads().then(setDownloads).finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return downloads.filter((d) => {
      const query = search.trim().toLowerCase();
      const matchesSearch = !query || d.card_title.toLowerCase().includes(query) || d.username.toLowerCase().includes(query);
      const matchesExactDate = !exactDate || (d.downloaded_at && d.downloaded_at.slice(0, 10) === exactDate);
      const matchesRange = isWithinRange(d.downloaded_at, range);
      return matchesSearch && matchesExactDate && matchesRange;
    });
  }, [downloads, search, exactDate, range]);

  return (
    <AdminLayout>
      <h1>Downloads</h1>
      <p style={{ color: '#888', marginBottom: 20 }}>Every card download across all customers.</p>

      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Search by card title or username..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: 220, padding: '8px 12px', borderRadius: 6, border: '1px solid #ddd' }}
        />
        <input
          type="date"
          value={exactDate}
          onChange={(e) => setExactDate(e.target.value)}
          style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid #ddd' }}
        />
        <select value={range} onChange={(e) => setRange(e.target.value)} style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid #ddd' }}>
          <option value="all">All Time</option>
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : filtered.length === 0 ? (
        <div style={{ padding: 40, textAlign: 'center', color: '#888' }}>No downloads match your filters.</div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '2px solid #eee' }}>
              <th style={{ padding: '10px 8px' }}>Thumbnail</th>
              <th style={{ padding: '10px 8px' }}>Card</th>
              <th style={{ padding: '10px 8px' }}>Downloaded By</th>
              <th style={{ padding: '10px 8px' }}>Date & Time</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((d, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #f2f2f2' }}>
                <td style={{ padding: '10px 8px' }}>
                  <img src={assetUrl(d.thumbnail)} alt={d.card_title} style={{ width: 44, height: 44, borderRadius: 6, objectFit: 'cover' }} />
                </td>
                <td style={{ padding: '10px 8px' }}>{d.card_title}</td>
                <td style={{ padding: '10px 8px' }}>{d.username}<br /><span style={{ color: '#999', fontSize: 12 }}>{d.email}</span></td>
                <td style={{ padding: '10px 8px' }}>{d.downloaded_at ? new Date(d.downloaded_at).toLocaleString() : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </AdminLayout>
  );
};

export default AdminDownloads;