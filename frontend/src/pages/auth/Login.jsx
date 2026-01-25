/* ============================================
   LOGIN PAGE - PROFESSIONAL & ATTRACTIVE
   Same design as Register page
   ============================================ */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import './Login.css';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    /* ==========================================
       STATE MANAGEMENT
       ========================================== */
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState('');

    /* ==========================================
       HANDLE INPUT CHANGE
       ========================================== */
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }

        if (apiError) {
            setApiError('');
        }
    };

    /* ==========================================
       FORM VALIDATION
       ========================================== */
    const validateForm = () => {
        const newErrors = {};

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    /* ==========================================
       HANDLE FORM SUBMIT
       ========================================== */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setApiError('');

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const response = await loginUser(formData);

            if (response.success) {
                login(
                    response.data.user,
                    response.data.token,
                    false
                );
                navigate('/my-bookings', { replace: true });
            } else {
                setApiError(response.message);
            }
        } catch (error) {
            setApiError('Something went wrong. Please try again.');
            console.error('Login error:', error);
        } finally {
            setLoading(false);
        }
    };

    /* ==========================================
       RENDER COMPONENT
       ========================================== */
    return (
        <div className="login-page">
            <div className="login-container">
                {/* Left Side - Branding */}
                <div className="login-left">
                    <div className="brand-content">
                        <div className="brand-icon">
                            <div className="icon-circle">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                                </svg>
                            </div>
                        </div>
                        <h1 className="brand-title">I Khodal Automotive</h1>
                        <p className="brand-subtitle">Your Trusted Car Service Partner</p>
                        <div className="brand-features">
                            <div className="feature-item">
                                <span className="feature-icon">✓</span>
                                <span>Expert Technicians</span>
                            </div>
                            <div className="feature-item">
                                <span className="feature-icon">✓</span>
                                <span>Quality Service</span>
                            </div>
                            <div className="feature-item">
                                <span className="feature-icon">✓</span>
                                <span>Easy Booking</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side - Login Form */}
                <div className="login-right">
                    <div className="form-wrapper">
                        <div className="form-header">
                            <h2 className="form-title">Welcome Back!</h2>
                            <p className="form-subtitle">Login to your account to continue</p>
                        </div>

                        <form onSubmit={handleSubmit} className="login-form">
                            {/* API Error */}
                            {apiError && (
                                <div className="error-banner">
                                    <span className="error-icon">⚠</span>
                                    <span>{apiError}</span>
                                </div>
                            )}

                            {/* Email Input */}
                            <div className="input-group">
                                <label htmlFor="email" className="input-label">Email Address</label>
                                <div className="input-wrapper">
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        placeholder="Enter your email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        disabled={loading}
                                        className={`input-field ${errors.email ? 'error' : ''}`}
                                    />
                                    <span className="input-icon">✉</span>
                                </div>
                                {errors.email && (
                                    <span className="error-text">{errors.email}</span>
                                )}
                            </div>

                            {/* Password Input */}
                            <div className="input-group">
                                <label htmlFor="password" className="input-label">Password</label>
                                <div className="input-wrapper">
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        placeholder="Enter your password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        disabled={loading}
                                        className={`input-field ${errors.password ? 'error' : ''}`}
                                    />
                                    <span className="input-icon">🔒</span>
                                </div>
                                {errors.password && (
                                    <span className="error-text">{errors.password}</span>
                                )}
                            </div>

                            {/* Forgot Password Link */}
                            <div className="forgot-password">
                                <Link to="/forgot-password" className="forgot-link">
                                    Forgot Password?
                                </Link>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="submit-btn"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner-small"></span>
                                        Logging In...
                                    </>
                                ) : (
                                    'Login'
                                )}
                            </button>
                        </form>

                        {/* Footer Links */}
                        <div className="form-footer">
                            <p className="footer-text">
                                Don't have an account?{' '}
                                <Link to="/register" className="footer-link">
                                    Register here
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
