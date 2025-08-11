import React, { useState } from 'react';
import './Auth.css';

function PasswordResetConfirmForm() {
  const [formData, setFormData] = useState({
    new_password1: '',
    new_password2: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validate passwords match
    if (formData.new_password1 !== formData.new_password2) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/password-reset-confirm/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(data.message || 'Password reset successfully');
        setFormData({ new_password1: '', new_password2: '' }); // Clear form
        
        // Redirect to login after 2 seconds
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      } else {
        if (data.errors) {
          const errorMessages = Object.values(data.errors).flat();
          setError(errorMessages.join(', '));
        } else {
          setError(data.error || 'Password reset confirmation failed');
        }
      }
    } catch (err) {
      console.error('Password reset confirm error:', err);
      setError('Network error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Set New Password</h2>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {success && (
          <div className="success-message">
            {success}
            <br />
            <small>Redirecting to login...</small>
          </div>
        )}

        <div className="form-group">
          <label htmlFor="new_password1">New Password:</label>
          <input
            type="password"
            id="new_password1"
            name="new_password1"
            value={formData.new_password1}
            onChange={handleChange}
            required
            disabled={loading}
            placeholder="Enter new password"
            minLength="8"
          />
        </div>

        <div className="form-group">
          <label htmlFor="new_password2">Confirm New Password:</label>
          <input
            type="password"
            id="new_password2"
            name="new_password2"
            value={formData.new_password2}
            onChange={handleChange}
            required
            disabled={loading}
            placeholder="Confirm new password"
            minLength="8"
          />
        </div>

        <button
          type="submit"
          className="auth-button"
          disabled={loading}
        >
          {loading ? 'Updating...' : 'Update Password'}
        </button>

        <div className="form-links">
          <a href="/login">Back to Login</a>
          <span> | </span>
          <a href="/password-reset">Reset Email Again</a>
        </div>
      </form>
    </div>
  );
}

export default PasswordResetConfirmForm;
