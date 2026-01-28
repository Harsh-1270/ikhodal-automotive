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
    const [cart, setCart] = useState([]);
    const [showCartNotification, setShowCartNotification] = useState(false);

    // Cart functions
    const addToCart = (service) => {
        const existingItem = cart.find(item => item.id === service.id);
        if (existingItem) {
            setCart(cart.map(item =>
                item.id === service.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            ));
        } else {
            setCart([...cart, { ...service, quantity: 1 }]);
        }

        // Show notification
        setShowCartNotification(true);
        setTimeout(() => setShowCartNotification(false), 3000);
    };

    const removeFromCart = (serviceId) => {
        setCart(cart.filter(item => item.id !== serviceId));
    };

    const isInCart = (serviceId) => {
        return cart.some(item => item.id === serviceId);
    };

    const getTotalItems = () => {
        return cart.reduce((sum, item) => sum + item.quantity, 0);
    };

    const getTotalPrice = () => {
        return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    };

    // Navigate to cart
    const goToCart = () => {
        navigate('/cart');
    };

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

    // Real services data based on I Khodal Automotive
    const services = [
        // Mobile Call-Out Service
        {
            id: 1,
            name: 'Mobile Mechanic Call-Out',
            icon: '🚗',
            description: 'Fast mobile mechanic to your location',
            price: 89,
            duration: '30 mins',
            category: 'mobile',
            popular: true,
            rating: 4.9,
            reviews: 523
        },
        // Service Packages
        {
            id: 2,
            name: 'Essential Care Service',
            icon: '🟢',
            description: 'Basic car service for everyday driving',
            price: 149,
            duration: '1-2 hours',
            category: 'service-packages',
            popular: true,
            rating: 4.8,
            reviews: 412
        },
        {
            id: 3,
            name: 'Complete Care Service',
            icon: '🔵',
            description: 'Comprehensive logbook-style service',
            price: 249,
            duration: '2-3 hours',
            category: 'service-packages',
            popular: true,
            rating: 4.9,
            reviews: 687
        },
        {
            id: 4,
            name: 'Premium Care Service',
            icon: '🔴',
            description: 'Detailed full vehicle health check',
            price: 349,
            duration: '3-4 hours',
            category: 'service-packages',
            rating: 4.9,
            reviews: 298
        },
        // Mechanical Repairs
        {
            id: 5,
            name: 'Mechanical Repairs',
            icon: '🛠️',
            description: 'Professional mobile mechanical repairs',
            price: 120,
            duration: '1-2 hours',
            category: 'repairs',
            rating: 4.7,
            reviews: 356
        },
        {
            id: 6,
            name: 'Brake Repairs & Replacement',
            icon: '🚘',
            description: 'Complete brake inspection & replacement',
            price: 180,
            duration: '1-2 hours',
            category: 'repairs',
            popular: true,
            rating: 4.8,
            reviews: 445
        },
        // Diagnostics & Testing
        {
            id: 7,
            name: 'Vehicle Diagnostics',
            icon: '🔍',
            description: 'Advanced diagnostic scan & fault codes',
            price: 79,
            duration: '30-45 mins',
            category: 'diagnostics',
            new: true,
            rating: 4.9,
            reviews: 234
        },
        {
            id: 8,
            name: 'Battery Testing & Replacement',
            icon: '🔋',
            description: 'Battery test, supply & installation',
            price: 150,
            duration: '30 mins',
            category: 'diagnostics',
            rating: 4.8,
            reviews: 389
        },
        // Electrical Services
        {
            id: 9,
            name: 'Auto Electrical Services',
            icon: '💡',
            description: 'Lighting, wiring & electrical repairs',
            price: 95,
            duration: '1 hour',
            category: 'electrical',
            rating: 4.7,
            reviews: 267
        },
        {
            id: 10,
            name: 'Dash Cam Installation',
            icon: '🎥',
            description: 'Professional dash cam setup',
            price: 120,
            duration: '1-2 hours',
            category: 'electrical',
            popular: true,
            rating: 4.9,
            reviews: 512
        },
        {
            id: 11,
            name: 'Car Audio & Sound Upgrades',
            icon: '🔊',
            description: 'Speaker & audio system installation',
            price: 180,
            duration: '2-3 hours',
            category: 'electrical',
            rating: 4.8,
            reviews: 198
        },
        // Air Conditioning
        {
            id: 12,
            name: 'Air Conditioning Inspection',
            icon: '❄️',
            description: 'AC system check & pressure testing',
            price: 89,
            duration: '45 mins',
            category: 'inspection',
            rating: 4.7,
            reviews: 312
        },
        // Inspections
        {
            id: 13,
            name: 'Pre-Purchase Inspection',
            icon: '🚙',
            description: 'Detailed inspection before buying',
            price: 199,
            duration: '1-2 hours',
            category: 'inspection',
            new: true,
            rating: 4.9,
            reviews: 423
        },
        {
            id: 14,
            name: 'Vehicle Safety Inspection',
            icon: '🧰',
            description: 'Overall safety & condition check',
            price: 129,
            duration: '1 hour',
            category: 'inspection',
            rating: 4.8,
            reviews: 378
        },
        // Accessories
        {
            id: 15,
            name: 'Accessory Fitment',
            icon: '⚡',
            description: 'Reverse cameras, USB ports & more',
            price: 99,
            duration: '1-2 hours',
            category: 'accessories',
            rating: 4.7,
            reviews: 256
        }
    ];

    const categories = [
        { id: 'all', name: 'All Services', icon: '🔧', count: 15 },
        { id: 'mobile', name: 'Mobile Call-Out', icon: '🚗', count: 1 },
        { id: 'service-packages', name: 'Service Packages', icon: '📦', count: 3 },
        { id: 'repairs', name: 'Repairs', icon: '🛠️', count: 2 },
        { id: 'diagnostics', name: 'Diagnostics', icon: '🔍', count: 2 },
        { id: 'electrical', name: 'Electrical', icon: '💡', count: 3 },
        { id: 'inspection', name: 'Inspection', icon: '🧰', count: 3 },
        { id: 'accessories', name: 'Accessories', icon: '⚡', count: 1 }
    ];

    const filteredServices = activeFilter === 'all'
        ? services
        : services.filter(service => service.category === activeFilter);

    // Handle browser back button - redirect to home page
    useEffect(() => {
        const handlePopState = (e) => {
            e.preventDefault();
            navigate('/', { replace: true });
        };

        // Add a history entry
        window.history.pushState(null, '', window.location.href);

        // Listen for back button
        window.addEventListener('popstate', handlePopState);

        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, [navigate]);

    return (
        <div className="dashboard-container">
            {/* Top Navigation Bar */}
            <UserNavbar cartCount={getTotalItems()} />

            {/* Cart Notification */}
            {showCartNotification && (
                <div className="cart-notification">
                    <span className="notification-icon">✓</span>
                    <span className="notification-text">Item added to cart!</span>
                    <button className="view-cart-btn" onClick={goToCart}>
                        View Cart
                    </button>
                </div>
            )}

            {/* Floating Cart Button */}
            {cart.length > 0 && (
                <button className="floating-cart-btn" onClick={goToCart}>
                    <span className="cart-icon">🛒</span>
                    <span className="cart-badge">{getTotalItems()}</span>
                    <span className="cart-text">
                        ₹{getTotalPrice().toLocaleString()}
                    </span>
                </button>
            )}

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
                                Book premium car services in minutes. Professional mobile mechanic care for your vehicle.
                            </p>
                            <div className="quick-actions">
                                <button
                                    className="quick-btn primary"
                                    onClick={() => sectionRefs.services.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                                >
                                    <span className="btn-icon">📅</span>
                                    Book Service
                                </button>
                                <button className="quick-btn secondary" onClick={() => navigate('/my-bookings')}>
                                    <span className="btn-icon">📍</span>
                                    Track Bookings
                                </button>
                            </div>
                        </div>
                        <div className="banner-right">
                            <div className="floating-card card-1">
                                <div className="card-icon">⭐</div>
                                <div className="card-text">
                                    <div className="card-value">4.9/5</div>
                                    <div className="card-label">Rating</div>
                                </div>
                            </div>
                            <div className="floating-card card-2">
                                <div className="card-icon">🚀</div>
                                <div className="card-text">
                                    <div className="card-value">5K+</div>
                                    <div className="card-label">Customers</div>
                                </div>
                            </div>
                            <div className="floating-card card-3">
                                <div className="card-icon">⚡</div>
                                <div className="card-text">
                                    <div className="card-value">Mobile</div>
                                    <div className="card-label">Service</div>
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
                                            {service.price === 0 ? 'Free' : `₹${service.price.toLocaleString()}`}
                                        </span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-icon">⏱️</span>
                                        <span className="info-text">{service.duration}</span>
                                    </div>
                                </div>

                                <div className="service-actions">
                                    <button
                                        className={`add-cart-btn ${isInCart(service.id) ? 'in-cart' : ''}`}
                                        onClick={() => addToCart(service)}
                                    >
                                        <span className="cart-icon">🛒</span>
                                        {isInCart(service.id) ? 'Added' : 'Add'}
                                    </button>
                                    <button className="service-book-btn">
                                        Book Now
                                        <span className="btn-arrow">→</span>
                                    </button>
                                </div>
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
                            <h3>Mobile Service</h3>
                            <p>We come to you - home, work or roadside</p>
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
                            <div className="stat-value">Victoria</div>
                            <div className="stat-label">All Suburbs</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
