/* ============================================
   ADMIN DASHBOARD - BOOKINGS MANAGEMENT
   ============================================ */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from '../../components/common/AdminNavbar';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [activeFilter, setActiveFilter] = useState('all');
    const [bookings, setBookings] = useState([]);
    const [filteredBookings, setFilteredBookings] = useState([]);
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        completed: 0,
        // cancelled: 0
    });

    /* ==========================================
       SVG ICONS COMPONENT - COLORFUL GRADIENTS
       ========================================== */
    const Icons = {
        BarChart: ({ className = "" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="url(#adBarChartGrad)">
                <defs>
                    <linearGradient id="adBarChartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                </defs>
                <path d="M3 3v18h18M9 17V10m4 7V7m4 10v-4" stroke="url(#adBarChartGrad)" strokeWidth="2" fill="none" strokeLinecap="round" />
                <path d="M7 17h2v-7H7v7zm4 0h2V7h-2v10zm4 0h2v-4h-2v4z" />
            </svg>
        ),
        Clipboard: ({ className = "" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="url(#adClipboardGrad)">
                <defs>
                    <linearGradient id="adClipboardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                </defs>
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                <rect x="8" y="2" width="8" height="4" rx="1" />
            </svg>
        ),
        Hourglass: ({ className = "" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="url(#adHourglassGrad)">
                <defs>
                    <linearGradient id="adHourglassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#f59e0b" />
                        <stop offset="100%" stopColor="#ef4444" />
                    </linearGradient>
                </defs>
                <path d="M6 2h12v4l-6 6 6 6v4H6v-4l6-6-6-6V2z" />
            </svg>
        ),
        CheckCircle: ({ className = "" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="url(#adCheckCircleGrad)">
                <defs>
                    <linearGradient id="adCheckCircleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#059669" />
                    </linearGradient>
                </defs>
                <circle cx="12" cy="12" r="10" />
                <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" />
            </svg>
        ),
        XCircle: ({ className = "" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="url(#adXCircleGrad)">
                <defs>
                    <linearGradient id="adXCircleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#ef4444" />
                        <stop offset="100%" stopColor="#dc2626" />
                    </linearGradient>
                </defs>
                <circle cx="12" cy="12" r="10" />
                <path d="M15 9l-6 6M9 9l6 6" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
        ),
        Ticket: ({ className = "" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="url(#adTicketGrad)">
                <defs>
                    <linearGradient id="adTicketGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#ec4899" />
                        <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                </defs>
                <path d="M2 9a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v1.5a1.5 1.5 0 0 1 0 3V15a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-1.5a1.5 1.5 0 0 1 0-3V9z" />
            </svg>
        ),
        User: ({ className = "" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="url(#adUserGrad)">
                <defs>
                    <linearGradient id="adUserGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                </defs>
                <circle cx="12" cy="8" r="4" />
                <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" fill="none" stroke="url(#adUserGrad)" strokeWidth="2" />
            </svg>
        ),
        Mail: ({ className = "" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="url(#adMailGrad)">
                <defs>
                    <linearGradient id="adMailGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                </defs>
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <path d="M22 6l-10 7L2 6" stroke="white" strokeWidth="2" fill="none" />
            </svg>
        ),
        Phone: ({ className = "" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="url(#adPhoneGrad)">
                <defs>
                    <linearGradient id="adPhoneGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#059669" />
                    </linearGradient>
                </defs>
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
        ),
        Calendar: ({ className = "" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="url(#adCalendarGrad)">
                <defs>
                    <linearGradient id="adCalendarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#6366f1" />
                    </linearGradient>
                </defs>
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <path d="M16 2v4M8 2v4M3 10h18" stroke="white" strokeWidth="2" fill="none" />
            </svg>
        ),
        Clock: ({ className = "" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="url(#adClockGrad)">
                <defs>
                    <linearGradient id="adClockGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#f59e0b" />
                        <stop offset="100%" stopColor="#ef4444" />
                    </linearGradient>
                </defs>
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" />
            </svg>
        ),
        MapPin: ({ className = "" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="url(#adMapPinGrad)">
                <defs>
                    <linearGradient id="adMapPinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#ef4444" />
                        <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                </defs>
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" fill="white" />
            </svg>
        ),
        Eye: ({ className = "" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke="url(#adEyeGrad)" strokeWidth="2">
                <defs>
                    <linearGradient id="adEyeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#06b6d4" />
                        <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                </defs>
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
            </svg>
        ),
        Trash: ({ className = "" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke="url(#adTrashGrad)" strokeWidth="2">
                <defs>
                    <linearGradient id="adTrashGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#ef4444" />
                        <stop offset="100%" stopColor="#dc2626" />
                    </linearGradient>
                </defs>
                <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6" strokeLinecap="round" />
            </svg>
        ),
        Inbox: ({ className = "" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="url(#adInboxGrad)">
                <defs>
                    <linearGradient id="adInboxGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#9ca3af" />
                        <stop offset="100%" stopColor="#6b7280" />
                    </linearGradient>
                </defs>
                <path d="M22 12h-6l-2 3h-4l-2-3H2" fill="none" stroke="url(#adInboxGrad)" strokeWidth="2" />
                <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
            </svg>
        ),
        Check: ({ className = "" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke="url(#adCheckGrad)" strokeWidth="3">
                <defs>
                    <linearGradient id="adCheckGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#059669" />
                    </linearGradient>
                </defs>
                <polyline points="20 6 9 17 4 12" />
            </svg>
        )
    };

    /* ==========================================
       MOCK BOOKINGS DATA (ALL USERS)
       ========================================== */
    const mockBookings = [
        {
            id: 'BK-2026-001',
            userName: 'Alis Desai',
            userEmail: 'alis.desai@example.com',
            userPhone: '+91 98765 43210',
            serviceName: '🔵 Complete Care Service',
            serviceIcon: '🔧',
            date: '2026-02-05',
            time: '10:00 AM',
            address: '123 Main Street, Ankleshwar, Gujarat',
            price: 3999,
            status: 'pending',
            paymentStatus: 'paid',
            bookingDate: '2026-01-28'
        },
        {
            id: 'BK-2026-002',
            userName: 'Raj Patel',
            userEmail: 'raj.patel@example.com',
            userPhone: '+91 98765 43211',
            serviceName: '🔴 Premium Care Service',
            serviceIcon: '⭐',
            date: '2026-02-03',
            time: '02:00 PM',
            address: '456 Park Avenue, Bharuch, Gujarat',
            price: 5999,
            status: 'completed',
            paymentStatus: 'paid',
            bookingDate: '2026-01-25'
        },
        {
            id: 'BK-2026-003',
            userName: 'Priya Shah',
            userEmail: 'priya.shah@example.com',
            userPhone: '+91 98765 43212',
            serviceName: '🚗 Mobile Call-Out Mechanic',
            serviceIcon: '🔧',
            date: '2026-02-08',
            time: '11:30 AM',
            address: '789 Lake View, Surat, Gujarat',
            price: 1999,
            status: 'pending',
            paymentStatus: 'paid',
            bookingDate: '2026-01-27'
        },
        {
            id: 'BK-2026-004',
            userName: 'Amit Kumar',
            userEmail: 'amit.kumar@example.com',
            userPhone: '+91 98765 43213',
            serviceName: '🚘 Brake Repairs & Replacement',
            serviceIcon: '🛑',
            date: '2026-01-30',
            time: '09:00 AM',
            address: '321 Garden Road, Vadodara, Gujarat',
            price: 4500,
            status: 'completed',
            paymentStatus: 'paid',
            bookingDate: '2026-01-20'
        },
        {
            id: 'BK-2026-005',
            userName: 'Neha Mehta',
            userEmail: 'neha.mehta@example.com',
            userPhone: '+91 98765 43214',
            serviceName: '🔋 Battery Testing & Replacement',
            serviceIcon: '🔋',
            date: '2026-02-10',
            time: '03:00 PM',
            address: '555 Hill Station, Ahmedabad, Gujarat',
            price: 2500,
            status: 'pending',
            paymentStatus: 'paid',
            bookingDate: '2026-01-28'
        },
        {
            id: 'BK-2026-006',
            userName: 'Vikram Singh',
            userEmail: 'vikram.singh@example.com',
            userPhone: '+91 98765 43215',
            serviceName: '🔍 Vehicle Diagnostics',
            serviceIcon: '🔍',
            date: '2026-02-01',
            time: '10:30 AM',
            address: '777 Market Street, Rajkot, Gujarat',
            price: 1500,
            status: 'completed',
            paymentStatus: 'paid',
            bookingDate: '2026-01-22'
        },
        {
            id: 'BK-2026-007',
            userName: 'Kavita Joshi',
            userEmail: 'kavita.joshi@example.com',
            userPhone: '+91 98765 43216',
            serviceName: '🎥 Dash Cam Installation',
            serviceIcon: '📹',
            date: '2026-02-12',
            time: '01:00 PM',
            address: '999 River Side, Gandhinagar, Gujarat',
            price: 3500,
            status: 'pending',
            paymentStatus: 'paid',
            bookingDate: '2026-01-28'
        },
        {
            id: 'BK-2026-008',
            userName: 'Rohit Sharma',
            userEmail: 'rohit.sharma@example.com',
            userPhone: '+91 98765 43217',
            serviceName: '❄️ Air Conditioning Inspection',
            serviceIcon: '❄️',
            date: '2026-02-06',
            time: '11:00 AM',
            address: '111 Beach Road, Bhavnagar, Gujarat',
            price: 2000,
            status: 'completed',
            paymentStatus: 'paid',
            bookingDate: '2026-01-26'
        },
        {
            id: 'BK-2026-009',
            userName: 'Anjali Patel',
            userEmail: 'anjali.patel@example.com',
            userPhone: '+91 98765 43218',
            serviceName: '🟢 Essential Care Service',
            serviceIcon: '🔧',
            date: '2026-02-15',
            time: '09:30 AM',
            address: '222 Temple Street, Jamnagar, Gujarat',
            price: 2499,
            status: 'pending',
            paymentStatus: 'paid',
            bookingDate: '2026-01-28'
        },
        {
            id: 'BK-2026-010',
            userName: 'Karan Desai',
            userEmail: 'karan.desai@example.com',
            userPhone: '+91 98765 43219',
            serviceName: '🚙 Pre-Purchase Vehicle Inspection',
            serviceIcon: '🔍',
            date: '2026-02-04',
            time: '04:00 PM',
            address: '333 Shopping Complex, Navsari, Gujarat',
            price: 1800,
            status: 'completed',
            paymentStatus: 'paid',
            bookingDate: '2026-01-24'
        }
    ];

    /* ==========================================
       LOAD BOOKINGS ON MOUNT
       ========================================== */
    useEffect(() => {
        setBookings(mockBookings);
        calculateStats(mockBookings);
        setFilteredBookings(mockBookings);

        // Animate cards on load
        setTimeout(() => {
            document.querySelectorAll('.booking-card').forEach((card, index) => {
                setTimeout(() => {
                    card.classList.add('visible');
                }, index * 100);
            });
        }, 100);
    }, []);

    /* ==========================================
       CALCULATE STATISTICS
       ========================================== */
    const calculateStats = (data) => {
        setStats({
            total: data.length,
            pending: data.filter(b => b.status === 'pending').length,
            completed: data.filter(b => b.status === 'completed').length,
            // cancelled: data.filter(b => b.status === 'cancelled').length
        });
    };

    /* ==========================================
   FILTER BOOKINGS
   ========================================== */
    useEffect(() => {
        // Remove visible class from all cards first
        document.querySelectorAll('.booking-card').forEach((card) => {
            card.classList.remove('visible');
        });

        // Filter bookings
        if (activeFilter === 'all') {
            setFilteredBookings(bookings);
        } else {
            setFilteredBookings(bookings.filter(b => b.status === activeFilter));
        }

        // Re-animate cards after filter change
        setTimeout(() => {
            document.querySelectorAll('.booking-card').forEach((card, index) => {
                setTimeout(() => {
                    card.classList.add('visible');
                }, index * 100);
            });
        }, 50);
    }, [activeFilter, bookings]);

    /* ==========================================
       HANDLE DELETE BOOKING
       ========================================== */
    const handleDeleteBooking = (bookingId) => {
        const confirmDelete = window.confirm(
            `Are you sure you want to delete booking ${bookingId}?\n\nThis action cannot be undone.`
        );

        if (confirmDelete) {
            const updatedBookings = bookings.filter(b => b.id !== bookingId);
            setBookings(updatedBookings);
            calculateStats(updatedBookings);

            // Show success message (you can replace this with a toast notification)
            alert(`✅ Booking ${bookingId} has been deleted successfully!`);
        }
    };

    /* ==========================================
       FORMAT DATE
       ========================================== */
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    /* ==========================================
       RENDER COMPONENT
       ========================================== */
    return (
        <div className="admin-dashboard-container">
            {/* Common Navbar */}
            <AdminNavbar />

            {/* Main Content */}
            <div className="admin-dashboard-main">
                {/* Page Header */}
                <div className="page-header">
                    <div className="header-left">
                        <h1 className="page-title">
                            <span className="title-icon">
                                <Icons.BarChart />
                            </span>
                            Admin Dashboard
                        </h1>
                        {/* <p className="page-subtitle">Manage all customer bookings</p> */}
                    </div>
                </div>

                {/* Statistics Row */}
                <div className="stats-row">
                    <div className="stat-box blue">
                        <div className="stat-icon-circle blue">
                            <span><Icons.Clipboard /></span>
                        </div>
                        <div className="stat-details">
                            <div className="stat-value">{stats.total}</div>
                            <div className="stat-label">Total Bookings</div>
                        </div>
                    </div>

                    <div className="stat-box orange">
                        <div className="stat-icon-circle orange">
                            <span><Icons.Hourglass /></span>
                        </div>
                        <div className="stat-details">
                            <div className="stat-value">{stats.pending}</div>
                            <div className="stat-label">Pending</div>
                        </div>
                    </div>

                    <div className="stat-box green">
                        <div className="stat-icon-circle green">
                            <span><Icons.CheckCircle /></span>
                        </div>
                        <div className="stat-details">
                            <div className="stat-value">{stats.completed}</div>
                            <div className="stat-label">Completed</div>
                        </div>
                    </div>
                    {/*
                    <div className="stat-box red">
                        <div className="stat-icon-circle red">
                            <span>❌</span>
                        </div>
                        <div className="stat-details">
                            <div className="stat-value">{stats.cancelled}</div>
                            <div className="stat-label">Cancelled</div>
                        </div>
                    </div> */}
                </div>

                {/* Filter Tabs */}
                <div className="filter-tabs">
                    <button
                        className={`filter-tab ${activeFilter === 'all' ? 'active' : ''}`}
                        onClick={() => setActiveFilter('all')}
                    >
                        <span className="tab-icon"><Icons.Clipboard /></span>
                        All Bookings
                        <span className="tab-count">{stats.total}</span>
                    </button>

                    <button
                        className={`filter-tab ${activeFilter === 'pending' ? 'active' : ''}`}
                        onClick={() => setActiveFilter('pending')}
                    >
                        <span className="tab-icon"><Icons.Hourglass /></span>
                        Pending
                        <span className="tab-count">{stats.pending}</span>
                    </button>

                    <button
                        className={`filter-tab ${activeFilter === 'completed' ? 'active' : ''}`}
                        onClick={() => setActiveFilter('completed')}
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
                            <h3>No bookings found</h3>
                            <p>There are no {activeFilter !== 'all' ? activeFilter : ''} bookings at the moment.</p>
                        </div>
                    ) : (
                        filteredBookings.map((booking) => (
                            <div key={booking.id} className="booking-card">
                                {/* Booking Header */}
                                <div className="booking-header">
                                    <div className="booking-id-section">
                                        <span className="booking-id"><Icons.Ticket /> {booking.id}</span>
                                        <span className={`status-badge ${booking.status}`}>
                                            {booking.status === 'pending' && <Icons.Hourglass className="status-icon" />}
                                            {booking.status === 'completed' && <Icons.CheckCircle className="status-icon" />}
                                            {booking.status === 'cancelled' && <Icons.XCircle className="status-icon" />}
                                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                        </span>
                                    </div>
                                    <div className="booking-date">
                                        <span className="date-label">Booked On</span>
                                        <span className="date-value">{formatDate(booking.bookingDate)}</span>
                                    </div>
                                </div>

                                {/* Customer Info */}
                                <div className="customer-info">
                                    <div className="customer-avatar">
                                        <span><Icons.User /></span>
                                    </div>
                                    <div className="customer-details">
                                        <div className="customer-name">{booking.userName}</div>
                                        <div className="customer-contact">
                                            <span><Icons.Mail className="contact-icon" /> {booking.userEmail}</span>
                                            <span className="divider">•</span>
                                            <span><Icons.Phone className="contact-icon" /> {booking.userPhone}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Booking Body */}
                                <div className="booking-body">
                                    <div className="service-info">
                                        <div className="service-icon-large">
                                            <span>{booking.serviceIcon}</span>
                                        </div>
                                        <div className="service-details">
                                            <div className="service-name">{booking.serviceName}</div>
                                            <div className="service-meta">
                                                <div className="meta-item">
                                                    <span className="meta-icon"><Icons.Calendar /></span>
                                                    <span className="meta-text">{formatDate(booking.date)}</span>
                                                </div>
                                                <div className="meta-item">
                                                    <span className="meta-icon"><Icons.Clock /></span>
                                                    <span className="meta-text">{booking.time}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="price-section">
                                        <span className="price-label">Total Amount</span>
                                        <span className="price-value">₹{booking.price.toLocaleString()}</span>
                                        <span className={`payment-status ${booking.paymentStatus}`}>
                                            <span className="payment-icon"><Icons.Check /></span>
                                            {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
                                        </span>
                                    </div>
                                </div>

                                {/* Booking Footer */}
                                <div className="booking-footer">
                                    <div className="address-info">
                                        <span className="address-icon"><Icons.MapPin /></span>
                                        <span>{booking.address}</span>
                                    </div>

                                    <div className="booking-actions">
                                        <button
                                            className="action-btn secondary"
                                            onClick={() => navigate(`/admin/booking/${booking.id}`)}
                                        >
                                            <span><Icons.Eye /></span>
                                            View Details
                                        </button>
                                        <button
                                            className="action-btn danger"
                                            onClick={() => handleDeleteBooking(booking.id)}
                                        >
                                            <span><Icons.Trash /></span>
                                            Delete Booking
                                        </button>
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

export default AdminDashboard;
