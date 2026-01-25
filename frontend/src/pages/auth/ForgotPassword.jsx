/* ============================================
   FORGOT PASSWORD PAGE - BEAST MODE UI
   Ultra-modern, attractive, eye-catching design
   ============================================ */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './ForgotPassword.css';

const ForgotPassword = () => {
    const navigate = useNavigate();

    /* ==========================================
       STATE MANAGEMENT
       ========================================== */
    const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: Reset Password, 4: Success
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState(['', '', '', '']);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showToast, setShowToast] = useState(false);

    /* ==========================================
       HANDLE EMAIL SUBMIT - Send OTP
       ========================================== */
    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Email validation
        if (!email.trim()) {
            setError('Email is required');
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError('Please enter a valid email');
            return;
        }

        setLoading(true);

        // Mock API call - simulate sending OTP
        setTimeout(() => {
            setLoading(false);
            setSuccess('OTP sent successfully to your email!');
            setStep(2);
        }, 1500);
    };

    /* ==========================================
       HANDLE OTP INPUT CHANGE
       ========================================== */
    const handleOtpChange = (index, value) => {
        // Only allow digits
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 3) {
            document.getElementById(`otp-${index + 1}`).focus();
        }
    };

    /* ==========================================
       HANDLE OTP SUBMIT - Verify OTP
       ========================================== */
    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const otpValue = otp.join('');

        // OTP validation
        if (otpValue.length !== 4) {
            setError('Please enter complete 4-digit OTP');
            return;
        }

        setLoading(true);

        // Mock API call - simulate OTP verification
        setTimeout(() => {
            setLoading(false);

            // Mock verification (in real app, verify with backend)
            if (otpValue === '1234') {
                setSuccess('OTP verified successfully!');
                setTimeout(() => {
                    setStep(3);
                    setSuccess('');
                }, 500);
            } else {
                setError('Invalid OTP. Please try again.');
            }
        }, 1500);
    };

    /* ==========================================
       HANDLE PASSWORD RESET SUBMIT
       ========================================== */
    const handlePasswordReset = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Password validation
        if (!newPassword.trim()) {
            setError('New password is required');
            return;
        }

        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        if (!confirmPassword.trim()) {
            setError('Please confirm your password');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);

        // Mock API call - simulate password reset
        setTimeout(() => {
            setLoading(false);
            setShowToast(true);

            // Hide toast and redirect after 1 second
            setTimeout(() => {
                setShowToast(false);
                navigate('/login');
            }, 1000);
        }, 1500);
    };

    /* ==========================================
       HANDLE RESEND OTP
       ========================================== */
    const handleResendOtp = () => {
        setError('');
        setSuccess('');
        setOtp(['', '', '', '']);
        setLoading(true);

        // Mock resend OTP
        setTimeout(() => {
            setLoading(false);
            setSuccess('New OTP sent to your email!');
        }, 1500);
    };

    /* ==========================================
       GO BACK TO EMAIL STEP
       ========================================== */
    const handleBackToEmail = () => {
        setStep(1);
        setOtp(['', '', '', '']);
        setError('');
        setSuccess('');
    };

    /* ==========================================
       RENDER COMPONENT
       ========================================== */
    return (
        <div className="forgot-password-page">
            {/* Success Toast Notification */}
            {showToast && (
                <div className="success-toast">
                    <div className="toast-content">
                        <span className="toast-icon">✓</span>
                        <span className="toast-message">Password reset successfully</span>
                    </div>
                </div>
            )}

            {/* Animated Background */}
            <div className="animated-bg">
                <div className="bg-shape shape-1"></div>
                <div className="bg-shape shape-2"></div>
                <div className="bg-shape shape-3"></div>
                <div className="bg-shape shape-4"></div>
            </div>

            {/* Main Container */}
            <div className="forgot-container">
                {/* Progress Indicator */}
                <div className="progress-bar">
                    <div className={`progress-step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
                        <div className="step-circle">
                            {step > 1 ? '✓' : '1'}
                        </div>
                        <span className="step-label">Email</span>
                    </div>
                    <div className={`progress-line ${step >= 2 ? 'active' : ''}`}></div>
                    <div className={`progress-step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
                        <div className="step-circle">
                            {step > 2 ? '✓' : '2'}
                        </div>
                        <span className="step-label">Verify OTP</span>
                    </div>
                    <div className={`progress-line ${step >= 3 ? 'active' : ''}`}></div>
                    <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>
                        <div className="step-circle">3</div>
                        <span className="step-label">Reset</span>
                    </div>
                </div>

                {/* Card Container */}
                <div className="forgot-card">
                    {/* Step 1: Email Input */}
                    {step === 1 && (
                        <div className="step-content">
                            <div className="icon-wrapper">
                                <div className="main-icon email-icon">
                                    <span>📧</span>
                                </div>
                            </div>

                            <h1 className="forgot-title">Forgot Password?</h1>
                            <p className="forgot-subtitle">
                                No worries! Enter your email and we'll send you an OTP to reset your password
                            </p>

                            <form onSubmit={handleEmailSubmit} className="forgot-form">
                                {error && (
                                    <div className="alert alert-error">
                                        <span className="alert-icon">⚠</span>
                                        <span>{error}</span>
                                    </div>
                                )}

                                <div className="input-group-modern">
                                    <label className="modern-label">Email Address</label>
                                    <div className="modern-input-wrapper">
                                        <span className="input-prefix">✉</span>
                                        <input
                                            type="email"
                                            placeholder="Enter your email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            disabled={loading}
                                            className="modern-input"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="btn-modern btn-primary"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <span className="btn-spinner"></span>
                                            Sending OTP...
                                        </>
                                    ) : (
                                        <>
                                            Send OTP
                                            <span className="btn-arrow">→</span>
                                        </>
                                    )}
                                </button>
                            </form>

                            <div className="back-to-login">
                                <Link to="/login" className="back-link">
                                    <span>←</span> Back to Login
                                </Link>
                            </div>
                        </div>
                    )}

                    {/* Step 2: OTP Verification */}
                    {step === 2 && (
                        <div className="step-content">
                            <div className="icon-wrapper">
                                <div className="main-icon otp-icon">
                                    <span>🔐</span>
                                </div>
                            </div>

                            <h1 className="forgot-title">Enter OTP</h1>
                            <p className="forgot-subtitle">
                                We've sent a 4-digit code to<br />
                                <strong>{email}</strong>
                            </p>

                            <form onSubmit={handleOtpSubmit} className="forgot-form">
                                {error && (
                                    <div className="alert alert-error">
                                        <span className="alert-icon">⚠</span>
                                        <span>{error}</span>
                                    </div>
                                )}

                                {success && (
                                    <div className="alert alert-success">
                                        <span className="alert-icon">✓</span>
                                        <span>{success}</span>
                                    </div>
                                )}

                                <div className="otp-container">
                                    {otp.map((digit, index) => (
                                        <input
                                            key={index}
                                            id={`otp-${index}`}
                                            type="text"
                                            maxLength="1"
                                            value={digit}
                                            onChange={(e) => handleOtpChange(index, e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Backspace' && !digit && index > 0) {
                                                    document.getElementById(`otp-${index - 1}`).focus();
                                                }
                                            }}
                                            disabled={loading}
                                            className="otp-input"
                                        />
                                    ))}
                                </div>

                                <div className="resend-section">
                                    <p>Didn't receive the code?</p>
                                    <button
                                        type="button"
                                        onClick={handleResendOtp}
                                        className="resend-btn"
                                        disabled={loading}
                                    >
                                        Resend OTP
                                    </button>
                                </div>

                                <button
                                    type="submit"
                                    className="btn-modern btn-primary"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <span className="btn-spinner"></span>
                                            Verifying...
                                        </>
                                    ) : (
                                        <>
                                            Verify OTP
                                            <span className="btn-arrow">→</span>
                                        </>
                                    )}
                                </button>
                            </form>

                            <div className="back-to-login">
                                <button onClick={handleBackToEmail} className="back-link">
                                    <span>←</span> Change Email
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Reset Password */}
                    {step === 3 && (
                        <div className="step-content">
                            <div className="icon-wrapper">
                                <div className="main-icon password-icon">
                                    <span>🔑</span>
                                </div>
                            </div>

                            <h1 className="forgot-title">Create New Password</h1>
                            <p className="forgot-subtitle">
                                Your new password must be different from previously used passwords
                            </p>

                            <form onSubmit={handlePasswordReset} className="forgot-form">
                                {error && (
                                    <div className="alert alert-error">
                                        <span className="alert-icon">⚠</span>
                                        <span>{error}</span>
                                    </div>
                                )}

                                <div className="input-group-modern">
                                    <label className="modern-label">New Password</label>
                                    <div className="modern-input-wrapper">
                                        <span className="input-prefix">🔒</span>
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="Enter new password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            disabled={loading}
                                            className="modern-input password-input"
                                        />
                                        <button
                                            type="button"
                                            className="toggle-password"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? '👁️' : '👁️‍🗨️'}
                                        </button>
                                    </div>
                                </div>

                                <div className="input-group-modern">
                                    <label className="modern-label">Confirm Password</label>
                                    <div className="modern-input-wrapper">
                                        <span className="input-prefix">🔒</span>
                                        <input
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            placeholder="Confirm new password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            disabled={loading}
                                            className="modern-input password-input"
                                        />
                                        <button
                                            type="button"
                                            className="toggle-password"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        >
                                            {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                                        </button>
                                    </div>
                                </div>

                                <div className="password-requirements">
                                    <p className="requirements-title">Password must contain:</p>
                                    <ul className="requirements-list">
                                        <li className={newPassword.length >= 6 ? 'valid' : ''}>
                                            <span className="requirement-icon">{newPassword.length >= 6 ? '✓' : '○'}</span>
                                            At least 6 characters
                                        </li>
                                        <li className={confirmPassword && newPassword === confirmPassword ? 'valid' : ''}>
                                            <span className="requirement-icon">{confirmPassword && newPassword === confirmPassword ? '✓' : '○'}</span>
                                            Passwords match
                                        </li>
                                    </ul>
                                </div>

                                <button
                                    type="submit"
                                    className="btn-modern btn-primary"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <span className="btn-spinner"></span>
                                            Resetting Password...
                                        </>
                                    ) : (
                                        <>
                                            Reset Password
                                            <span className="btn-arrow">→</span>
                                        </>
                                    )}
                                </button>
                            </form>

                            <div className="back-to-login">
                                <Link to="/login" className="back-link">
                                    <span>←</span> Back to Login
                                </Link>
                            </div>
                        </div>
                    )}
                </div>

                {/* Bottom Decoration */}
                <div className="bottom-decoration">
                    <div className="decoration-dot"></div>
                    <div className="decoration-dot"></div>
                    <div className="decoration-dot"></div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
