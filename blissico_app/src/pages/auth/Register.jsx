import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Marquee from '../../components/Marquee';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
  first_name: '', last_name: '', email: '', password: '', confirmPassword: ''
  });
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match.");
    }
    if (!agreeToTerms) {
      return setError("You must agree to the Terms & Conditions.");
    }

    setLoading(true);
    try {
      await register(formData.first_name, formData.last_name, formData.email, formData.password, formData.confirmPassword);
      navigate('/verify-otp', { state: { email: formData.email } });
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper">
      <Marquee />
      <Navbar />
      <div className="auth-container">
        <div className="auth-box register-box">
          <div className="auth-header">
            <h2>Create Account</h2>
            <p>Join Blissico and start celebrating beautifully.</p>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit}>
           <div className="form-row">
                <div className="form-group">
                  <label>First Name</label>
                  <input type="text" name="first_name" placeholder="John" value={formData.first_name} onChange={handleChange} required disabled={loading} />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input type="text" name="last_name" placeholder="Doe" value={formData.last_name} onChange={handleChange} required disabled={loading} />
                </div>
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input type="email" name="email" placeholder="your@email.com" value={formData.email} onChange={handleChange} required disabled={loading} />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Password</label>
                <input type="password" name="password" placeholder="Create a password" value={formData.password} onChange={handleChange} required disabled={loading} />
              </div>
              <div className="form-group">
                <label>Confirm Password</label>
                <input type="password" name="confirmPassword" placeholder="Confirm password" value={formData.confirmPassword} onChange={handleChange} required disabled={loading} />
              </div>
            </div>

            <div className="form-group terms-group">
              <label className="checkbox-label">
                <input 
                  type="checkbox" 
                  checked={agreeToTerms} 
                  onChange={(e) => setAgreeToTerms(e.target.checked)} 
                  disabled={loading}
                />
                <span>I agree to the <Link to="/terms" className="auth-link">Terms &amp; Conditions</Link></span>
              </label>
            </div>

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="auth-footer">
            <p>Already have an account? <Link to="/login" className="auth-link">Sign In</Link></p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Register;