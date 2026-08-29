import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { getContactMessages, replyContactMessage } from '../../api/admin';

const ContactMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sendingId, setSendingId] = useState(null);
  const [replyDrafts, setReplyDrafts] = useState({});
  const [deliveryMessage, setDeliveryMessage] = useState(null);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const data = await getContactMessages();
      setMessages(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load contact messages.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleReply = async (messageId) => {
    const reply = (replyDrafts[messageId] || '').trim();
    if (!reply) {
      alert('Please enter a reply before sending.');
      return;
    }

    try {
      setSendingId(messageId);
      const response = await replyContactMessage(messageId, reply);
      const updatedMessage = response.data;
      setMessages((prev) =>
        prev.map((item) => (item.id === messageId ? { ...item, ...updatedMessage, is_replied: true } : item))
      );
      setReplyDrafts((prev) => ({ ...prev, [messageId]: '' }));

      if (response.email_sent === false) {
        setDeliveryMessage({
          type: 'error',
          text: response.message || 'Reply was saved, but the email could not be delivered.',
        });
      } else if (response.delivery_method === 'email_and_notification') {
        setDeliveryMessage({
          type: 'success',
          text: 'Reply sent via email and notification.',
        });
      } else {
        setDeliveryMessage({
          type: 'success',
          text: 'Reply sent via email.',
        });
      }
    } catch (err) {
      setDeliveryMessage({
        type: 'error',
        text: err.response?.data?.message || 'Could not send reply.',
      });
    } finally {
      setSendingId(null);
    }
  };

  return (
    <AdminLayout>
      <div style={{ padding: '32px 24px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, gap: 16 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 28 }}>Contact Messages</h2>
            <p style={{ margin: '8px 0 0', color: '#64748b' }}>All customer inquiries and replies sent from the website.</p>
          </div>
        </div>

        {error && <div style={{ color: '#c0392b', margin: '0 0 16px' }}>{error}</div>}

        {loading ? (
          <div style={{ padding: 24, background: '#fff', borderRadius: 12 }}>Loading messages...</div>
        ) : messages.length === 0 ? (
          <div style={{ padding: 24, background: '#fff', borderRadius: 12, color: '#64748b' }}>
            No contact messages found.
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 20 }}>
            {messages.map((message) => (
              <div
                key={message.id}
                style={{
                  background: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: 14,
                  padding: 20,
                  boxShadow: '0 1px 2px rgba(15,23,42,0.04)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, marginBottom: 16, flexWrap: 'wrap' }}>
                  <div>
                    <h3 style={{ margin: '0 0 6px', fontSize: 20 }}>{message.name}</h3>
                    <div style={{ color: '#475569', fontSize: 14 }}>
                      {message.email} {message.subject ? `• ${message.subject}` : ''}
                    </div>
                  </div>
                  <span
                    style={{
                      padding: '6px 12px',
                      borderRadius: 999,
                      background: message.is_replied ? '#dcfce7' : '#fef3c7',
                      color: message.is_replied ? '#166534' : '#92400e',
                      fontSize: 12,
                      fontWeight: 600,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {message.is_replied ? 'Replied' : 'New'}
                  </span>
                </div>

                <div style={{ color: '#334155', lineHeight: 1.7, marginBottom: 18 }}>
                  {message.message}
                </div>

                <div style={{ color: '#64748b', fontSize: 12, marginBottom: 16 }}>
                  {message.created_at ? new Date(message.created_at).toLocaleString() : '—'}
                </div>

                {message.admin_reply ? (
                  <div
                    style={{
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: 10,
                      padding: 14,
                      marginBottom: 16,
                    }}
                  >
                    <strong style={{ display: 'block', marginBottom: 8 }}>Reply sent:</strong>
                    <div style={{ color: '#334155', whiteSpace: 'pre-wrap' }}>{message.admin_reply}</div>
                  </div>
                ) : null}

                <div style={{ display: 'grid', gap: 10 }}>
                  <textarea
                    value={replyDrafts[message.id] ?? ''}
                    onChange={(e) =>
                      setReplyDrafts((prev) => ({ ...prev, [message.id]: e.target.value }))
                    }
                    placeholder="Type a response to this customer..."
                    rows={5}
                    style={{
                      width: '100%',
                      border: '1px solid #cbd5e1',
                      borderRadius: 10,
                      padding: '12px 14px',
                      resize: 'vertical',
                      fontFamily: 'inherit',
                    }}
                  />

                  <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                    {deliveryMessage && (
                      <div
                        style={{
                          color: deliveryMessage.type === 'error' ? '#b91c1c' : '#166534',
                          background: deliveryMessage.type === 'error' ? '#fef2f2' : '#dcfce7',
                          border: `1px solid ${deliveryMessage.type === 'error' ? '#fecaca' : '#bbf7d0'}`,
                          borderRadius: 8,
                          padding: '8px 12px',
                          fontSize: 13,
                          fontWeight: 600,
                        }}
                      >
                        {deliveryMessage.text}
                      </div>
                    )}
                    <button
                      onClick={() => handleReply(message.id)}
                      disabled={sendingId === message.id}
                      style={{
                        background: '#7c3aed',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 10,
                        padding: '10px 18px',
                        cursor: sendingId === message.id ? 'not-allowed' : 'pointer',
                        opacity: sendingId === message.id ? 0.7 : 1,
                        fontWeight: 600,
                      }}
                    >
                      {sendingId === message.id ? 'Sending...' : 'Send Reply'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ContactMessages;
