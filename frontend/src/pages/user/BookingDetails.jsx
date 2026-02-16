import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import UserNavbar from '../../components/common/UserNavbar';
import { getBookingById } from '../../services/api';
import './BookingDetails.css';

const BookingDetails = () => {
    const { bookingId } = useParams();
    const navigate = useNavigate();
    const [booking, setBooking] = useState(null);

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
        Clock: ({ className = "", color = "#f59e0b" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
            </svg>
        ),
        Calendar: ({ className = "", color = "#3b82f6" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
        ),
        Wrench: ({ className = "", color = "#f59e0b" }) => (
            <svg className={className} viewBox="0 0 24 24" fill={color}>
                <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z" />
            </svg>
        ),
        Snowflake: ({ className = "", color = "#0ea5e9" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="2" x2="12" y2="22" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                <line x1="19.07" y1="4.93" x2="4.93" y2="19.07" />
            </svg>
        ),
        Sparkles: ({ className = "", color = "#fbbf24" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3l1.545 4.635L18.18 9.18l-4.635 1.545L12 15.36l-1.545-4.635L5.82 9.18l4.635-1.545L12 3z" />
                <path d="M5 5l.5 1.5L7 7l-1.5.5L5 9l-.5-1.5L3 7l1.5-.5L5 5z" />
                <path d="M19 15l.5 1.5L21 17l-1.5.5L19 19l-.5-1.5L17 17l1.5-.5L19 15z" />
            </svg>
        ),
        Car: ({ className = "", color = "#f59e0b" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 17h-2v-6l2-5h9l4 5h1a2 2 0 0 1 2 2v4h-2m-4 0a2 2 0 1 1-4 0m-4 0a2 2 0 1 1-4 0" />
                <path d="M5 9l1.5-4.5h5L13 9" />
            </svg>
        ),
        Hash: ({ className = "", color = "#64748b" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" y1="9" x2="20" y2="9" />
                <line x1="4" y1="15" x2="20" y2="15" />
                <line x1="10" y1="3" x2="8" y2="21" />
                <line x1="16" y1="3" x2="14" y2="21" />
            </svg>
        ),
        Factory: ({ className = "", color = "#64748b" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z" />
            </svg>
        ),
        User: ({ className = "", color = "#8b5cf6" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
            </svg>
        ),
        Mail: ({ className = "", color = "#64748b" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
            </svg>
        ),
        Phone: ({ className = "", color = "#64748b" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
        ),
        MapPin: ({ className = "", color = "#ef4444" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
            </svg>
        ),
        Home: ({ className = "", color = "#64748b" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
        ),
        Map: ({ className = "", color = "#64748b" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
                <line x1="8" y1="2" x2="8" y2="18" />
                <line x1="16" y1="6" x2="16" y2="22" />
            </svg>
        ),
        Package: ({ className = "", color = "#64748b" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="16.5" y1="9.4" x2="7.5" y2="4.21" />
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
        ),
        Briefcase: ({ className = "", color = "#1e3a8a" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
        ),
        DollarSign: ({ className = "", color = "#10b981" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="1" x2="12" y2="23" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
        ),
        ChevronLeft: ({ className = "" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
            </svg>
        )
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
            try {
                const response = await getBookingById(bookingId);
                if (response.success && response.data) {
                    const b = response.data;
                    setBooking({
                        id: `BK${String(b.bookingId).padStart(3, '0')}`,
                        serviceName: b.services && b.services.length > 0 ? b.services.map(s => s.serviceName).join(', ') : 'Service Appointment',
                        serviceIcon: <Icons.Wrench />,
                        price: b.totalAmount || 0,
                        bookingDate: b.date,
                        serviceDate: b.date,
                        timeSlot: `${formatTime(b.startTime)} - ${formatTime(b.endTime)}`,
                        status: (b.status || 'PENDING').toLowerCase(),
                        paymentStatus: '—',
                        paymentMethod: '—',
                        transactionId: '—',
                        vehicleNumber: b.registrationNumber || '—',
                        vehicleBrand: b.vehicleMake || '—',
                        vehicleModel: b.vehicleModel || '—',
                        vehicleYear: b.vehicleYear || '—',
                        address: b.address || '—',
                        landmark: '—',
                        pincode: b.postcode || '—',
                        customerName: b.fullName || '—',
                        customerEmail: '—',
                        customerPhone: '—',
                        specialInstructions: b.additionalComments || '',
                        serviceCenter: 'I Khodal Automotive Service Center',
                        serviceCenterAddress: '—',
                        serviceCenterPhone: '—',
                        technician: 'To be assigned',
                        technicianPhone: '—',
                        estimatedDuration: '—',
                        servicesIncluded: b.services ? b.services.map(s => s.serviceName) : [],
                        invoiceNumber: '—',
                        gstNumber: '—',
                        basePrice: b.totalAmount ? Math.round(Number(b.totalAmount) / 1.18) : 0,
                        gst: b.totalAmount ? Math.round(Number(b.totalAmount) - Number(b.totalAmount) / 1.18) : 0,
                        discount: 0,
                        totalPrice: Number(b.totalAmount) || 0
                    });
                }
            } catch (error) {
                console.error('Error fetching booking:', error);
            }
        };
        fetchBooking();
    }, [bookingId]);

    if (!booking) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading booking details...</p>
            </div>
        );
    }

    return (
        <div className="booking-details-container">
            {/* Top Navigation Bar */}
            <UserNavbar />

            {/* Main Content */}
            <div className="booking-details-main">
                {/* Back Button */}
                <button className="back-btn" onClick={() => navigate('/my-bookings')}>
                    <span className="back-icon"><Icons.ChevronLeft /></span>
                    Back to My Bookings
                </button>

                {/* Page Header */}
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
                            {booking.status === 'pending' ? <><Icons.Clock color="#f59e0b" /> Pending</> : <><Icons.Check color="#10b981" /> Completed</>}
                        </span>
                    </div>
                </div>

                {/* Main Details Grid */}
                <div className="details-grid">
                    {/* Left Column */}
                    <div className="details-left">
                        {/* Service Information Card */}
                        <div className="detail-card">
                            <div className="card-header">
                                <h2 className="card-title">
                                    <span className="card-icon"><Icons.Wrench /></span>
                                    Service Information
                                </h2>
                            </div>
                            <div className="card-body">
                                <div className="service-showcase">
                                    <div className="service-icon-xl">{booking.serviceIcon}</div>
                                    <div className="service-info-text">
                                        <h3 className="service-name-large">{booking.serviceName}</h3>
                                        <p className="service-duration"><Icons.Clock className="inline-icon" /> {booking.estimatedDuration}</p>
                                    </div>
                                </div>

                                <div className="info-divider"></div>

                                <div className="info-rows">
                                    <div className="info-row">
                                        <span className="info-label"><Icons.Calendar className="inline-icon" /> Service Date</span>
                                        <span className="info-value">
                                            {new Date(booking.serviceDate).toLocaleDateString('en-IN', {
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
                                    <div className="info-row">
                                        <span className="info-label"><Icons.Calendar className="inline-icon" /> Booked On</span>
                                        <span className="info-value">
                                            {new Date(booking.bookingDate).toLocaleDateString('en-IN', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric'
                                            })}
                                        </span>
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

                        {/* Vehicle Information Card */}
                        <div className="detail-card">
                            <div className="card-header">
                                <h2 className="card-title">
                                    <span className="card-icon"><Icons.Car /></span>
                                    Vehicle Information
                                </h2>
                            </div>
                            <div className="card-body">
                                <div className="info-rows">
                                    <div className="info-row">
                                        <span className="info-label"><Icons.Hash className="inline-icon" /> Vehicle Number</span>
                                        <span className="info-value highlight">{booking.vehicleNumber}</span>
                                    </div>
                                    <div className="info-row">
                                        <span className="info-label"><Icons.Factory className="inline-icon" /> Brand</span>
                                        <span className="info-value">{booking.vehicleBrand}</span>
                                    </div>
                                    <div className="info-row">
                                        <span className="info-label"><Icons.Car className="inline-icon" /> Model</span>
                                        <span className="info-value">{booking.vehicleModel}</span>
                                    </div>
                                    <div className="info-row">
                                        <span className="info-label"><Icons.Calendar className="inline-icon" /> Year</span>
                                        <span className="info-value">{booking.vehicleYear}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Customer Information Card */}
                        <div className="detail-card">
                            <div className="card-header">
                                <h2 className="card-title">
                                    <span className="card-icon"><Icons.User /></span>
                                    Customer Information
                                </h2>
                            </div>
                            <div className="card-body">
                                <div className="info-rows">
                                    <div className="info-row">
                                        <span className="info-label"><Icons.User className="inline-icon" /> Name</span>
                                        <span className="info-value">{booking.customerName}</span>
                                    </div>
                                    <div className="info-row">
                                        <span className="info-label"><Icons.Mail className="inline-icon" /> Email</span>
                                        <span className="info-value">{booking.customerEmail}</span>
                                    </div>
                                    <div className="info-row">
                                        <span className="info-label"><Icons.Phone className="inline-icon" /> Phone</span>
                                        <span className="info-value">{booking.customerPhone}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Service Location Card */}
                        <div className="detail-card">
                            <div className="card-header">
                                <h2 className="card-title">
                                    <span className="card-icon"><Icons.MapPin /></span>
                                    Service Location
                                </h2>
                            </div>
                            <div className="card-body">
                                <div className="info-rows">
                                    <div className="info-row">
                                        <span className="info-label"><Icons.Home className="inline-icon" /> Address</span>
                                        <span className="info-value">{booking.address}</span>
                                    </div>
                                    <div className="info-row">
                                        <span className="info-label"><Icons.Map className="inline-icon" /> Landmark</span>
                                        <span className="info-value">{booking.landmark}</span>
                                    </div>
                                    <div className="info-row">
                                        <span className="info-label"><Icons.Package className="inline-icon" /> Pincode</span>
                                        <span className="info-value">{booking.pincode}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Special Instructions Card */}
                        {booking.specialInstructions && (
                            <div className="detail-card">
                                <div className="card-header">
                                    <h2 className="card-title">
                                        <span className="card-icon"><Icons.Clipboard /></span>
                                        Special Instructions
                                    </h2>
                                </div>
                                <div className="card-body">
                                    <p className="instructions-text">{booking.specialInstructions}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column */}
                    <div className="details-right">
                        {/* Service Center Card - Sticky */}
                        <div className="sticky-wrapper">
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

                                    <div className="info-divider"></div>

                                    <div className="technician-info">
                                        <h4 className="tech-title"><Icons.User className="inline-icon" /> Assigned Technician</h4>
                                        <p className="tech-name">{booking.technician}</p>
                                        <p className="tech-phone">
                                            <span className="contact-icon"><Icons.Phone className="inline-icon" /></span>
                                            {booking.technicianPhone}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Scrollable Cards Container */}
                        <div className="scrollable-cards">
                            {/* Payment Summary Card - Sticky */}
                            <div className="sticky-wrapper">
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
                                                <span className="payment-label">Invoice Number</span>
                                                <span className="payment-value">{booking.invoiceNumber}</span>
                                            </div>
                                            <div className="payment-row">
                                                <span className="payment-label">Base Price</span>
                                                <span className="payment-value">${booking.basePrice.toLocaleString()}</span>
                                            </div>
                                            <div className="payment-row">
                                                <span className="payment-label">GST (18%)</span>
                                                <span className="payment-value">${booking.gst.toLocaleString()}</span>
                                            </div>
                                            {booking.discount > 0 && (
                                                <div className="payment-row discount">
                                                    <span className="payment-label">Discount</span>
                                                    <span className="payment-value">- ${booking.discount.toLocaleString()}</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="payment-total">
                                            <span className="total-label">Total Amount</span>
                                            <span className="total-value">${booking.totalPrice.toLocaleString()}</span>
                                        </div>

                                        <div className="payment-status-section">
                                            <div className="payment-status-badge paid">
                                                <span className="status-icon"><Icons.Check /></span>
                                                Payment {booking.paymentStatus}
                                            </div>
                                            <div className="payment-info-row">
                                                <span className="payment-info-label">Payment Method</span>
                                                <span className="payment-info-value">{booking.paymentMethod}</span>
                                            </div>
                                            <div className="payment-info-row">
                                                <span className="payment-info-label">Transaction ID</span>
                                                <span className="payment-info-value">{booking.transactionId}</span>
                                            </div>
                                        </div>
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
