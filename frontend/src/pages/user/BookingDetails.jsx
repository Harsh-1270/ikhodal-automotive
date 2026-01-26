import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import UserNavbar from '../../components/common/UserNavbar';
import './BookingDetails.css';

const BookingDetails = () => {
    const { bookingId } = useParams();
    const navigate = useNavigate();
    const [booking, setBooking] = useState(null);

    // Mock user data
    const user = {
        name: 'Alis Desai',
        email: 'alis.desai@example.com',
        avatar: '👤'
    };

    // Mock booking data (in real app, fetch based on bookingId)
    const mockBookings = {
        'BK001': {
            id: 'BK001',
            serviceName: 'General Service',
            serviceIcon: '🔧',
            price: 2499,
            bookingDate: '2024-01-20',
            serviceDate: '2024-01-25',
            timeSlot: '10:00 AM - 12:00 PM',
            status: 'completed',
            paymentStatus: 'paid',
            paymentMethod: 'UPI',
            transactionId: 'TXN123456789',
            vehicleNumber: 'GJ-01-AB-1234',
            vehicleBrand: 'Maruti Suzuki',
            vehicleModel: 'Swift VXI',
            vehicleYear: '2020',
            address: '123 Main Street, Surat',
            landmark: 'Near City Mall',
            pincode: '395007',
            customerName: 'Alis Desai',
            customerEmail: 'alis.desai@example.com',
            customerPhone: '+91 98765 43210',
            specialInstructions: 'Please check the AC cooling and brake pads thoroughly.',
            serviceCenter: 'I Khodal Automotive Service Center - Surat Branch',
            serviceCenterAddress: '456 Ring Road, Surat - 395001',
            serviceCenterPhone: '+91 98765 00000',
            technician: 'Ramesh Kumar',
            technicianPhone: '+91 98765 11111',
            estimatedDuration: '2-3 hours',
            servicesIncluded: [
                'Engine Oil Change',
                'Oil Filter Replacement',
                'Air Filter Cleaning',
                'Brake Inspection',
                'Battery Check',
                'Tire Pressure Check',
                'General Checkup'
            ],
            invoiceNumber: 'INV-2024-001',
            gstNumber: 'GST123456789',
            basePrice: 2118,
            gst: 381,
            discount: 0,
            totalPrice: 2499
        },
        'BK002': {
            id: 'BK002',
            serviceName: 'AC Service',
            serviceIcon: '❄️',
            price: 1799,
            bookingDate: '2024-01-22',
            serviceDate: '2024-01-28',
            timeSlot: '02:00 PM - 04:00 PM',
            status: 'pending',
            paymentStatus: 'paid',
            paymentMethod: 'Credit Card',
            transactionId: 'TXN987654321',
            vehicleNumber: 'GJ-01-AB-1234',
            vehicleBrand: 'Maruti Suzuki',
            vehicleModel: 'Swift VXI',
            vehicleYear: '2020',
            address: '123 Main Street, Surat',
            landmark: 'Near City Mall',
            pincode: '395007',
            customerName: 'Alis Desai',
            customerEmail: 'alis.desai@example.com',
            customerPhone: '+91 98765 43210',
            specialInstructions: 'AC is not cooling properly. Need gas refill.',
            serviceCenter: 'I Khodal Automotive Service Center - Surat Branch',
            serviceCenterAddress: '456 Ring Road, Surat - 395001',
            serviceCenterPhone: '+91 98765 00000',
            technician: 'To be assigned',
            technicianPhone: '-',
            estimatedDuration: '1-2 hours',
            servicesIncluded: [
                'AC Gas Refill',
                'AC Filter Cleaning',
                'Cooling Check',
                'Blower Motor Inspection',
                'Temperature Sensor Check'
            ],
            invoiceNumber: 'INV-2024-002',
            gstNumber: 'GST123456789',
            basePrice: 1524,
            gst: 275,
            discount: 0,
            totalPrice: 1799
        }
    };

    useEffect(() => {
        // Simulate API call to fetch booking details
        const fetchedBooking = mockBookings[bookingId];
        if (fetchedBooking) {
            setBooking(fetchedBooking);
        }
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
                    <span className="back-icon">←</span>
                    Back to My Bookings
                </button>

                {/* Page Header */}
                <div className="details-header">
                    <div className="header-left">
                        <h1 className="details-title">
                            <span className="title-icon">📋</span>
                            Booking Details
                        </h1>
                        <p className="booking-ref">Reference: #{booking.id}</p>
                    </div>
                    <div className="header-right">
                        <span className={`status-badge-large ${booking.status}`}>
                            {booking.status === 'pending' ? '⏳ Pending' : '✅ Completed'}
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
                                    <span className="card-icon">🔧</span>
                                    Service Information
                                </h2>
                            </div>
                            <div className="card-body">
                                <div className="service-showcase">
                                    <div className="service-icon-xl">{booking.serviceIcon}</div>
                                    <div className="service-info-text">
                                        <h3 className="service-name-large">{booking.serviceName}</h3>
                                        <p className="service-duration">⏱️ {booking.estimatedDuration}</p>
                                    </div>
                                </div>

                                <div className="info-divider"></div>

                                <div className="info-rows">
                                    <div className="info-row">
                                        <span className="info-label">📅 Service Date</span>
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
                                        <span className="info-label">🕐 Time Slot</span>
                                        <span className="info-value">{booking.timeSlot}</span>
                                    </div>
                                    <div className="info-row">
                                        <span className="info-label">📆 Booked On</span>
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
                                    <h4 className="included-title">✨ Services Included</h4>
                                    <ul className="included-list">
                                        {booking.servicesIncluded.map((service, index) => (
                                            <li key={index} className="included-item">
                                                <span className="check-icon">✓</span>
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
                                    <span className="card-icon">🚗</span>
                                    Vehicle Information
                                </h2>
                            </div>
                            <div className="card-body">
                                <div className="info-rows">
                                    <div className="info-row">
                                        <span className="info-label">🔢 Vehicle Number</span>
                                        <span className="info-value highlight">{booking.vehicleNumber}</span>
                                    </div>
                                    <div className="info-row">
                                        <span className="info-label">🏭 Brand</span>
                                        <span className="info-value">{booking.vehicleBrand}</span>
                                    </div>
                                    <div className="info-row">
                                        <span className="info-label">🚙 Model</span>
                                        <span className="info-value">{booking.vehicleModel}</span>
                                    </div>
                                    <div className="info-row">
                                        <span className="info-label">📅 Year</span>
                                        <span className="info-value">{booking.vehicleYear}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Customer Information Card */}
                        <div className="detail-card">
                            <div className="card-header">
                                <h2 className="card-title">
                                    <span className="card-icon">👤</span>
                                    Customer Information
                                </h2>
                            </div>
                            <div className="card-body">
                                <div className="info-rows">
                                    <div className="info-row">
                                        <span className="info-label">👨 Name</span>
                                        <span className="info-value">{booking.customerName}</span>
                                    </div>
                                    <div className="info-row">
                                        <span className="info-label">📧 Email</span>
                                        <span className="info-value">{booking.customerEmail}</span>
                                    </div>
                                    <div className="info-row">
                                        <span className="info-label">📱 Phone</span>
                                        <span className="info-value">{booking.customerPhone}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Service Location Card */}
                        <div className="detail-card">
                            <div className="card-header">
                                <h2 className="card-title">
                                    <span className="card-icon">📍</span>
                                    Service Location
                                </h2>
                            </div>
                            <div className="card-body">
                                <div className="info-rows">
                                    <div className="info-row">
                                        <span className="info-label">🏠 Address</span>
                                        <span className="info-value">{booking.address}</span>
                                    </div>
                                    <div className="info-row">
                                        <span className="info-label">🗺️ Landmark</span>
                                        <span className="info-value">{booking.landmark}</span>
                                    </div>
                                    <div className="info-row">
                                        <span className="info-label">📮 Pincode</span>
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
                                        <span className="card-icon">📝</span>
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
                                        <span className="card-icon">🏢</span>
                                        Service Center
                                    </h2>
                                </div>
                                <div className="card-body">
                                    <div className="center-info">
                                        <h3 className="center-name">{booking.serviceCenter}</h3>
                                        <p className="center-address">{booking.serviceCenterAddress}</p>
                                        <div className="center-contact">
                                            <span className="contact-icon">📞</span>
                                            <span className="contact-text">{booking.serviceCenterPhone}</span>
                                        </div>
                                    </div>

                                    <div className="info-divider"></div>

                                    <div className="technician-info">
                                        <h4 className="tech-title">👨‍🔧 Assigned Technician</h4>
                                        <p className="tech-name">{booking.technician}</p>
                                        <p className="tech-phone">
                                            <span className="contact-icon">📱</span>
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
                                            <span className="card-icon">💰</span>
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
                                                <span className="status-icon">✓</span>
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
