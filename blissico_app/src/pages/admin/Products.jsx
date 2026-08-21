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
  is_free: false, price: '', is_active: true
};

const Products = () => {
  const [cards, setCards] = useState([]);
  const [categories, setCategories] = useState([]); // flat list, each item has parent_id
  const [collections, setCollections] = useState([]);
  const [occasions, setOccasions] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [parentCategoryId, setParentCategoryId] = useState(''); // UI-only: selected group 
  const [parentCollectionId, setParentCollectionId] = useState('');
  const [parentOccasionId, setParentOccasionId] = useState('');
  
  // (FEATURED / SHOP BY RECIPIENT etc)
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

  // --- category tree helpers (same pattern as Categories.jsx) ---
  // Note: <select> values are always strings, while parent_id/id from the API
  // may come back as numbers — so all comparisons below are normalized with String().
  const topLevelCategories = categories.filter((c) => !c.parent_id);
  const childCategoriesOf = (id) =>
    categories.filter((c) => c.parent_id != null && String(c.parent_id) === String(id));

  const topLevelCollections = collections.filter((c) => !c.parent_id);
  const childCollectionsOf = (id) =>
    collections.filter((c) => c.parent_id != null && String(c.parent_id) === String(id));

  const topLevelOccasions = occasions.filter((o) => !o.parent_id);
  const childOccasionsOf = (id) =>
    occasions.filter((o) => o.parent_id != null && String(o.parent_id) === String(id));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.id && !thumbnailFile) {
      return setError('A thumbnail image is required.');
    }
   

    const fd = new FormData();
    fd.append('title', form.title);
    fd.append('description', form.description);
    fd.append('is_free', form.is_free);
    fd.append('price', form.is_free ? 0 : form.price || 0);
    fd.append('is_active', form.is_active);
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
      setParentCategoryId('');
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
  const catId = card.category?.id || '';
  const cat = categories.find((c) => String(c.id) === String(catId));
  const derivedParentId = cat?.parent_id != null ? String(cat.parent_id) : (cat ? String(cat.id) : '');

  const colId = card.collection?.id || '';
  const col = collections.find((c) => String(c.id) === String(colId));
  const derivedParentCollectionId = col?.parent_id != null ? String(col.parent_id) : (col ? String(col.id) : '');

  const occId = card.occasion?.id || '';
  const occ = occasions.find((o) => String(o.id) === String(occId));
  const derivedParentOccasionId = occ?.parent_id != null ? String(occ.parent_id) : (occ ? String(occ.id) : '');

  setForm({
    id: card.id, title: card.title, description: card.description || '',
    category_id: catId ? String(catId) : '', collection_id: colId ? String(colId) : '',
    occasion_id: occId ? String(occId) : '', is_free: card.is_free, price: card.price,
    is_active: card.is_active,
  });
  setParentCategoryId(derivedParentId);
  setParentCollectionId(derivedParentCollectionId);
  setParentOccasionId(derivedParentOccasionId);
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
    setParentCategoryId('');
    setThumbnailFile(null);
    setError('');
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setForm(emptyForm);
    setParentCategoryId('');
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
                  <label>Category Group (optional)</label>
                  <select
                    value={parentCategoryId}
                    onChange={(e) => {
                      const newParentId = e.target.value;
                      setParentCategoryId(newParentId);
                      setForm({ ...form, category_id: '' });
                    }}
                  >
                    <option value="">None</option>
                    {topLevelCategories.map((p) => (
                      <option key={p.id} value={String(p.id)}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Category</label>
                  <select
                    value={form.category_id}
                    onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                    disabled={!parentCategoryId}
                  
                  >
                    <option value="">{parentCategoryId ? 'Select a category' : 'Select a group first'}</option>
                    {childCategoriesOf(parentCategoryId).map((c) => (
                      <option key={c.id} value={String(c.id)}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Collection Group (optional)</label>
                  <select
                    value={parentCollectionId}
                    onChange={(e) => {
                      const newParentId = e.target.value;
                      setParentCollectionId(newParentId);
                      setForm({ ...form, collection_id: '' });
                    }}
                  >
                    <option value="">None</option>
                    {topLevelCollections.map((p) => (
                      <option key={p.id} value={String(p.id)}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Collection (optional)</label>
                  <select
                    value={form.collection_id}
                    onChange={(e) => setForm({ ...form, collection_id: e.target.value })}
                    disabled={!parentCollectionId}
                  >
                    <option value="">{parentCollectionId ? 'Select a collection' : 'Select a group first'}</option>
                    {childCollectionsOf(parentCollectionId).map((c) => (
                      <option key={c.id} value={String(c.id)}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Occasion Group (optional)</label>
                  <select
                    value={parentOccasionId}
                    onChange={(e) => {
                      const newParentId = e.target.value;
                      setParentOccasionId(newParentId);
                      setForm({ ...form, occasion_id: '' });
                    }}
                  >
                    <option value="">None</option>
                    {topLevelOccasions.map((p) => (
                      <option key={p.id} value={String(p.id)}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Occasion (optional)</label>
                  <select
                    value={form.occasion_id}
                    onChange={(e) => setForm({ ...form, occasion_id: e.target.value })}
                    disabled={!parentOccasionId}
                  >
                    <option value="">{parentOccasionId ? 'Select an occasion' : 'Select a group first'}</option>
                    {childOccasionsOf(parentOccasionId).map((o) => (
                      <option key={o.id} value={String(o.id)}>{o.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group checkbox-group">
                  <label className="checkbox-row">
                    <input type="checkbox" checked={form.is_free} onChange={(e) => setForm({ ...form, is_free: e.target.checked })} />
                    Free card
                  </label>
                </div>

                <div className="form-group checkbox-group">
                  <label className="checkbox-row">
                    <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />
                    Active (visible to customers)
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
                        <span className={`status-pill ${card.is_active ? 'active' : 'inactive'}`}>
                          {card.is_active ? 'Active' : 'Inactive'}
                        </span>
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
