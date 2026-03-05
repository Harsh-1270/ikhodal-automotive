/* ============================================
   REGISTER PAGE - MODERN & ATTRACTIVE REDESIGN
   ============================================ */

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser, verifyOtp } from '../../services/api';
import './Register.css';

const Register = () => {
    const navigate = useNavigate();

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
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke="url(#regMonitorGradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <defs>
                    <linearGradient id="regMonitorGradient" x1="0%" y1="0%" x2="100%" y2="100%">
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
            <svg className={className} viewBox="0 0 24 24" fill="url(#regLightningGradient)">
                <defs>
                    <linearGradient id="regLightningGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#fbbf24" />
                        <stop offset="100%" stopColor="#f59e0b" />
                    </linearGradient>
                </defs>
                <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" />
            </svg>
        ),
        Diamond: ({ className = "" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="url(#regDiamondGradient)">
                <defs>
                    <linearGradient id="regDiamondGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#ec4899" />
                        <stop offset="100%" stopColor="#db2777" />
                    </linearGradient>
                </defs>
                <path d="M12 2L2 7l10 15L22 7 12 2zm0 3.84L18.93 9H5.07L12 5.84zM6.54 11h10.92L12 18.5 6.54 11z" />
            </svg>
        ),
        Rocket: ({ className = "" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="url(#regRocketGradient)">
                <defs>
                    <linearGradient id="regRocketGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#6366f1" />
                    </linearGradient>
                </defs>
                <path d="M12 2c-4 0-8 .5-8 4 0 1.5.5 3 1 4l-1 4c0 .5.5 1 1 1h2v3c0 .5.5 1 1 1s1-.5 1-1v-3h4v3c0 .5.5 1 1 1s1-.5 1-1v-3h2c.5 0 1-.5 1-1l-1-4c.5-1 1-2.5 1-4 0-3.5-4-4-8-4zm0 2c2.4 0 4.7.3 5.7 1.3.3.3.3.6.3 1.2 0 1-.4 2.2-.8 3.2L16 12H8l-1.2-2.3c-.4-1-.8-2.2-.8-3.2 0-.6 0-.9.3-1.2C7.3 4.3 9.6 4 12 4z" />
            </svg>
        ),
        AlertTriangle: ({ className = "" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="url(#regAlertGradient)">
                <defs>
                    <linearGradient id="regAlertGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#f59e0b" />
                        <stop offset="100%" stopColor="#ef4444" />
                    </linearGradient>
                </defs>
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" stroke="white" strokeWidth="2" />
                <circle cx="12" cy="17" r="0.5" fill="white" />
            </svg>
        ),
        ArrowRight: ({ className = "" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
            </svg>
        )
    };

    /* ==========================================
       STATE MANAGEMENT
       ========================================== */
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState('');
    const [otpStep, setOtpStep] = useState(false);
    const [otp, setOtp] = useState('');
    const [signupEmail, setSignupEmail] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

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

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        } else if (formData.name.trim().length < 2) {
            newErrors.name = 'Name must be at least 2 characters';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        if (!formData.password || !formData.password.trim()) {
            newErrors.password = 'Password is required';
        } else if (formData.password.trim().length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) {
            newErrors.password = 'Password must describe a special character';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    /* ==========================================
       HANDLE FORM SUBMIT (Step 1: Signup)
       ========================================== */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setApiError('');
        setSuccessMessage('');

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const response = await registerUser(formData);

            if (response.success) {
                setSignupEmail(formData.email);
                setOtpStep(true);
                setSuccessMessage(response.message || 'OTP sent to your email!');
            } else {
                setApiError(response.message);
            }
        } catch (error) {
            setApiError('Something went wrong. Please try again.');
            console.error('Registration error:', error);
        } finally {
            setLoading(false);
        }
    };

    /* ==========================================
       HANDLE OTP SUBMIT (Step 2: Verify OTP)
       ========================================== */
    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        setApiError('');
        setSuccessMessage('');

        if (!otp.trim()) {
            setApiError('Please enter the OTP');
            return;
        }

        setLoading(true);

        try {
            const response = await verifyOtp({ email: signupEmail, otp: otp.trim() });

            if (response.success) {
                setSuccessMessage(response.message || 'Account verified! Redirecting to login...');
                setTimeout(() => {
                    navigate('/login', { replace: true });
                }, 2000);
            } else {
                setApiError(response.message);
            }
        } catch (error) {
            setApiError('OTP verification failed. Please try again.');
            console.error('OTP verification error:', error);
        } finally {
            setLoading(false);
        }
    };

    /* ==========================================
       RENDER COMPONENT
       ========================================== */
    return (
        <div className="register-page">
            <div className="register-container">
                {/* ========== LEFT SIDE - BRANDING ========== */}
                <div className="register-left">
                    <div className="brand-content">
                        {/* Brand Icon with Modern SVG */}
                        <div className="brand-icon">
                            <div className="icon-circle">
                                <Icons.Monitor />
                            </div>
                        </div>

                        {/* Brand Title & Subtitle */}
                        <h1 className="brand-title">I Khodal Automotive</h1>
                        <p className="brand-subtitle">Premium Car Service Excellence</p>

                        {/* Feature List */}
                        <div className="brand-features">
                            <div className="feature-item">
                                <span className="feature-icon">
                                    <Icons.Lightning />
                                </span>
                                <span>Expert Technicians</span>
                            </div>
                            <div className="feature-item">
                                <span className="feature-icon">
                                    <Icons.Diamond />
                                </span>
                                <span>Quality Guaranteed</span>
                            </div>
                            <div className="feature-item">
                                <span className="feature-icon">
                                    <Icons.Rocket />
                                </span>
                                <span>Quick & Easy Booking</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ========== RIGHT SIDE - REGISTRATION FORM ========== */}
                <div className="register-right">
                    <div className="form-wrapper">
                        {/* Form Header */}
                        <div className="form-header">
                            <h2 className="form-title">{otpStep ? 'Verify Your Email' : 'Create Account'}</h2>
                            <p className="form-subtitle">
                                {otpStep
                                    ? `We've sent a verification code to ${signupEmail}`
                                    : 'Welcome! Register to start booking premium car services'
                                }
                            </p>
                        </div>

                        {/* Registration Form */}
                        <form onSubmit={handleSubmit} className="register-form">
                            {/* API Error Banner */}
                            {apiError && (
                                <div className="error-banner">
                                    <span className="error-icon">
                                        <Icons.AlertTriangle />
                                    </span>
                                    <span>{apiError}</span>
                                </div>
                            )}

                            {/* Success Message */}
                            {successMessage && (
                                <div className="error-banner" style={{ background: 'rgba(34, 197, 94, 0.1)', borderColor: 'rgba(34, 197, 94, 0.3)', color: '#22c55e' }}>
                                    <span>✓</span>
                                    <span>{successMessage}</span>
                                </div>
                            )}

                            {otpStep ? (
                                <>
                                    <div className="input-group">
                                        <label htmlFor="otp" className="input-label">Enter OTP</label>
                                        <div className="input-wrapper">
                                            <input
                                                type="text"
                                                id="otp"
                                                name="otp"
                                                placeholder="Enter OTP from your email"
                                                value={otp}
                                                onChange={(e) => { setOtp(e.target.value); setApiError(''); }}
                                                disabled={loading}
                                                className="input-field email-icon"
                                                autoComplete="one-time-code"
                                                autoFocus
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        className="submit-btn"
                                        disabled={loading}
                                        onClick={handleOtpSubmit}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-small"></span>
                                                Verifying...
                                            </>
                                        ) : (
                                            <>
                                                Verify OTP
                                                <span className="arrow-icon">
                                                    <Icons.ArrowRight />
                                                </span>
                                            </>
                                        )}
                                    </button>
                                </>
                            ) : (
                                <>

                                    {/* Name Input */}
                                    <div className="input-group">
                                        <label htmlFor="name" className="input-label">Full Name</label>
                                        <div className="input-wrapper">
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                placeholder="Enter your full name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                disabled={loading}
                                                className={`input-field name-icon ${errors.name ? 'error' : ''}`}
                                                autoComplete="name"
                                            />
                                            {/* <span className="input-icon">👤</span> */}
                                        </div>
                                        {errors.name && (
                                            <span className="error-text">{errors.name}</span>
                                        )}
                                    </div>

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
                                                className={`input-field email-icon ${errors.email ? 'error' : ''}`}
                                                autoComplete="email"
                                            />
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
                                                placeholder="Create a strong password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                disabled={loading}
                                                className={`input-field password-icon ${errors.password ? 'error' : ''}`}
                                                autoComplete="new-password"
                                            />
                                            {/* <span className="input-icon">🔒</span> */}
                                        </div>
                                        {errors.password && (
                                            <span className="error-text">{errors.password}</span>
                                        )}
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
                                                Creating Account...
                                            </>
                                        ) : (
                                            <>
                                                Create Account
                                                <span className="arrow-icon">
                                                    <Icons.ArrowRight />
                                                </span>
                                            </>
                                        )}
                                    </button>
                                </>
                            )}
                        </form>

                        {/* Footer Links */}
                        <div className="form-footer">
                            <p className="footer-text">
                                Already have an account?{' '}
                                <Link to="/login" className="footer-link">
                                    Sign In
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
