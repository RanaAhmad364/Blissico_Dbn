// src/pages/admin/Categories.jsx
import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../../api/admin';
import { assetUrl } from '../../api/catalog';
import { FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';
import './Categories.css';

const emptyForm = { id: null, name: '', description: '', parent_id: '', mega_menu_image: '' };

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [megaMenuImage, setMegaMenuImage] = useState(null);
  const [megaMenuImagePreview, setMegaMenuImagePreview] = useState('');
  const [removeMegaMenuImage, setRemoveMegaMenuImage] = useState(false);

  const load = () => getCategories().then(setCategories).catch(() => setError('Could not load categories.'));

  useEffect(() => { load(); }, []);

  const topLevel = categories.filter((c) => !c.parent_id);
  const childrenOf = (id) => categories.filter((c) => c.parent_id === id);

  const resetMegaMenuImageState = (existingImage = '') => {
    setMegaMenuImage(null);
    setRemoveMegaMenuImage(false);
    setMegaMenuImagePreview(existingImage ? assetUrl(existingImage) : '');
  };

  const openAddForm = () => {
    setForm(emptyForm);
    resetMegaMenuImageState();
    setError('');
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    const fd = new FormData();
    fd.append('name', form.name);
    fd.append('description', form.description || '');
    if (form.parent_id) fd.append('parent_id', form.parent_id);
    if (removeMegaMenuImage) fd.append('remove_mega_menu_image', 'true');
    if (megaMenuImage) fd.append('mega_menu_image', megaMenuImage);

    try {
      if (form.id) {
        await updateCategory(form.id, fd);
      } else {
        await createCategory(fd);
      }
      setForm(emptyForm);
      resetMegaMenuImageState();
      setShowForm(false);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save category.');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (cat) => {
    setForm({ id: cat.id, name: cat.name, description: cat.description || '', parent_id: cat.parent_id || '', mega_menu_image: cat.mega_menu_image || '' });
    resetMegaMenuImageState(cat.mega_menu_image || '');
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    try {
      await deleteCategory(id);
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Could not delete category.');
    }
  };

  const renderRow = (cat, depth = 0) => (
    <React.Fragment key={cat.id}>
      <tr>
        <td className="cat-name-cell" style={{ paddingLeft: 20 + depth * 24 }}>
          {depth > 0 && <span className="cat-connector">↳</span>}
          {cat.name}
        </td>
        <td className="cat-slug">{cat.slug}</td>
        <td>
          <span className={`status-pill ${cat.is_active ? 'active' : 'inactive'}`}>
            {cat.is_active ? 'Active' : 'Inactive'}
          </span>
        </td>
        <td>
          <div className="row-actions">
            <button className="action-pill edit" onClick={() => handleEdit(cat)}>
              <FiEdit2 size={13} /> Edit
            </button>
            <button className="action-pill delete" onClick={() => handleDelete(cat.id)}>
              <FiTrash2 size={13} /> Delete
            </button>
          </div>
        </td>
      </tr>
      {childrenOf(cat.id).map((child) => renderRow(child, depth + 1))}
    </React.Fragment>
  );

  return (
    <AdminLayout>
      <div className="categories-page">
        <div className="categories-header">
          <div>
            <h1>Categories</h1>
            <p className="page-subtitle">Manage your card categories and subcategories</p>
          </div>
          {!showForm && (
            <button className="add-new-btn" onClick={openAddForm}>
              <FiPlus size={16} /> Add New Category
            </button>
          )}
        </div>

        {error && <div className="categories-error">{error}</div>}

        {showForm && (
          <div className="category-form-card">
            <div className="form-card-header">
              <h3>{form.id ? 'Edit Category' : 'Add New Category'}</h3>
              <button className="close-form-btn" onClick={() => { setShowForm(false); setForm(emptyForm); resetMegaMenuImageState(); }}>
                <FiX size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="category-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>Name</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Birthday"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Parent (optional — makes this a subcategory)</label>
                  <select value={form.parent_id} onChange={(e) => setForm({ ...form, parent_id: e.target.value })}>
                    <option value="">None — top level</option>
                    {topLevel.filter((c) => c.id !== form.id).map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group full-width">
                  <label>Description</label>
                  <input
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Short description (optional)"
                  />
                </div>
                <div className="form-group full-width">
                  <label>Mega Menu Image (Optional)</label>
                  <div className="mega-menu-upload-box">
                    {megaMenuImagePreview ? (
                      <img src={megaMenuImagePreview} alt="Mega menu preview" className="mega-menu-preview" />
                    ) : (
                      <div className="mega-menu-placeholder">No image selected</div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        setMegaMenuImage(file);
                        setRemoveMegaMenuImage(false);
                        setMegaMenuImagePreview(file ? URL.createObjectURL(file) : (form.mega_menu_image ? assetUrl(form.mega_menu_image) : ''));
                      }}
                    />
                    {(form.mega_menu_image || megaMenuImagePreview) && !removeMegaMenuImage && (
                      <button
                        type="button"
                        className="text-btn danger"
                        onClick={() => {
                          setRemoveMegaMenuImage(true);
                          setMegaMenuImage(null);
                          setMegaMenuImagePreview('');
                        }}
                      >
                        Remove Image
                      </button>
                    )}
                  </div>
                  <small className="helper-text">Upload an image to show it in the navbar mega menu. The category name will be used as the caption.</small>
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="save-btn" disabled={saving}>
                  {saving ? 'Saving...' : form.id ? 'Update Category' : 'Add Category'}
                </button>
                <button type="button" className="cancel-btn" onClick={() => { setShowForm(false); setForm(emptyForm); resetMegaMenuImageState(); }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="categories-table-card">
          <table className="categories-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Slug</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {topLevel.length === 0 ? (
                <tr><td colSpan={4} className="empty-state">No categories yet — click "Add New Category" to create one.</td></tr>
              ) : (
                topLevel.map((c) => renderRow(c))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Categories;