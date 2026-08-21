import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { getOccasions, createOccasion, updateOccasion, deleteOccasion } from '../../api/admin';
import '../../pages/admin/Categories.css';

const emptyForm = { id: null, name: '', description: '', parent_id: '' };

const Occasions = () => {
  const [occasions, setOccasions] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const load = () => getOccasions().then(setOccasions).catch(() => setError('Could not load occasions.'));
  useEffect(() => { load(); }, []);

  const topLevel = occasions.filter((o) => !o.parent_id);
  const childrenOf = (id) => occasions.filter((o) => o.parent_id === id);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    const payload = { name: form.name, description: form.description, parent_id: form.parent_id || null };
    try {
      if (form.id) await updateOccasion(form.id, payload);
      else await createOccasion(payload);
      setForm(emptyForm);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save occasion.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this occasion?')) return;
    try { await deleteOccasion(id); load(); }
    catch (err) { alert(err.response?.data?.message || 'Could not delete occasion.'); }
  };

  const renderRow = (occ, depth = 0) => (
    <React.Fragment key={occ.id}>
      <tr>
        <td style={{ paddingLeft: 20 + depth * 24 }}>{depth > 0 && '↳ '}{occ.name}</td>
        <td>{occ.slug}</td>
        <td>
          <span className={`status-pill ${occ.is_active ? 'active' : 'inactive'}`}>
            {occ.is_active ? 'Active' : 'Inactive'}
          </span>
        </td>
        <td>
          <button onClick={() => setForm({ id: occ.id, name: occ.name, description: occ.description || '', parent_id: occ.parent_id || '' })}>Edit</button>{' '}
          <button onClick={() => handleDelete(occ.id)}>Delete</button>
        </td>
      </tr>
      {childrenOf(occ.id).map((child) => renderRow(child, depth + 1))}
    </React.Fragment>
  );

  return (
    <AdminLayout>
      <h1>Occasions</h1>
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
            {topLevel.filter((o) => o.id !== form.id).map((o) => (
              <option key={o.id} value={o.id}>{o.name}</option>
            ))}
          </select>
        </div>
        <button type="submit" disabled={saving}>{form.id ? 'Update' : 'Add'} Occasion</button>
        {form.id && <button type="button" onClick={() => setForm(emptyForm)}>Cancel</button>}
      </form>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ textAlign: 'left', borderBottom: '2px solid #eee' }}>
            <th>Name</th><th>Slug</th><th>Status</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>{topLevel.map((o) => renderRow(o))}</tbody>
      </table>
    </AdminLayout>
  );
};

export default Occasions;