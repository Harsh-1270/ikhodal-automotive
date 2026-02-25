import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './UserNavbar.css';

const UserNavbar = ({ cartCount = 0 }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [showLogoutDropdown, setShowLogoutDropdown] = useState(false);
    const dropdownRef = useRef(null);

    // Get display name and email from AuthContext user
    const displayName = user?.name || user?.email?.split('@')[0] || 'User';
    const displayEmail = user?.email || '';
    const userInitial = displayName.charAt(0).toUpperCase();

    /* ==========================================
       SVG ICONS COMPONENT - HIGH QUALITY STANDARD ICONS
       ========================================== */
    const Icons = {
        Car: ({ className = "" }) => (
            <svg className={className} width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
                <circle cx="7" cy="17" r="2" />
                <path d="M9 17h6" />
                <circle cx="17" cy="17" r="2" />
            </svg>
        ),
        Home: ({ className = "" }) => (
            <svg className={className} width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
        ),
        Cart: ({ className = "" }) => (
            <svg className={className} width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
        ),
        Calendar: ({ className = "" }) => (
            <svg className={className} width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
        ),
        CreditCard: ({ className = "" }) => (
            <svg className={className} width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                <line x1="1" y1="10" x2="23" y2="10"></line>
            </svg>
        ),
        Logout: ({ className = "" }) => (
            <svg className={className} width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
        ),
        Menu: ({ className = "" }) => (
            <svg className={className} width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
        ),
        Close: ({ className = "" }) => (
            <svg className={className} width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
        ),
        ChevronDown: ({ className = "" }) => (
            <svg className={className} width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
        ),
        ChevronUp: ({ className = "" }) => (
            <svg className={className} width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="18 15 12 9 6 15"></polyline>
            </svg>
        )
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

    const toggleLogoutDropdown = () => {
        setShowLogoutDropdown(!showLogoutDropdown);
    };

    const handleLogout = () => {
        logout();
        navigate('/login', { replace: true });
        setShowLogoutDropdown(false);
        setMobileMenuOpen(false);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowLogoutDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <nav className="dashboard-navbar">
            <div className="navbar-content">
                <div className="navbar-left">
                    <div className="logo" onClick={() => handleNavigation('/dashboard')}>
                        <span className="logo-text">I Khodal Automotive</span>
                    </div>
                </div>

                <div className="navbar-right">
                    {/* Desktop Nav Items */}
                    <button
                        className={`nav-icon-btn ${isActive('/dashboard') ? 'active' : ''}`}
                        onClick={() => handleNavigation('/dashboard')}
                    >
                        <span className="icon">
                            <Icons.Home />
                        </span>
                        <span className="nav-label">Home</span>
                    </button>

                    <button
                        className={`nav-icon-btn ${isActive('/cart') ? 'active' : ''}`}
                        onClick={() => handleNavigation('/cart')}
                    >
                        <span className="icon">
                            <Icons.Cart />
                        </span>
                        <span className="nav-label">My Cart</span>
                    </button>

                    <button
                        className={`nav-icon-btn ${isActive('/my-bookings') ? 'active' : ''}`}
                        onClick={() => handleNavigation('/my-bookings')}
                    >
                        <span className="icon">
                            <Icons.Calendar />
                        </span>
                        <span className="nav-label">My Bookings</span>
                    </button>

                    <button
                        className={`nav-icon-btn ${isActive('/payment') ? 'active' : ''}`}
                        onClick={() => handleNavigation('/payment')}
                    >
                        <span className="icon">
                            <Icons.CreditCard />
                        </span>
                        <span className="nav-label">Payments</span>
                    </button>

                    {/* User Profile with Logout Dropdown */}
                    <div className="user-profile-wrapper" ref={dropdownRef}>
                        <div className="user-profile" onClick={toggleLogoutDropdown}>
                            <div className="user-avatar">{userInitial}</div>
                            <div className="user-info">
                                <div className="user-name">{displayName}</div>
                                <div className="user-email">{displayEmail}</div>
                            </div>
                            <span className="dropdown-arrow">
                                {showLogoutDropdown ? <Icons.ChevronUp /> : <Icons.ChevronDown />}
                            </span>
                        </div>

                        {/* Logout Dropdown */}
                        {showLogoutDropdown && (
                            <div className="logout-dropdown">
                                <button className="logout-dropdown-btn" onClick={handleLogout}>
                                    <span>
                                        <Icons.Logout />
                                    </span>
                                    <span>Logout</span>
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button onClick={toggleMobileMenu} className="mobile-menu-btn">
                        {mobileMenuOpen ? <Icons.Close /> : <Icons.Menu />}
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
                                <span>{userInitial}</span>
                            </div>
                            <div className="mobile-user-details">
                                <div className="mobile-user-name">{displayName}</div>
                                <div className="mobile-user-email">{displayEmail}</div>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Links */}
                    <button
                        onClick={() => handleNavigation('/dashboard')}
                        className={`mobile-menu-link ${isActive('/dashboard') ? 'active' : ''}`}
                    >
                        <div className="mobile-menu-link-content">
                            <span className="mobile-menu-icon">
                                <Icons.Home />
                            </span>
                            <span>Home</span>
                        </div>
                    </button>

                    <button
                        onClick={() => handleNavigation('/cart')}
                        className={`mobile-menu-link ${isActive('/cart') ? 'active' : ''}`}
                    >
                        <div className="mobile-menu-link-content">
                            <span className="mobile-menu-icon">
                                <Icons.Cart />
                            </span>
                            <span>My Cart</span>
                        </div>
                    </button>

                    <button
                        onClick={() => handleNavigation('/my-bookings')}
                        className={`mobile-menu-link ${isActive('/my-bookings') ? 'active' : ''}`}
                    >
                        <div className="mobile-menu-link-content">
                            <span className="mobile-menu-icon">
                                <Icons.Calendar />
                            </span>
                            <span>My Bookings</span>
                        </div>
                    </button>

                    <button
                        onClick={() => handleNavigation('/payment')}
                        className={`mobile-menu-link ${isActive('/payment') ? 'active' : ''}`}
                    >
                        <div className="mobile-menu-link-content">
                            <span className="mobile-menu-icon">
                                <Icons.CreditCard />
                            </span>
                            <span>Payments</span>
                        </div>
                    </button>

                    {/* Mobile Logout Button */}
                    <div className="mobile-user-section" style={{ borderTop: '2px solid rgba(30, 58, 138, 0.1)', borderBottom: 'none', marginTop: '0.5rem' }}>
                        <button className="mobile-logout-btn" onClick={handleLogout}>
                            <span>
                                <Icons.Logout />
                            </span>
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default UserNavbar;
