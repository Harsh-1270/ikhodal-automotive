import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getPaymentHistory } from '../../services/api';
import UserNavbar from '../../components/common/UserNavbar';
import './Payment.css';

const Payments = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [sortBy, setSortBy] = useState('newest');

    /* ==========================================
       SVG ICONS COMPONENT
       ========================================== */
    const Icons = {
        // Core Service Icons
        Car: ({ className = "" }) => <svg className={className} viewBox="0 0 24 24" fill="url(#dashRedGradient)"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" /></svg>,
        Package: ({ className = "" }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="url(#dashBlueGradient)" strokeWidth="2"><path d="M16.5 9.4l-9-5.19M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></svg>,
        Tool: ({ className = "" }) => <svg className={className} viewBox="0 0 24 24" fill="url(#dashOrangeGradient)"><path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z" /></svg>,
        Magnifier: ({ className = "" }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="url(#dashCyanGradient)" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>,
        Battery: ({ className = "" }) => <svg className={className} viewBox="0 0 24 24" fill="url(#dashYellowLightGradient)"><rect x="1" y="6" width="18" height="12" rx="2" /><path d="M23 13v-2M5 10v4M8 10v4M14 9l-3 6" /></svg>,
        Snowflake: ({ className = "" }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="url(#dashGreenGradient)" strokeWidth="2"><line x1="12" y1="2" x2="12" y2="22" /><line x1="20" y1="12" x2="4" y2="12" /><line x1="17.66" y1="6.34" x2="6.34" y2="17.66" /><line x1="17.66" y1="17.66" x2="6.34" y2="6.34" /></svg>,
        Brakes: ({ className = "" }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="url(#dashRedGradient)" strokeWidth="2"><circle cx="12" cy="12" r="9" /><path d="M12 7v10M7 12h10" /><path d="M15 15l2 2M9 9l-2-2M15 9l2-2M9 15l-2 2" /></svg>,
        Engine: ({ className = "" }) => <svg className={className} viewBox="0 0 24 24" fill="url(#dashOrangeGradient)"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" /><path d="M12 5l-4 10h8l-4-10z" /></svg>,
        OilCan: ({ className = "" }) => <svg className={className} viewBox="0 0 24 24" fill="url(#dashBlueGradient)"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5L12 2 8 9.5c-2 1.6-3 3.5-3 5.5a7 7 0 0 0 7 7z" /></svg>,
        Wrench: ({ className = "" }) => <svg className={className} viewBox="0 0 24 24" fill="url(#dashGreenGradient)"><path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z" /></svg>,

        // UI Icons
        CreditCard: ({ className = "", color = "#6366f1" }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" /></svg>,
        DollarSign: ({ className = "", color = "#16a34a" }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>,
        BarChart: ({ className = "", color = "#3b82f6" }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="20" x2="12" y2="10" /><line x1="18" y1="20" x2="18" y2="4" /><line x1="6" y1="20" x2="6" y2="16" /></svg>,
        Calendar: ({ className = "", color = "#64748b" }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>,
        Clock: ({ className = "", color = "#ca8a04" }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>,
        Check: ({ className = "", color = "#10b981" }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>,
        ArrowRight: ({ className = "" }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>,
        User: ({ className = "", color = "#64748b" }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>,
        Sparkles: ({ className = "" }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3 1.912 5.813a2 2 0 0 0 1.275 1.275L21 12l-5.813 1.912a2 2 0 0 0-1.275 1.275L12 21l-1.912-5.813a2 2 0 0 0-1.275-1.275L3 12l5.813-1.912a2 2 0 0 0 1.275-1.275L12 3Z" /><path d="M5 3v4" /><path d="M19 17v4" /><path d="M3 5h4" /><path d="M17 19h4" /></svg>,
        TrendingDown: ({ className = "" }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6" /><polyline points="17 18 23 18 23 12" /></svg>,
        TrendingUp: ({ className = "" }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>,
        Tag: ({ className = "" }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" /><path d="M7 7h.01" /></svg>
    };

    const Gradients = () => (
        <svg style={{ width: 0, height: 0, position: 'absolute' }}>
            <defs>
                <linearGradient id="dashRedGradient" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#ef4444" /><stop offset="100%" stopColor="#b91c1c" /></linearGradient>
                <linearGradient id="dashBlueGradient" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#3b82f6" /><stop offset="100%" stopColor="#1d4ed8" /></linearGradient>
                <linearGradient id="dashOrangeGradient" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#f97316" /><stop offset="100%" stopColor="#c2410c" /></linearGradient>
                <linearGradient id="dashCyanGradient" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#06b6d4" /><stop offset="100%" stopColor="#0891b2" /></linearGradient>
                <linearGradient id="dashPurpleRocketGradient" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#8b5cf6" /><stop offset="100%" stopColor="#6366f1" /></linearGradient>
                <linearGradient id="dashPurpleGradient" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#a855f7" /><stop offset="100%" stopColor="#7e22ce" /></linearGradient>
                <linearGradient id="dashYellowLightGradient" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#fbbf24" /><stop offset="100%" stopColor="#f59e0b" /></linearGradient>
                <linearGradient id="dashGreenGradient" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#22c55e" /><stop offset="100%" stopColor="#15803d" /></linearGradient>
                <linearGradient id="dashYellowGradient" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#fbbf24" /><stop offset="100%" stopColor="#d97706" /></linearGradient>
            </defs>
        </svg>
    );

    const getIconComponent = (iconName) => {
        let IconComponent = Icons[iconName];
        if (!IconComponent) {
            const entry = Object.entries(Icons).find(([key]) => key.toLowerCase() === (iconName || '').toLowerCase());
            IconComponent = entry ? entry[1] : Icons.Wrench;
        }
        return <IconComponent />;
    };

    // Track if we came from a specific page
    const cameFromPage = location.state?.from;

    const [visibleTransactions, setVisibleTransactions] = useState(new Set());
    const [initialLoadComplete, setInitialLoadComplete] = useState(false);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const transactionRefs = useRef([]);

    // Get real payment history
    // Get real payment history
    useEffect(() => {
        const fetchHistory = async () => {
            try {
                setLoading(true);
                const response = await getPaymentHistory();
                if (response.success) {
                    // Map backend field names if they differ slightly
                    const mappedData = response.data.map(t => ({
                        ...t,
                        serviceName: t.serviceName || 'Service',
                        serviceIcon: t.serviceIcon || '🛠️'
                    }));
                    setTransactions(mappedData);
                }
            } catch (err) {
                console.error("Error fetching payment history:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    // Mock user data (kept for display if needed, though user info comes from Navbar)
    const user = {
        name: 'User',
        email: 'user@example.com',
        avatar: <Icons.User />
    };

    /* ==========================================
       DELAYED INITIAL LOAD
       ========================================== */
    useEffect(() => {
        const timer = setTimeout(() => {
            setInitialLoadComplete(true);
        }, 100);

        return () => clearTimeout(timer);
    }, []);

    /* ==========================================
       INTERSECTION OBSERVER - SMOOTH ANIMATIONS
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
                    const transactionId = entry.target.dataset.transactionId;
                    setTimeout(() => {
                        setVisibleTransactions(prev => new Set([...prev, String(transactionId)]));
                    }, 100);
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);

        transactionRefs.current.forEach(ref => {
            if (ref) {
                observer.observe(ref);
            }
        });

        return () => {
            transactionRefs.current.forEach(ref => {
                if (ref) {
                    observer.unobserve(ref);
                }
            });
        };
    }, [initialLoadComplete, sortBy, transactions]);

    // Sort transactions based on selected filter
    const sortedTransactions = [...transactions].sort((a, b) => {
        switch (sortBy) {
            case 'newest':
                return new Date(b.date) - new Date(a.date);
            case 'oldest':
                return new Date(a.date) - new Date(b.date);
            case 'priceHighToLow':
                return b.amount - a.amount;
            case 'priceLowToHigh':
                return a.amount - b.amount;
            default:
                return 0;
        }
    });

    // Calculate statistics
    const stats = {
        total: transactions.length,
        totalAmount: transactions.reduce((sum, t) => sum + t.amount, 0),
        thisMonth: transactions.filter(t => {
            const transactionDate = new Date(t.date);
            const now = new Date();
            return transactionDate.getMonth() === now.getMonth() &&
                transactionDate.getFullYear() === now.getFullYear();
        }).length,
        lastTransaction: transactions.length > 0 ? transactions.reduce((latest, t) => {
            return new Date(t.date) > new Date(latest.date) ? t : latest;
        }, transactions[0]) : { amount: 0 }
    };

    // Handle browser back button - always redirect to dashboard
    useEffect(() => {
        const handlePopState = (e) => {
            e.preventDefault();
            navigate('/dashboard', { replace: true });
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
        <div className="payments-container">
            <Gradients />
            {/* Top Navigation Bar */}
            <UserNavbar />

            {/* Main Content */}
            <div className="payments-main">
                {/* Page Header */}
                <div className="page-header">
                    <div className="header-left">
                        <h1 className="page-title">
                            <span className="title-icon"><Icons.CreditCard /></span>
                            Payment History
                        </h1>
                        {/* <p className="page-subtitle">View all your transactions and payment details</p> */}
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="stats-row">
                    <div className="stat-box">
                        <div className="stat-icon-circle purple"><Icons.DollarSign /></div>
                        <div className="stat-details">
                            <div className="stat-value">${stats.totalAmount.toLocaleString()}</div>
                            <div className="stat-label">Total Spent</div>
                        </div>
                    </div>

                    <div className="stat-box">
                        <div className="stat-icon-circle blue"><Icons.BarChart /></div>
                        <div className="stat-details">
                            <div className="stat-value">{stats.total}</div>
                            <div className="stat-label">Total Transactions</div>
                        </div>
                    </div>

                    <div className="stat-box">
                        <div className="stat-icon-circle green"><Icons.Calendar /></div>
                        <div className="stat-details">
                            <div className="stat-value">{stats.thisMonth}</div>
                            <div className="stat-label">This Month</div>
                        </div>
                    </div>

                    <div className="stat-box">
                        <div className="stat-icon-circle orange"><Icons.Clock /></div>
                        <div className="stat-details">
                            <div className="stat-value">${stats.lastTransaction.amount.toLocaleString()}</div>
                            <div className="stat-label">Last Payment</div>
                        </div>
                    </div>
                </div>

                {/* Filter Section */}
                <div className="filter-section">
                    <div className="filter-header">
                        <h3 className="filter-title">
                            <span className="filter-icon"><Icons.Magnifier /></span>
                            Sort Transactions
                        </h3>
                    </div>
                    <div className="filter-options">
                        <button
                            className={`filter-option ${sortBy === 'newest' ? 'active' : ''}`}
                            onClick={() => setSortBy('newest')}
                        >
                            <span className="option-icon"><Icons.Sparkles /></span>
                            Newest First
                        </button>

                        <button
                            className={`filter-option ${sortBy === 'oldest' ? 'active' : ''}`}
                            onClick={() => setSortBy('oldest')}
                        >
                            <span className="option-icon"><Icons.Calendar color="#64748b" /></span>
                            Oldest First
                        </button>

                        <button
                            className={`filter-option ${sortBy === 'priceHighToLow' ? 'active' : ''}`}
                            onClick={() => setSortBy('priceHighToLow')}
                        >
                            <span className="option-icon"><Icons.TrendingDown /></span>
                            Price: High to Low
                        </button>

                        <button
                            className={`filter-option ${sortBy === 'priceLowToHigh' ? 'active' : ''}`}
                            onClick={() => setSortBy('priceLowToHigh')}
                        >
                            <span className="option-icon"><Icons.TrendingUp /></span>
                            Price: Low to High
                        </button>
                    </div>
                </div>

                {/* Transactions List */}
                <div className="transactions-list">
                    {loading ? (
                        <div className="loading-state">
                            <div className="spinner"></div>
                            <p>Loading transactions...</p>
                        </div>
                    ) : sortedTransactions.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-state-visual">
                                <div className="empty-state-glow"></div>
                                <div className="empty-state-icon">
                                    <Icons.CreditCard />
                                </div>
                            </div>
                            <h3 className="empty-state-title">No Transactions Yet</h3>
                            <p className="empty-state-sub">
                                Your payment history will appear here once<br />
                                you complete your first booking.
                            </p>
                            <div className="empty-state-perks">
                                <div className="empty-perk">
                                    <span className="eperk-icon eperk-blue"><Icons.BarChart /></span>
                                    <span className="eperk-label">Track Spending</span>
                                </div>
                                <div className="eperk-divider"></div>
                                <div className="empty-perk">
                                    <span className="eperk-icon eperk-green"><Icons.Check /></span>
                                    <span className="eperk-label">Instant Receipts</span>
                                </div>
                                <div className="eperk-divider"></div>
                                <div className="empty-perk">
                                    <span className="eperk-icon eperk-purple"><Icons.Sparkles /></span>
                                    <span className="eperk-label">Secure Payments</span>
                                </div>
                            </div>
                            <button className="back-btn" onClick={() => navigate('/dashboard')}>
                                Back to Dashboard
                                <span className="back-btn-arrow"><Icons.ArrowRight /></span>
                            </button>
                        </div>
                    ) : sortedTransactions.map((transaction, index) => (
                        <div
                            key={transaction.id}
                            ref={el => transactionRefs.current[index] = el}
                            data-transaction-id={transaction.id}
                            className={`transaction-card ${visibleTransactions.has(String(transaction.id)) ? 'visible' : ''}`}
                            style={{
                                animationDelay: visibleTransactions.has(String(transaction.id)) ? `${index * 0.1}s` : '0s'
                            }}
                        >
                            <div className="transaction-left">
                                <div className="transaction-icon-wrapper">
                                    <div className="transaction-icon">{getIconComponent(transaction.serviceIcon)}</div>
                                </div>
                                <div className="transaction-details">
                                    <h3 className="transaction-service">{transaction.serviceName}</h3>
                                    <div className="transaction-meta">
                                        <span className="meta-item">
                                            <span className="meta-icon"><Icons.Tag /></span>
                                            {transaction.invoiceNumber}
                                        </span>
                                        <span className="meta-item">
                                            <span className="meta-icon"><Icons.Calendar color="#64748b" /></span>
                                            {new Date(transaction.date).toLocaleDateString('en-IN', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric'
                                            })}
                                        </span>
                                        <span className="meta-item">
                                            <span className="meta-icon"><Icons.Clock color="#64748b" /></span>
                                            {transaction.time}
                                        </span>
                                    </div>
                                    <div className="transaction-bottom-row">
                                        <div className="payment-method-badge">
                                            <span className="method-icon"><Icons.CreditCard color="#1e3a8a" /></span>
                                            {transaction.paymentMethod}
                                        </div>
                                        <div className="transaction-amount">
                                            ${transaction.amount.toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="transaction-right">
                                <div className="transaction-status success">
                                    <span className="status-icon"><Icons.Check /></span>
                                    Success
                                </div>
                                <button
                                    className="view-booking-btn"
                                    onClick={() => navigate(`/booking-details/${transaction.bookingId}`, { state: { from: '/payment' } })}
                                >
                                    View Booking
                                    <span className="btn-arrow"><Icons.ArrowRight /></span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Payments;
