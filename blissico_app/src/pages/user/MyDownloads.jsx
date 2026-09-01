import React, { useState, useEffect } from 'react';
import UserLayout from '../../components/user/UserLayout';
import { getMyDownloads } from '../../api/downloads';
import { assetUrl } from '../../api/catalog';
import './MyDownloads.css';

const MyDownloads = () => {
  const [downloads, setDownloads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyDownloads().then(setDownloads).finally(() => setLoading(false));
  }, []);

  return (
    <UserLayout>
      <div className="downloads-page">
        <h1>Download History</h1>
        
        {loading ? (
          <div className="loading-state">Loading...</div>
        ) : downloads.length === 0 ? (
          <div className="empty-state">
            <p>No downloads yet.</p>
          </div>
        ) : (
          <div className="downloads-table-card">
            <table className="downloads-table">
              <thead>
                <tr>
                  <th>Thumbnail</th>
                  <th>Card</th>
                  <th>Downloaded At</th>
                </tr>
              </thead>
              <tbody>
                {downloads.map((d) => (
                  <tr key={d.id}>
                    <td className="thumb-cell">
                      <img src={assetUrl(d.thumbnail)} alt={d.card_title} className="download-thumb" />
                    </td>
                    <td className="card-title-cell">{d.card_title}</td>
                    <td className="date-cell">{new Date(d.downloaded_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </UserLayout>
  );
};

export default MyDownloads;