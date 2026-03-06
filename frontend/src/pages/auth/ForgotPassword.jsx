import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ForgotPassword.css";
import {
  forgotPasswordRequest,
  verifyForgotPasswordOtp,
  resetPassword,
} from "../../services/api";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(0);

  /* ==========================================
       SVG ICONS COMPONENT - COLORFUL GRADIENTS
       ========================================== */
  const Icons = {
    Lock: ({ className = "" }) => (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="url(#fpLockGradient)"
      >
        <defs>
          <linearGradient
            id="fpLockGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="50%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
        </defs>
        <path d="M12 1a5 5 0 0 1 5 5v3h1a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V11a2 2 0 0 1 2-2h1V6a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v3h6V6a3 3 0 0 0-3-3zm0 9a2 2 0 0 1 1 3.732V18a1 1 0 0 1-2 0v-2.268A2 2 0 0 1 12 12z" />
      </svg>
    ),
    Shield: ({ className = "" }) => (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="url(#fpShieldGradient)"
      >
        <defs>
          <linearGradient
            id="fpShieldGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
        </defs>
        <path d="M12 2L4 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-8-3z" />
      </svg>
    ),
    AlertTriangle: ({ className = "" }) => (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="url(#fpAlertGradient)"
      >
        <defs>
          <linearGradient
            id="fpAlertGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#ef4444" />
          </linearGradient>
        </defs>
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" stroke="white" strokeWidth="2" />
        <circle cx="12" cy="17" r="0.5" fill="white" />
      </svg>
    ),
    Mail: ({ className = "" }) => (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="url(#fpMailGradient)"
      >
        <defs>
          <linearGradient
            id="fpMailGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
        <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
      </svg>
    ),
    Eye: ({ className = "" }) => (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="url(#fpEyeGradient)"
        strokeWidth="2"
      >
        <defs>
          <linearGradient
            id="fpEyeGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
        </defs>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
    EyeOff: ({ className = "" }) => (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="url(#fpEyeOffGradient)"
        strokeWidth="2"
      >
        <defs>
          <linearGradient
            id="fpEyeOffGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </svg>
    ),
    Check: ({ className = "" }) => (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="url(#fpCheckGradient)"
        strokeWidth="3"
      >
        <defs>
          <linearGradient
            id="fpCheckGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
        </defs>
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
    ArrowRight: ({ className = "" }) => (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12 5 19 12 12 19" />
      </svg>
    ),
    ArrowLeft: ({ className = "" }) => (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="19" y1="12" x2="5" y2="12" />
        <polyline points="12 19 5 12 12 5" />
      </svg>
    ),
  };

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Handle browser back button - redirect to Login page
  useEffect(() => {
    const handlePopState = (e) => {
      e.preventDefault();
      navigate("/login", { replace: true });
    };

    // Add a history entry to intercept the back button
    window.history.pushState(null, "", window.location.href);

    // Listen for back button
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [navigate]);

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError(
        "That doesn't look like a valid email address (e.g., name@example.com).",
      );
      return;
    }

    setLoading(true);
    forgotPasswordRequest(email)
      .then((res) => {
        setLoading(false);
        if (res.success) {
          setStep(2);
          setCountdown(60);
        } else {
          setError(res.message || "Failed to send OTP. Please try clicking 'Continue' again.");
        }
      })
      .catch(() => {
        setLoading(false);
        setError("An unexpected error occurred. Please try again later.");
      });
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
    setError("");

    const otpValue = otp.join("");

    if (otpValue.length !== 6) {
      setError("Please enter the complete 6-digit code sent to your email.");
      return;
    }

    setLoading(true);
    verifyForgotPasswordOtp(email, otpValue)
      .then((res) => {
        setLoading(false);
        if (res.success) {
          setStep(3);
        } else {
          setError(
            res.message ||
            "Incorrect code. Please check the OTP and try again.",
          );
        }
      })
      .catch(() => {
        setLoading(false);
        setError("An unexpected error occurred. Please try again later.");
      });
  };

  const handlePasswordReset = (e) => {
    e.preventDefault();
    setError("");

    if (!newPassword.trim()) {
      setError("Please enter your new password.");
      return;
    }

    if (newPassword.length < 8) {
      setError("Your password must be at least 8 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("The passwords you entered don't match. Please try again.");
      return;
    }

    setLoading(true);
    resetPassword({ email, otp: otp.join(""), newPassword })
      .then((res) => {
        setLoading(false);
        if (res.success) {
          setStep(4);
        } else {
          setError(res.message || "Failed to reset password. Please try again.");
        }
      })
      .catch(() => {
        setLoading(false);
        setError("An unexpected error occurred. Please try again later.");
      });
  };

  const handleResendOtp = () => {
    if (countdown > 0) return;
    setError("");
    setOtp(["", "", "", "", "", ""]);

    setLoading(true);
    forgotPasswordRequest(email)
      .then((res) => {
        setLoading(false);
        if (res.success) {
          setCountdown(60);
        } else {
          setError(res.message || "Failed to resend OTP.");
        }
      })
      .catch(() => {
        setLoading(false);
        setError("An unexpected error occurred.");
      });
  };

  const passwordRequirements = [
    { label: "At least 8 characters", valid: newPassword.length >= 8 },
    { label: "One uppercase letter", valid: /[A-Z]/.test(newPassword) },
    { label: "One lowercase letter", valid: /[a-z]/.test(newPassword) },
    { label: "One number", valid: /[0-9]/.test(newPassword) },
    {
      label: "Passwords match",
      valid: confirmPassword && newPassword === confirmPassword,
    },
  ];

  return (
    <div className="forgot-password-container">
      {/* Left Panel - Progress Sidebar */}
      <div className="left-panel">
        <div className="logo-section">
          <div className="logo-icon">
            <Icons.Lock />
          </div>
          <h2 className="logo-text">Secure Account Recovery</h2>
        </div>

        <div className="progress-container">
          {[
            "Email Verification",
            "Enter OTP",
            "Reset Password",
            "Complete",
          ].map((label, idx) => (
            <div key={idx} className="progress-item">
              <div
                className={`progress-circle ${step > idx + 1 ? "completed" : ""} ${step === idx + 1 ? "active" : ""}`}
              >
                {step > idx + 1 ? (
                  <Icons.Check className="check-icon" />
                ) : (
                  idx + 1
                )}
              </div>
              <div className="progress-label">
                <div
                  className={`progress-title ${step >= idx + 1 ? "active" : ""}`}
                >
                  {label}
                </div>
                <div className="progress-subtitle">
                  {idx === 0 && "Verify your email address"}
                  {idx === 1 && "Enter the code we sent"}
                  {idx === 2 && "Create a new password"}
                  {idx === 3 && "Successfully reset"}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="security-note">
          <span className="security-icon">
            <Icons.Shield />
          </span>
          <div>
            <div className="security-title">Your data is secure</div>
            <div className="security-text">
              We use industry-standard encryption to protect your information
            </div>
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
                <p className="subtitle">
                  Enter your email address and we'll send you a verification
                  code
                </p>
              </div>

              <div className="form-wrapper">
                {error && (
                  <div className="error-alert">
                    <span className="alert-icon">
                      <Icons.AlertTriangle />
                    </span>
                    <span>{error}</span>
                  </div>
                )}

                <div className="input-group">
                  <label className="label">Email Address</label>
                  <div className="input-wrapper">
                    <span className="input-icon">
                      <Icons.Mail />
                    </span>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && handleEmailSubmit(e)
                      }
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
                      <span className="button-arrow">
                        <Icons.ArrowRight />
                      </span>
                    </>
                  )}
                </button>

                <a href="/login" className="back-link">
                  <span className="arrow-icon">
                    <Icons.ArrowLeft />
                  </span>{" "}
                  Back to Login
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
                  We've sent a 6-digit code to{" "}
                  <strong className="email-highlight">{email}</strong>
                </p>
              </div>

              <div className="form-wrapper">
                {error && (
                  <div className="error-alert">
                    <span className="alert-icon">
                      <Icons.AlertTriangle />
                    </span>
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
                        if (e.key === "Backspace" && !digit && index > 0) {
                          document.getElementById(`otp-${index - 1}`)?.focus();
                        }
                        if (e.key === "Enter") {
                          handleOtpSubmit(e);
                        }
                      }}
                      disabled={loading}
                      className="otp-input"
                    />
                  ))}
                </div>

                <p className="input-hint" style={{ textAlign: 'center', marginBottom: '1.5rem', fontSize: '0.875rem', color: '#6b7280' }}>
                  If you don't see the email, please check your <strong>Spam/Junk folder</strong>.
                  <br />
                  If a transmission error occurs, try clicking the button again.
                </p>

                <div className="resend-section">
                  <span className="resend-text">Didn't receive the code?</span>
                  <button
                    onClick={handleResendOtp}
                    disabled={countdown > 0}
                    className="resend-button"
                  >
                    {countdown > 0 ? `Resend in ${countdown}s` : "Resend Code"}
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
                      <span className="button-arrow">
                        <Icons.ArrowRight />
                      </span>
                    </>
                  )}
                </button>

                <button onClick={() => setStep(1)} className="back-link">
                  <span className="arrow-icon">
                    <Icons.ArrowLeft />
                  </span>{" "}
                  Change Email
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Reset Password */}
          {step === 3 && (
            <div className="step-content">
              <div className="header">
                <h1 className="title">Create New Password</h1>
                <p className="subtitle">
                  Choose a strong password to secure your account
                </p>
              </div>

              <div className="form-wrapper">
                {error && (
                  <div className="error-alert">
                    <span className="alert-icon">
                      <Icons.AlertTriangle />
                    </span>
                    <span>{error}</span>
                  </div>
                )}

                <div className="input-group">
                  <label className="label">New Password</label>
                  <div className="input-wrapper">
                    <span className="input-icon lock-icon">
                      <Icons.Lock />
                    </span>
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && handlePasswordReset(e)
                      }
                      disabled={loading}
                      className="input"
                    />
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className="toggle-password"
                    >
                      {showPassword ? <Icons.Eye /> : <Icons.EyeOff />}
                    </button>
                  </div>
                </div>

                <div className="input-group">
                  <label className="label">Confirm Password</label>
                  <div className="input-wrapper">
                    <span className="input-icon lock-icon">
                      <Icons.Lock />
                    </span>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && handlePasswordReset(e)
                      }
                      disabled={loading}
                      className="input"
                    />
                    <button
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="toggle-password"
                    >
                      {showConfirmPassword ? <Icons.Eye /> : <Icons.EyeOff />}
                    </button>
                  </div>
                </div>

                <div className="requirements">
                  <div className="requirements-title">
                    Password Requirements
                  </div>
                  <div className="requirements-list">
                    {passwordRequirements.map((req, idx) => (
                      <div key={idx} className="requirement-item">
                        <span
                          className={`requirement-icon ${req.valid ? "valid" : ""}`}
                        >
                          {req.valid ? "✓" : ""}
                        </span>
                        <span
                          className={`requirement-text ${req.valid ? "valid" : ""}`}
                        >
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
                      <span className="button-arrow">
                        <Icons.ArrowRight />
                      </span>
                    </>
                  )}
                </button>

                <a href="/login" className="back-link">
                  <span className="arrow-icon">
                    <Icons.ArrowLeft />
                  </span>{" "}
                  Back to Login
                </a>
              </div>
            </div>
          )}

          {/* Step 4: Success */}
          {step === 4 && (
            <div className="step-content">
              <div className="header center">
                <div className="success-icon">
                  <div className="checkmark">
                    <Icons.Check />
                  </div>
                </div>
                <h1 className="title success">Password Reset Successful!</h1>
                <p className="subtitle">
                  Your password has been reset successfully. You can now log in
                  with your new password.
                </p>
              </div>

              <div className="form-wrapper success-wrapper">
                <a href="/login" className="primary-button">
                  Go to Login
                  <span className="button-arrow">
                    <Icons.ArrowRight />
                  </span>
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
