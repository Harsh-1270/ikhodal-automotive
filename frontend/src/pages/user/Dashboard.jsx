import React, { useState, useEffect, useRef } from 'react';
import './Dashboard.css';

const Dashboard = () => {
    const [activeFilter, setActiveFilter] = useState('all');
    const [visibleSections, setVisibleSections] = useState(new Set());

    // Refs for sections
    const sectionRefs = {
        welcome: useRef(null),
        popular: useRef(null),
        category: useRef(null),
        services: useRef(null),
        whyChoose: useRef(null),
        testimonials: useRef(null)
    };

    /* ==========================================
       INTERSECTION OBSERVER - SMOOTH SCROLL ANIMATIONS
       ========================================== */
    useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observerCallback = (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setVisibleSections(prev => new Set([...prev, entry.target.dataset.section]));
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);

        Object.values(sectionRefs).forEach(ref => {
            if (ref.current) {
                observer.observe(ref.current);
            }
        });

        return () => {
            Object.values(sectionRefs).forEach(ref => {
                if (ref.current) {
                    observer.unobserve(ref.current);
                }
            });
        };
    }, []);

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
            name: 'General Service',
            icon: '🔧',
            description: 'Complete car checkup & maintenance',
            price: 2499,
            duration: '2-3 hours',
            category: 'maintenance',
            popular: true,
            rating: 4.8,
            reviews: 234
        },
        {
            id: 2,
            name: 'AC Service',
            icon: '❄️',
            description: 'AC repair, gas refill & cleaning',
            price: 1799,
            duration: '1-2 hours',
            category: 'repair',
            popular: true,
            rating: 4.7,
            reviews: 189
        },
        {
            id: 3,
            name: 'Battery Service',
            icon: '🔋',
            description: 'Battery replacement & charging',
            price: 3499,
            duration: '30 mins',
            category: 'replacement',
            rating: 4.6,
            reviews: 156
        },
        {
            id: 4,
            name: 'Tyres & Wheels',
            icon: '⚙️',
            description: 'Alignment, balancing & rotation',
            price: 1199,
            duration: '1 hour',
            category: 'maintenance',
            popular: true,
            rating: 4.9,
            reviews: 312
        },
        {
            id: 5,
            name: 'Denting & Painting',
            icon: '🎨',
            description: 'Body repair & premium painting',
            price: 4999,
            duration: '1-2 days',
            category: 'repair',
            rating: 4.5,
            reviews: 98
        },
        {
            id: 6,
            name: 'Car Detailing',
            icon: '✨',
            description: 'Interior & exterior deep cleaning',
            price: 1999,
            duration: '2-3 hours',
            category: 'cleaning',
            rating: 4.8,
            reviews: 267
        },
        {
            id: 7,
            name: 'Car Spa',
            icon: '🧼',
            description: 'Premium wash, polish & waxing',
            price: 799,
            duration: '1 hour',
            category: 'cleaning',
            popular: true,
            rating: 4.7,
            reviews: 445
        },
        {
            id: 8,
            name: 'Full Inspection',
            icon: '📋',
            description: 'Complete vehicle health checkup',
            price: 1499,
            duration: '1 hour',
            category: 'inspection',
            new: true,
            rating: 4.9,
            reviews: 178
        },
        {
            id: 9,
            name: 'Windshield Repair',
            icon: '💡',
            description: 'Glass replacement & restoration',
            price: 2199,
            duration: '1-2 hours',
            category: 'repair',
            rating: 4.6,
            reviews: 134
        },
        {
            id: 10,
            name: 'Suspension',
            icon: '🛠️',
            description: 'Shock absorber replacement',
            price: 3999,
            duration: '2-3 hours',
            category: 'repair',
            rating: 4.7,
            reviews: 201
        },
        {
            id: 11,
            name: 'Clutch Service',
            icon: '⚡',
            description: 'Clutch plate replacement',
            price: 5999,
            duration: '3-4 hours',
            category: 'replacement',
            new: true,
            rating: 4.8,
            reviews: 89
        },
        {
            id: 12,
            name: 'Insurance Help',
            icon: '🛡️',
            description: 'Claim assistance & support',
            price: 0,
            duration: 'Free',
            category: 'support',
            rating: 4.9,
            reviews: 412
        }
    ];

    const categories = [
        { id: 'all', name: 'All Services', icon: '🔧', count: 12 },
        { id: 'maintenance', name: 'Maintenance', icon: '🔨', count: 3 },
        { id: 'repair', name: 'Repair', icon: '⚙️', count: 4 },
        { id: 'cleaning', name: 'Cleaning', icon: '✨', count: 2 },
        { id: 'replacement', name: 'Replacement', icon: '🔄', count: 2 },
        { id: 'inspection', name: 'Inspection', icon: '📋', count: 1 }
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

            {/* Main Scrollable Content */}
            <div className="dashboard-main">
                {/* Welcome Banner */}
                <div
                    ref={sectionRefs.welcome}
                    data-section="welcome"
                    className={`welcome-banner ${visibleSections.has('welcome') ? 'section-visible' : ''}`}
                >
                    <div className="banner-content">
                        <div className="banner-left">
                            <div className="greeting">
                                <span className="wave-emoji">👋</span>
                                <h1 className="welcome-title">
                                    Welcome back, <span className="user-highlight">{user.name.split(' ')[0]}</span>!
                                </h1>
                            </div>
                            <p className="welcome-text">
                                Book premium car services in minutes. Professional care for your vehicle.
                            </p>
                            <div className="quick-actions">
                                <button className="quick-btn primary">
                                    <span className="btn-icon">📅</span>
                                    Book Service
                                </button>
                                <button className="quick-btn secondary">
                                    <span className="btn-icon">📍</span>
                                    Track Order
                                </button>
                            </div>
                        </div>
                        <div className="banner-right">
                            <div className="floating-card card-1">
                                <div className="card-icon">⭐</div>
                                <div className="card-text">
                                    <div className="card-value">4.8/5</div>
                                    <div className="card-label">Rating</div>
                                </div>
                            </div>
                            <div className="floating-card card-2">
                                <div className="card-icon">🚀</div>
                                <div className="card-text">
                                    <div className="card-value">2K+</div>
                                    <div className="card-label">Customers</div>
                                </div>
                            </div>
                            <div className="floating-card card-3">
                                <div className="card-icon">⚡</div>
                                <div className="card-text">
                                    <div className="card-value">24/7</div>
                                    <div className="card-label">Support</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Popular Services Quick Access */}
                <div
                    ref={sectionRefs.popular}
                    data-section="popular"
                    className={`popular-services-section ${visibleSections.has('popular') ? 'section-visible' : ''}`}
                >
                    <h2 className="section-title">⚡ Most Popular Services</h2>
                    <div className="popular-grid">
                        {services.filter(s => s.popular).slice(0, 4).map(service => (
                            <div key={service.id} className="popular-card">
                                <div className="popular-icon">{service.icon}</div>
                                <div className="popular-name">{service.name}</div>
                                <div className="popular-price">₹{service.price.toLocaleString()}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Category Filter Pills */}
                <div
                    ref={sectionRefs.category}
                    data-section="category"
                    className={`category-section ${visibleSections.has('category') ? 'section-visible' : ''}`}
                >
                    <h2 className="section-title">Browse by Category</h2>
                    <div className="category-pills">
                        {categories.map(category => (
                            <button
                                key={category.id}
                                onClick={() => setActiveFilter(category.id)}
                                className={`pill ${activeFilter === category.id ? 'active' : ''}`}
                            >
                                <span className="pill-icon">{category.icon}</span>
                                <span className="pill-name">{category.name}</span>
                                <span className="pill-count">{category.count}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Services Grid */}
                <div
                    ref={sectionRefs.services}
                    data-section="services"
                    className={`services-section ${visibleSections.has('services') ? 'section-visible' : ''}`}
                >
                    <div className="section-header-row">
                        <h2 className="section-title">All Services</h2>
                        <div className="view-toggle">
                            <button className="toggle-btn active">
                                <span>▦</span>
                            </button>
                            <button className="toggle-btn">
                                <span>☰</span>
                            </button>
                        </div>
                    </div>

                    <div className="services-grid">
                        {filteredServices.map((service, index) => (
                            <div
                                key={service.id}
                                className="service-card-new"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className="service-header-badges">
                                    {service.popular && (
                                        <span className="badge-popular">🔥 Popular</span>
                                    )}
                                    {service.new && (
                                        <span className="badge-new">✨ New</span>
                                    )}
                                </div>

                                <div className="service-icon-large">{service.icon}</div>

                                <h3 className="service-title">{service.name}</h3>
                                <p className="service-desc">{service.description}</p>

                                <div className="service-rating">
                                    <div className="stars">⭐ {service.rating}</div>
                                    <span className="reviews">({service.reviews} reviews)</span>
                                </div>

                                <div className="service-info-row">
                                    <div className="info-item">
                                        <span className="info-icon">💰</span>
                                        <span className="info-text">
                                            {service.price === 0 ? 'Free' : `₹${service.price.toLocaleString()}`}
                                        </span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-icon">⏱️</span>
                                        <span className="info-text">{service.duration}</span>
                                    </div>
                                </div>

                                <button className="service-book-btn">
                                    Book Now
                                    <span className="btn-arrow">→</span>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Why Choose Section */}
                <div
                    ref={sectionRefs.whyChoose}
                    data-section="whyChoose"
                    className={`why-choose-section ${visibleSections.has('whyChoose') ? 'section-visible' : ''}`}
                >
                    <h2 className="section-title-center">Why Choose AutoCare?</h2>
                    <div className="benefits-grid">
                        <div className="benefit-item">
                            <div className="benefit-icon">🎯</div>
                            <h3>Expert Technicians</h3>
                            <p>Certified professionals with 10+ years experience</p>
                        </div>
                        <div className="benefit-item">
                            <div className="benefit-icon">💎</div>
                            <h3>Premium Quality</h3>
                            <p>Genuine parts with warranty guarantee</p>
                        </div>
                        <div className="benefit-item">
                            <div className="benefit-icon">⚡</div>
                            <h3>Quick Service</h3>
                            <p>Fast turnaround without compromising quality</p>
                        </div>
                        <div className="benefit-item">
                            <div className="benefit-icon">💯</div>
                            <h3>Best Prices</h3>
                            <p>Transparent pricing with no hidden charges</p>
                        </div>
                    </div>
                </div>

                {/* Testimonials */}
                <div
                    ref={sectionRefs.testimonials}
                    data-section="testimonials"
                    className={`testimonials-section ${visibleSections.has('testimonials') ? 'section-visible' : ''}`}
                >
                    <h2 className="section-title-center">What Our Customers Say</h2>
                    <div className="testimonials-grid">
                        <div className="testimonial-card">
                            <div className="testimonial-stars">⭐⭐⭐⭐⭐</div>
                            <p className="testimonial-text">
                                "Excellent service! My car feels brand new after the full service. Highly recommended!"
                            </p>
                            <div className="testimonial-author">
                                <div className="author-avatar">RS</div>
                                <div>
                                    <div className="author-name">Rajesh Sharma</div>
                                    <div className="author-title">BMW Owner</div>
                                </div>
                            </div>
                        </div>
                        <div className="testimonial-card">
                            <div className="testimonial-stars">⭐⭐⭐⭐⭐</div>
                            <p className="testimonial-text">
                                "Professional team, great pricing, and super quick service. Will definitely come back!"
                            </p>
                            <div className="testimonial-author">
                                <div className="author-avatar">PK</div>
                                <div>
                                    <div className="author-name">Priya Kumar</div>
                                    <div className="author-title">Honda City Owner</div>
                                </div>
                            </div>
                        </div>
                        <div className="testimonial-card">
                            <div className="testimonial-stars">⭐⭐⭐⭐⭐</div>
                            <p className="testimonial-text">
                                "Best car service experience ever. Transparent pricing and excellent customer support!"
                            </p>
                            <div className="testimonial-author">
                                <div className="author-avatar">AM</div>
                                <div>
                                    <div className="author-name">Amit Mehta</div>
                                    <div className="author-title">Maruti Owner</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <footer className="dashboard-footer">
                    <div className="footer-content">
                        <div className="footer-brand">
                            <div className="footer-logo">
                                <span className="logo-icon">🚗</span>
                                <span className="logo-text">AutoCare</span>
                            </div>
                            <p className="footer-tagline">Your trusted car service partner</p>
                        </div>
                        <div className="footer-links">
                            <div className="footer-col">
                                <h4>Services</h4>
                                <a href="#">General Service</a>
                                <a href="#">AC Repair</a>
                                <a href="#">Car Wash</a>
                                <a href="#">Detailing</a>
                            </div>
                            <div className="footer-col">
                                <h4>Company</h4>
                                <a href="#">About Us</a>
                                <a href="#">Contact</a>
                                <a href="#">Careers</a>
                                <a href="#">Blog</a>
                            </div>
                            <div className="footer-col">
                                <h4>Support</h4>
                                <a href="#">Help Center</a>
                                <a href="#">Terms</a>
                                <a href="#">Privacy</a>
                                <a href="#">FAQ</a>
                            </div>
                        </div>
                    </div>
                    <div className="footer-bottom">
                        <p>© 2024 AutoCare. All rights reserved.</p>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default Dashboard;
