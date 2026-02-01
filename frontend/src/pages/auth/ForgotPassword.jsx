import React, { useState, useEffect } from 'react';
import './ForgotPassword.css';

const ForgotPassword = () => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [countdown, setCountdown] = useState(0);

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    const handleEmailSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (!email.trim()) {
            setError('Email is required');
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError('Please enter a valid email');
            return;
        }

        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setStep(2);
            setCountdown(60);
        }, 1200);
    };

    const handleOtpChange = (index, value) => {
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) {
            document.getElementById(`otp-${index + 1}`)?.focus();
        }
    };

    const handleOtpSubmit = (e) => {
        e.preventDefault();
        setError('');

        const otpValue = otp.join('');

        if (otpValue.length !== 6) {
            setError('Please enter complete 6-digit OTP');
            return;
        }

        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            if (otpValue === '123456') {
                setStep(3);
            } else {
                setError('Invalid OTP. Please try again.');
            }
        }, 1200);
    };

    const handlePasswordReset = (e) => {
        e.preventDefault();
        setError('');

        if (!newPassword.trim()) {
            setError('New password is required');
            return;
        }

        if (newPassword.length < 8) {
            setError('Password must be at least 8 characters');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setStep(4);
        }, 1200);
    };

    const handleResendOtp = () => {
        if (countdown > 0) return;
        setError('');
        setOtp(['', '', '', '', '', '']);
        setCountdown(60);
    };

    const passwordRequirements = [
        { label: 'At least 8 characters', valid: newPassword.length >= 8 },
        { label: 'One uppercase letter', valid: /[A-Z]/.test(newPassword) },
        { label: 'One lowercase letter', valid: /[a-z]/.test(newPassword) },
        { label: 'One number', valid: /[0-9]/.test(newPassword) },
        { label: 'Passwords match', valid: confirmPassword && newPassword === confirmPassword }
    ];

    return (
        <div className="forgot-password-container">
            {/* Left Panel - Progress Sidebar */}
            <div className="left-panel">
                <div className="logo-section">
                    <div className="logo-icon">🔐</div>
                    <h2 className="logo-text">Secure Account Recovery</h2>
                </div>

                <div className="progress-container">
                    {['Email Verification', 'Enter OTP', 'Reset Password', 'Complete'].map((label, idx) => (
                        <div key={idx} className="progress-item">
                            <div className={`progress-circle ${step > idx + 1 ? 'completed' : ''} ${step === idx + 1 ? 'active' : ''}`}>
                                {step > idx + 1 ? '✓' : idx + 1}
                            </div>
                            <div className="progress-label">
                                <div className={`progress-title ${step >= idx + 1 ? 'active' : ''}`}>
                                    {label}
                                </div>
                                <div className="progress-subtitle">
                                    {idx === 0 && 'Verify your email address'}
                                    {idx === 1 && 'Enter the code we sent'}
                                    {idx === 2 && 'Create a new password'}
                                    {idx === 3 && 'Successfully reset'}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="security-note">
                    <span className="security-icon">🛡️</span>
                    <div>
                        <div className="security-title">Your data is secure</div>
                        <div className="security-text">We use industry-standard encryption to protect your information</div>
                    </div>
                </div>
            </div>

            {/* Right Panel - Form Content */}
            <div className="right-panel">
                <div className="form-container">
                    {/* Step 1: Email Input */}
                    {step === 1 && (
                        <div className="step-content">
                            <div className="header">
                                <h1 className="title">Forgot Password?</h1>
                                <p className="subtitle">Enter your email address and we'll send you a verification code</p>
                            </div>

                            <div className="form-wrapper">
                                {error && (
                                    <div className="error-alert">
                                        <span>⚠️</span>
                                        <span>{error}</span>
                                    </div>
                                )}

                                <div className="input-group">
                                    <label className="label">Email Address</label>
                                    <div className="input-wrapper">
                                        <span className="input-icon">📧</span>
                                        <input
                                            type="email"
                                            placeholder="you@example.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && handleEmailSubmit(e)}
                                            disabled={loading}
                                            className="input"
                                        />
                                    </div>
                                </div>

                                <button
                                    onClick={handleEmailSubmit}
                                    disabled={loading}
                                    className="primary-button"
                                >
                                    {loading ? (
                                        <>
                                            <div className="spinner"></div>
                                            Sending Code...
                                        </>
                                    ) : (
                                        <>
                                            Continue
                                            <span className="button-arrow">→</span>
                                        </>
                                    )}
                                </button>

                                <a href="/login" className="back-link">
                                    <span>←</span> Back to Login
                                </a>
                            </div>
                        </div>
                    )}

                    {/* Step 2: OTP Verification */}
                    {step === 2 && (
                        <div className="step-content">
                            <div className="header">
                                <h1 className="title">Verify Your Email</h1>
                                <p className="subtitle">
                                    We've sent a 6-digit code to <strong className="email-highlight">{email}</strong>
                                </p>
                            </div>

                            <div className="form-wrapper">
                                {error && (
                                    <div className="error-alert">
                                        <span>⚠️</span>
                                        <span>{error}</span>
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
                                                    document.getElementById(`otp-${index - 1}`)?.focus();
                                                }
                                                if (e.key === 'Enter') {
                                                    handleOtpSubmit(e);
                                                }
                                            }}
                                            disabled={loading}
                                            className="otp-input"
                                        />
                                    ))}
                                </div>

                                <div className="resend-section">
                                    <span className="resend-text">Didn't receive the code?</span>
                                    <button
                                        onClick={handleResendOtp}
                                        disabled={countdown > 0}
                                        className="resend-button"
                                    >
                                        {countdown > 0 ? `Resend in ${countdown}s` : 'Resend Code'}
                                    </button>
                                </div>

                                <button
                                    onClick={handleOtpSubmit}
                                    disabled={loading}
                                    className="primary-button"
                                >
                                    {loading ? (
                                        <>
                                            <div className="spinner"></div>
                                            Verifying...
                                        </>
                                    ) : (
                                        <>
                                            Verify Code
                                            <span className="button-arrow">→</span>
                                        </>
                                    )}
                                </button>

                                <button
                                    onClick={() => setStep(1)}
                                    className="back-link"
                                >
                                    <span>←</span> Change Email
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Reset Password */}
                    {step === 3 && (
                        <div className="step-content">
                            <div className="header">
                                <h1 className="title">Create New Password</h1>
                                <p className="subtitle">Choose a strong password to secure your account</p>
                            </div>

                            <div className="form-wrapper">
                                {error && (
                                    <div className="error-alert">
                                        <span>⚠️</span>
                                        <span>{error}</span>
                                    </div>
                                )}

                                <div className="input-group">
                                    <label className="label">New Password</label>
                                    <div className="input-wrapper">
                                        <span className="input-icon">🔒</span>
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="Enter new password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && handlePasswordReset(e)}
                                            disabled={loading}
                                            className="input"
                                        />
                                        <button
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="toggle-password"
                                        >
                                            {showPassword ? '👁️' : '👁️‍🗨️'}
                                        </button>
                                    </div>
                                </div>

                                <div className="input-group">
                                    <label className="label">Confirm Password</label>
                                    <div className="input-wrapper">
                                        <span className="input-icon">🔒</span>
                                        <input
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            placeholder="Confirm new password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && handlePasswordReset(e)}
                                            disabled={loading}
                                            className="input"
                                        />
                                        <button
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="toggle-password"
                                        >
                                            {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                                        </button>
                                    </div>
                                </div>

                                <div className="requirements">
                                    <div className="requirements-title">Password Requirements</div>
                                    <div className="requirements-list">
                                        {passwordRequirements.map((req, idx) => (
                                            <div key={idx} className="requirement-item">
                                                <span className={`requirement-icon ${req.valid ? 'valid' : ''}`}>
                                                    {req.valid ? '✓' : ''}
                                                </span>
                                                <span className={`requirement-text ${req.valid ? 'valid' : ''}`}>
                                                    {req.label}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    onClick={handlePasswordReset}
                                    disabled={loading}
                                    className="primary-button"
                                >
                                    {loading ? (
                                        <>
                                            <div className="spinner"></div>
                                            Resetting Password...
                                        </>
                                    ) : (
                                        <>
                                            Reset Password
                                            <span className="button-arrow">→</span>
                                        </>
                                    )}
                                </button>

                                <a href="/login" className="back-link">
                                    <span>←</span> Back to Login
                                </a>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Success */}
                    {step === 4 && (
                        <div className="step-content">
                            <div className="header center">
                                <div className="success-icon">
                                    <div className="checkmark">✓</div>
                                </div>
                                <h1 className="title success">Password Reset Successful!</h1>
                                <p className="subtitle">
                                    Your password has been reset successfully. You can now log in with your new password.
                                </p>
                            </div>

                            <div className="form-wrapper success-wrapper">
                                <a href="/login" className="primary-button">
                                    Go to Login
                                    <span className="button-arrow">→</span>
                                </a>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
