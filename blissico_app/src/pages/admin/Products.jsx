import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import {
  getAdminCards, createCard, updateCard, deleteCard,
  getCategories, getCollections, getOccasions,
  addCardTemplate,
} from '../../api/admin';
import { assetUrl } from '../../api/Catalog';

const emptyForm = {
  id: null, title: '', description: '', category_id: '', collection_id: '', occasion_id: '',
  is_free: false, price: '',
};

const flattenCategories = (cats, depth = 0) =>
  cats.flatMap((c) => [{ ...c, depth }, ...flattenCategories(c.subcategories || [], depth + 1)]);

const Products = () => {
  const [cards, setCards] = useState([]);
  const [categories, setCategories] = useState([]);
  const [collections, setCollections] = useState([]);
  const [occasions, setOccasions] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const loadCards = () => getAdminCards(1, 100).then((res) => setCards(res.items)).catch(() => setError('Could not load cards.'));

  useEffect(() => {
    loadCards();
    getCategories().then(setCategories).catch(() => {});
    getCollections().then(setCollections).catch(() => {});
    getOccasions().then(setOccasions).catch(() => {});
  }, []);

  const flatCategories = flattenCategories(categories);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.id && !thumbnailFile) {
      return setError('A thumbnail image is required.');
    }

    const fd = new FormData();
    fd.append('title', form.title);
    fd.append('description', form.description);
    fd.append('category_id', form.category_id);
    fd.append('collection_id', form.collection_id);
    fd.append('occasion_id', form.occasion_id);
    fd.append('is_free', form.is_free);
    fd.append('price', form.is_free ? 0 : form.price || 0);
    if (thumbnailFile) fd.append('thumbnail', thumbnailFile);

    setSaving(true);
    try {
      if (form.id) {
        await updateCard(form.id, fd);
      } else {
        await createCard(fd);
      }
      setForm(emptyForm);
      setThumbnailFile(null);
      loadCards();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save card.');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (card) => {
    setForm({
      id: card.id, title: card.title, description: card.description || '',
      category_id: card.category?.id || '', collection_id: card.collection?.id || '',
      occasion_id: card.occasion?.id || '', is_free: card.is_free, price: card.price,
    });
    setThumbnailFile(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this card? This also removes its uploaded templates.')) return;
    try {
      await deleteCard(id);
      loadCards();
    } catch (err) {
      alert(err.response?.data?.message || 'Could not delete card.');
    }
  };

  const handleAddTemplate = async (cardId) => {
    const templateFile = document.getElementById(`template-file-${cardId}`).files[0];
    const previewFile = document.getElementById(`preview-file-${cardId}`).files[0];
    const width = document.getElementById(`width-${cardId}`).value;
    const height = document.getElementById(`height-${cardId}`).value;

    if (!templateFile || !previewFile || !width || !height) {
      return alert('Template file, preview image, width, and height are all required.');
    }

    const fd = new FormData();
    fd.append('template_file', templateFile);
    fd.append('preview_image', previewFile);
    fd.append('width', width);
    fd.append('height', height);

    try {
      await addCardTemplate(cardId, fd);
      loadCards();
    } catch (err) {
      alert(err.response?.data?.message || 'Could not add template.');
    }
  };

  return (
    <AdminLayout>
      <h1>Cards</h1>
      {error && <div style={{ color: '#c0392b', margin: '12px 0' }}>{error}</div>}

      {/* --- Add / Edit Card --- */}
      <form onSubmit={handleSubmit} style={{ border: '1px solid #eee', borderRadius: 10, padding: 20, margin: '20px 0' }}>
        <h3>{form.id ? 'Edit Card' : 'Add New Card'}</h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12 }}>Title</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required style={{ width: '100%' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12 }}>Category</label>
            <select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} required style={{ width: '100%' }}>
              <option value="">Select a category</option>
              {flatCategories.map((c) => (
                <option key={c.id} value={c.id}>{'—'.repeat(c.depth)} {c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12 }}>Collection</label>
            <select value={form.collection_id} onChange={(e) => setForm({ ...form, collection_id: e.target.value })} required style={{ width: '100%' }}>
              <option value="">Select a collection</option>
              {collections.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12 }}>Occasion</label>
            <select value={form.occasion_id} onChange={(e) => setForm({ ...form, occasion_id: e.target.value })} required style={{ width: '100%' }}>
              <option value="">Select an occasion</option>
              {occasions.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12 }}>
              <input type="checkbox" checked={form.is_free} onChange={(e) => setForm({ ...form, is_free: e.target.checked })} /> Free card
            </label>
          </div>
          {!form.is_free && (
            <div>
              <label style={{ display: 'block', fontSize: 12 }}>Price ($)</label>
              <input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} style={{ width: '100%' }} />
            </div>
          )}
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ display: 'block', fontSize: 12 }}>Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} style={{ width: '100%' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12 }}>Thumbnail {form.id && '(leave empty to keep current)'}</label>
            <input type="file" accept="image/*" onChange={(e) => setThumbnailFile(e.target.files[0])} />
          </div>
        </div>

        <div style={{ marginTop: 16 }}>
          <button type="submit" disabled={saving}>{saving ? 'Saving...' : form.id ? 'Update Card' : 'Add Card'}</button>
          {form.id && <button type="button" style={{ marginLeft: 10 }} onClick={() => { setForm(emptyForm); setThumbnailFile(null); }}>Cancel</button>}
        </div>
      </form>

      {/* --- Card List --- */}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ textAlign: 'left', borderBottom: '2px solid #eee' }}>
            <th></th><th>Title</th><th>Category</th><th>Price</th><th>Styles</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {cards.map((card) => (
            <tr key={card.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
              <td><img src={assetUrl(card.thumbnail)} alt={card.title} style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 6 }} /></td>
              <td>{card.title}</td>
              <td>{card.category?.name}</td>
              <td>{card.is_free ? 'Free' : `$${card.price}`}</td>
              <td>{card.templates?.length || 0}</td>
              <td>
                <button onClick={() => handleEdit(card)}>Edit</button>{' '}
                <button onClick={() => handleDelete(card.id)}>Delete</button>
                <details style={{ marginTop: 6 }}>
                  <summary style={{ cursor: 'pointer', fontSize: 12 }}>+ Add style variant</summary>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 6, maxWidth: 220 }}>
                    <input id={`template-file-${card.id}`} type="file" accept="image/*,.svg,.json,.pdf" placeholder="Template file" />
                    <input id={`preview-file-${card.id}`} type="file" accept="image/*" placeholder="Preview image" />
                    <input id={`width-${card.id}`} type="number" placeholder="Width (px)" />
                    <input id={`height-${card.id}`} type="number" placeholder="Height (px)" />
                    <button type="button" onClick={() => handleAddTemplate(card.id)}>Upload</button>
                  </div>
                </details>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </AdminLayout>
  );
};

export default Products;