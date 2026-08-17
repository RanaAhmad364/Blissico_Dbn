import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { getOccasions, createOccasion, updateOccasion, deleteOccasion } from '../../api/admin';

const emptyForm = { id: null, name: '', description: '' };

const Occasions = () => {
  const [occasions, setOccasions] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const load = () => getOccasions().then(setOccasions).catch(() => setError('Could not load occasions.'));
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      if (form.id) await updateOccasion(form.id, form);
      else await createOccasion(form);
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
        <button type="submit" disabled={saving}>{form.id ? 'Update' : 'Add'} Occasion</button>
        {form.id && <button type="button" onClick={() => setForm(emptyForm)}>Cancel</button>}
      </form>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ textAlign: 'left', borderBottom: '2px solid #eee' }}>
            <th>Name</th><th>Slug</th><th>Status</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {occasions.map((o) => (
            <tr key={o.id}>
              <td>{o.name}</td>
              <td>{o.slug}</td>
              <td>{o.is_active ? 'Active' : 'Inactive'}</td>
              <td>
                <button onClick={() => setForm({ id: o.id, name: o.name, description: o.description || '' })}>Edit</button>{' '}
                <button onClick={() => handleDelete(o.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </AdminLayout>
  );
};

export default Occasions;