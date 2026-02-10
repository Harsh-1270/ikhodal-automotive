import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './UserNavbar.css';

const UserNavbar = ({ cartCount = 0 }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const user = {
        name: 'Alis Desai',
        email: 'alis.desai@example.com',
        avatar: '👤'
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

    return (
        <nav className="dashboard-navbar">
            <div className="navbar-content">
                <div className="navbar-left">
                    <div className="logo" onClick={() => handleNavigation('/dashboard')}>
                        <span className="logo-icon">🚗</span>
                        <span className="logo-text">I Khodal Automotive</span>
                    </div>
                </div>

                <div className="navbar-right">
                    {/* Desktop Nav Items */}
                    <button
                        className={`nav-icon-btn ${isActive('/dashboard') ? 'active' : ''}`}
                        onClick={() => handleNavigation('/dashboard')}
                    >
                        <span className="icon">🏠</span>
                        <span className="nav-label">Home</span>
                    </button>

                    <button
                        className={`nav-icon-btn ${isActive('/cart') ? 'active' : ''}`}
                        onClick={() => handleNavigation('/cart')}
                    >
                        <span className="icon">🛒</span>
                        {cartCount > 0 && <span className="badge">{cartCount}</span>}
                        <span className="nav-label">My Cart</span>
                    </button>

                    <button
                        className={`nav-icon-btn ${isActive('/my-bookings') ? 'active' : ''}`}
                        onClick={() => handleNavigation('/my-bookings')}
                    >
                        <span className="icon">📅</span>
                        <span className="badge">5</span>
                        <span className="nav-label">My Bookings</span>
                    </button>

                    <button
                        className={`nav-icon-btn ${isActive('/payment') ? 'active' : ''}`}
                        onClick={() => handleNavigation('/payment')}
                    >
                        <span className="icon">💳</span>
                        <span className="nav-label">Payments</span>
                    </button>

                    <div className="user-profile">
                        <div className="user-avatar">{user.avatar}</div>
                        <div className="user-info">
                            <div className="user-name">{user.name}</div>
                            <div className="user-email">{user.email}</div>
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <button onClick={toggleMobileMenu} className="mobile-menu-btn">
                        {mobileMenuOpen ? '✕' : '☰'}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {mobileMenuOpen && (
                <div className="mobile-menu active">
                    {/* User Profile Section */}
                    <div className="mobile-user-section">
                        <div className="mobile-user-profile">
                            <div className="mobile-user-avatar">
                                <span>{user.avatar}</span>
                            </div>
                            <div className="mobile-user-details">
                                <div className="mobile-user-name">{user.name}</div>
                                <div className="mobile-user-email">{user.email}</div>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Links */}
                    <button
                        onClick={() => handleNavigation('/dashboard')}
                        className={`mobile-menu-link ${isActive('/dashboard') ? 'active' : ''}`}
                    >
                        <div className="mobile-menu-link-content">
                            <span className="mobile-menu-icon">🏠</span>
                            <span>Home</span>
                        </div>
                    </button>

                    <button
                        onClick={() => handleNavigation('/cart')}
                        className={`mobile-menu-link ${isActive('/cart') ? 'active' : ''}`}
                    >
                        <div className="mobile-menu-link-content">
                            <span className="mobile-menu-icon">🛒</span>
                            <span>My Cart</span>
                        </div>
                        {cartCount > 0 && <span className="mobile-menu-badge">{cartCount}</span>}
                    </button>

                    <button
                        onClick={() => handleNavigation('/my-bookings')}
                        className={`mobile-menu-link ${isActive('/my-bookings') ? 'active' : ''}`}
                    >
                        <div className="mobile-menu-link-content">
                            <span className="mobile-menu-icon">📅</span>
                            <span>My Bookings</span>
                        </div>
                        <span className="mobile-menu-badge">5</span>
                    </button>

                    <button
                        onClick={() => handleNavigation('/payment')}
                        className={`mobile-menu-link ${isActive('/payment') ? 'active' : ''}`}
                    >
                        <div className="mobile-menu-link-content">
                            <span className="mobile-menu-icon">💳</span>
                            <span>Payments</span>
                        </div>
                    </button>
                </div>
            )}
        </nav>
    );
};

export default UserNavbar;
