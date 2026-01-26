import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import UserNavbar from '../../components/common/UserNavbar';
import './MyBookings.css';

const MyBookings = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('all');
    const [visibleBookings, setVisibleBookings] = useState(new Set());
    const [initialLoadComplete, setInitialLoadComplete] = useState(false);
    const bookingRefs = useRef([]);

    // Mock user data
    const user = {
        name: 'Alis Desai',
        email: 'alis.desai@example.com',
        avatar: '👤'
    };

    // Mock bookings data
    const bookings = [
        {
            id: 'BK001',
            serviceName: 'General Service',
            serviceIcon: '🔧',
            price: 2499,
            bookingDate: '2024-01-20',
            serviceDate: '2024-01-25',
            timeSlot: '10:00 AM - 12:00 PM',
            status: 'completed',
            paymentStatus: 'paid',
            vehicleNumber: 'GJ-01-AB-1234',
            address: '123 Main Street, Surat'
        },
        {
            id: 'BK002',
            serviceName: 'AC Service',
            serviceIcon: '❄️',
            price: 1799,
            bookingDate: '2024-01-22',
            serviceDate: '2024-01-28',
            timeSlot: '02:00 PM - 04:00 PM',
            status: 'pending',
            paymentStatus: 'paid',
            vehicleNumber: 'GJ-01-AB-1234',
            address: '123 Main Street, Surat'
        },
        {
            id: 'BK003',
            serviceName: 'Car Spa',
            serviceIcon: '🧼',
            price: 799,
            bookingDate: '2024-01-18',
            serviceDate: '2024-01-22',
            timeSlot: '11:00 AM - 01:00 PM',
            status: 'completed',
            paymentStatus: 'paid',
            vehicleNumber: 'GJ-01-AB-1234',
            address: '123 Main Street, Surat'
        },
        {
            id: 'BK004',
            serviceName: 'Tyres & Wheels',
            serviceIcon: '⚙️',
            price: 1199,
            bookingDate: '2024-01-24',
            serviceDate: '2024-01-30',
            timeSlot: '03:00 PM - 05:00 PM',
            status: 'pending',
            paymentStatus: 'paid',
            vehicleNumber: 'GJ-01-AB-1234',
            address: '123 Main Street, Surat'
        },
        {
            id: 'BK005',
            serviceName: 'Car Detailing',
            serviceIcon: '✨',
            price: 1999,
            bookingDate: '2024-01-15',
            serviceDate: '2024-01-19',
            timeSlot: '09:00 AM - 12:00 PM',
            status: 'completed',
            paymentStatus: 'paid',
            vehicleNumber: 'GJ-01-AB-1234',
            address: '123 Main Street, Surat'
        },
        {
            id: 'BK006',
            serviceName: 'Battery Service',
            serviceIcon: '🔋',
            price: 3499,
            bookingDate: '2024-01-26',
            serviceDate: '2024-02-02',
            timeSlot: '10:30 AM - 11:30 AM',
            status: 'pending',
            paymentStatus: 'paid',
            vehicleNumber: 'GJ-01-AB-1234',
            address: '123 Main Street, Surat'
        }
    ];

    /* ==========================================
       DELAYED INITIAL LOAD
       ========================================== */
    useEffect(() => {
        const timer = setTimeout(() => {
            setInitialLoadComplete(true);
        }, 100);

        return () => clearTimeout(timer);
    }, []);

    /* ==========================================
       INTERSECTION OBSERVER - SMOOTH ANIMATIONS
       ========================================== */
    useEffect(() => {
        if (!initialLoadComplete) return;

        const observerOptions = {
            root: null,
            rootMargin: '-50px 0px -100px 0px',
            threshold: [0, 0.05, 0.1]
        };

        const observerCallback = (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting && entry.intersectionRatio >= 0.05) {
                    const bookingId = entry.target.dataset.bookingId;
                    setTimeout(() => {
                        setVisibleBookings(prev => new Set([...prev, bookingId]));
                    }, 100);
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);

        bookingRefs.current.forEach(ref => {
            if (ref) {
                observer.observe(ref);
            }
        });

        return () => {
            bookingRefs.current.forEach(ref => {
                if (ref) {
                    observer.unobserve(ref);
                }
            });
        };
    }, [initialLoadComplete, activeTab]);

    // Filter bookings based on active tab
    const filteredBookings = activeTab === 'all'
        ? bookings
        : bookings.filter(booking => booking.status === activeTab);

    // Calculate statistics
    const stats = {
        total: bookings.length,
        pending: bookings.filter(b => b.status === 'pending').length,
        completed: bookings.filter(b => b.status === 'completed').length,
        totalSpent: bookings.reduce((sum, b) => sum + b.price, 0)
    };

    return (
        <div className="mybookings-container">
            <UserNavbar />

            {/* Main Content */}
            <div className="mybookings-main">
                {/* Page Header */}
                <div className="page-header">
                    <div className="header-left">
                        <h1 className="page-title">
                            <span className="title-icon">📋</span>
                            My Bookings
                        </h1>
                        {/* <p className="page-subtitle">Track and manage all your service appointments</p> */}
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="stats-row">
                    <div className="stat-box">
                        <div className="stat-icon-circle blue">📊</div>
                        <div className="stat-details">
                            <div className="stat-value">{stats.total}</div>
                            <div className="stat-label">Total Bookings</div>
                        </div>
                    </div>

                    <div className="stat-box">
                        <div className="stat-icon-circle orange">⏳</div>
                        <div className="stat-details">
                            <div className="stat-value">{stats.pending}</div>
                            <div className="stat-label">Pending Services</div>
                        </div>
                    </div>

                    <div className="stat-box">
                        <div className="stat-icon-circle green">✅</div>
                        <div className="stat-details">
                            <div className="stat-value">{stats.completed}</div>
                            <div className="stat-label">Completed</div>
                        </div>
                    </div>

                    <div className="stat-box">
                        <div className="stat-icon-circle purple">💰</div>
                        <div className="stat-details">
                            <div className="stat-value">${stats.totalSpent.toLocaleString()}</div>
                            <div className="stat-label">Total Spent</div>
                        </div>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="filter-tabs">
                    <button
                        className={`filter-tab ${activeTab === 'all' ? 'active' : ''}`}
                        onClick={() => setActiveTab('all')}
                    >
                        <span className="tab-icon">📑</span>
                        All Bookings
                        <span className="tab-count">{stats.total}</span>
                    </button>

                    <button
                        className={`filter-tab ${activeTab === 'pending' ? 'active' : ''}`}
                        onClick={() => setActiveTab('pending')}
                    >
                        <span className="tab-icon">⏳</span>
                        Pending
                        <span className="tab-count">{stats.pending}</span>
                    </button>

                    <button
                        className={`filter-tab ${activeTab === 'completed' ? 'active' : ''}`}
                        onClick={() => setActiveTab('completed')}
                    >
                        <span className="tab-icon">✅</span>
                        Completed
                        <span className="tab-count">{stats.completed}</span>
                    </button>
                </div>

                {/* Bookings List */}
                <div className="bookings-list">
                    {filteredBookings.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">📭</div>
                            <h3>No Bookings Found</h3>
                            <p>You don't have any {activeTab !== 'all' ? activeTab : ''} bookings yet.</p>
                            <button className="empty-action-btn">Browse Services</button>
                        </div>
                    ) : (
                        filteredBookings.map((booking, index) => (
                            <div
                                key={booking.id}
                                ref={el => bookingRefs.current[index] = el}
                                data-booking-id={booking.id}
                                className={`booking-card ${visibleBookings.has(booking.id) ? 'visible' : ''}`}
                                style={{
                                    animationDelay: visibleBookings.has(booking.id) ? `${index * 0.1}s` : '0s'
                                }}
                            >
                                <div className="booking-header">
                                    <div className="booking-id-section">
                                        <span className="booking-id">#{booking.id}</span>
                                        <span className={`status-badge ${booking.status}`}>
                                            {booking.status === 'pending' ? '⏳ Pending' : '✅ Completed'}
                                        </span>
                                    </div>
                                    <div className="booking-date">
                                        <span className="date-label">Booked on:</span>
                                        <span className="date-value">{new Date(booking.bookingDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                    </div>
                                </div>

                                <div className="booking-body">
                                    <div className="service-info">
                                        <div className="service-icon-large">{booking.serviceIcon}</div>
                                        <div className="service-details">
                                            <h3 className="service-name">{booking.serviceName}</h3>
                                            <div className="service-meta">
                                                <div className="meta-item">
                                                    <span className="meta-icon">📅</span>
                                                    <span className="meta-text">{new Date(booking.serviceDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                                </div>
                                                <div className="meta-item">
                                                    <span className="meta-icon">⏰</span>
                                                    <span className="meta-text">{booking.timeSlot}</span>
                                                </div>
                                                <div className="meta-item">
                                                    <span className="meta-icon">🚗</span>
                                                    <span className="meta-text">{booking.vehicleNumber}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="price-section">
                                        <div className="price-label">Total Amount</div>
                                        <div className="price-value">${booking.price.toLocaleString()}</div>
                                        <div className="payment-status paid">
                                            <span className="payment-icon">✓</span>
                                            Paid
                                        </div>
                                    </div>
                                </div>

                                <div className="booking-footer">
                                    <div className="address-info">
                                        <span className="address-icon">📍</span>
                                        <span className="address-text">{booking.address}</span>
                                    </div>
                                    <div className="booking-actions">
                                        <button
                                            className="action-btn secondary"
                                            onClick={() => navigate(`/booking-details/${booking.id}`)}
                                        >
                                            <span>📄</span>
                                            View Details
                                        </button>
                                        {booking.status === 'completed' && (
                                            <button className="action-btn primary">
                                                <span>🔄</span>
                                                Book Again
                                            </button>
                                        )}
                                        {booking.status === 'pending' && (
                                            <button className="action-btn primary">
                                                <span>📞</span>
                                                Contact Support
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyBookings;
