import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './AdminNavbar.css';

const AdminNavbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const admin = {
        name: 'Admin User',
        email: 'admin@ikhodalautomotive.com',
        avatar: '👨‍💼'
    };

    const isActive = (path) => location.pathname === path;

    const handleNavigation = (path) => {
        if (!isActive(path)) {
            navigate(path);
        }
        setMobileMenuOpen(false);
    };

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    const handleLogout = () => {
        const confirmLogout = window.confirm('Are you sure you want to logout?');
        if (confirmLogout) {
            // Clear auth data (implement with your AuthContext)
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/admin/login');
        }
        setMobileMenuOpen(false);
    };

    return (
        <nav className="admin-navbar">
            <div className="admin-navbar-content">
                {/* Left Side - Logo */}
                <div className="admin-navbar-left">
                    <div className="admin-logo" onClick={() => handleNavigation('/admin/dashboard')}>
                        <span className="admin-logo-icon">🚗</span>
                        <div className="admin-logo-wrapper">
                            <span className="admin-logo-text">I Khodal Automotive</span>
                            <span className="admin-badge">Admin Panel</span>
                        </div>
                    </div>
                </div>

                {/* Right Side - Navigation + Profile */}
                <div className="admin-navbar-right">
                    {/* Desktop Navigation Buttons */}
                    <button
                        className={`admin-nav-btn ${isActive('/admin/dashboard') ? 'active' : ''}`}
                        onClick={() => handleNavigation('/admin/dashboard')}
                    >
                        <span className="admin-icon">🏠</span>
                        <span className="admin-nav-label">Home</span>
                    </button>

                    <button
                        className={`admin-nav-btn ${isActive('/admin/users') ? 'active' : ''}`}
                        onClick={() => handleNavigation('/admin/users')}
                    >
                        <span className="admin-icon">👥</span>
                        <span className="admin-nav-label">Users</span>
                    </button>

                    <button
                        className={`admin-nav-btn ${isActive('/admin/schedule') ? 'active' : ''}`}
                        onClick={() => handleNavigation('/admin/schedule')}
                    >
                        <span className="admin-icon">📅</span>
                        <span className="admin-nav-label">Schedule</span>
                    </button>

                    {/* Desktop Admin Profile */}
                    <div className="admin-profile">
                        <div className="admin-avatar">{admin.avatar}</div>
                        <div className="admin-info">
                            <div className="admin-name">{admin.name}</div>
                            <div className="admin-email">{admin.email}</div>
                        </div>
                    </div>

                    {/* Desktop Logout Button */}
                    <button className="admin-logout-btn" onClick={handleLogout}>
                        <span className="logout-icon">🚪</span>
                        <span className="logout-label">Logout</span>
                    </button>

                    {/* Mobile Menu Button */}
                    <button onClick={toggleMobileMenu} className="admin-mobile-menu-btn">
                        {mobileMenuOpen ? '✕' : '☰'}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {mobileMenuOpen && (
                <div className="admin-mobile-menu active">
                    {/* Mobile User Profile Section */}
                    <div className="admin-mobile-user-section">
                        <div className="admin-mobile-user-profile">
                            <div className="admin-mobile-user-avatar">
                                <span>{admin.avatar}</span>
                            </div>
                            <div className="admin-mobile-user-details">
                                <div className="admin-mobile-user-name">{admin.name}</div>
                                <div className="admin-mobile-user-email">{admin.email}</div>
                            </div>
                        </div>
                        <div className="admin-mobile-admin-badge">Administrator</div>
                    </div>

                    {/* Mobile Navigation Links */}
                    <button
                        onClick={() => handleNavigation('/admin/dashboard')}
                        className={`admin-mobile-menu-link ${isActive('/admin/dashboard') ? 'active' : ''}`}
                    >
                        <div className="admin-mobile-menu-link-content">
                            <span className="admin-mobile-menu-icon">🏠</span>
                            <span>Dashboard</span>
                        </div>
                    </button>

                    <button
                        onClick={() => handleNavigation('/admin/users')}
                        className={`admin-mobile-menu-link ${isActive('/admin/users') ? 'active' : ''}`}
                    >
                        <div className="admin-mobile-menu-link-content">
                            <span className="admin-mobile-menu-icon">👥</span>
                            <span>Users</span>
                        </div>
                    </button>

                    <button
                        onClick={() => handleNavigation('/admin/schedule')}
                        className={`admin-mobile-menu-link ${isActive('/admin/schedule') ? 'active' : ''}`}
                    >
                        <div className="admin-mobile-menu-link-content">
                            <span className="admin-mobile-menu-icon">📅</span>
                            <span>Schedule Management</span>
                        </div>
                    </button>

                    {/* Mobile Logout Button */}
                    <button className="admin-mobile-logout-btn" onClick={handleLogout}>
                        <span className="admin-mobile-logout-icon">🚪</span>
                        <span>Logout</span>
                    </button>
                </div>
            )}
        </nav>
    );
};

export default AdminNavbar;
