import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import UserLayout from '../../components/user/UserLayout';
import { getMyCustomizations } from '../../api/customization';
import { downloadCardFile } from '../../api/downloads';
import { assetUrl } from '../../api/catalog';
import { FiDownload, FiEdit2 } from 'react-icons/fi';

const CustomizedCards = () => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState(null);

  useEffect(() => {
    getMyCustomizations().then(setCards).finally(() => setLoading(false));
  }, []);

  const handleDownload = async (cardId) => {
    setDownloadingId(cardId);
    try {
      await downloadCardFile(cardId, 'image');
    } catch (err) {
      alert(err.response?.data?.message || 'Could not download this card.');
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <UserLayout>
      <div style={{ padding: '20px 0' }}>
        <h1>My Customized Cards</h1>
        <p style={{ color: '#888', marginBottom: 24 }}>Designs you've created — edit them anytime, download once purchased.</p>

        {loading ? (
          <div>Loading...</div>
        ) : cards.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#888' }}>You haven't customized any cards yet.</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20 }}>
            {cards.map((c) => (
              <div key={c.card_id} style={{ border: '1px solid #eee', borderRadius: 10, overflow: 'hidden' }}>
                <img src={assetUrl(c.thumbnail)} alt={c.title} style={{ width: '100%', height: 160, objectFit: 'cover' }} />
                <div style={{ padding: 14 }}>
                  <h4 style={{ margin: '0 0 10px' }}>{c.title}</h4>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <Link to={`/customize/${c.card_id}`} style={{ flex: 1, textAlign: 'center', padding: '8px 0', borderRadius: 6, border: '1px solid #ddd', textDecoration: 'none', color: '#333' }}>
                      <FiEdit2 /> Edit
                    </Link>
                    {c.can_download ? (
                      <button
                        onClick={() => handleDownload(c.card_id)}
                        disabled={downloadingId === c.card_id}
                        style={{ flex: 1, padding: '8px 0', borderRadius: 6, border: 'none', background: '#7c3aed', color: '#fff', cursor: 'pointer' }}
                      >
                        <FiDownload /> {downloadingId === c.card_id ? '...' : 'Download'}
                      </button>
                    ) : (
                      <Link to="/cart" style={{ flex: 1, textAlign: 'center', padding: '8px 0', borderRadius: 6, background: '#f3e8ff', color: '#7c3aed', textDecoration: 'none' }}>
                        Purchase
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </UserLayout>
  );
};

export default CustomizedCards;