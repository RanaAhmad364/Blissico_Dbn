import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { getCollections, createCollection, updateCollection, deleteCollection } from '../../api/admin';

const emptyForm = { id: null, name: '', description: '' };

const Collections = () => {
  const [collections, setCollections] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const load = () => getCollections().then(setCollections).catch(() => setError('Could not load collections.'));
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      if (form.id) await updateCollection(form.id, form);
      else await createCollection(form);
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
        <button type="submit" disabled={saving}>{form.id ? 'Update' : 'Add'} Collection</button>
        {form.id && <button type="button" onClick={() => setForm(emptyForm)}>Cancel</button>}
      </form>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ textAlign: 'left', borderBottom: '2px solid #eee' }}>
            <th>Name</th><th>Slug</th><th>Status</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {collections.map((c) => (
            <tr key={c.id}>
              <td>{c.name}</td>
              <td>{c.slug}</td>
              <td>{c.is_active ? 'Active' : 'Inactive'}</td>
              <td>
                <button onClick={() => setForm({ id: c.id, name: c.name, description: c.description || '' })}>Edit</button>{' '}
                <button onClick={() => handleDelete(c.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </AdminLayout>
  );
};

export default Collections;

