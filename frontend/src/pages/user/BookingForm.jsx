import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserNavbar from '../../components/common/UserNavbar';
import './BookingForm.css';

const BookingForm = () => {
    const navigate = useNavigate();

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

    // Mock cart summary (in real app, get from context/state)
    const cartSummary = {
        items: 3,
        subtotal: 5097,
        tax: 917,
        total: 6014
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
    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            // In real app: save form data to context/backend
            console.log('Form Data:', formData);

            // Navigate to payment page
            navigate('/payment');
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
                            <span className="title-icon">📝</span>
                            Booking Details
                        </h1>
                        <p className="page-subtitle">Please provide your vehicle and contact information</p>
                    </div>
                </div>

                {/* Progress Indicator */}
                <div className="progress-steps">
                    <div className="step completed">
                        <div className="step-icon">✓</div>
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
                        <div className="step-icon">📝</div>
                        <span className="step-label">Details</span>
                    </div>
                    <div className="step-line"></div>
                    <div className="step">
                        <div className="step-icon">💳</div>
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
                                    <span className="section-icon">🚗</span>
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
                                    <span className="section-icon">👤</span>
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
                                    <span className="section-icon">💬</span>
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

                            {/* Form Actions */}
                            <div className="form-actions">
                                <button
                                    type="button"
                                    className="btn-secondary"
                                    onClick={() => navigate('/cart')}
                                >
                                    <span className="btn-icon">←</span>
                                    Back to Cart
                                </button>
                                <button type="submit" className="btn-primary">
                                    Continue to Payment
                                    <span className="btn-icon">→</span>
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Right Column - Order Summary */}
                    <div className="summary-section">
                        <div className="summary-card sticky-card">
                            <h3 className="summary-title">
                                <span className="summary-icon">📋</span>
                                Order Summary
                            </h3>

                            <div className="summary-details">
                                <div className="summary-row">
                                    <span className="label">Services</span>
                                    <span className="value">{cartSummary.items} items</span>
                                </div>
                                <div className="summary-row">
                                    <span className="label">Subtotal</span>
                                    <span className="value">₹{cartSummary.subtotal.toLocaleString()}</span>
                                </div>
                                <div className="summary-row">
                                    <span className="label">GST (18%)</span>
                                    <span className="value">₹{cartSummary.tax.toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="summary-divider"></div>

                            <div className="summary-total">
                                <span className="total-label">Total Amount</span>
                                <span className="total-value">₹{cartSummary.total.toLocaleString()}</span>
                            </div>

                            <div className="summary-info">
                                <div className="info-item">
                                    <span className="info-icon">✓</span>
                                    <span>Secure Payment</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-icon">✓</span>
                                    <span>Professional Service</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-icon">✓</span>
                                    <span>Quality Guaranteed</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingForm;
