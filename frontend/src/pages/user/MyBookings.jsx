import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import UserNavbar from '../../components/common/UserNavbar';
import './MyBookings.css';

const MyBookings = () => {
    const navigate = useNavigate();
    const location = useLocation();

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
        BarChart: ({ className = "", color = "#3b82f6" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="20" x2="12" y2="10" />
                <line x1="18" y1="20" x2="18" y2="4" />
                <line x1="6" y1="20" x2="6" y2="16" />
            </svg>
        ),
        Hourglass: ({ className = "", color = "#f59e0b" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 22h14" />
                <path d="M5 2h14" />
                <path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22" />
                <path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2" />
            </svg>
        ),
        CheckCircle: ({ className = "", color = "#10b981" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
        ),
        DollarSign: ({ className = "", color = "#8b5cf6" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="1" x2="12" y2="23" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
        ),
        FileText: ({ className = "", color = "#64748b" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
        ),
        Inbox: ({ className = "", color = "#94a3b8" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
                <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
            </svg>
        ),
        Calendar: ({ className = "", color = "#64748b" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
        ),
        Clock: ({ className = "", color = "#64748b" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
            </svg>
        ),
        Car: ({ className = "", color = "#64748b" }) => (
            <svg className={className} viewBox="0 0 24 24" fill={color}>
                <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
            </svg>
        ),
        Check: ({ className = "", color = "#10b981" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
            </svg>
        ),
        MapPin: ({ className = "", color = "#64748b" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
            </svg>
        ),
        File: ({ className = "", color = "#1e3a8a" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
            </svg>
        ),
        Refresh: ({ className = "", color = "#ffffff" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="23 4 23 10 17 10" />
                <polyline points="1 20 1 14 7 14" />
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
            </svg>
        ),
        Phone: ({ className = "", color = "#ffffff" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
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
        Bubbles: ({ className = "", color = "#06b6d4" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="8" cy="8" r="5" />
                <circle cx="17" cy="16" r="4" />
                <circle cx="6" cy="18" r="2" />
            </svg>
        ),
        Gear: ({ className = "", color = "#64748b" }) => (
            <svg className={className} viewBox="0 0 24 24" fill={color}>
                <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
            </svg>
        ),
        SparklesStar: ({ className = "", color = "#eab308" }) => (
            <svg className={className} viewBox="0 0 24 24" fill={color}>
                <path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8L12 2z" />
            </svg>
        ),
        Battery: ({ className = "", color = "#10b981" }) => (
            <svg className={className} viewBox="0 0 24 24" fill={color}>
                <path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4z" />
            </svg>
        ),
        User: ({ className = "", color = "#64748b" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
            </svg>
        )
    };

    // Track if we came from a specific page
    const cameFromPage = location.state?.from;
    const [activeTab, setActiveTab] = useState('all');
    const [visibleBookings, setVisibleBookings] = useState(new Set());
    const [initialLoadComplete, setInitialLoadComplete] = useState(false);
    const bookingRefs = useRef([]);

    // Mock user data
    const user = {
        name: 'Alis Desai',
        email: 'alis.desai@example.com',
        avatar: <Icons.User />
    };

    // Mock bookings data
    const bookings = [
        {
            id: 'BK001',
            serviceName: 'General Service',
            serviceIcon: <Icons.Wrench />,
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
            serviceIcon: <Icons.Snowflake />,
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
            serviceIcon: <Icons.Bubbles />,
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
            serviceIcon: <Icons.Gear />,
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
            serviceIcon: <Icons.SparklesStar />,
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
            serviceIcon: <Icons.Battery />,
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

    // Handle browser back button - always redirect to dashboard
    useEffect(() => {
        const handlePopState = (e) => {
            e.preventDefault();
            navigate('/dashboard', { replace: true });
        };

        // Add a history entry
        window.history.pushState(null, '', window.location.href);

        // Listen for back button
        window.addEventListener('popstate', handlePopState);

        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, [navigate]);

    return (
        <div className="mybookings-container">
            <UserNavbar />

            {/* Main Content */}
            <div className="mybookings-main">
                {/* Page Header */}
                <div className="page-header">
                    <div className="header-left">
                        <h1 className="page-title">
                            <span className="title-icon"><Icons.Clipboard /></span>
                            My Bookings
                        </h1>
                        {/* <p className="page-subtitle">Track and manage all your service appointments</p> */}
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="stats-row">
                    <div className="stat-box">
                        <div className="stat-icon-circle blue"><Icons.BarChart /></div>
                        <div className="stat-details">
                            <div className="stat-value">{stats.total}</div>
                            <div className="stat-label">Total Bookings</div>
                        </div>
                    </div>

                    <div className="stat-box">
                        <div className="stat-icon-circle orange"><Icons.Hourglass /></div>
                        <div className="stat-details">
                            <div className="stat-value">{stats.pending}</div>
                            <div className="stat-label">Pending Services</div>
                        </div>
                    </div>

                    <div className="stat-box">
                        <div className="stat-icon-circle green"><Icons.CheckCircle /></div>
                        <div className="stat-details">
                            <div className="stat-value">{stats.completed}</div>
                            <div className="stat-label">Completed</div>
                        </div>
                    </div>

                    <div className="stat-box">
                        <div className="stat-icon-circle purple"><Icons.DollarSign /></div>
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
                        <span className="tab-icon"><Icons.FileText /></span>
                        All Bookings
                        <span className="tab-count">{stats.total}</span>
                    </button>

                    <button
                        className={`filter-tab ${activeTab === 'pending' ? 'active' : ''}`}
                        onClick={() => setActiveTab('pending')}
                    >
                        <span className="tab-icon"><Icons.Hourglass /></span>
                        Pending
                        <span className="tab-count">{stats.pending}</span>
                    </button>

                    <button
                        className={`filter-tab ${activeTab === 'completed' ? 'active' : ''}`}
                        onClick={() => setActiveTab('completed')}
                    >
                        <span className="tab-icon"><Icons.CheckCircle /></span>
                        Completed
                        <span className="tab-count">{stats.completed}</span>
                    </button>
                </div>

                {/* Bookings List */}
                <div className="bookings-list">
                    {filteredBookings.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon"><Icons.Inbox /></div>
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
                                            {booking.status === 'pending' ? <><Icons.Hourglass color="#92400e" /> Pending</> : <><Icons.CheckCircle color="#065f46" /> Completed</>}
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
                                                    <span className="meta-icon"><Icons.Calendar /></span>
                                                    <span className="meta-text">{new Date(booking.serviceDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                                </div>
                                                <div className="meta-item">
                                                    <span className="meta-icon"><Icons.Clock /></span>
                                                    <span className="meta-text">{booking.timeSlot}</span>
                                                </div>
                                                <div className="meta-item">
                                                    <span className="meta-icon"><Icons.Car /></span>
                                                    <span className="meta-text">{booking.vehicleNumber}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="price-section">
                                        <div className="price-label">Total Amount</div>
                                        <div className="price-value">${booking.price.toLocaleString()}</div>
                                        <div className="payment-status paid">
                                            <span className="payment-icon"><Icons.Check /></span>
                                            Paid
                                        </div>
                                    </div>
                                </div>

                                <div className="booking-footer">
                                    <div className="address-info">
                                        <span className="address-icon"><Icons.MapPin /></span>
                                        <span className="address-text">{booking.address}</span>
                                    </div>
                                    <div className="booking-actions">
                                        <button
                                            className="action-btn secondary"
                                            onClick={() => navigate(`/booking-details/${booking.id}`, { state: { from: '/my-bookings' } })}
                                        >
                                            <span className="action-btn-icon"><Icons.File /></span>
                                            View Details
                                        </button>
                                        {booking.status === 'completed' && (
                                            <button className="action-btn primary">
                                                <span className="action-btn-icon"><Icons.Refresh /></span>
                                                Book Again
                                            </button>
                                        )}
                                        {booking.status === 'pending' && (
                                            <button className="action-btn primary">
                                                <span className="action-btn-icon"><Icons.Phone /></span>
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
