import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { getUsers, updateUserStatus, verifyUser, deleteUser } from '../../api/admin';
import { assetUrl } from '../../api/Catalog';
import '../admin/Categories.css';

const initials = (firstName, lastName) =>
  `${(firstName || '?')[0]}${(lastName || '')[0] || ''}`.toUpperCase();

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = () =>
    getUsers()
      .then(setUsers)
      .catch(() => setError('Could not load users.'))
      .finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const handleToggleActive = async (user) => {
    try {
      await updateUserStatus(user.id, !user.is_active);
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Could not update status.');
    }
  };

  const handleToggleVerified = async (user) => {
    try {
      await verifyUser(user.id, !user.is_verified);
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Could not update verification.');
    }
  };

  const handleDelete = async (user) => {
    if (!window.confirm(`Delete ${user.first_name} ${user.last_name}? This cannot be undone.`)) return;
    try {
      await deleteUser(user.id);
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Could not delete user.');
    }
  };

  return (
    <AdminLayout>
      <h1>Users</h1>
      <p style={{ color: '#888', marginBottom: 20 }}>All registered accounts, including their verification and access status.</p>

      {error && <div style={{ color: '#c0392b', margin: '12px 0' }}>{error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '2px solid #eee' }}>
              <th style={{ padding: '10px 8px' }}></th>
              <th style={{ padding: '10px 8px' }}>Name</th>
              <th style={{ padding: '10px 8px' }}>Email</th>
              <th style={{ padding: '10px 8px' }}>Role</th>
              <th style={{ padding: '10px 8px' }}>Verified</th>
              <th style={{ padding: '10px 8px' }}>Active</th>
              <th style={{ padding: '10px 8px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} style={{ borderBottom: '1px solid #f2f2f2' }}>
                <td style={{ padding: '10px 8px' }}>
                  {user.profile_picture ? (
                    <img
                      src={assetUrl(user.profile_picture)}
                      alt={`${user.first_name} ${user.last_name}`}
                      style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div
                      style={{
                        width: 36, height: 36, borderRadius: '50%', background: '#e5e0f7',
                        color: '#6d28d9', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 13, fontWeight: 600,
                      }}
                    >
                      {initials(user.first_name, user.last_name)}
                    </div>
                  )}
                </td>
                <td style={{ padding: '10px 8px' }}>{user.first_name} {user.last_name}</td>
                <td style={{ padding: '10px 8px' }}>{user.email}</td>
                <td style={{ padding: '10px 8px' }}>{user.role || '—'}</td>
                <td style={{ padding: '10px 8px' }}>
                  <span
                    className={`status-pill ${user.is_verified ? 'active' : 'inactive'}`}
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleToggleVerified(user)}
                    title="Click to toggle"
                  >
                    {user.is_verified ? 'Verified' : 'Unverified'}
                  </span>
                </td>
                <td style={{ padding: '10px 8px' }}>
                  <span
                    className={`status-pill ${user.is_active ? 'active' : 'inactive'}`}
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleToggleActive(user)}
                    title="Click to toggle"
                  >
                    {user.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td style={{ padding: '10px 8px' }}>
                  <button onClick={() => handleDelete(user)}>Delete</button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr><td colSpan={7} style={{ padding: 20, textAlign: 'center', color: '#888' }}>No users found.</td></tr>
            )}
          </tbody>
        </table>
      )}
    </AdminLayout>
  );
};

export default Users;