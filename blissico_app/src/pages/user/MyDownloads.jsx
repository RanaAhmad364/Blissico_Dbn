import React, { useState, useEffect } from 'react';
import UserLayout from '../../components/user/UserLayout';
import { getMyDownloads } from '../../api/downloads';

const MyDownloads = () => {
  const [downloads, setDownloads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyDownloads().then(setDownloads).finally(() => setLoading(false));
  }, []);

  return (
    <UserLayout>
      <div style={{ padding: '20px 0' }}>
        <h1>Download History</h1>
        {loading ? (
          <div>Loading...</div>
        ) : downloads.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#888' }}>No downloads yet.</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '2px solid #eee' }}>
                <th style={{ padding: '10px 8px' }}>Card</th>
                <th style={{ padding: '10px 8px' }}>Downloaded At</th>
              </tr>
            </thead>
            <tbody>
              {downloads.map((d) => (
                <tr key={d.id} style={{ borderBottom: '1px solid #f2f2f2' }}>
                  <td style={{ padding: '10px 8px' }}>{d.card_title}</td>
                  <td style={{ padding: '10px 8px' }}>{new Date(d.downloaded_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </UserLayout>
  );
};

export default MyDownloads;








