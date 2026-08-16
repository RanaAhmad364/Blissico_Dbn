// src/pages/user/UserEditProfile.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import UserLayout from '../../components/user/UserLayout';
import api from '../../api/axiosConfig';
import { FiUser, FiCamera, FiSave, FiX, FiMail, FiPhone, FiMapPin, FiEdit2 } from 'react-icons/fi';
import './UserEditProfile.css';

const UserEditProfile = () => {
  const { user, setUser } = useAuth();
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    username: '',
    bio: '',
    phone: '',
    address: '',
  });
  
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [uploading, setUploading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const defaultUserData = {
    first_name: 'User',
    last_name: '',
    email: 'user@blissico.com',
    username: 'user',
    bio: '',
    phone: '',
    address: '',
    profile_image: null
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setFetching(true);
        
        if (user && user.email) {
          setFormData({
            first_name: user.first_name || defaultUserData.first_name,
            last_name: user.last_name || defaultUserData.last_name,
            email: user.email || defaultUserData.email,
            username: user.username || defaultUserData.username,
            bio: user.bio || defaultUserData.bio,
            phone: user.phone || defaultUserData.phone,
            address: user.address || defaultUserData.address,
          });
          
          if (user.profile_picture) {
            setImagePreview(user.profile_picture);
            setProfileImage(user.profile_picture);
          }
          setFetching(false);
          return;
        }

        try {
          const response = await api.get('/auth/me');
          const userData = response.data;
          
          if (userData) {
            setFormData({
              first_name: userData.first_name || defaultUserData.first_name,
              last_name: userData.last_name || defaultUserData.last_name,
              email: userData.email || defaultUserData.email,
              username: userData.username || defaultUserData.username,
              bio: userData.bio || defaultUserData.bio,
              phone: userData.phone || defaultUserData.phone,
              address: userData.address || defaultUserData.address,
            });
            
            if (userData.profile_picture) {
              setImagePreview(userData.profile_picture);
              setProfileImage(userData.profile_picture);
            }
            
            if (setUser) {
              setUser(userData);
            }
          }
        } catch (apiError) {
          console.warn('API Error, using default data:', apiError);
          setFormData(defaultUserData);
          setMessage({
            type: 'warning',
            text: 'Using demo data. API connection failed.'
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setFormData(defaultUserData);
      } finally {
        setFetching(false);
      }
    };

    fetchUserData();
  }, [user, setUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        setMessage({
          type: 'error',
          text: 'Please select a valid image (JPEG, PNG, WEBP, GIF)'
        });
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setMessage({
          type: 'error',
          text: 'Image size should be less than 5MB'
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setProfileImage(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('profile_picture', file);
    
    try {
      const response = await api.post('/auth/upload-profile-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.image_url;
    } catch (error) {
      console.error('Image upload error:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      let imageUrl = user?.profile_picture || null;

      if (profileImage && typeof profileImage !== 'string') {
        setUploading(true);
        try {
          imageUrl = await uploadImage(profileImage);
        } catch (uploadError) {
          console.warn('Image upload failed:', uploadError);
          imageUrl = user?.profile_picture || null;
        }
        setUploading(false);
      }

      const updateData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        username: formData.username,
        bio: formData.bio,
        phone: formData.phone,
        address: formData.address,
        profile_picture: imageUrl,
      };

      try {
        const response = await api.put('/auth/update-profile', updateData);
        
        if (setUser && response.data.user) {
          setUser(response.data.user);
        }

        setMessage({
          type: 'success',
          text: 'Profile updated successfully!'
        });

        if (response.data.user) {
          setFormData({
            first_name: response.data.user.first_name || '',
            last_name: response.data.user.last_name || '',
            email: response.data.user.email || '',
            username: response.data.user.username || '',
            bio: response.data.user.bio || '',
            phone: response.data.user.phone || '',
            address: response.data.user.address || '',
          });
          
          if (response.data.user.profile_picture) {
            setImagePreview(response.data.user.profile_picture);
            setProfileImage(response.data.user.profile_picture);
          }
        }
      } catch (updateError) {
        console.warn('Update API failed:', updateError);
        const updatedUser = {
          ...user,
          ...updateData,
        };
        if (setUser) {
          setUser(updatedUser);
        }
        setMessage({
          type: 'success',
          text: 'Profile updated locally!'
        });
      }

      setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 5000);

    } catch (error) {
      console.error('Update profile error:', error);
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to update profile.'
      });
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  const handleRemoveImage = async () => {
    try {
      await api.delete('/auth/remove-profile-image');
      setImagePreview(null);
      setProfileImage(null);
      setMessage({
        type: 'success',
        text: 'Profile image removed successfully!'
      });
      
      if (setUser) {
        setUser({ ...user, profile_picture: null });
      }
    } catch (error) {
      console.warn('Remove image failed:', error);
      setImagePreview(null);
      setProfileImage(null);
      if (setUser) {
        setUser({ ...user, profile_picture: null });
      }
      setMessage({
        type: 'success',
        text: 'Profile image removed locally!'
      });
    }
  };

  if (fetching) {
    return (
      <UserLayout>
        <div className="user-edit-profile-container">
          <div className="user-loading-container">
            <div className="user-loading-spinner"></div>
            <p>Loading profile data...</p>
          </div>
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <div className="user-edit-profile-container">
        <div className="user-edit-profile-header">
          <h2>
            <FiEdit2 className="user-header-icon" />
            Edit Profile
          </h2>
          <p>Update your personal information and profile photo</p>
        </div>

        {message.text && (
          <div className={`user-profile-message ${message.type}`}>
            {message.type === 'success' ? '✅' : message.type === 'warning' ? '⚠️' : '❌'} 
            {message.text}
          </div>
        )}

        <form className="user-edit-profile-form" onSubmit={handleSubmit}>
          <div className="user-profile-form-grid">
            <div className="user-profile-image-section">
              <div className="user-profile-image-container">
                <div className="user-profile-image-wrapper">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Profile" className="user-profile-image-preview" />
                  ) : (
                    <div className="user-profile-image-placeholder">
                      <FiUser size={64} />
                    </div>
                  )}
                  <div className="user-profile-image-overlay">
                    <button 
                      type="button" 
                      className="user-image-upload-btn"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <FiCamera size={20} />
                      <span>Change Photo</span>
                    </button>
                  </div>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageSelect}
                  accept="image/*"
                  style={{ display: 'none' }}
                />
                {imagePreview && (
                  <button 
                    type="button" 
                    className="user-remove-image-btn"
                    onClick={handleRemoveImage}
                  >
                    <FiX size={16} />
                    Remove
                  </button>
                )}
                <p className="user-image-hint">JPG, PNG, WEBP (Max 5MB)</p>
              </div>
            </div>

            <div className="user-profile-form-fields">
              <div className="user-form-row">
                <div className="user-form-group">
                  <label>First Name</label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    placeholder="Enter first name"
                    required
                  />
                </div>
                <div className="user-form-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    placeholder="Enter last name"
                  />
                </div>
              </div>

              <div className="user-form-group">
                <label>
                  <FiMail className="user-input-icon" />
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                  required
                />
              </div>

              <div className="user-form-group">
                <label>Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Enter username"
                  required
                />
              </div>

              <div className="user-form-group">
                <label>
                  <FiPhone className="user-input-icon" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                />
              </div>

              <div className="user-form-group">
                <label>Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Tell us about yourself"
                  rows="3"
                />
              </div>

              <div className="user-form-group">
                <label>
                  <FiMapPin className="user-input-icon" />
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter your address"
                />
              </div>

              <div className="user-form-actions">
                <button 
                  type="submit" 
                  className="user-save-btn"
                  disabled={loading || uploading}
                >
                  {loading || uploading ? (
                    <>
                      <span className="user-spinner"></span>
                      {uploading ? 'Uploading...' : 'Saving...'}
                    </>
                  ) : (
                    <>
                      <FiSave size={18} />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </UserLayout>
  );
};

export default UserEditProfile;