import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import UserLayout from '../../components/user/UserLayout';
import { getMyProfile, updateMyProfile, uploadProfilePicture, removeProfilePicture } from '../../api/profile';
import { assetUrl } from '../../api/Catalog';
import { FiUser, FiCamera, FiSave, FiX, FiMail, FiEdit2 } from 'react-icons/fi';
import './UserEditProfile.css';

const EditProfile = () => {
  const { updateUser } = useAuth();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({ first_name: '', last_name: '', email: '' });
  const [picture, setPicture] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    getMyProfile()
      .then((data) => {
        setFormData({ first_name: data.first_name, last_name: data.last_name, email: data.email });
        setPicture(data.profile_picture);
      })
      .catch(() => setMessage({ type: 'error', text: 'Could not load your profile.' }))
      .finally(() => setFetching(false));
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleImageSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setMessage({ type: '', text: '' });
    try {
      const res = await uploadProfilePicture(file);
      setPicture(res.data.profile_picture);
      updateUser({ profile_picture: res.data.profile_picture });
      setMessage({ type: 'success', text: 'Profile picture updated!' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Could not upload image.' });
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = async () => {
    try {
      await removeProfilePicture();
      setPicture(null);
      updateUser({ profile_picture: null });
      setMessage({ type: 'success', text: 'Profile picture removed.' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Could not remove image.' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const res = await updateMyProfile(formData);
      updateUser(res.data);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update profile.' });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <UserLayout>
        <div className="edit-profile-container">
          <div className="loading-container"><div className="loading-spinner"></div><p>Loading profile data...</p></div>
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <div className="edit-profile-container">
        <div className="edit-profile-header">
          <h2><FiEdit2 className="header-icon" /> Edit Profile</h2>
          <p>Update your personal information and profile photo</p>
        </div>

        {message.text && (
          <div className={`profile-message ${message.type}`}>
            {message.type === 'success' ? '✅' : '❌'} {message.text}
          </div>
        )}

        <form className="edit-profile-form" onSubmit={handleSubmit}>
          <div className="profile-form-grid">
            <div className="profile-image-section">
              <div className="profile-image-container">
                <div className="profile-image-wrapper">
                  {picture ? (
                    <img src={assetUrl(picture)} alt="Profile" className="profile-image-preview" />
                  ) : (
                    <div className="profile-image-placeholder"><FiUser size={64} /></div>
                  )}
                  <div className="profile-image-overlay">
                    <button type="button" className="image-upload-btn" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
                      <FiCamera size={20} /><span>{uploading ? 'Uploading...' : 'Change Photo'}</span>
                    </button>
                  </div>
                </div>
                <input type="file" ref={fileInputRef} onChange={handleImageSelect} accept="image/*" style={{ display: 'none' }} />
                {picture && (
                  <button type="button" className="remove-image-btn" onClick={handleRemoveImage}>
                    <FiX size={16} /> Remove
                  </button>
                )}
                <p className="image-hint">JPG, PNG, WEBP (max 10MB)</p>
              </div>
            </div>

            <div className="profile-form-fields">
              <div className="form-row">
                <div className="form-group">
                  <label>First Name</label>
                  <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} required />
                </div>
              </div>

              <div className="form-group">
                <label><FiMail className="input-icon" /> Email Address</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required />
              </div>

              <div className="form-actions">
                <button type="submit" className="save-btn" disabled={loading}>
                  {loading ? <><span className="spinner"></span> Saving...</> : <><FiSave size={18} /> Save Changes</>}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </UserLayout>
  );
};

export default EditProfile;



































































