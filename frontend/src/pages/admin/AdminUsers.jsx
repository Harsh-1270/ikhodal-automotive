/* ============================================
   ADMIN USERS - USER MANAGEMENT PAGE
   ============================================ */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from '../../components/common/AdminNavbar';
import { getAllUsers, deleteUser } from '../../services/api';
import './AdminUsers.css';

const AdminUsers = () => {
    /* ==========================================
       SVG ICONS COMPONENT
       ========================================== */
    const Icons = {
        Users: ({ className = "", color = "#3b82f6" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
        ),
        User: ({ className = "", color = "#3b82f6" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
            </svg>
        ),
        CheckCircle: ({ className = "", color = "#10b981" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="9 12 11 14 15 10" />
            </svg>
        ),
        PauseCircle: ({ className = "", color = "#ef4444" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="10" y1="15" x2="10" y2="9" />
                <line x1="14" y1="15" x2="14" y2="9" />
            </svg>
        ),
        Search: ({ className = "", color = "#64748b" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
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
        Calendar: ({ className = "", color = "#64748b" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
        ),
        Ticket: ({ className = "", color = "#64748b" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 7v4a1 1 0 0 0 1 1h3" />
                <path d="M7 7v10" />
                <path d="M10 8v8a1 1 0 0 0 1 1h9a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-9a1 1 0 0 0-1 1z" />
            </svg>
        ),
        Eye: ({ className = "", color = "currentColor" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
            </svg>
        ),
        Trash: ({ className = "", color = "currentColor" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                <line x1="10" y1="11" x2="10" y2="17" />
                <line x1="14" y1="11" x2="14" y2="17" />
            </svg>
        ),
        CircleDot: ({ className = "", color = "#10b981" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke="none">
                <circle cx="12" cy="12" r="10" fill={color} />
            </svg>
        ),
        X: ({ className = "", color = "currentColor" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
        )
    };

    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [stats, setStats] = useState({
        total: 0,
        active: 0,
        inactive: 0
    });

    /* ==========================================
       FETCH USERS FROM API
       ========================================== */
    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError(null);
            const result = await getAllUsers();
            if (result.success) {
                const usersData = result.data || [];
                setUsers(usersData);
                setFilteredUsers(usersData);
                calculateStats(usersData);
            } else {
                setError(result.message || 'Failed to fetch users');
            }
        } catch (err) {
            setError('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    /* ==========================================
       LOAD USERS ON MOUNT
       ========================================== */
    useEffect(() => {
        fetchUsers();
    }, []);

    /* ==========================================
       ANIMATE CARDS AFTER LOADING
       ========================================== */
    useEffect(() => {
        if (!loading) {
            setTimeout(() => {
                document.querySelectorAll('.adm-user-card').forEach((card, index) => {
                    setTimeout(() => {
                        card.classList.add('visible');
                    }, index * 80);
                });
            }, 100);
        }
    }, [loading, filteredUsers]);

    /* ==========================================
       CALCULATE STATISTICS
       ========================================== */
    const calculateStats = (data) => {
        setStats({
            total: data.length,
            active: data.filter(u => u.online === true).length,
            inactive: data.filter(u => u.online !== true).length
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
                (user.name || '').toLowerCase().includes(query) ||
                (user.email || '').toLowerCase().includes(query) ||
                (user.phone || '').includes(query) ||
                String(user.id).toLowerCase().includes(query)
            );
            setFilteredUsers(filtered);
        }

        // Re-animate cards after search
        setTimeout(() => {
            document.querySelectorAll('.adm-user-card').forEach((card) => {
                card.classList.remove('visible');
            });
            setTimeout(() => {
                document.querySelectorAll('.adm-user-card').forEach((card, index) => {
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
    const handleDeleteUser = async (userId, userName) => {
        const confirmDelete = window.confirm(
            `Are you sure you want to delete user "${userName}"?\n\nUser ID: ${userId}\n\nThis action cannot be undone.`
        );

        if (confirmDelete) {
            const result = await deleteUser(userId);
            if (result.success) {
                const updatedUsers = users.filter(u => u.id !== userId);
                setUsers(updatedUsers);
                calculateStats(updatedUsers);
                alert(`✅ User "${userName}" has been deleted successfully!`);
            } else {
                alert(`❌ Failed to delete user: ${result.message}`);
            }
        }
    };

    /* ==========================================
       FORMAT DATE
       ========================================== */
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    /* ==========================================
       GET USER STATUS (based on isOnline)
       ========================================== */
    const getUserStatus = (user) => {
        return user.online === true ? 'active' : 'inactive';
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
                <div className="adm-page-header">
                    <div className="adm-header-left">
                        <h1 className="adm-page-title">
                            <span className="adm-title-icon"><Icons.Users /></span>
                            User Management
                        </h1>
                    </div>
                </div>

                {/* Statistics Row */}
                <div className="adm-stats-row">
                    <div className="adm-stat-box blue">
                        <div className="adm-stat-icon-circle blue">
                            <span><Icons.User /></span>
                        </div>
                        <div className="adm-stat-details">
                            <div className="adm-stat-value">{stats.total}</div>
                            <div className="adm-stat-label">Total Users</div>
                        </div>
                    </div>

                    <div className="adm-stat-box green">
                        <div className="adm-stat-icon-circle green">
                            <span><Icons.CheckCircle /></span>
                        </div>
                        <div className="adm-stat-details">
                            <div className="adm-stat-value">{stats.active}</div>
                            <div className="adm-stat-label">Active Users</div>
                        </div>
                    </div>

                    <div className="adm-stat-box red">
                        <div className="adm-stat-icon-circle red">
                            <span><Icons.PauseCircle /></span>
                        </div>
                        <div className="adm-stat-details">
                            <div className="adm-stat-value">{stats.inactive}</div>
                            <div className="adm-stat-label">Inactive Users</div>
                        </div>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="adm-search-section">
                    <div className="adm-search-wrapper">
                        <span className="adm-search-icon"><Icons.Search /></span>
                        <input
                            type="text"
                            className="adm-search-input"
                            placeholder="Search by name, email, phone, or user ID..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && (
                            <button
                                className="adm-clear-search"
                                onClick={() => setSearchQuery('')}
                            >
                                <Icons.X />
                            </button>
                        )}
                    </div>
                    <div className="adm-search-results-count">
                        Showing {filteredUsers.length} of {users.length} users
                    </div>
                </div>

                {/* Users Grid */}
                <div className="adm-users-grid">
                    {loading ? (
                        <div className="adm-empty-state">
                            <div className="adm-empty-icon"><Icons.Users color="#94a3b8" /></div>
                            <h3>Loading users...</h3>
                            <p>Please wait while we fetch user data</p>
                        </div>
                    ) : error ? (
                        <div className="adm-empty-state">
                            <div className="adm-empty-icon"><Icons.PauseCircle color="#ef4444" /></div>
                            <h3>Error loading users</h3>
                            <p>{error}</p>
                            <button
                                className="adm-clear-filters-btn"
                                onClick={fetchUsers}
                            >
                                Retry
                            </button>
                        </div>
                    ) : filteredUsers.length === 0 ? (
                        <div className="adm-empty-state">
                            <div className="adm-empty-icon"><Icons.Search color="#94a3b8" /></div>
                            <h3>No users found</h3>
                            <p>Try adjusting your search query</p>
                            <button
                                className="adm-clear-filters-btn"
                                onClick={() => setSearchQuery('')}
                            >
                                Clear Search
                            </button>
                        </div>
                    ) : (
                        filteredUsers.map((user) => {
                            const status = getUserStatus(user);
                            return (
                                <div key={user.id} className="adm-user-card">
                                    {/* User Header */}
                                    <div className="adm-user-card-header">
                                        <div className="adm-user-avatar-large">
                                            <Icons.User color="#ffffff" />
                                        </div>
                                        <div className={`adm-user-status-badge ${status}`}>
                                            {status === 'active' ? <Icons.CircleDot color="#10b981" /> : <Icons.CircleDot color="#ef4444" />}
                                            {status === 'active' ? 'Active' : 'Inactive'}
                                        </div>
                                    </div>

                                    {/* User Info */}
                                    <div className="adm-user-card-body">
                                        <h3 className="adm-user-card-name">{user.name}</h3>
                                        <p className="adm-user-card-id">ID: {user.id}</p>

                                        <div className="adm-user-card-details">
                                            <div className="adm-detail-item">
                                                <span className="adm-detail-icon"><Icons.Mail /></span>
                                                <span className="adm-detail-text">{user.email}</span>
                                            </div>
                                            <div className="adm-detail-item">
                                                <span className="adm-detail-icon"><Icons.Phone /></span>
                                                <span className="adm-detail-text">{user.phone || 'N/A'}</span>
                                            </div>
                                            <div className="adm-detail-item">
                                                <span className="adm-detail-icon"><Icons.Calendar /></span>
                                                <span className="adm-detail-text">{formatDate(user.createdAt)}</span>
                                            </div>
                                            <div className="adm-detail-item">
                                                <span className="adm-detail-icon"><Icons.Ticket /></span>
                                                <span className="adm-detail-text">{user.totalBookings} bookings</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* User Actions */}
                                    <div className="adm-user-card-footer">
                                        <button
                                            className="adm-user-action-btn view"
                                            onClick={() => navigate(`/admin/user/${user.id}`)}
                                        >
                                            <span><Icons.Eye /></span>
                                            View Details
                                        </button>
                                        <button
                                            className="adm-user-action-btn delete"
                                            onClick={() => handleDeleteUser(user.id, user.name)}
                                        >
                                            <span><Icons.Trash /></span>
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminUsers;