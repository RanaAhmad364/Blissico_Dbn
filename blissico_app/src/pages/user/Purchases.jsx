import React, { useState, useEffect } from 'react';
import UserLayout from '../../components/user/UserLayout';
import { getMyOrders } from '../../api/orders';
import { downloadCard } from '../../api/downloads';
import { assetUrl } from '../../api/catalog';
import { FiDownload } from 'react-icons/fi';

const Purchases = () => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [downloadingId, setDownloadingId] = useState(null);

  useEffect(() => {
    getMyOrders()
      .then((orders) => {
        const paidItems = orders
          .filter((o) => o.status === 'paid')
          .flatMap((o) => o.items);

        // De-duplicate by card_id — same card bought twice should only show once here.
        const seen = new Set();
        const unique = paidItems.filter((item) => {
          if (seen.has(item.card_id)) return false;
          seen.add(item.card_id);
          return true;
        });
        setCards(unique);
      })
      .catch(() => setError('Could not load your purchases.'))
      .finally(() => setLoading(false));
  }, []);

  const handleDownload = async (cardId) => {
    setDownloadingId(cardId);
    try {
      const res = await downloadCard(cardId);
      window.open(assetUrl(res.file_url), '_blank');
    } catch (err) {
      alert(err.response?.data?.message || 'Could not download this card.');
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <UserLayout>
      <div style={{ padding: '20px 0' }}>
        <h1>Purchases</h1>
        <p style={{ color: '#888', marginBottom: 24 }}>Cards you've bought — download them any time.</p>

        {loading && <div>Loading...</div>}
        {error && <div style={{ color: '#c0392b' }}>{error}</div>}

        {!loading && !error && cards.length === 0 && (
          <div style={{ padding: 40, textAlign: 'center', color: '#888' }}>
            You haven't purchased any cards yet.
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20 }}>
          {cards.map((item) => (
            <div key={item.card_id} style={{ border: '1px solid #eee', borderRadius: 10, overflow: 'hidden' }}>
              <img
                src={assetUrl(item.thumbnail)}
                alt={item.title}
                style={{ width: '100%', height: 160, objectFit: 'cover' }}
              />
              <div style={{ padding: 14 }}>
                <h4 style={{ margin: '0 0 10px' }}>{item.title}</h4>
                <button
                  onClick={() => handleDownload(item.card_id)}
                  disabled={downloadingId === item.card_id}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6, width: '100%',
                    justifyContent: 'center', padding: '8px 0', borderRadius: 6,
                    border: 'none', background: '#7c3aed', color: '#fff', cursor: 'pointer',
                  }}
                >
                  <FiDownload /> {downloadingId === item.card_id ? 'Preparing...' : 'Download'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </UserLayout>
  );
};

export default Purchases;



