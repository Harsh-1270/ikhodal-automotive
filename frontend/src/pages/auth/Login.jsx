/* ============================================
   LOGIN PAGE - PROFESSIONAL & ATTRACTIVE
   Same design as Register page
   ============================================ */

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import './Login.css';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    // Handle browser back button - redirect to Homepage
    useEffect(() => {
        const handlePopState = (e) => {
            e.preventDefault();
            navigate('/', { replace: true });
        };

        // Add a history entry to intercept the back button
        window.history.pushState(null, '', window.location.href);

        // Listen for back button
        window.addEventListener('popstate', handlePopState);

        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, [navigate]);

    /* ==========================================
       SVG ICONS COMPONENT - COLORFUL GRADIENTS
       ========================================== */
    const Icons = {
        Monitor: ({ className = "" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke="url(#loginMonitorGradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <defs>
                    <linearGradient id="loginMonitorGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#06b6d4" />
                        <stop offset="50%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                </defs>
                <path d="M5 17H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-1" />
                <polygon points="12 15 17 21 7 21 12 15" />
            </svg>
        ),
        Lightning: ({ className = "" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="url(#loginLightningGradient)">
                <defs>
                    <linearGradient id="loginLightningGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#fbbf24" />
                        <stop offset="100%" stopColor="#f59e0b" />
                    </linearGradient>
                </defs>
                <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" />
            </svg>
        ),
        Diamond: ({ className = "" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="url(#loginDiamondGradient)">
                <defs>
                    <linearGradient id="loginDiamondGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#ec4899" />
                        <stop offset="100%" stopColor="#db2777" />
                    </linearGradient>
                </defs>
                <path d="M12 2L2 7l10 15L22 7 12 2zm0 3.84L18.93 9H5.07L12 5.84zM6.54 11h10.92L12 18.5 6.54 11z" />
            </svg>
        ),
        Rocket: ({ className = "" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="url(#loginRocketGradient)">
                <defs>
                    <linearGradient id="loginRocketGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#6366f1" />
                    </linearGradient>
                </defs>
                <path d="M12 2c-4 0-8 .5-8 4 0 1.5.5 3 1 4l-1 4c0 .5.5 1 1 1h2v3c0 .5.5 1 1 1s1-.5 1-1v-3h4v3c0 .5.5 1 1 1s1-.5 1-1v-3h2c.5 0 1-.5 1-1l-1-4c.5-1 1-2.5 1-4 0-3.5-4-4-8-4zm0 2c2.4 0 4.7.3 5.7 1.3.3.3.3.6.3 1.2 0 1-.4 2.2-.8 3.2L16 12H8l-1.2-2.3c-.4-1-.8-2.2-.8-3.2 0-.6 0-.9.3-1.2C7.3 4.3 9.6 4 12 4z" />
            </svg>
        ),
        AlertTriangle: ({ className = "" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="url(#loginAlertGradient)">
                <defs>
                    <linearGradient id="loginAlertGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#f59e0b" />
                        <stop offset="100%" stopColor="#ef4444" />
                    </linearGradient>
                </defs>
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" stroke="white" strokeWidth="2" />
                <circle cx="12" cy="17" r="0.5" fill="white" />
            </svg>
        ),
        Email: ({ className = "" }) => (
            <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
            </svg>
        ),
        Lock: ({ className = "" }) => (
            <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
        )
    };

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
            newErrors.email = 'Please enter your email address.';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'That doesn\'t look like a valid email address (e.g., name@example.com).';
        }

        if (!formData.password) {
            newErrors.password = 'Please enter your password.';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters long.';
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
                // Backend returns { token, refreshToken, name, roleId, message }
                const { token, refreshToken, name, roleId } = response.data;
                const role = Number(roleId);
                const isAdmin = role === 2;

                const userData = {
                    email: formData.email,
                    name: name || 'User',
                    roleId: role
                };

                login(userData, token, isAdmin, refreshToken);

                // Role based redirect
                // If roleId is 2 (Admin) -> /admin/dashboard
                // Else -> /dashboard
                if (isAdmin) {
                    navigate('/admin/dashboard', { replace: true });
                } else {
                    navigate('/dashboard', { replace: true });
                }
            } else {
                setApiError(response.message);
            }
        } catch (error) {
            setApiError('Unable to connect. Please check your internet connection and try again.');
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
                                <Icons.Monitor />
                            </div>
                        </div>
                        <h1 className="login-brand-heading">I Khodal Automotive</h1>
                        <p className="login-brand-text">Your Trusted Car Service Partner</p>
                        <div className="login-features-list">
                            <div className="login-feature-box">
                                <span className="login-feature-symbol">
                                    <Icons.Lightning className="w-5 h-5" />
                                </span>
                                <span>Expert Technicians</span>
                            </div>
                            <div className="login-feature-box">
                                <span className="login-feature-symbol">
                                    <Icons.Diamond className="w-5 h-5" />
                                </span>
                                <span>Quality Service</span>
                            </div>
                            <div className="login-feature-box">
                                <span className="login-feature-symbol">
                                    <Icons.Rocket className="w-5 h-5" />
                                </span>
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

                        <form onSubmit={handleSubmit} className="login-form-element" autoComplete="off">
                            {/* API Error */}
                            {apiError && (
                                <div className="login-error-message">
                                    <span className="login-error-symbol">
                                        <Icons.AlertTriangle className="w-5 h-5" />
                                    </span>
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
                                        autoComplete="off"
                                        className={`login-input-box ${errors.email ? 'login-error-state' : ''}`}
                                    />
                                    <span className="login-field-icon">
                                        <Icons.Email className="w-5 h-5" />
                                    </span>
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
                                        autoComplete="new-password"
                                        className={`login-input-box ${errors.password ? 'login-error-state' : ''}`}
                                    />
                                    <span className="login-field-icon">
                                        <Icons.Lock className="w-5 h-5" />
                                    </span>
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
