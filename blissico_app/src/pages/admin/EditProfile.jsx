// src/pages/admin/EditProfile.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../api/axiosConfig';
import { FiUser, FiCamera, FiSave, FiX, FiMail, FiPhone, FiMapPin, FiEdit2 } from 'react-icons/fi';
import './EditProfile.css';

const EditProfile = () => {
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

  // ✅ DEFAULT MOCK DATA (Fallback if API fails)
  const defaultUserData = {
    first_name: 'Admin',
    last_name: 'User',
    email: 'admin@blissico.com',
    username: 'admin',
    bio: 'Administrator of Blissico',
    phone: '+92 300 1234567',
    address: '123 Main Street, Lahore, Pakistan',
    profile_image: null
  };

  // Fetch user data from API
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setFetching(true);
        
        // If user is already in context, use it
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
          
          if (user.profile_image) {
            setImagePreview(user.profile_image);
            setProfileImage(user.profile_image);
          }
          setFetching(false);
          return;
        }

        // Try to fetch from API
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
            
            if (userData.profile_image) {
              setImagePreview(userData.profile_image);
              setProfileImage(userData.profile_image);
            }
            
            // Update context
            if (setUser) {
              setUser(userData);
            }
          }
        } catch (apiError) {
          console.warn('API Error, using default data:', apiError);
          // Use default data if API fails
          setFormData(defaultUserData);
          setImagePreview(null);
          setProfileImage(null);
          
          // Show warning message
          setMessage({
            type: 'warning',
            text: 'Using demo data. API connection failed.'
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        // Use default data on any error
        setFormData(defaultUserData);
      } finally {
        setFetching(false);
      }
    };

    fetchUserData();
  }, [user, setUser]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle image selection
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

  // Upload image to server
  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('profile_image', file);
    
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

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      let imageUrl = user?.profile_image || null;

      // Upload image if new image selected
      if (profileImage && typeof profileImage !== 'string') {
        setUploading(true);
        try {
          imageUrl = await uploadImage(profileImage);
        } catch (uploadError) {
          console.warn('Image upload failed, continuing without image:', uploadError);
          imageUrl = user?.profile_image || null;
        }
        setUploading(false);
      }

      // Update user profile
      const updateData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        username: formData.username,
        bio: formData.bio,
        phone: formData.phone,
        address: formData.address,
        profile_image: imageUrl,
      };

      try {
        const response = await api.put('/auth/update-profile', updateData);
        
        // Update user in context
        if (setUser && response.data.user) {
          setUser(response.data.user);
        }

        setMessage({
          type: 'success',
          text: 'Profile updated successfully!'
        });

        // Update local user data
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
          
          if (response.data.user.profile_image) {
            setImagePreview(response.data.user.profile_image);
            setProfileImage(response.data.user.profile_image);
          }
        }
      } catch (updateError) {
        console.warn('Update API failed, updating locally:', updateError);
        // Update locally even if API fails
        const updatedUser = {
          ...user,
          ...updateData,
        };
        if (setUser) {
          setUser(updatedUser);
        }
        setMessage({
          type: 'success',
          text: 'Profile updated locally! (API connection failed)'
        });
      }

      setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 5000);

    } catch (error) {
      console.error('Update profile error:', error);
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to update profile. Please try again.'
      });
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  // Remove image
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
        setUser({ ...user, profile_image: null });
      }

      setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 3000);

    } catch (error) {
      console.warn('Remove image API failed, removing locally:', error);
      setImagePreview(null);
      setProfileImage(null);
      if (setUser) {
        setUser({ ...user, profile_image: null });
      }
      setMessage({
        type: 'success',
        text: 'Profile image removed locally!'
      });
    }
  };

  // Show loading state
  if (fetching) {
    return (
      <AdminLayout>
        <div className="edit-profile-container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading profile data...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="edit-profile-container">
        <div className="edit-profile-header">
          <h2>
            <FiEdit2 className="header-icon" />
            Edit Profile
          </h2>
          <p>Update your personal information and profile photo</p>
        </div>

        {/* Message */}
        {message.text && (
          <div className={`profile-message ${message.type}`}>
            {message.type === 'success' ? '✅' : message.type === 'warning' ? '⚠️' : '❌'} 
            {message.text}
          </div>
        )}

        <form className="edit-profile-form" onSubmit={handleSubmit}>
          <div className="profile-form-grid">
            {/* Left Column - Profile Image */}
            <div className="profile-image-section">
              <div className="profile-image-container">
                <div className="profile-image-wrapper">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Profile" className="profile-image-preview" />
                  ) : (
                    <div className="profile-image-placeholder">
                      <FiUser size={64} />
                    </div>
                  )}
                  <div className="profile-image-overlay">
                    <button 
                      type="button" 
                      className="image-upload-btn"
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
                    className="remove-image-btn"
                    onClick={handleRemoveImage}
                  >
                    <FiX size={16} />
                    Remove
                  </button>
                )}
                <p className="image-hint">JPG, PNG, WEBP (Max 5MB)</p>
              </div>
            </div>

            {/* Right Column - Form Fields */}
            <div className="profile-form-fields">
              <div className="form-row">
                <div className="form-group">
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
                <div className="form-group">
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

              <div className="form-group">
                <label>
                  <FiMail className="input-icon" />
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

              <div className="form-group">
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

              <div className="form-group">
                <label>
                  <FiPhone className="input-icon" />
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

              <div className="form-group">
                <label>Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Tell us about yourself"
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>
                  <FiMapPin className="input-icon" />
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

              <div className="form-actions">
                <button 
                  type="submit" 
                  className="save-btn"
                  disabled={loading || uploading}
                >
                  {loading || uploading ? (
                    <>
                      <span className="spinner"></span>
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
    </AdminLayout>
  );
};

export default EditProfile;