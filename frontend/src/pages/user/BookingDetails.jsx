import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import UserNavbar from '../../components/common/UserNavbar';
import { getBookingById } from '../../services/api';
import './BookingDetails.css';

const BookingDetails = () => {
    const { bookingId } = useParams();
    const navigate = useNavigate();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    /* ==========================================
       SVG ICONS WITH GRADIENTS
       ========================================== */
    const Icons = {
        Clipboard: ({ className = "" }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="url(#dashCyanGradient)" strokeWidth="2"><rect x="8" y="2" width="8" height="4" rx="1" ry="1" /><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><path d="M9 12h6M9 16h6" /></svg>,
        Check: ({ className = "" }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>,
        CheckCircle: ({ className = "" }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="url(#dashGreenGradient)" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>,
        Clock: ({ className = "" }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="url(#dashPurpleGradient)" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>,
        Calendar: ({ className = "" }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="url(#dashBlueGradient)" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>,
        Wrench: ({ className = "" }) => <svg className={className} viewBox="0 0 24 24" fill="url(#dashGreenGradient)"><path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z" /></svg>,
        Car: ({ className = "" }) => <svg className={className} viewBox="0 0 24 24" fill="url(#dashRedGradient)"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" /></svg>,
        Hash: ({ className = "" }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="url(#dashCyanGradient)" strokeWidth="2"><line x1="4" y1="9" x2="20" y2="9" /><line x1="4" y1="15" x2="20" y2="15" /><line x1="10" y1="3" x2="8" y2="21" /><line x1="16" y1="3" x2="14" y2="21" /></svg>,
        Factory: ({ className = "" }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="url(#dashPurpleRocketGradient)" strokeWidth="2"><path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z" /></svg>,
        User: ({ className = "" }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="url(#dashPurpleGradient)" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>,
        Mail: ({ className = "" }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="url(#dashCyanGradient)" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>,
        Phone: ({ className = "" }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="url(#dashGreenGradient)" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>,
        MapPin: ({ className = "" }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="url(#dashRedGradient)" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>,
        Home: ({ className = "" }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="url(#dashBlueGradient)" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>,
        Map: ({ className = "" }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="url(#dashCyanGradient)" strokeWidth="2"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" /><line x1="8" y1="2" x2="8" y2="18" /><line x1="16" y1="6" x2="16" y2="22" /></svg>,
        Package: ({ className = "" }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="url(#dashPurpleRocketGradient)" strokeWidth="2"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21" /><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></svg>,
        DollarSign: ({ className = "" }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="url(#dashBlueGradient)" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>,
        ChevronLeft: ({ className = "" }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>,
        Sparkles: ({ className = "" }) => <svg className={className} viewBox="0 0 24 24" fill="url(#dashYellowLightGradient)"><path d="M12 3l1.5 4.5 4.5 1.5-4.5 1.5L12 15l-1.5-4.5-4.5-1.5 4.5-1.5L12 3z" /></svg>,
        Engine: ({ className = "" }) => <svg className={className} viewBox="0 0 24 24" fill="url(#dashOrangeGradient)"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" /><path d="M12 5l-4 10h8l-4-10z" /></svg>,
        Brakes: ({ className = "" }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="url(#dashRedGradient)" strokeWidth="2"><circle cx="12" cy="12" r="9" /><path d="M12 7v10M7 12h10" /></svg>,
        Battery: ({ className = "" }) => <svg className={className} viewBox="0 0 24 24" fill="url(#dashYellowLightGradient)"><rect x="1" y="6" width="18" height="12" rx="2" /><path d="M23 13v-2" /></svg>,
        Briefcase: ({ className = "" }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="url(#dashPurpleRocketGradient)" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>,
    };

    const Gradients = () => (
        <svg style={{ width: 0, height: 0, position: 'absolute' }}>
            <defs>
                <linearGradient id="dashRedGradient" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#ef4444" /><stop offset="100%" stopColor="#b91c1c" /></linearGradient>
                <linearGradient id="dashBlueGradient" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#3b82f6" /><stop offset="100%" stopColor="#1d4ed8" /></linearGradient>
                <linearGradient id="dashOrangeGradient" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#f97316" /><stop offset="100%" stopColor="#c2410c" /></linearGradient>
                <linearGradient id="dashCyanGradient" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#06b6d4" /><stop offset="100%" stopColor="#0891b2" /></linearGradient>
                <linearGradient id="dashPurpleRocketGradient" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#8b5cf6" /><stop offset="100%" stopColor="#6366f1" /></linearGradient>
                <linearGradient id="dashPurpleGradient" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#a855f7" /><stop offset="100%" stopColor="#7e22ce" /></linearGradient>
                <linearGradient id="dashYellowLightGradient" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#fbbf24" /><stop offset="100%" stopColor="#f59e0b" /></linearGradient>
                <linearGradient id="dashGreenGradient" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#22c55e" /><stop offset="100%" stopColor="#15803d" /></linearGradient>
                <linearGradient id="dashYellowGradient" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#fbbf24" /><stop offset="100%" stopColor="#d97706" /></linearGradient>
            </defs>
        </svg>
    );

    const getIconComponent = (iconName) => {
        let IconComponent = Icons[iconName];
        if (!IconComponent) {
            const entry = Object.entries(Icons).find(([key]) => key.toLowerCase() === (iconName || '').toLowerCase());
            IconComponent = entry ? entry[1] : Icons.Wrench;
        }
        return <IconComponent />;
    };

    // Helper to format 24h time to 12h display
    const formatTime = (timeStr) => {
        if (!timeStr) return '';
        const [hours, minutes] = timeStr.split(':').map(Number);
        const period = hours >= 12 ? 'PM' : 'AM';
        const displayHour = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
        return `${String(displayHour).padStart(2, '0')}:${String(minutes).padStart(2, '0')} ${period}`;
    };

    useEffect(() => {
        const fetchBooking = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await getBookingById(bookingId);
                if (response.success && response.data) {
                    const b = response.data;
                    setBooking({
                        id: `BK${String(b.bookingId).padStart(3, '0')}`,
                        serviceName: b.services && b.services.length > 0 ? b.services.map(s => s.serviceName).join(', ') : 'Service Appointment',
                        serviceIcon: b.serviceIcon || 'Wrench',
                        price: b.totalAmount || 0,
                        bookingDate: b.date,
                        serviceDate: b.date,
                        timeSlot: `${formatTime(b.startTime)} - ${formatTime(b.endTime)}`,
                        status: (b.status || 'PENDING').toLowerCase(),
                        paymentStatus: 'Confirmed',
                        paymentMethod: 'Stripe Secure',
                        transactionId: 'TRX-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
                        vehicleNumber: b.registrationNumber || 'N/A',
                        vehicleBrand: b.vehicleMake || 'N/A',
                        vehicleModel: b.vehicleModel || 'N/A',
                        vehicleYear: b.vehicleYear || 'N/A',
                        address: b.address || 'N/A',
                        landmark: 'N/A',
                        pincode: b.postcode || 'N/A',
                        customerName: b.fullName || 'User',
                        customerEmail: 'N/A',
                        customerPhone: 'N/A',
                        specialInstructions: b.additionalComments || '',
                        serviceCenter: 'I Khodal Automotive Service Center',
                        serviceCenterAddress: 'Melbourne, VIC, Australia',
                        serviceCenterPhone: '+61 400 000 000',
                        technician: 'To be assigned',
                        technicianPhone: '—',
                        estimatedDuration: '2 hours',
                        servicesIncluded: b.services ? b.services.map(s => s.serviceName) : [],
                        invoiceNumber: `INV-${String(b.bookingId).padStart(5, '0')}`,
                        gstNumber: 'N/A',
                        basePrice: b.totalAmount ? Math.round(Number(b.totalAmount) / 1.18) : 0,
                        gst: b.totalAmount ? Math.round(Number(b.totalAmount) - Number(b.totalAmount) / 1.18) : 0,
                        discount: 0,
                        totalPrice: Number(b.totalAmount) || 0
                    });
                } else {
                    setError(response.message || 'Failed to fetch booking details');
                }
            } catch (error) {
                console.error('Error fetching booking:', error);
                setError('An unexpected error occurred while loading booking details.');
            } finally {
                setLoading(false);
            }
        };
        fetchBooking();
    }, [bookingId]);

    if (loading) {
        return (
            <div className="loading-container">
                <Gradients />
                <div className="spinner"></div>
                <p>Retrieving your booking details...</p>
            </div>
        );
    }

    if (error || !booking) {
        return (
            <div className="bd-error-container">
                <Gradients />
                <div className="bd-error-card">
                    <div className="bd-error-visual">
                        <div className="bd-error-glow"></div>
                        <div className="bd-error-icon">
                            <Icons.Brakes />
                        </div>
                    </div>
                    <h2 className="bd-error-title">Something Went Wrong</h2>
                    <p className="bd-error-sub">
                        {error || 'Booking not found'}<br />
                        Please try again or go back to your bookings.
                    </p>
                    <div className="bd-error-hints">
                        <div className="bd-hint">
                            <span className="bdhint-icon bdhint-blue"><Icons.Calendar /></span>
                            <span className="bdhint-label">Check booking ID</span>
                        </div>
                        <div className="bdhint-divider"></div>
                        <div className="bd-hint">
                            <span className="bdhint-icon bdhint-orange"><Icons.Clock /></span>
                            <span className="bdhint-label">Try again later</span>
                        </div>
                        <div className="bdhint-divider"></div>
                        <div className="bd-hint">
                            <span className="bdhint-icon bdhint-green"><Icons.Phone /></span>
                            <span className="bdhint-label">Contact support</span>
                        </div>
                    </div>
                    <button className="bd-error-btn" onClick={() => navigate('/my-bookings')}>
                        ← Back to My Bookings
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="booking-details-container">
            <Gradients />

            <UserNavbar />

            <div className="booking-details-main">
                <button className="back-btn" onClick={() => navigate('/my-bookings')}>
                    <span className="back-icon"><Icons.ChevronLeft /></span>
                    Back to My Bookings
                </button>

                <div className="details-header">
                    <div className="header-left">
                        <h1 className="details-title">
                            <span className="title-icon"><Icons.Clipboard /></span>
                            Booking Details
                        </h1>
                        <p className="booking-ref">Reference: #{booking.id}</p>
                    </div>
                    <div className="header-right">
                        <span className={`status-badge-large ${booking.status}`}>
                            {booking.status === 'pending' ? <><Icons.Clock /> Pending</> : <><Icons.CheckCircle /> Completed</>}
                        </span>
                    </div>
                </div>

                <div className="details-grid">
                    <div className="details-left">
                        <div className="detail-card">
                            <div className="card-header">
                                <h2 className="card-title">
                                    <span className="card-icon"><Icons.Wrench /></span>
                                    Service Information
                                </h2>
                            </div>
                            <div className="card-body">
                                <div className="service-showcase">
                                    <div className="service-icon-xl">
                                        {getIconComponent(booking.serviceIcon)}
                                    </div>
                                    <div className="service-info-text">
                                        <h3 className="service-name-large">{booking.serviceName}</h3>
                                        <p className="service-duration">
                                            <Icons.Clock className="inline-icon" />
                                            Est. Duration: {booking.estimatedDuration}
                                        </p>
                                    </div>
                                </div>

                                <div className="info-rows">
                                    <div className="info-row">
                                        <span className="info-label"><Icons.Calendar className="inline-icon" /> Date</span>
                                        <span className="info-value">
                                            {new Date(booking.serviceDate).toLocaleDateString('en-AU', {
                                                weekday: 'long',
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                    <div className="info-row">
                                        <span className="info-label"><Icons.Clock className="inline-icon" /> Time Slot</span>
                                        <span className="info-value">{booking.timeSlot}</span>
                                    </div>
                                </div>

                                <div className="services-included">
                                    <h4 className="included-title"><Icons.Sparkles className="inline-icon" /> Services Included</h4>
                                    <ul className="included-list">
                                        {booking.servicesIncluded.map((service, index) => (
                                            <li key={index} className="included-item">
                                                <span className="check-icon"><Icons.Check /></span>
                                                {service}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="detail-card">
                            <div className="card-header">
                                <h2 className="card-title">
                                    <span className="card-icon"><Icons.Car /></span>
                                    Vehicle Details
                                </h2>
                            </div>
                            <div className="card-body">
                                <div className="info-rows">
                                    <div className="info-row">
                                        <span className="info-label"><Icons.Hash className="inline-icon" /> Registration</span>
                                        <span className="info-value highlight">{booking.vehicleNumber}</span>
                                    </div>
                                    <div className="info-row">
                                        <span className="info-label">Make & Model</span>
                                        <span className="info-value">{booking.vehicleBrand} {booking.vehicleModel}</span>
                                    </div>
                                    <div className="info-row">
                                        <span className="info-label">Year</span>
                                        <span className="info-value">{booking.vehicleYear}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="detail-card">
                            <div className="card-header">
                                <h2 className="card-title">
                                    <span className="card-icon"><Icons.User /></span>
                                    Customer Details
                                </h2>
                            </div>
                            <div className="card-body">
                                <div className="info-rows">
                                    <div className="info-row">
                                        <span className="info-label">Name</span>
                                        <span className="info-value">{booking.customerName}</span>
                                    </div>
                                    <div className="info-row">
                                        <span className="info-label"><Icons.MapPin className="inline-icon" /> Address</span>
                                        <span className="info-value">{booking.address}, {booking.pincode}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="details-right">
                        <div className="detail-card sticky-service-card">
                            <div className="card-header">
                                <h2 className="card-title">
                                    <span className="card-icon"><Icons.Briefcase /></span>
                                    Service Center
                                </h2>
                            </div>
                            <div className="card-body">
                                <div className="center-info">
                                    <h3 className="center-name">{booking.serviceCenter}</h3>
                                    <p className="center-address">{booking.serviceCenterAddress}</p>
                                    <div className="center-contact">
                                        <span className="contact-icon"><Icons.Phone className="inline-icon" /></span>
                                        <span className="contact-text">{booking.serviceCenterPhone}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="detail-card sticky-payment-card">
                            <div className="card-header">
                                <h2 className="card-title">
                                    <span className="card-icon"><Icons.DollarSign /></span>
                                    Payment Summary
                                </h2>
                            </div>
                            <div className="card-body">
                                <div className="payment-rows">
                                    <div className="payment-row">
                                        <span className="payment-label">Base Price</span>
                                        <span className="payment-value">AUD {booking.basePrice.toLocaleString()}</span>
                                    </div>
                                    <div className="payment-row">
                                        <span className="payment-label">Tax (GST)</span>
                                        <span className="payment-value">AUD {booking.gst.toLocaleString()}</span>
                                    </div>
                                </div>

                                <div className="payment-total">
                                    <span className="total-label">Subtotal</span>
                                    <span className="total-value">AUD {booking.totalPrice.toLocaleString()}</span>
                                </div>

                                <div className="payment-status-section">
                                    <div className={`payment-status-badge ${booking.status === 'confirmed' || booking.status === 'completed' ? 'paid' : 'paid'}`}>
                                        <span className="status-icon"><Icons.Check /></span>
                                        Payment {booking.status === 'pending' ? 'Verified' : 'Successful'}
                                    </div>
                                    <div className="payment-info-row">
                                        <span className="payment-info-label">Method</span>
                                        <span className="payment-info-value">{booking.paymentMethod}</span>
                                    </div>
                                    <div className="payment-info-row">
                                        <span className="payment-info-label">Ref ID</span>
                                        <span className="payment-info-value" style={{ fontSize: '0.75rem' }}>{booking.transactionId}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingDetails;
