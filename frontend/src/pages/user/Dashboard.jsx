import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import UserNavbar from '../../components/common/UserNavbar';
import './Dashboard.css';

const Dashboard = () => {
    const navigate = useNavigate();
    const [activeFilter, setActiveFilter] = useState('all');
    const [visibleSections, setVisibleSections] = useState(new Set());
    const [initialLoadComplete, setInitialLoadComplete] = useState(false);
    const hasScrolledDown = useRef(false);



    // Refs for sections
    const sectionRefs = {
        welcome: useRef(null),
        popular: useRef(null),
        category: useRef(null),
        services: useRef(null),
        whyChoose: useRef(null),
        stats: useRef(null)
    };

    /* ==========================================
       DELAYED INITIAL LOAD
       ========================================== */
    useEffect(() => {
        setInitialLoadComplete(true);
    }, []);

    /* ==========================================
       INTERSECTION OBSERVER - SMOOTH SCROLL ANIMATIONS
       ========================================== */
    useEffect(() => {
        if (!initialLoadComplete) return;

        const observerOptions = {
            root: null,
            rootMargin: '-50px 0px -100px 0px',
            threshold: [0, 0.05, 0.1]
        };

        const observerCallback = (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting && entry.intersectionRatio >= 0.05) {
                    const sectionName = entry.target.dataset.section;

                    if (!hasScrolledDown.current || entry.boundingClientRect.top > 0) {
                        hasScrolledDown.current = true;

                        setTimeout(() => {
                            setVisibleSections(prev => new Set([...prev, sectionName]));
                        }, 100);
                    }
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
    }, [initialLoadComplete]);

    // Mock user data
    const user = {
        name: 'Alis Desai',
        email: 'alis.desai@example.com',
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
            <UserNavbar />

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
                                <div className="popular-price">${service.price.toLocaleString()}</div>
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
                                style={{
                                    animationDelay: visibleSections.has('services') ? `${index * 0.15}s` : '0s'
                                }}
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
                                            {service.price === 0 ? 'Free' : `$${service.price.toLocaleString()}`}
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
                    <h2 className="section-title-center">Why Choose I Khodal Automotive?</h2>
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

                {/* Statistics Section */}
                <div
                    ref={sectionRefs.stats}
                    data-section="stats"
                    className={`stats-section ${visibleSections.has('stats') ? 'section-visible' : ''}`}
                >
                    <h2 className="section-title-center">Our Track Record</h2>
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-icon">🏆</div>
                            <div className="stat-value">15K+</div>
                            <div className="stat-label">Happy Customers</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">🔧</div>
                            <div className="stat-value">25K+</div>
                            <div className="stat-label">Services Completed</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">⭐</div>
                            <div className="stat-value">4.9/5</div>
                            <div className="stat-label">Average Rating</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">📍</div>
                            <div className="stat-value">50+</div>
                            <div className="stat-label">Service Centers</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
