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
            <div className="login-main-container">
                {/* Left Side - Branding */}
                <div className="login-brand-panel">
                    <div className="login-brand-wrapper">
                        <div className="login-icon-wrapper">
                            <div className="login-icon-box">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                                </svg>
                            </div>
                        </div>
                        <h1 className="login-brand-heading">I Khodal Automotive</h1>
                        <p className="login-brand-text">Your Trusted Car Service Partner</p>
                        <div className="login-features-list">
                            <div className="login-feature-box">
                                <span className="login-feature-symbol">✓</span>
                                <span>Expert Technicians</span>
                            </div>
                            <div className="login-feature-box">
                                <span className="login-feature-symbol">✓</span>
                                <span>Quality Service</span>
                            </div>
                            <div className="login-feature-box">
                                <span className="login-feature-symbol">✓</span>
                                <span>Easy Booking</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side - Login Form */}
                <div className="login-form-panel">
                    <div className="login-form-container">
                        <div className="login-header">
                            <h2 className="login-heading">Welcome Back!</h2>
                            <p className="login-subheading">Login to your account to continue</p>
                        </div>

                        <form onSubmit={handleSubmit} className="login-form-element">
                            {/* API Error */}
                            {apiError && (
                                <div className="login-error-message">
                                    <span className="login-error-symbol">⚠</span>
                                    <span>{apiError}</span>
                                </div>
                            )}

                            {/* Email Input */}
                            <div className="login-field-group">
                                <label htmlFor="email" className="login-field-label">Email Address</label>
                                <div className="login-field-container">
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        placeholder="Enter your email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        disabled={loading}
                                        className={`login-input-box ${errors.email ? 'login-error-state' : ''}`}
                                    />
                                    <span className="login-field-icon">✉</span>
                                </div>
                                {errors.email && (
                                    <span className="login-validation-text">{errors.email}</span>
                                )}
                            </div>

                            {/* Password Input */}
                            <div className="login-field-group">
                                <label htmlFor="password" className="login-field-label">Password</label>
                                <div className="login-field-container">
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        placeholder="Enter your password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        disabled={loading}
                                        className={`login-input-box ${errors.password ? 'login-error-state' : ''}`}
                                    />
                                    <span className="login-field-icon">🔒</span>
                                </div>
                                {errors.password && (
                                    <span className="login-validation-text">{errors.password}</span>
                                )}
                            </div>

                            {/* Forgot Password Link */}
                            <div className="login-forgot-section">
                                <Link to="/forgot-password" className="login-forgot-anchor">
                                    Forgot Password?
                                </Link>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="login-submit-button"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="login-spinner"></span>
                                        Logging In...
                                    </>
                                ) : (
                                    'Login'
                                )}
                            </button>
                        </form>

                        {/* Footer Links */}
                        <div className="login-footer-section">
                            <p className="login-footer-paragraph">
                                Don't have an account?{' '}
                                <Link to="/register" className="login-footer-anchor">
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
