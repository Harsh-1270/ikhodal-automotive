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
    Mail: ({ className = "" }) => (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1-.9-2-2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
    Lock: ({ className = "" }) => (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
    Eye: ({ className = "" }) => (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
    EyeOff: ({ className = "" }) => (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </svg>
    ),
    ArrowLeft: ({ className = "" }) => (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="19" y1="12" x2="5" y2="12" />
        <polyline points="12 19 5 12 12 5" />
      </svg>
    ),
    PaperPlane: ({ className = "" }) => (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="22" y1="2" x2="11" y2="13" />
        <polygon points="22 2 15 22 11 13 2 9 22 2" />
      </svg>
    ),
    BigEnvelope: ({ className = "" }) => (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 6h16v12H4V6z" />
        <polyline points="4,6 12,13 20,6" />
        <line x1="4" y1="18" x2="10" y2="12" />
        <line x1="20" y1="18" x2="14" y2="12" />
      </svg>
    ),
    Check: ({ className = "" }) => (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    )
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
          setError(
            res.message ||
              "Failed to send OTP. Please try clicking 'Continue' again.",
          );
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
          setError(
            res.message || "Failed to reset password. Please try again.",
          );
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
    <div className="auth-page-wrapper">
      <div className="bg-blob bg-blob-1"></div>
      <div className="bg-blob bg-blob-2"></div>
      
      <div className="fp-auth-card">
        {/* LEFT: FORM AREA */}
        <div className="auth-form-area">
          {/* STEP TRACKER */}
          <div className="fp-stepper-horizontal">
            {[1, 2, 3, 4].map((num) => (
              <React.Fragment key={num}>
                <div className={`fp-step-circle ${step >= num ? "active" : ""} ${step > num ? "completed" : ""}`}>
                  {step > num ? <Icons.Check className="check-icon" /> : num}
                </div>
                {num < 4 && <div className={`fp-step-line ${step > num ? "active" : ""}`} />}
              </React.Fragment>
            ))}
          </div>

          <div className="form-content-inner">
            {step === 1 && (
              <div className="step-content fade-in">
                <h1 className="form-title">Forgot Password</h1>
                <p className="form-subtitle">Enter your e-mail address, and we'll give you reset instruction.</p>
                
                {error && <div className="error-alert">{error}</div>}

                <div className="input-group">
                  <div className="input-wrapper">
                    <span className="input-icon"><Icons.Mail /></span>
                    <input
                      type="email"
                      placeholder="Enter E-mail Address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleEmailSubmit(e)}
                      disabled={loading}
                      className="auth-input"
                    />
                  </div>
                </div>

                <button onClick={handleEmailSubmit} disabled={loading} className="primary-button">
                  {loading ? "Sending..." : "Send New Password"}
                </button>

                <a href="/login" className="back-link">
                  Back to <span className="blue-text">Login</span>
                </a>
              </div>
            )}

            {step === 2 && (
              <div className="step-content fade-in">
                <h1 className="form-title">Verify Your Email</h1>
                <p className="form-subtitle">We've sent a 6-digit code to <strong>{email}</strong></p>
                
                {error && <div className="error-alert">{error}</div>}

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
                        if (e.key === "Enter") handleOtpSubmit(e);
                      }}
                      disabled={loading}
                      className="otp-input"
                    />
                  ))}
                </div>

                <div className="resend-section">
                  <button onClick={handleResendOtp} disabled={countdown > 0 || loading} className="resend-button">
                    {countdown > 0 ? `Resend in ${countdown}s` : "Resend Code"}
                  </button>
                </div>

                <button onClick={handleOtpSubmit} disabled={loading} className="primary-button">
                  {loading ? "Verifying..." : "Verify Code"}
                </button>

                <button onClick={() => setStep(1)} className="back-link">
                  Change <span className="blue-text">Email</span>
                </button>
              </div>
            )}

            {step === 3 && (
              <div className="step-content fade-in">
                <h1 className="form-title">Create New Password</h1>
                <p className="form-subtitle">Choose a strong password for your account.</p>
                
                {error && <div className="error-alert">{error}</div>}

                <div className="input-group">
                  <div className="input-wrapper">
                    <span className="input-icon"><Icons.Lock /></span>
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter New Password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handlePasswordReset(e)}
                      disabled={loading}
                      className="auth-input"
                    />
                    <button onClick={() => setShowPassword(!showPassword)} className="toggle-password">
                      {showPassword ? <Icons.Eye /> : <Icons.EyeOff />}
                    </button>
                  </div>
                </div>

                <div className="input-group" style={{ marginTop: '1.25rem' }}>
                  <div className="input-wrapper">
                    <span className="input-icon"><Icons.Lock /></span>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm New Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handlePasswordReset(e)}
                      disabled={loading}
                      className="auth-input"
                    />
                    <button onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="toggle-password">
                      {showConfirmPassword ? <Icons.Eye /> : <Icons.EyeOff />}
                    </button>
                  </div>
                </div>

                <button onClick={handlePasswordReset} disabled={loading} className="primary-button" style={{ marginTop: '1.5rem' }}>
                  {loading ? "Resetting..." : "Reset Password"}
                </button>
                
                <button onClick={() => setStep(1)} className="back-link">
                  Cancel & Go <span className="blue-text">Back</span>
                </button>
              </div>
            )}

            {step === 4 && (
              <div className="step-content fade-in center-text">
                <div className="success-check-big">
                  <Icons.Check />
                </div>
                <h1 className="form-title">Reset Successful!</h1>
                <p className="form-subtitle">Your password has been reset successfully. You can now login.</p>
                
                <a href="/login" className="primary-button" style={{ marginTop: '1.5rem', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  Go to Login
                </a>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: ILLUSTRATION AREA */}
        <div className="auth-illustration-area">
          <div className="grid-illustration">
            {/* Lines */}
            <div className="grid-line v-line left-line"></div>
            <div className="grid-line v-line right-line"></div>
            <div className="grid-line h-line top-line"></div>
            <div className="grid-line h-line bottom-line"></div>

            {/* Elements inside cells */}
            <div className="grid-cell cell-top-left">
              <span className="q-mark">?</span>
            </div>
            
            <div className="grid-cell cell-center">
              <div className="envelope-wrapper">
                <div className="env-glow"></div>
                <Icons.BigEnvelope className="env-svg" />
              </div>
            </div>
            
            <div className="grid-cell cell-bottom-right">
              <Icons.PaperPlane className="plane-svg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
