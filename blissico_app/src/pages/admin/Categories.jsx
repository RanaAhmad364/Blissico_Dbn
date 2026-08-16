import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../../api/admin';

const emptyForm = { id: null, name: '', description: '', parent_id: '' };

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const load = () => getCategories().then(setCategories).catch(() => setError('Could not load categories.'));

  useEffect(() => { load(); }, []);

  const topLevel = categories.filter((c) => !c.parent_id);
  const childrenOf = (id) => categories.filter((c) => c.parent_id === id);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    const payload = { name: form.name, description: form.description, parent_id: form.parent_id || null };
    try {
      if (form.id) {
        await updateCategory(form.id, payload);
      } else {
        await createCategory(payload);
      }
      setForm(emptyForm);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save category.');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (cat) => setForm({ id: cat.id, name: cat.name, description: cat.description || '', parent_id: cat.parent_id || '' });

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
        <td style={{ paddingLeft: depth * 24 }}>{depth > 0 ? '— ' : ''}{cat.name}</td>
        <td>{cat.slug}</td>
        <td>{cat.is_active ? 'Active' : 'Inactive'}</td>
        <td>
          <button onClick={() => handleEdit(cat)}>Edit</button>{' '}
          <button onClick={() => handleDelete(cat.id)}>Delete</button>
        </td>
      </tr>
      {childrenOf(cat.id).map((child) => renderRow(child, depth + 1))}
    </React.Fragment>
  );

  return (
    <AdminLayout>
      <h1>Categories</h1>
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
        <button type="submit" disabled={saving}>{form.id ? 'Update' : 'Add'} Category</button>
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

export default Categories;




