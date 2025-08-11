import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import './Auth.css';

function PasswordResetConfirm() {
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    token: '',
    uid: '',
    new_password1: '',
    new_password2: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Extract token and uid from URL parameters on component mount
  useEffect(() => {
    const token = searchParams.get('token');
    const uid = searchParams.get('uid');
    
    if (token && uid) {
      setFormData(prev => ({
        ...prev,
        token: token,
        uid: uid
      }));
    } else {
      setError('Invalid password reset link. Please request a new password reset.');
    }
  }, [searchParams]);

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

    // Validate token and uid
    if (!formData.token || !formData.uid) {
      setError('Invalid password reset link. Please request a new password reset.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/password-reset-confirm/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: formData.token,
          uid: formData.uid,
          new_password1: formData.new_password1,
          new_password2: formData.new_password2
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(data.message || 'Password reset successfully');
        setFormData(prev => ({ 
          ...prev, 
          new_password1: '', 
          new_password2: '' 
        })); // Clear password fields only
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          window.location.href = '/login';
        }, 3000);
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
        <h2>Confirm Password Reset</h2>

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

        {/* Show token and uid info for debugging in dev mode */}
        {process.env.NODE_ENV === 'development' && formData.token && (
          <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '1rem' }}>
            <strong>Debug Info:</strong><br />
            Token: {formData.token.substring(0, 10)}...<br />
            UID: {formData.uid}
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
            disabled={loading || !formData.token}
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
            disabled={loading || !formData.token}
            placeholder="Confirm new password"
            minLength="8"
          />
        </div>

        <button
          type="submit"
          className="auth-button"
          disabled={loading || !formData.token}
        >
          {loading ? 'Updating...' : 'Reset Password'}
        </button>

        <div className="form-links">
          <a href="/login">Back to Login</a>
          <span> | </span>
          <a href="/password-reset">Request New Reset</a>
        </div>
      </form>
    </div>
  );
}

export default PasswordResetConfirm;
