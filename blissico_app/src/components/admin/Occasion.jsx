// src/pages/admin/Occasions.jsx
import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { getOccasions, createOccasion, updateOccasion, deleteOccasion } from '../../api/admin';
import { FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';
import '../../pages/admin/Categories.css'; // Same CSS file reuse karein

const emptyForm = { id: null, name: '', description: '', parent_id: '' };

const Occasions = () => {
  const [occasions, setOccasions] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const load = () => getOccasions().then(setOccasions).catch(() => setError('Could not load occasions.'));

  useEffect(() => { load(); }, []);

  const topLevel = occasions.filter((o) => !o.parent_id);
  const childrenOf = (id) => occasions.filter((o) => o.parent_id === id);

  const openAddForm = () => {
    setForm(emptyForm);
    setError('');
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    const payload = { name: form.name, description: form.description, parent_id: form.parent_id || null };
    try {
      if (form.id) {
        await updateOccasion(form.id, payload);
      } else {
        await createOccasion(payload);
      }
      setForm(emptyForm);
      setShowForm(false); // ✅ Save k baad wapis table par redirect
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save occasion.');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (occ) => {
    setForm({ id: occ.id, name: occ.name, description: occ.description || '', parent_id: occ.parent_id || '' });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this occasion?')) return;
    try {
      await deleteOccasion(id);
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Could not delete occasion.');
    }
  };

  const renderRow = (occ, depth = 0) => (
    <React.Fragment key={occ.id}>
      <tr>
        <td className="cat-name-cell" style={{ paddingLeft: 20 + depth * 24 }}>
          {depth > 0 && <span className="cat-connector">↳</span>}
          {occ.name}
        </td>
        <td className="cat-slug">{occ.slug}</td>
        <td>
          <span className={`status-pill ${occ.is_active ? 'active' : 'inactive'}`}>
            {occ.is_active ? 'Active' : 'Inactive'}
          </span>
        </td>
        <td>
          <div className="row-actions">
            <button className="action-pill edit" onClick={() => handleEdit(occ)}>
              <FiEdit2 size={13} /> Edit
            </button>
            <button className="action-pill delete" onClick={() => handleDelete(occ.id)}>
              <FiTrash2 size={13} /> Delete
            </button>
          </div>
        </td>
      </tr>
      {childrenOf(occ.id).map((child) => renderRow(child, depth + 1))}
    </React.Fragment>
  );

  return (
    <AdminLayout>
      <div className="categories-page">
        <div className="categories-header">
          <div>
            <h1>Occasions</h1>
            <p className="page-subtitle">Manage your card occasions and sub-occasions</p>
          </div>
          {!showForm && (
            <button className="add-new-btn" onClick={openAddForm}>
              <FiPlus size={16} /> Add New Occasion
            </button>
          )}
        </div>

        {error && <div className="categories-error">{error}</div>}

        {showForm && (
          <div className="category-form-card">
            <div className="form-card-header">
              <h3>{form.id ? 'Edit Occasion' : 'Add New Occasion'}</h3>
              <button className="close-form-btn" onClick={() => { setShowForm(false); setForm(emptyForm); }}>
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
                  <label>Parent (optional — makes this a sub-occasion)</label>
                  <select value={form.parent_id} onChange={(e) => setForm({ ...form, parent_id: e.target.value })}>
                    <option value="">None — top level</option>
                    {topLevel.filter((o) => o.id !== form.id).map((o) => (
                      <option key={o.id} value={o.id}>{o.name}</option>
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
              </div>

              <div className="form-actions">
                <button type="submit" className="save-btn" disabled={saving}>
                  {saving ? 'Saving...' : form.id ? 'Update Occasion' : 'Add Occasion'}
                </button>
                <button type="button" className="cancel-btn" onClick={() => { setShowForm(false); setForm(emptyForm); }}>
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
                <tr><td colSpan={4} className="empty-state">No occasions yet — click "Add New Occasion" to create one.</td></tr>
              ) : (
                topLevel.map((o) => renderRow(o))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Occasions;