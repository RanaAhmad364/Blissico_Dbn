import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { getCollections, createCollection, updateCollection, deleteCollection } from '../../api/admin';
import '../../pages/admin/Categories.css';

const emptyForm = { id: null, name: '', description: '', parent_id: '' };

const Collections = () => {
  const [collections, setCollections] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const load = () => getCollections().then(setCollections).catch(() => setError('Could not load collections.'));
  useEffect(() => { load(); }, []);

  const topLevel = collections.filter((c) => !c.parent_id);
  const childrenOf = (id) => collections.filter((c) => c.parent_id === id);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    const payload = { name: form.name, description: form.description, parent_id: form.parent_id || null };
    try {
      if (form.id) await updateCollection(form.id, payload);
      else await createCollection(payload);
      setForm(emptyForm);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save collection.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this collection?')) return;
    try { await deleteCollection(id); load(); }
    catch (err) { alert(err.response?.data?.message || 'Could not delete collection.'); }
  };

  const renderRow = (col, depth = 0) => (
    <React.Fragment key={col.id}>
      <tr>
        <td style={{ paddingLeft: 20 + depth * 24 }}>{depth > 0 && '↳ '}{col.name}</td>
        <td>{col.slug}</td>
        <td>
          <span className={`status-pill ${col.is_active ? 'active' : 'inactive'}`}>
            {col.is_active ? 'Active' : 'Inactive'}
          </span>
        </td>
        <td>
          <button onClick={() => setForm({ id: col.id, name: col.name, description: col.description || '', parent_id: col.parent_id || '' })}>Edit</button>{' '}
          <button onClick={() => handleDelete(col.id)}>Delete</button>
        </td>
      </tr>
      {childrenOf(col.id).map((child) => renderRow(child, depth + 1))}
    </React.Fragment>
  );

  return (
    <AdminLayout>
      <h1>Collections</h1>
      {error && <div style={{ color: '#c0392b', margin: '12px 0' }}>{error}</div>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 10, alignItems: 'flex-end', margin: '20px 0', flexWrap: 'wrap' }}>
        <div>
          <label style={{ display: 'block', fontSize: 12 }}>Name</label>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 12 }}>Description</label>
          <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 12 }}>Parent (optional — makes this a subcategory)</label>
          <select value={form.parent_id} onChange={(e) => setForm({ ...form, parent_id: e.target.value })}>
            <option value="">None — top level</option>
            {topLevel.filter((c) => c.id !== form.id).map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <button type="submit" disabled={saving}>{form.id ? 'Update' : 'Add'} Collection</button>
        {form.id && <button type="button" onClick={() => setForm(emptyForm)}>Cancel</button>}
      </form>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ textAlign: 'left', borderBottom: '2px solid #eee' }}>
            <th>Name</th><th>Slug</th><th>Status</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>{topLevel.map((c) => renderRow(c))}</tbody>
      </table>
    </AdminLayout>
  );
};

export default Collections;