const { forgotPassword } = useAuth();
const navigate = useNavigate();
// ...
const handleSubmit = async (e) => {
  e.preventDefault();
  setMessage('');
  setError('');
  setLoading(true);
  try {
    await forgotPassword(email);
    setMessage('If an account exists with this email, you will receive a password reset code shortly.');
    setTimeout(() => navigate('/reset-password', { state: { email } }), 1200);
  } catch (err) {
    setError(err.response?.data?.message || 'Something went wrong. Please try again.');
  } finally {
    setLoading(false);
  }
};