import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import CardDesignEditor from '../../components/customize/CardDesignEditor';
import { getAdminCard } from '../../api/admin';
import { getDefaultCustomization, saveDefaultCustomization } from '../../api/adminCustomization';
import '../../pages/Customize.css';

const AdminCustomizeCard = () => {
  const { cardId } = useParams();
  const [card, setCard] = useState(null);
  const [design, setDesign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([getAdminCard(cardId), getDefaultCustomization(cardId)])
      .then(([cardData, defaultResponse]) => {
        setCard(cardData);
        setDesign(defaultResponse.data);
      })
      .catch((err) => setError(err.response?.data?.message || 'Could not load card design.'))
      .finally(() => setLoading(false));
  }, [cardId]);

  const handleSave = async (values) => {
    setSaving(true);
    setMessage('');
    setError('');
    try {
      const response = await saveDefaultCustomization(cardId, values);
      setDesign(response.data);
      setMessage('Default design saved.');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save default design.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <AdminLayout><div className="loading-state">Loading...</div></AdminLayout>;
  if (!card) return <AdminLayout><div className="products-error">{error || 'Card not found.'}</div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="cus-products-page">
        <div className="products-header">
          <div>
            <h1>Customize: {card.title}</h1>
            <p className="page-subtitle">Set the design customers see by default</p>
          </div>
        </div>
        
        {message && <div className="products-success">{message}</div>}
        {error && <div className="products-error">{error}</div>}
        
        <CardDesignEditor card={card} initialValues={design} onSave={handleSave} saving={saving} />
      </div>
    </AdminLayout>
  );
};

export default AdminCustomizeCard;









