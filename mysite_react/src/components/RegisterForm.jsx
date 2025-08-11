import React, { useState } from 'react';
import './Auth.css';

function RegisterForm() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password1: '',
        password2: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        // Clear error when user starts typing
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const response = await fetch('/api/auth/register/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

                  if (response.ok) {
        // Registration successful - store token and redirect to Articles
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        console.log('Registration successful:', data);
        
        // Redirect to Articles page
        window.location.href = '/articles';
                        
            } else {
                // Registration failed
                if (data.errors) {
                    // Handle DRF serializer errors
                    const errorMessages = Object.values(data.errors).flat();
                    setError(errorMessages.join(', '));
                } else {
                    setError(data.error || 'Registration failed');
                }
            }
        } catch (err) {
            console.error('Registration error:', err);
            setError('Network error. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-form-container">
            <form onSubmit={handleSubmit} className="auth-form">
                <h2>Register</h2>
                
                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                <div className="form-group">
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        disabled={loading}
                        placeholder="Your username"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        disabled={loading}
                        placeholder="your@email.com"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password1">Password:</label>
                    <input
                        type="password"
                        id="password1"
                        name="password1"
                        value={formData.password1}
                        onChange={handleChange}
                        required
                        disabled={loading}
                        placeholder="At least 8 characters"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password2">Confirm Password:</label>
                    <input
                        type="password"
                        id="password2"
                        name="password2"
                        value={formData.password2}
                        onChange={handleChange}
                        required
                        disabled={loading}
                        placeholder="Repeat password"
                    />
                </div>

                <button 
                    type="submit" 
                    className="auth-button"
                    disabled={loading}
                >
                    {loading ? 'Creating account...' : 'Register'}
                </button>

                <div className="form-links">
                    <a href="/login">Already have an account? Login</a>
                </div>
            </form>
        </div>
    );
}

export default RegisterForm; 