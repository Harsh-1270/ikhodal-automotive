import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './UserNavbar.css';

const UserNavbar = ({ cartCount = 0 }) => {
    const navigate = useNavigate();
    const location = useLocation();

    // Mock user data (in real app, get from AuthContext)
    const user = {
        name: 'Alis Desai',
        email: 'alis.desai@example.com',
        avatar: '👤'
    };

    // Check if current page is active
    const isActive = (path) => location.pathname === path;

    return (
        <nav className="dashboard-navbar">
            <div className="navbar-content">
                <div className="navbar-left">
                    <div className="logo" onClick={() => navigate('/dashboard')}>
                        <span className="logo-icon">🚗</span>
                        <span className="logo-text">I Khodal Automotive</span>
                    </div>
                </div>

                <div className="navbar-right">
                    <button
                        className={`nav-icon-btn ${isActive('/dashboard') ? 'active' : ''}`}
                        onClick={() => !isActive('/dashboard') && navigate('/dashboard')}
                    >
                        <span className="icon">🏠</span>
                        <span className="nav-label">Home</span>
                    </button>

                    <button
                        className={`nav-icon-btn ${isActive('/cart') ? 'active' : ''}`}
                        onClick={() => !isActive('/cart') && navigate('/cart')}
                    >
                        <span className="icon">🛒</span>
                        {cartCount > 0 && <span className="badge">{cartCount}</span>}
                        <span className="nav-label">My Cart</span>
                    </button>

                    <button
                        className={`nav-icon-btn ${isActive('/my-bookings') ? 'active' : ''}`}
                        onClick={() => !isActive('/my-bookings') && navigate('/my-bookings')}
                    >
                        <span className="icon">📅</span>
                        <span className="badge">5</span>
                        <span className="nav-label">My Bookings</span>
                    </button>

                    <button
                        className={`nav-icon-btn ${isActive('/payments') ? 'active' : ''}`}
                        onClick={() => !isActive('/payments') && navigate('/payments')}
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
                </div>
            </div>
        </nav>
    );
};

export default UserNavbar;
