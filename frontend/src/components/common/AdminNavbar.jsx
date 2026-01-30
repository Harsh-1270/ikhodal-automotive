/* ============================================
   ADMIN NAVBAR - DEDICATED FOR ADMIN PANEL
   ============================================ */

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './AdminNavbar.css';

const AdminNavbar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const admin = {
        name: 'Admin User',
        email: 'admin@ikhodalautomotive.com',
        avatar: '👨‍💼'
    };

    const isActive = (path) => location.pathname === path;

    const handleLogout = () => {
        const confirmLogout = window.confirm('Are you sure you want to logout?');
        if (confirmLogout) {
            // Clear auth data (implement with your AuthContext)
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/admin/login');
        }
    };

    return (
        <nav className="admin-navbar">
            <div className="admin-navbar-content">
                {/* Left Side - Logo */}
                <div className="admin-navbar-left">
                    <div className="admin-logo" onClick={() => navigate('/admin/dashboard')}>
                        <span className="admin-logo-icon">🚗</span>
                        <div className="admin-logo-wrapper">
                            <span className="admin-logo-text">I Khodal Automotive</span>
                            <span className="admin-badge">Admin Panel</span>
                        </div>
                    </div>
                </div>

                {/* Right Side - Navigation + Profile */}
                <div className="admin-navbar-right">
                    {/* Navigation Buttons */}
                    <button
                        className={`admin-nav-btn ${isActive('/admin/dashboard') ? 'active' : ''}`}
                        onClick={() => !isActive('/admin/dashboard') && navigate('/admin/dashboard')}
                    >
                        <span className="admin-icon">🏠</span>
                        <span className="admin-nav-label">Home</span>
                    </button>

                    <button
                        className={`admin-nav-btn ${isActive('/admin/users') ? 'active' : ''}`}
                        onClick={() => !isActive('/admin/users') && navigate('/admin/users')}
                    >
                        <span className="admin-icon">👥</span>
                        <span className="admin-nav-label">Users</span>
                    </button>

                    <button
                        className={`admin-nav-btn ${isActive('/admin/schedule') ? 'active' : ''}`}
                        onClick={() => !isActive('/admin/schedule') && navigate('/admin/schedule')}
                    >
                        <span className="admin-icon">📅</span>
                        <span className="admin-nav-label">Schedule Management</span>
                    </button>

                    {/* Admin Profile */}
                    <div className="admin-profile">
                        <div className="admin-avatar">{admin.avatar}</div>
                        <div className="admin-info">
                            <div className="admin-name">{admin.name}</div>
                            <div className="admin-email">{admin.email}</div>
                        </div>
                    </div>

                    {/* Logout Button */}
                    <button className="admin-logout-btn" onClick={handleLogout}>
                        <span className="logout-icon">🚪</span>
                        <span className="logout-label">Logout</span>
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default AdminNavbar;
