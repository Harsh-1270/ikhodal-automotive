/* ============================================
   ADMIN USERS - USER MANAGEMENT PAGE
   ============================================ */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from '../../components/common/AdminNavbar';
import './AdminUsers.css';

const AdminUsers = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [stats, setStats] = useState({
        total: 0,
        active: 0,
        inactive: 0
    });

    /* ==========================================
       MOCK USERS DATA
       ========================================== */
    const mockUsers = [
        {
            id: 'USR-001',
            name: 'Alis Desai',
            email: 'alis.desai@example.com',
            phone: '+91 98765 43210',
            registeredDate: '2025-12-15',
            totalBookings: 8,
            status: 'active',
            avatar: '👤'
        },
        {
            id: 'USR-002',
            name: 'Raj Patel',
            email: 'raj.patel@example.com',
            phone: '+91 98765 43211',
            registeredDate: '2025-11-20',
            totalBookings: 5,
            status: 'active',
            avatar: '👨'
        },
        {
            id: 'USR-003',
            name: 'Priya Shah',
            email: 'priya.shah@example.com',
            phone: '+91 98765 43212',
            registeredDate: '2025-10-10',
            totalBookings: 12,
            status: 'active',
            avatar: '👩'
        },
        {
            id: 'USR-004',
            name: 'Amit Kumar',
            email: 'amit.kumar@example.com',
            phone: '+91 98765 43213',
            registeredDate: '2025-09-05',
            totalBookings: 3,
            status: 'active',
            avatar: '👨‍💼'
        },
        {
            id: 'USR-005',
            name: 'Neha Mehta',
            email: 'neha.mehta@example.com',
            phone: '+91 98765 43214',
            registeredDate: '2026-01-08',
            totalBookings: 6,
            status: 'active',
            avatar: '👩‍💼'
        },
        {
            id: 'USR-006',
            name: 'Vikram Singh',
            email: 'vikram.singh@example.com',
            phone: '+91 98765 43215',
            registeredDate: '2025-08-22',
            totalBookings: 15,
            status: 'active',
            avatar: '🧔'
        },
        {
            id: 'USR-007',
            name: 'Kavita Joshi',
            email: 'kavita.joshi@example.com',
            phone: '+91 98765 43216',
            registeredDate: '2025-12-30',
            totalBookings: 2,
            status: 'inactive',
            avatar: '👩‍🦰'
        },
        {
            id: 'USR-008',
            name: 'Rohit Sharma',
            email: 'rohit.sharma@example.com',
            phone: '+91 98765 43217',
            registeredDate: '2025-07-18',
            totalBookings: 9,
            status: 'active',
            avatar: '🧑'
        },
        {
            id: 'USR-009',
            name: 'Anjali Patel',
            email: 'anjali.patel@example.com',
            phone: '+91 98765 43218',
            registeredDate: '2025-11-12',
            totalBookings: 4,
            status: 'active',
            avatar: '👧'
        },
        {
            id: 'USR-010',
            name: 'Karan Desai',
            email: 'karan.desai@example.com',
            phone: '+91 98765 43219',
            registeredDate: '2025-10-25',
            totalBookings: 7,
            status: 'inactive',
            avatar: '👦'
        },
        {
            id: 'USR-011',
            name: 'Sonia Kapoor',
            email: 'sonia.kapoor@example.com',
            phone: '+91 98765 43220',
            registeredDate: '2026-01-15',
            totalBookings: 1,
            status: 'active',
            avatar: '👩‍🎤'
        },
        {
            id: 'USR-012',
            name: 'Arjun Reddy',
            email: 'arjun.reddy@example.com',
            phone: '+91 98765 43221',
            registeredDate: '2025-09-30',
            totalBookings: 11,
            status: 'active',
            avatar: '🧑‍💻'
        }
    ];

    /* ==========================================
       LOAD USERS ON MOUNT
       ========================================== */
    useEffect(() => {
        setUsers(mockUsers);
        setFilteredUsers(mockUsers);
        calculateStats(mockUsers);

        // Animate cards on load
        setTimeout(() => {
            document.querySelectorAll('.user-card').forEach((card, index) => {
                setTimeout(() => {
                    card.classList.add('visible');
                }, index * 80);
            });
        }, 100);
    }, []);

    /* ==========================================
       CALCULATE STATISTICS
       ========================================== */
    const calculateStats = (data) => {
        setStats({
            total: data.length,
            active: data.filter(u => u.status === 'active').length,
            inactive: data.filter(u => u.status === 'inactive').length
        });
    };

    /* ==========================================
       SEARCH USERS
       ========================================== */
    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredUsers(users);
        } else {
            const query = searchQuery.toLowerCase();
            const filtered = users.filter(user =>
                user.name.toLowerCase().includes(query) ||
                user.email.toLowerCase().includes(query) ||
                user.phone.includes(query) ||
                user.id.toLowerCase().includes(query)
            );
            setFilteredUsers(filtered);
        }

        // Re-animate cards after search
        setTimeout(() => {
            document.querySelectorAll('.user-card').forEach((card) => {
                card.classList.remove('visible');
            });
            setTimeout(() => {
                document.querySelectorAll('.user-card').forEach((card, index) => {
                    setTimeout(() => {
                        card.classList.add('visible');
                    }, index * 80);
                });
            }, 50);
        }, 50);
    }, [searchQuery, users]);

    /* ==========================================
       HANDLE DELETE USER
       ========================================== */
    const handleDeleteUser = (userId, userName) => {
        const confirmDelete = window.confirm(
            `Are you sure you want to delete user "${userName}"?\n\nUser ID: ${userId}\n\nThis action cannot be undone.`
        );

        if (confirmDelete) {
            const updatedUsers = users.filter(u => u.id !== userId);
            setUsers(updatedUsers);
            calculateStats(updatedUsers);

            // Show success message
            alert(`✅ User "${userName}" has been deleted successfully!`);
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
        <div className="admin-users-container">
            {/* Admin Navbar */}
            <AdminNavbar />

            {/* Main Content */}
            <div className="admin-users-main">
                {/* Page Header */}
                <div className="page-header">
                    <div className="header-left">
                        <h1 className="page-title">
                            <span className="title-icon">👥</span>
                            User Management
                        </h1>
                    </div>
                </div>

                {/* Statistics Row */}
                <div className="stats-row">
                    <div className="stat-box blue">
                        <div className="stat-icon-circle blue">
                            <span>👤</span>
                        </div>
                        <div className="stat-details">
                            <div className="stat-value">{stats.total}</div>
                            <div className="stat-label">Total Users</div>
                        </div>
                    </div>

                    <div className="stat-box green">
                        <div className="stat-icon-circle green">
                            <span>✅</span>
                        </div>
                        <div className="stat-details">
                            <div className="stat-value">{stats.active}</div>
                            <div className="stat-label">Active Users</div>
                        </div>
                    </div>

                    <div className="stat-box red">
                        <div className="stat-icon-circle red">
                            <span>⏸️</span>
                        </div>
                        <div className="stat-details">
                            <div className="stat-value">{stats.inactive}</div>
                            <div className="stat-label">Inactive Users</div>
                        </div>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="search-section">
                    <div className="search-wrapper">
                        <span className="search-icon">🔍</span>
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Search by name, email, phone, or user ID..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && (
                            <button
                                className="clear-search"
                                onClick={() => setSearchQuery('')}
                            >
                                ✕
                            </button>
                        )}
                    </div>
                    <div className="search-results-count">
                        Showing {filteredUsers.length} of {users.length} users
                    </div>
                </div>

                {/* Users Grid */}
                <div className="users-grid">
                    {filteredUsers.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">🔍</div>
                            <h3>No users found</h3>
                            <p>Try adjusting your search query</p>
                            <button
                                className="clear-filters-btn"
                                onClick={() => setSearchQuery('')}
                            >
                                Clear Search
                            </button>
                        </div>
                    ) : (
                        filteredUsers.map((user) => (
                            <div key={user.id} className="user-card">
                                {/* User Header */}
                                <div className="user-card-header">
                                    <div className="user-avatar-large">
                                        <span>{user.avatar}</span>
                                    </div>
                                    <div className={`user-status-badge ${user.status}`}>
                                        {user.status === 'active' ? '🟢' : '🔴'}
                                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                                    </div>
                                </div>

                                {/* User Info */}
                                <div className="user-card-body">
                                    <h3 className="user-card-name">{user.name}</h3>
                                    <p className="user-card-id">ID: {user.id}</p>

                                    <div className="user-card-details">
                                        <div className="detail-item">
                                            <span className="detail-icon">📧</span>
                                            <span className="detail-text">{user.email}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-icon">📱</span>
                                            <span className="detail-text">{user.phone}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-icon">📅</span>
                                            <span className="detail-text">{formatDate(user.registeredDate)}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-icon">🎫</span>
                                            <span className="detail-text">{user.totalBookings} bookings</span>
                                        </div>
                                    </div>
                                </div>

                                {/* User Actions */}
                                <div className="user-card-footer">
                                    <button
                                        className="user-action-btn view"
                                        onClick={() => navigate(`/admin/user/${user.id}`)}
                                    >
                                        <span>👁️</span>
                                        View Details
                                    </button>
                                    <button
                                        className="user-action-btn delete"
                                        onClick={() => handleDeleteUser(user.id, user.name)}
                                    >
                                        <span>🗑️</span>
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminUsers;
