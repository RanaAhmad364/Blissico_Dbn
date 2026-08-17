// src/pages/admin/Products.jsx
import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import {
  getAdminCards, createCard, updateCard, deleteCard,
  getCategories, getCollections, getOccasions,
  addCardTemplate,
} from '../../api/admin';
import { assetUrl } from '../../api/Catalog';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiUpload, FiChevronDown } from 'react-icons/fi';
import './Products.css';

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
  const [showForm, setShowForm] = useState(false);
  const [expandedCardId, setExpandedCardId] = useState(null);

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
    fd.append('is_free', form.is_free);
    fd.append('price', form.is_free ? 0 : form.price || 0);
    if (thumbnailFile) fd.append('thumbnail', thumbnailFile);

    fd.append('category_id', form.category_id);
    if (form.collection_id) fd.append('collection_id', form.collection_id);
    if (form.occasion_id) fd.append('occasion_id', form.occasion_id);

    setSaving(true);
    try {
      if (form.id) {
        await updateCard(form.id, fd);
      } else {
        await createCard(fd);
      }
      setForm(emptyForm);
      setThumbnailFile(null);
      setShowForm(false); // save k baad table pr wapis
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
    setShowForm(true);
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

  const openAddForm = () => {
    setForm(emptyForm);
    setThumbnailFile(null);
    setError('');
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setForm(emptyForm);
    setThumbnailFile(null);
    setError('');
  };

  return (
    <AdminLayout>
      <div className="products-page">
        <div className="products-header">
          <div>
            <h1>Cards</h1>
            <p className="page-subtitle">Manage your greeting card catalog</p>
          </div>
          {!showForm && (
            <button className="add-new-btn" onClick={openAddForm}>
              <FiPlus size={16} /> Add New Card
            </button>
          )}
        </div>

        {error && <div className="products-error">{error}</div>}

        {/* --- Add / Edit Card --- */}
        {showForm && (
          <div className="card-form-card">
            <div className="form-card-header">
              <h3>{form.id ? 'Edit Card' : 'Add New Card'}</h3>
              <button className="close-form-btn" onClick={closeForm}><FiX size={18} /></button>
            </div>

            <form onSubmit={handleSubmit} className="card-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>Title</label>
                  <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Birthday Blooms" required />
                </div>

                <div className="form-group">
                  <label>Category</label>
                  <select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} required>
                    <option value="">Select a category</option>
                    {flatCategories.map((c) => (
                      <option key={c.id} value={c.id}>{'—'.repeat(c.depth)} {c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Collection (optional)</label>
                  <select value={form.collection_id} onChange={(e) => setForm({ ...form, collection_id: e.target.value })}>
                    <option value="">None</option>
                    {collections.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>

                <div className="form-group">
                  <label>Occasion (optional)</label>
                  <select value={form.occasion_id} onChange={(e) => setForm({ ...form, occasion_id: e.target.value })}>
                    <option value="">None</option>
                    {occasions.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}
                  </select>
                </div>

                <div className="form-group checkbox-group">
                  <label className="checkbox-row">
                    <input type="checkbox" checked={form.is_free} onChange={(e) => setForm({ ...form, is_free: e.target.checked })} />
                    Free card
                  </label>
                </div>

                {!form.is_free && (
                  <div className="form-group">
                    <label>Price ($)</label>
                    <input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="0.00" />
                  </div>
                )}

                <div className="form-group full-width">
                  <label>Description</label>
                  <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Short description of this card" />
                </div>

                <div className="form-group full-width">
                  <label>Thumbnail {form.id && <span className="hint">(leave empty to keep current)</span>}</label>
                  <input type="file" accept="image/*" onChange={(e) => setThumbnailFile(e.target.files[0])} />
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="save-btn" disabled={saving}>
                  {saving ? 'Saving...' : form.id ? 'Update Card' : 'Add Card'}
                </button>
                <button type="button" className="cancel-btn" onClick={closeForm}>Cancel</button>
              </div>
            </form>
          </div>
        )}

        {/* --- Card List --- */}
        <div className="products-table-card">
          <table className="products-table">
            <thead>
              <tr>
                <th></th>
                <th>Title</th>
                <th>Category</th>
                <th>Price</th>
                <th>Styles</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cards.length === 0 ? (
                <tr><td colSpan={6} className="empty-state">No cards yet — click "Add New Card" to create one.</td></tr>
              ) : (
                cards.map((card) => (
                  <React.Fragment key={card.id}>
                    <tr>
                      <td className="thumb-cell">
                        <img src={assetUrl(card.thumbnail)} alt={card.title} className="card-thumb" />
                      </td>
                      <td className="card-title-cell">{card.title}</td>
                      <td>{card.category?.name || '—'}</td>
                      <td>
                        {card.is_free ? <span className="free-badge">Free</span> : `$${card.price}`}
                      </td>
                      <td>
                        <span className="style-count-badge">{card.templates?.length || 0}</span>
                      </td>
                      <td>
                        <div className="row-actions">
                          <button className="action-pill edit" onClick={() => handleEdit(card)}>
                            <FiEdit2 size={13} /> Edit
                          </button>
                          <button className="action-pill delete" onClick={() => handleDelete(card.id)}>
                            <FiTrash2 size={13} /> Delete
                          </button>
                          <button
                            className="action-pill style"
                            onClick={() => setExpandedCardId(expandedCardId === card.id ? null : card.id)}
                          >
                            <FiUpload size={13} /> Add Style
                            <FiChevronDown size={13} className={`chevron ${expandedCardId === card.id ? 'open' : ''}`} />
                          </button>
                        </div>
                      </td>
                    </tr>

                    {expandedCardId === card.id && (
                      <tr className="style-panel-row">
                        <td colSpan={6}>
                          <div className="style-panel">
                            <div className="style-panel-grid">
                              <div className="form-group">
                                <label>Template File</label>
                                <input id={`template-file-${card.id}`} type="file" accept="image/*,.svg,.json,.pdf" />
                              </div>
                              <div className="form-group">
                                <label>Preview Image</label>
                                <input id={`preview-file-${card.id}`} type="file" accept="image/*" />
                              </div>
                              <div className="form-group">
                                <label>Width (px)</label>
                                <input id={`width-${card.id}`} type="number" placeholder="e.g. 1080" />
                              </div>
                              <div className="form-group">
                                <label>Height (px)</label>
                                <input id={`height-${card.id}`} type="number" placeholder="e.g. 1350" />
                              </div>
                            </div>
                            <button type="button" className="save-btn small" onClick={() => handleAddTemplate(card.id)}>
                              <FiUpload size={14} /> Upload Style
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Products;