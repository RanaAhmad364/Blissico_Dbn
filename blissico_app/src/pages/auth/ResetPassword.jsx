import { useLocation, useNavigate, Link } from 'react-router-dom';
// ...
const location = useLocation();
const email = location.state?.email;
const { resetPassword } = useAuth();
// ...
const handleSubmit = async (e) => {
  e.preventDefault();
  setMessage(''); setError('');
  if (newPassword !== confirmPassword) return setError('Passwords do not match.');
  if (newPassword.length < 8) return setError('Password must be at least 8 characters.');
  if (!email) return setError('Session expired — please restart from Forgot Password.');

  setLoading(true);
  try {
    await resetPassword(email, otp, newPassword);
    setMessage('Password reset successfully! Redirecting to login...');
    setTimeout(() => navigate('/login'), 2000);
  } catch (err) {
    setError(err.response?.data?.message || 'Invalid or expired code.');
  } finally {
    setLoading(false);
  }
};