import React, { useEffect, useState } from 'react';
import UserLayout from '../../components/user/UserLayout';
import { getNotifications, markNotificationRead, markAllNotificationsRead } from '../../api/notifications';
import { Link } from 'react-router-dom';

const UserNotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const data = await getNotifications();
      setNotifications(data);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead();
      setNotifications((prev) => prev.map((item) => ({ ...item, is_read: true })));
    } catch (error) {
      console.error('Failed to mark notifications as read:', error);
    }
  };

  const handleReadOne = async (id) => {
    try {
      await markNotificationRead(id);
      setNotifications((prev) => prev.map((item) => item.id === id ? { ...item, is_read: true } : item));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  return (
    <UserLayout>
      <div style={{ padding: '32px 24px', maxWidth: 960, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 28 }}>Notifications</h2>
            <p style={{ margin: '8px 0 0', color: '#64748b' }}>Your latest updates and account activity.</p>
          </div>
          <button
            onClick={handleMarkAllRead}
            style={{
              border: 'none',
              background: '#7c3aed',
              color: '#fff',
              padding: '10px 16px',
              borderRadius: 10,
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            Mark all read
          </button>
        </div>

        {loading ? (
          <div style={{ padding: 24, background: '#fff', borderRadius: 12 }}>Loading notifications...</div>
        ) : notifications.length === 0 ? (
          <div style={{ padding: 24, background: '#fff', borderRadius: 12, color: '#64748b' }}>
            You do not have any notifications yet.
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 16 }}>
            {notifications.map((item) => (
              <div
                key={item.id}
                style={{
                  background: item.is_read ? '#fff' : '#f5f3ff',
                  border: item.is_read ? '1px solid #e2e8f0' : '1px solid #ddd6fe',
                  borderRadius: 12,
                  padding: 18,
                  boxShadow: '0 1px 2px rgba(15,23,42,0.04)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: '0 0 6px', fontSize: 18 }}>{item.title}</h3>
                    <p style={{ margin: '0 0 10px', color: '#334155' }}>{item.message}</p>
                    <small style={{ color: '#64748b' }}>{new Date(item.created_at).toLocaleString()}</small>
                  </div>
                  {!item.is_read && (
                    <button
                      onClick={() => handleReadOne(item.id)}
                      style={{
                        border: '1px solid #ddd6fe',
                        background: '#fff',
                        color: '#7c3aed',
                        borderRadius: 8,
                        padding: '8px 10px',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Mark read
                    </button>
                  )}
                </div>
                {item.redirect_url && (
                  <div style={{ marginTop: 12 }}>
                    <Link to={item.redirect_url} style={{ color: '#7c3aed', fontWeight: 600 }}>Open related page</Link>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </UserLayout>
  );
};

export default UserNotificationsPage;
