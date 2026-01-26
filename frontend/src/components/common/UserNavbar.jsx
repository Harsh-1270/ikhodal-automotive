import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './UserNavbar.css';

const UserNavbar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Mock user data (in real app, get from AuthContext)
    const user = {
        name: 'John Doe',
        email: 'john.doe@example.com',
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
                        <span className="logo-text">AutoCare</span>
                    </div>
                </div>

                <div className="navbar-right">
                    <button className="nav-icon-btn">
                        <span className="icon">🛒</span>
                        <span className="badge">3</span>
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
                        <span className="dropdown-arrow">▼</span>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default UserNavbar;
