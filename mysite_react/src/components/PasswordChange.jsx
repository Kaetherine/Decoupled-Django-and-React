import React, { useState } from 'react';
import './Auth.css';

function PasswordChange() {
  const [formData, setFormData] = useState({
    old_password: '',
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
      setError('New passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('You must be logged in to change your password');
        setLoading(false);
        return;
      }

      const response = await fetch('/api/auth/password-change/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        // Update token if provided (password change usually generates new token)
        if (data.token) {
          localStorage.setItem('authToken', data.token);
        }
        
        setSuccess(data.message || 'Password changed successfully');
        setFormData({ old_password: '', new_password1: '', new_password2: '' }); // Clear form
        
        // Optionally redirect to profile or articles after successful change
        setTimeout(() => {
          window.location.href = '/articles';
        }, 2000);
      } else {
        if (data.errors) {
          const errorMessages = Object.values(data.errors).flat();
          setError(errorMessages.join(', '));
        } else {
          setError(data.error || 'Password change failed');
        }
      }
    } catch (err) {
      console.error('Password change error:', err);
      setError('Network error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Change Password</h2>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {success && (
          <div className="success-message">
            {success}
            <br />
            <small>Redirecting to articles...</small>
          </div>
        )}

        <div className="form-group">
          <label htmlFor="old_password">Current Password:</label>
          <input
            type="password"
            id="old_password"
            name="old_password"
            value={formData.old_password}
            onChange={handleChange}
            required
            disabled={loading}
            placeholder="Enter current password"
          />
        </div>

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
          {loading ? 'Updating...' : 'Change Password'}
        </button>

        <div className="form-links">
          <a href="/articles">Back to Articles</a>
          <span> | </span>
          <a href="/user-profile">View Profile</a>
        </div>
      </form>
    </div>
  );
}

export default PasswordChange;
