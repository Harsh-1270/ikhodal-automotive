import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import UserNavbar from '../../components/common/UserNavbar';
import { createBooking } from '../../services/api';
import './BookingForm.css';

const BookingForm = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Read schedule + cart data passed from ScheduleSelection
    const { selectedDate, selectedTime, serviceIds = [], cartItems = [] } = location.state || {};

    // Redirect to cart if accessed without state (e.g. direct URL or refresh)
    React.useEffect(() => {
        if (!location.state || !serviceIds || serviceIds.length === 0) {
            navigate('/cart', { replace: true });
        }
    }, [location.state, serviceIds, navigate]);

    /* ==========================================
       SVG ICONS COMPONENT
       ========================================== */
    const Icons = {
        Clipboard: ({ className = "", color = "#3b82f6" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                <path d="M9 12h6" />
                <path d="M9 16h6" />
            </svg>
        ),
        Check: ({ className = "", color = "#10b981" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
            </svg>
        ),
        Car: ({ className = "", color = "#f59e0b" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 17h-2v-6l2-5h9l4 5h1a2 2 0 0 1 2 2v4h-2m-4 0a2 2 0 1 1-4 0m-4 0a2 2 0 1 1-4 0" />
                <path d="M5 9l1.5-4.5h5L13 9" />
            </svg>
        ),
        User: ({ className = "", color = "#8b5cf6" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
            </svg>
        ),
        MessageSquare: ({ className = "", color = "#06b6d4" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
        ),
        CreditCard: ({ className = "", color = "#6366f1" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                <line x1="1" y1="10" x2="23" y2="10" />
            </svg>
        ),
        ChevronLeft: ({ className = "" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
            </svg>
        ),
        ChevronRight: ({ className = "" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 6 15 12 9 18" />
            </svg>
        )
    };

    // Form state
    const [formData, setFormData] = useState({
        registrationNumber: '',
        make: '',
        model: '',
        year: '',
        fullName: '',
        address: '',
        postcode: '',
        additionalComments: ''
    });

    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');

    // Compute cart summary from real cart data
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);
    const tax = Math.round(subtotal * 0.18);
    const total = subtotal + tax;
    const cartSummary = {
        items: cartItems.length,
        subtotal,
        tax,
        total
    };

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    // Validate form
    const validateForm = () => {
        const newErrors = {};

        // Required fields
        if (!formData.make.trim()) {
            newErrors.make = 'Make is required';
        }

        if (!formData.model.trim()) {
            newErrors.model = 'Model is required';
        }

        if (!formData.year) {
            newErrors.year = 'Year is required';
        } else if (formData.year < 1900 || formData.year > new Date().getFullYear() + 1) {
            newErrors.year = 'Please enter a valid year';
        }

        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Full name is required';
        }

        if (!formData.address.trim()) {
            newErrors.address = 'Address is required';
        }

        if (!formData.postcode.trim()) {
            newErrors.postcode = 'Postcode is required';
        } else if (!/^\d{3,}$/.test(formData.postcode)) {
            newErrors.postcode = 'Postcode must contain at least 3 numbers';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitError('');

        if (validateForm()) {
            setSubmitting(true);
            try {
                const bookingPayload = {
                    date: selectedDate,
                    startTime: selectedTime?.start || null,
                    endTime: selectedTime?.end || null,
                    serviceIds: serviceIds,
                    // Vehicle information
                    registrationNumber: formData.registrationNumber,
                    make: formData.make,
                    model: formData.model,
                    year: formData.year,
                    // Contact information
                    fullName: formData.fullName,
                    address: formData.address,
                    postcode: formData.postcode,
                    additionalComments: formData.additionalComments
                };

                const response = await createBooking(bookingPayload);

                if (response.success) {
                    // Navigate to Stripe checkout with the appointmentId
                    const appointmentId = response.data.appointmentId;
                    navigate('/checkout', {
                        state: { appointmentId },
                        replace: true
                    });
                } else {
                    setSubmitError(response.message || 'Failed to create booking. Please try again.');
                }
            } catch (error) {
                console.error('Booking error:', error);
                setSubmitError('An unexpected error occurred. Please try again.');
            } finally {
                setSubmitting(false);
            }
        }
    };

    return (
        <div className="booking-form-container">
            <UserNavbar cartCount={cartSummary.items} />

            <div className="booking-form-main">
                {/* Page Header */}
                <div className="page-header">
                    <div className="header-left">
                        <h1 className="page-title">
                            <span className="title-icon"><Icons.Clipboard /></span>
                            Booking Details
                        </h1>
                        <p className="page-subtitle">Please provide your vehicle and contact information</p>
                    </div>
                </div>

                {/* Progress Indicator */}
                <div className="progress-steps">
                    <div className="step completed">
                        <div className="step-icon"><Icons.Check /></div>
                        <span className="step-label">Services</span>
                    </div>
                    <div className="step-line completed"></div>
                    <div className="step completed">
                        <div className="step-icon">✓</div>
                        <span className="step-label">Cart</span>
                    </div>
                    <div className="step-line completed"></div>
                    <div className="step completed">
                        <div className="step-icon">✓</div>
                        <span className="step-label">Schedule</span>
                    </div>
                    <div className="step-line active"></div>
                    <div className="step active">
                        <div className="step-icon"><Icons.Clipboard color="#ffffff" /></div>
                        <span className="step-label">Details</span>
                    </div>
                    <div className="step-line"></div>
                    <div className="step">
                        <div className="step-icon"><Icons.CreditCard /></div>
                        <span className="step-label">Payment</span>
                    </div>
                </div>

                {/* Form Grid */}
                <div className="form-grid">
                    {/* Left Column - Form */}
                    <div className="form-section">
                        <form onSubmit={handleSubmit} className="booking-form">
                            {/* Vehicle Information Section */}
                            <div className="form-card">
                                <h2 className="section-title">
                                    <span className="section-icon"><Icons.Car /></span>
                                    Vehicle Information
                                </h2>

                                {/* Registration Number */}
                                <div className="form-group">
                                    <label htmlFor="registrationNumber" className="form-label">
                                        Registration Number
                                        <span className="optional-badge">Optional</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="registrationNumber"
                                        name="registrationNumber"
                                        placeholder="e.g., AB12 CDE"
                                        value={formData.registrationNumber}
                                        onChange={handleChange}
                                        className="form-input"
                                    />
                                </div>

                                {/* Make and Model - Two columns */}
                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="make" className="form-label">
                                            Make <span className="required">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="make"
                                            name="make"
                                            placeholder="e.g., Toyota"
                                            value={formData.make}
                                            onChange={handleChange}
                                            className={`form-input ${errors.make ? 'error' : ''}`}
                                        />
                                        {errors.make && (
                                            <span className="error-text">{errors.make}</span>
                                        )}
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="model" className="form-label">
                                            Model <span className="required">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="model"
                                            name="model"
                                            placeholder="e.g., Camry"
                                            value={formData.model}
                                            onChange={handleChange}
                                            className={`form-input ${errors.model ? 'error' : ''}`}
                                        />
                                        {errors.model && (
                                            <span className="error-text">{errors.model}</span>
                                        )}
                                    </div>
                                </div>

                                {/* Year */}
                                <div className="form-group">
                                    <label htmlFor="year" className="form-label">
                                        Year <span className="required">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        id="year"
                                        name="year"
                                        placeholder="e.g., 2020"
                                        min="1900"
                                        max={new Date().getFullYear() + 1}
                                        value={formData.year}
                                        onChange={handleChange}
                                        className={`form-input ${errors.year ? 'error' : ''}`}
                                    />
                                    {errors.year && (
                                        <span className="error-text">{errors.year}</span>
                                    )}
                                </div>
                            </div>

                            {/* Contact Information Section */}
                            <div className="form-card">
                                <h2 className="section-title">
                                    <span className="section-icon"><Icons.User /></span>
                                    Contact Information
                                </h2>

                                {/* Full Name */}
                                <div className="form-group">
                                    <label htmlFor="fullName" className="form-label">
                                        Full Name <span className="required">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="fullName"
                                        name="fullName"
                                        placeholder="Enter your full name"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        className={`form-input ${errors.fullName ? 'error' : ''}`}
                                    />
                                    {errors.fullName && (
                                        <span className="error-text">{errors.fullName}</span>
                                    )}
                                </div>

                                {/* Detailed Address */}
                                <div className="form-group">
                                    <label htmlFor="address" className="form-label">
                                        Detailed Address <span className="required">*</span>
                                    </label>
                                    <textarea
                                        id="address"
                                        name="address"
                                        rows="3"
                                        placeholder="Enter your full address including street, city"
                                        value={formData.address}
                                        onChange={handleChange}
                                        className={`form-textarea ${errors.address ? 'error' : ''}`}
                                    />
                                    {errors.address && (
                                        <span className="error-text">{errors.address}</span>
                                    )}
                                </div>

                                {/* Postcode */}
                                <div className="form-group">
                                    <label htmlFor="postcode" className="form-label">
                                        Postcode <span className="required">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="postcode"
                                        name="postcode"
                                        placeholder="e.g., SW1A 1AA"
                                        value={formData.postcode}
                                        onChange={handleChange}
                                        className={`form-input ${errors.postcode ? 'error' : ''}`}
                                    />
                                    {errors.postcode && (
                                        <span className="error-text">{errors.postcode}</span>
                                    )}
                                </div>
                            </div>

                            {/* Additional Comments Section */}
                            <div className="form-card">
                                <h2 className="section-title">
                                    <span className="section-icon"><Icons.MessageSquare /></span>
                                    Additional Information
                                </h2>

                                <div className="form-group">
                                    <label htmlFor="additionalComments" className="form-label">
                                        Additional Comments
                                        <span className="optional-badge">Optional</span>
                                    </label>
                                    <textarea
                                        id="additionalComments"
                                        name="additionalComments"
                                        rows="4"
                                        placeholder="Any special requests or information we should know..."
                                        value={formData.additionalComments}
                                        onChange={handleChange}
                                        className="form-textarea"
                                    />
                                    <span className="char-count">
                                        {formData.additionalComments.length} / 500 characters
                                    </span>
                                </div>
                            </div>

                            {/* Error Message */}
                            {submitError && (
                                <div style={{ color: '#ef4444', background: 'rgba(239,68,68,0.1)', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>
                                    {submitError}
                                </div>
                            )}

                            {/* Form Actions */}
                            <div className="form-actions">
                                <button
                                    type="button"
                                    className="btn-secondary"
                                    onClick={() => navigate('/schedule')}
                                    disabled={submitting}
                                >
                                    <span className="btn-icon"><Icons.ChevronLeft /></span>
                                    Back to Schedule
                                </button>
                                <button type="submit" className="btn-primary" disabled={submitting}>
                                    {submitting ? 'Booking...' : 'Confirm Booking'}
                                    <span className="btn-icon"><Icons.ChevronRight /></span>
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Right Column - Order Summary */}
                    <div className="summary-section">
                        <div className="summary-card sticky-card">
                            <h3 className="summary-title">
                                <span className="summary-icon"><Icons.Clipboard /></span>
                                Order Summary
                            </h3>

                            <div className="summary-details">
                                <div className="summary-row">
                                    <span className="label">Services</span>
                                    <span className="value">{cartSummary.items} items</span>
                                </div>
                                <div className="summary-row">
                                    <span className="label">Subtotal</span>
                                    <span className="value">${cartSummary.subtotal.toLocaleString()}</span>
                                </div>
                                <div className="summary-row">
                                    <span className="label">GST (18%)</span>
                                    <span className="value">${cartSummary.tax.toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="summary-divider"></div>

                            <div className="summary-total">
                                <span className="total-label">Total Amount</span>
                                <span className="total-value">${cartSummary.total.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingForm;
