import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import UserNavbar from '../../components/common/UserNavbar';
import './Dashboard.css';

const Dashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [activeFilter, setActiveFilter] = useState('all');
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
    const [visibleSections, setVisibleSections] = useState(new Set());
    const [initialLoadComplete, setInitialLoadComplete] = useState(false);
    const [cart, setCart] = useState([]);
    const [showCartNotification, setShowCartNotification] = useState(false);

    /* ==========================================
       SVG ICONS COMPONENT - COLORFUL GRADIENTS
       ========================================== */
    const Icons = {
        Car: ({ className = "" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="url(#dashCarGradient)">
                <defs>
                    <linearGradient id="dashCarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#f59e0b" />
                        <stop offset="100%" stopColor="#ef4444" />
                    </linearGradient>
                </defs>
                <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
            </svg>
        ),
        User: ({ className = "" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke="url(#dashUserGradient)" strokeWidth="2">
                <defs>
                    <linearGradient id="dashUserGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#7c3aed" />
                    </linearGradient>
                </defs>
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
            </svg>
        ),
        Wave: ({ className = "" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="url(#dashWaveGradient)">
                <defs>
                    <linearGradient id="dashWaveGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#06b6d4" />
                        <stop offset="100%" stopColor="#0ea5e9" />
                    </linearGradient>
                </defs>
                <path d="M7.5 11c.8 0 1.5-.7 1.5-1.5V3c0-.8-.7-1.5-1.5-1.5S6 2.2 6 3v6.5C6 10.3 6.7 11 7.5 11zM4.5 13c-.8 0-1.5.7-1.5 1.5V21c0 .8.7 1.5 1.5 1.5S6 21.8 6 21v-6.5C6 13.7 5.3 13 4.5 13zM13.5 7c-.8 0-1.5.7-1.5 1.5V21c0 .8.7 1.5 1.5 1.5s1.5-.7 1.5-1.5V8.5C15 7.7 14.3 7 13.5 7zM10.5 1C9.7 1 9 1.7 9 2.5V21c0 .8.7 1.5 1.5 1.5S12 21.8 12 21V2.5C12 1.7 11.3 1 10.5 1z" />
            </svg>
        ),
        Calendar: ({ className = "" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke="url(#dashCalendarGradient)" strokeWidth="2">
                <defs>
                    <linearGradient id="dashCalendarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#2563eb" />
                    </linearGradient>
                </defs>
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
        ),
        MapPin: ({ className = "" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke="url(#dashMapPinGradient)" strokeWidth="2">
                <defs>
                    <linearGradient id="dashMapPinGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#ef4444" />
                        <stop offset="100%" stopColor="#dc2626" />
                    </linearGradient>
                </defs>
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
            </svg>
        ),
        Star: ({ className = "" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="url(#dashStarGradient)">
                <defs>
                    <linearGradient id="dashStarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#fbbf24" />
                        <stop offset="100%" stopColor="#f59e0b" />
                    </linearGradient>
                </defs>
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
        ),
        Rocket: ({ className = "" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="url(#dashRocketGradient)">
                <defs>
                    <linearGradient id="dashRocketGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#6366f1" />
                    </linearGradient>
                </defs>
                <path d="M12 2c-4 0-8 .5-8 4 0 1.5.5 3 1 4l-1 4c0 .5.5 1 1 1h2v3c0 .5.5 1 1 1s1-.5 1-1v-3h4v3c0 .5.5 1 1 1s1-.5 1-1v-3h2c.5 0 1-.5 1-1l-1-4c.5-1 1-2.5 1-4 0-3.5-4-4-8-4zm0 2c2.4 0 4.7.3 5.7 1.3.3.3.3.6.3 1.2 0 1-.4 2.2-.8 3.2L16 12H8l-1.2-2.3c-.4-1-.8-2.2-.8-3.2 0-.6 0-.9.3-1.2C7.3 4.3 9.6 4 12 4z" />
            </svg>
        ),
        Lightning: ({ className = "" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="url(#dashLightningGradient)">
                <defs>
                    <linearGradient id="dashLightningGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#fbbf24" />
                        <stop offset="100%" stopColor="#f59e0b" />
                    </linearGradient>
                </defs>
                <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" />
            </svg>
        ),
        Fire: ({ className = "" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="url(#dashFireGradient)">
                <defs>
                    <linearGradient id="dashFireGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#f59e0b" />
                        <stop offset="100%" stopColor="#ef4444" />
                    </linearGradient>
                </defs>
                <path d="M13.5 0c-.8 2.5-1.5 5-2.8 6.5-1.3-2-2.5-4-4.2-6 0 0-2.5 4.5-2.5 9.5 0 5 4 9 9 9s9-4 9-9c0-4-2-7-3-8.5-.5 1.5-1.5 3-3 4-1-2.5-1.5-4-2.5-5.5z" />
            </svg>
        ),
        Sparkles: ({ className = "" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="url(#dashSparklesGradient)">
                <defs>
                    <linearGradient id="dashSparklesGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#fbbf24" />
                        <stop offset="100%" stopColor="#f59e0b" />
                    </linearGradient>
                </defs>
                <path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8L12 2z" />
                <path d="M5 5l1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3z" />
            </svg>
        ),
        Package: ({ className = "" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16.5 9.4l-9-5.19M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
        ),
        Tool: ({ className = "" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z" />
            </svg>
        ),
        Magnifier: ({ className = "" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
            </svg>
        ),
        Bulb: ({ className = "" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 21c0 .5.4 1 1 1h4c.6 0 1-.5 1-1v-1H9v1zm3-19C8.1 2 5 5.1 5 9c0 2.4 1.2 4.5 3 5.7V17c0 .5.4 1 1 1h6c.6 0 1-.5 1-1v-2.3c1.8-1.3 3-3.4 3-5.7 0-3.9-3.1-7-7-7z" />
            </svg>
        ),
        Wrench: ({ className = "" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z" />
            </svg>
        ),
        Zap: ({ className = "" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="currentColor">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
        ),
        DollarSign: ({ className = "" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="1" x2="12" y2="23" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
        ),
        Clock: ({ className = "" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
            </svg>
        ),
        ShoppingCart: ({ className = "" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
        ),
        ArrowRight: ({ className = "" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
            </svg>
        ),
        Check: ({ className = "" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <polyline points="20 6 9 17 4 12" />
            </svg>
        ),
        Target: ({ className = "" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="6" />
                <circle cx="12" cy="12" r="2" />
            </svg>
        ),
        Diamond: ({ className = "" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7l10 15L22 7 12 2zm0 3.84L18.93 9H5.07L12 5.84zM6.54 11h10.92L12 18.5 6.54 11z" />
            </svg>
        ),
        Trophy: ({ className = "" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z" />
            </svg>
        ),
        Grid: ({ className = "" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
            </svg>
        ),
        List: ({ className = "" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="8" y1="6" x2="21" y2="6" />
                <line x1="8" y1="12" x2="21" y2="12" />
                <line x1="8" y1="18" x2="21" y2="18" />
                <line x1="3" y1="6" x2="3.01" y2="6" />
                <line x1="3" y1="12" x2="3.01" y2="12" />
                <line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
        ),
        Phone: ({ className = "" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
        ),
        Mail: ({ className = "" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
            </svg>
        )
    };

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

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
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
       INTERSECTION OBSERVER - IMMEDIATE SERVICE LOADING
       ========================================== */
    useEffect(() => {
        if (!initialLoadComplete) return;

        const observerOptions = {
            root: null,
            rootMargin: '0px 0px 300px 0px',  // Load 300px BEFORE element is visible
            threshold: 0  // Trigger immediately when element starts to appear
        };

        const observerCallback = (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const sectionName = entry.target.dataset.section;
                    setVisibleSections(prev => new Set([...prev, sectionName]));
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

    // Use logged-in user data from AuthContext
    const userName = user?.name || user?.email?.split('@')[0] || 'User';
    const userEmail = user?.email || '';

    // Real services data based on I Khodal Automotive
    const services = [
        // Mobile Call-Out Service
        {
            id: 1,
            name: 'Mobile Mechanic Call-Out',
            icon: <Icons.Car />,
            description: 'Fast mobile mechanic to your location',
            price: 89,
            duration: '30 mins',
            category: 'mobile',
            popular: true,
            rating: 4.9,
            // reviews: 523
        },
        // Service Packages
        {
            id: 2,
            name: 'Essential Care Service',
            icon: <Icons.Package />,
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
            icon: <Icons.Package />,
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
            icon: <Icons.Package />,
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
            icon: <Icons.Tool />,
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
            icon: <Icons.Car />,
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
            icon: <Icons.Magnifier />,
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
            icon: <Icons.Zap />,
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
            icon: <Icons.Bulb />,
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
            icon: <Icons.Bulb />,
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
            icon: <Icons.Bulb />,
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
            icon: <Icons.Wrench />,
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
            icon: <Icons.Magnifier />,
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
            icon: <Icons.Tool />,
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
            icon: <Icons.Zap />,
            description: 'Reverse cameras, USB ports & more',
            price: 99,
            duration: '1-2 hours',
            category: 'accessories',
            rating: 4.7,
            reviews: 256
        }
    ];

    const categories = [
        { id: 'all', name: 'All Services', icon: <Icons.Wrench />, count: 15 },
        { id: 'mobile', name: 'Mobile Call-Out', icon: <Icons.Car />, count: 1 },
        { id: 'service-packages', name: 'Service Packages', icon: <Icons.Package />, count: 3 },
        { id: 'repairs', name: 'Repairs', icon: <Icons.Tool />, count: 2 },
        { id: 'diagnostics', name: 'Diagnostics', icon: <Icons.Magnifier />, count: 2 },
        { id: 'electrical', name: 'Electrical', icon: <Icons.Bulb />, count: 3 },
        { id: 'inspection', name: 'Inspection', icon: <Icons.Tool />, count: 3 },
        { id: 'accessories', name: 'Accessories', icon: <Icons.Zap />, count: 1 }
    ];

    const filteredServices = activeFilter === 'all'
        ? services
        : services.filter(service => service.category === activeFilter);

    // Prevent browser back button from going to login/home page after logging in
    useEffect(() => {
        const handlePopState = (e) => {
            e.preventDefault();
            // Push the current page back into history so user stays on dashboard
            window.history.pushState(null, '', window.location.href);
        };

        // Add a history entry to trap the back button
        window.history.pushState(null, '', window.location.href);

        // Listen for back button
        window.addEventListener('popstate', handlePopState);

        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, []);

    return (
        <div className="dashboard-container">
            {/* Top Navigation Bar */}
            <UserNavbar cartCount={getTotalItems()} />

            {/* Cart Notification */}
            {showCartNotification && (
                <div className="cart-notification">
                    <span className="notification-icon">
                        <Icons.Check />
                    </span>
                    <span className="notification-text">Item added to cart!</span>
                    <button className="view-cart-btn" onClick={goToCart}>
                        View Cart
                    </button>
                </div>
            )}

            {/* Floating Cart Button */}
            {cart.length > 0 && (
                <button className="floating-cart-btn" onClick={goToCart}>
                    <span className="cart-icon">
                        <Icons.ShoppingCart />
                    </span>
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
                                <h1 className="welcome-title">
                                    <span className="wave-emoji">
                                        <Icons.Wave />
                                    </span>
                                    Welcome back, <span className="user-highlight">{userName.split(' ')[0]}</span>!
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
                                    <span className="btn-icon">
                                        <Icons.Calendar />
                                    </span>
                                    Book Service
                                </button>
                                <button className="quick-btn secondary" onClick={() => navigate('/my-bookings')}>
                                    <span className="btn-icon">
                                        <Icons.MapPin />
                                    </span>
                                    Track Bookings
                                </button>
                            </div>
                        </div>
                        <div className="banner-right">
                            <div className="floating-card card-1">
                                <div className="card-icon">
                                    <Icons.Star />
                                </div>
                                <div className="card-text">
                                    <div className="card-value">4.9/5</div>
                                    <div className="card-label">Rating</div>
                                </div>
                            </div>
                            <div className="floating-card card-2">
                                <div className="card-icon">
                                    <Icons.Rocket />
                                </div>
                                <div className="card-text">
                                    <div className="card-value">5K+</div>
                                    <div className="card-label">Customers</div>
                                </div>
                            </div>
                            <div className="floating-card card-3">
                                <div className="card-icon">
                                    <Icons.Lightning />
                                </div>
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
                    <h2 className="section-title">
                        <Icons.Lightning className="section-title-icon" /> Most Popular Services
                    </h2>
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
                            <button
                                className={`toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                                onClick={() => setViewMode('grid')}
                            >
                                <Icons.Grid />
                            </button>
                            <button
                                className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                                onClick={() => setViewMode('list')}
                            >
                                <Icons.List />
                            </button>
                        </div>
                    </div>

                    <div className={`services-${viewMode}`}>
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
                                        <span className="badge-popular">
                                            <Icons.Fire className="badge-icon" /> Popular
                                        </span>
                                    )}
                                    {service.new && (
                                        <span className="badge-new">
                                            <Icons.Sparkles className="badge-icon" /> New
                                        </span>
                                    )}
                                </div>

                                <div className="service-icon-large">{service.icon}</div>

                                <div className="service-content">
                                    <h3 className="service-title">{service.name}</h3>
                                    <p className="service-desc">{service.description}</p>

                                    <div className="service-info-row">
                                        <div className="info-item">
                                            <span className="info-icon">
                                                <Icons.DollarSign />
                                            </span>
                                            <span className="info-text">
                                                {service.price === 0 ? 'Free' : `₹${service.price.toLocaleString()}`}
                                            </span>
                                        </div>
                                        <div className="info-item">
                                            <span className="info-icon">
                                                <Icons.Clock />
                                            </span>
                                            <span className="info-text">{service.duration}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="service-actions">
                                    <button
                                        className={`add-cart-btn ${isInCart(service.id) ? 'in-cart' : ''}`}
                                        onClick={() => addToCart(service)}
                                    >
                                        <span className="cart-icon">
                                            <Icons.ShoppingCart />
                                        </span>
                                        {isInCart(service.id) ? 'Added' : 'Add'}
                                    </button>
                                    <button className="service-book-btn">
                                        Book Now
                                        <span className="btn-arrow">
                                            <Icons.ArrowRight />
                                        </span>
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
                            <div className="benefit-icon">
                                <Icons.Target />
                            </div>
                            <h3>Expert Technicians</h3>
                            <p>Certified professionals with 10+ years experience</p>
                        </div>
                        <div className="benefit-item">
                            <div className="benefit-icon">
                                <Icons.Diamond />
                            </div>
                            <h3>Premium Quality</h3>
                            <p>Genuine parts with warranty guarantee</p>
                        </div>
                        <div className="benefit-item">
                            <div className="benefit-icon">
                                <Icons.Lightning />
                            </div>
                            <h3>Mobile Service</h3>
                            <p>We come to you - home, work or roadside</p>
                        </div>
                        <div className="benefit-item">
                            <div className="benefit-icon">
                                <Icons.Trophy />
                            </div>
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
                            <div className="stat-icon">
                                <Icons.Trophy />
                            </div>
                            <div className="stat-value">15K+</div>
                            <div className="stat-label">Happy Customers</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">
                                <Icons.Wrench />
                            </div>
                            <div className="stat-value">25K+</div>
                            <div className="stat-label">Services Completed</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">
                                <Icons.Star />
                            </div>
                            <div className="stat-value">4.9/5</div>
                            <div className="stat-label">Average Rating</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">
                                <Icons.MapPin />
                            </div>
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
