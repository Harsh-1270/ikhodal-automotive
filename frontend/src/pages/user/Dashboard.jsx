import React, { useState } from 'react';
import './Dashboard.css';

const Dashboard = () => {
    const [activeFilter, setActiveFilter] = useState('all');

    // Mock user data
    const user = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        avatar: '👤'
    };

    // Mock services data
    const services = [
        {
            id: 1,
            name: 'Car Services',
            icon: '🚗',
            description: 'Complete car maintenance & repair',
            price: 2500,
            duration: '2-3 hours',
            category: 'maintenance',
            popular: true
        },
        {
            id: 2,
            name: 'AC Service & Repair',
            icon: '❄️',
            description: 'AC gas refill, repair & cleaning',
            price: 1800,
            duration: '1-2 hours',
            category: 'repair',
            popular: true
        },
        {
            id: 3,
            name: 'Batteries',
            icon: '🔋',
            description: 'Battery check, replacement & charging',
            price: 3500,
            duration: '30 mins',
            category: 'replacement'
        },
        {
            id: 4,
            name: 'Tyres & Wheel Care',
            icon: '⚙️',
            description: 'Wheel alignment, balancing & rotation',
            price: 1200,
            duration: '1 hour',
            category: 'maintenance',
            popular: true
        },
        {
            id: 5,
            name: 'Denting & Painting',
            icon: '🎨',
            description: 'Professional denting & painting services',
            price: 5000,
            duration: '1-2 days',
            category: 'repair'
        },
        {
            id: 6,
            name: 'Detailing Services',
            icon: '✨',
            description: 'Interior & exterior deep cleaning',
            price: 2000,
            duration: '2-3 hours',
            category: 'cleaning'
        },
        {
            id: 7,
            name: 'Car Spa & Cleaning',
            icon: '🧼',
            description: 'Premium car wash & waxing',
            price: 800,
            duration: '1 hour',
            category: 'cleaning',
            popular: true
        },
        {
            id: 8,
            name: 'Car Inspections',
            icon: '📋',
            description: 'Complete vehicle inspection & report',
            price: 1500,
            duration: '1 hour',
            category: 'inspection',
            new: true
        },
        {
            id: 9,
            name: 'Windshields & Lights',
            icon: '💡',
            description: 'Glass repair & headlight restoration',
            price: 2200,
            duration: '1-2 hours',
            category: 'repair'
        },
        {
            id: 10,
            name: 'Suspension & Fitments',
            icon: '🔧',
            description: 'Shock absorbers & suspension repair',
            price: 4000,
            duration: '2-3 hours',
            category: 'repair'
        },
        {
            id: 11,
            name: 'Clutch & Body Parts',
            icon: '⚡',
            description: 'Clutch replacement & body parts',
            price: 6000,
            duration: '3-4 hours',
            category: 'replacement',
            new: true
        },
        {
            id: 12,
            name: 'Insurance Claims',
            icon: '🛡️',
            description: 'Insurance claim assistance & support',
            price: 0,
            duration: 'Varies',
            category: 'support'
        }
    ];

    const categories = [
        { id: 'all', name: 'All Services', icon: '🔧' },
        { id: 'maintenance', name: 'Maintenance', icon: '🔨' },
        { id: 'repair', name: 'Repair', icon: '⚙️' },
        { id: 'cleaning', name: 'Cleaning', icon: '✨' },
        { id: 'replacement', name: 'Replacement', icon: '🔄' },
        { id: 'inspection', name: 'Inspection', icon: '📋' },
        { id: 'support', name: 'Support', icon: '💬' }
    ];

    const filteredServices = activeFilter === 'all'
        ? services
        : services.filter(service => service.category === activeFilter);

    return (
        <div className="dashboard-container">
            {/* Top Navigation Bar */}
            <nav className="dashboard-navbar">
                <div className="navbar-content">
                    <div className="navbar-left">
                        <div className="logo">
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

                        <button className="nav-icon-btn">
                            <span className="icon">📅</span>
                            <span className="badge">5</span>
                            <span className="nav-label">My Bookings</span>
                        </button>

                        <button className="nav-icon-btn">
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

            {/* Main Content */}
            <div className="dashboard-main">
                {/* Hero Section */}
                <div className="hero-section">
                    <div className="hero-content">
                        <h1 className="hero-title">
                            Welcome back, <span className="highlight">{user.name.split(' ')[0]}</span>! 👋
                        </h1>
                        <p className="hero-subtitle">
                            Book your car service in just a few clicks. Professional service at your doorstep.
                        </p>
                        <div className="hero-stats">
                            <div className="stat-card">
                                <div className="stat-icon">⭐</div>
                                <div className="stat-info">
                                    <div className="stat-value">4.8/5</div>
                                    <div className="stat-label">Rating</div>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon">🔧</div>
                                <div className="stat-info">
                                    <div className="stat-value">12+</div>
                                    <div className="stat-label">Services</div>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon">⚡</div>
                                <div className="stat-info">
                                    <div className="stat-value">24/7</div>
                                    <div className="stat-label">Support</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Category Filter */}
                <div className="category-section">
                    <h2 className="section-title">Browse Services</h2>
                    <div className="category-filters">
                        {categories.map(category => (
                            <button
                                key={category.id}
                                onClick={() => setActiveFilter(category.id)}
                                className={`category-btn ${activeFilter === category.id ? 'active' : ''}`}
                            >
                                <span className="category-icon">{category.icon}</span>
                                <span className="category-name">{category.name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Services Grid */}
                <div className="services-section">
                    <div className="services-grid">
                        {filteredServices.map(service => (
                            <div key={service.id} className="service-card">
                                {service.popular && (
                                    <span className="service-badge popular">⭐ Popular</span>
                                )}
                                {service.new && (
                                    <span className="service-badge new">🆕 New</span>
                                )}

                                <div className="service-icon">{service.icon}</div>
                                <h3 className="service-name">{service.name}</h3>
                                <p className="service-description">{service.description}</p>

                                <div className="service-details">
                                    <div className="service-detail">
                                        <span className="detail-icon">💰</span>
                                        <span className="detail-text">
                                            {service.price === 0 ? 'Free' : `₹${service.price}`}
                                        </span>
                                    </div>
                                    <div className="service-detail">
                                        <span className="detail-icon">⏱️</span>
                                        <span className="detail-text">{service.duration}</span>
                                    </div>
                                </div>

                                <button className="book-btn">
                                    Book Now
                                    <span className="btn-arrow">→</span>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
