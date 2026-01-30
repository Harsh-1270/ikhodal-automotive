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
                            <span className="title-icon">📊</span>
                            Admin Dashboard
                        </h1>
                        {/* <p className="page-subtitle">Manage all customer bookings</p> */}
                    </div>
                </div>

                {/* Statistics Row */}
                <div className="stats-row">
                    <div className="stat-box blue">
                        <div className="stat-icon-circle blue">
                            <span>📋</span>
                        </div>
                        <div className="stat-details">
                            <div className="stat-value">{stats.total}</div>
                            <div className="stat-label">Total Bookings</div>
                        </div>
                    </div>

                    <div className="stat-box orange">
                        <div className="stat-icon-circle orange">
                            <span>⏳</span>
                        </div>
                        <div className="stat-details">
                            <div className="stat-value">{stats.pending}</div>
                            <div className="stat-label">Pending</div>
                        </div>
                    </div>

                    <div className="stat-box green">
                        <div className="stat-icon-circle green">
                            <span>✅</span>
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
                        <span className="tab-icon">📋</span>
                        All Bookings
                        <span className="tab-count">{stats.total}</span>
                    </button>

                    <button
                        className={`filter-tab ${activeFilter === 'pending' ? 'active' : ''}`}
                        onClick={() => setActiveFilter('pending')}
                    >
                        <span className="tab-icon">⏳</span>
                        Pending
                        <span className="tab-count">{stats.pending}</span>
                    </button>

                    <button
                        className={`filter-tab ${activeFilter === 'completed' ? 'active' : ''}`}
                        onClick={() => setActiveFilter('completed')}
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
                            <h3>No bookings found</h3>
                            <p>There are no {activeFilter !== 'all' ? activeFilter : ''} bookings at the moment.</p>
                        </div>
                    ) : (
                        filteredBookings.map((booking) => (
                            <div key={booking.id} className="booking-card">
                                {/* Booking Header */}
                                <div className="booking-header">
                                    <div className="booking-id-section">
                                        <span className="booking-id">🎫 {booking.id}</span>
                                        <span className={`status-badge ${booking.status}`}>
                                            {booking.status === 'pending' && '⏳'}
                                            {booking.status === 'completed' && '✅'}
                                            {booking.status === 'cancelled' && '❌'}
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
                                        <span>👤</span>
                                    </div>
                                    <div className="customer-details">
                                        <div className="customer-name">{booking.userName}</div>
                                        <div className="customer-contact">
                                            <span>📧 {booking.userEmail}</span>
                                            <span className="divider">•</span>
                                            <span>📱 {booking.userPhone}</span>
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
                                                    <span className="meta-icon">📅</span>
                                                    <span className="meta-text">{formatDate(booking.date)}</span>
                                                </div>
                                                <div className="meta-item">
                                                    <span className="meta-icon">🕐</span>
                                                    <span className="meta-text">{booking.time}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="price-section">
                                        <span className="price-label">Total Amount</span>
                                        <span className="price-value">₹{booking.price.toLocaleString()}</span>
                                        <span className={`payment-status ${booking.paymentStatus}`}>
                                            <span className="payment-icon">✓</span>
                                            {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
                                        </span>
                                    </div>
                                </div>

                                {/* Booking Footer */}
                                <div className="booking-footer">
                                    <div className="address-info">
                                        <span className="address-icon">📍</span>
                                        <span>{booking.address}</span>
                                    </div>

                                    <div className="booking-actions">
                                        <button
                                            className="action-btn secondary"
                                            onClick={() => navigate(`/admin/booking/${booking.id}`)}
                                        >
                                            <span>👁️</span>
                                            View Details
                                        </button>
                                        <button
                                            className="action-btn danger"
                                            onClick={() => handleDeleteBooking(booking.id)}
                                        >
                                            <span>🗑️</span>
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
