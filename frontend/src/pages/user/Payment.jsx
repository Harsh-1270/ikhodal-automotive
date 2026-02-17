import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
// import { getPaymentHistory } from '../../services/api';
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
        CreditCard: ({ className = "", color = "#6366f1" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                <line x1="1" y1="10" x2="23" y2="10" />
            </svg>
        ),
        DollarSign: ({ className = "", color = "#8b5cf6" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="1" x2="12" y2="23" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
        ),
        BarChart: ({ className = "", color = "#3b82f6" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="20" x2="12" y2="10" />
                <line x1="18" y1="20" x2="18" y2="4" />
                <line x1="6" y1="20" x2="6" y2="16" />
            </svg>
        ),
        Calendar: ({ className = "", color = "#10b981" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
        ),
        Clock: ({ className = "", color = "#f59e0b" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
            </svg>
        ),
        Magnifier: ({ className = "", color = "#64748b" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
            </svg>
        ),
        Sparkles: ({ className = "", color = "#3b82f6" }) => (
            <svg className={className} viewBox="0 0 24 24" fill={color}>
                <path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8L12 2z" />
                <path d="M5 5l1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3z" />
            </svg>
        ),
        TrendingDown: ({ className = "", color = "#ef4444" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
                <polyline points="17 18 23 18 23 12" />
            </svg>
        ),
        TrendingUp: ({ className = "", color = "#10b981" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                <polyline points="17 6 23 6 23 12" />
            </svg>
        ),
        Wrench: ({ className = "", color = "#f59e0b" }) => (
            <svg className={className} viewBox="0 0 24 24" fill={color}>
                <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z" />
            </svg>
        ),
        Snowflake: ({ className = "", color = "#0ea5e9" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="2" x2="12" y2="22" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                <line x1="19.07" y1="4.93" x2="4.93" y2="19.07" />
            </svg>
        ),
        Bubbles: ({ className = "", color = "#06b6d4" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="8" cy="8" r="5" />
                <circle cx="17" cy="16" r="4" />
                <circle cx="6" cy="18" r="2" />
            </svg>
        ),
        Gear: ({ className = "", color = "#64748b" }) => (
            <svg className={className} viewBox="0 0 24 24" fill={color}>
                <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
            </svg>
        ),
        SparklesStar: ({ className = "", color = "#eab308" }) => (
            <svg className={className} viewBox="0 0 24 24" fill={color}>
                <path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8L12 2z" />
            </svg>
        ),
        Battery: ({ className = "", color = "#10b981" }) => (
            <svg className={className} viewBox="0 0 24 24" fill={color}>
                <path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4z" />
            </svg>
        ),
        Palette: ({ className = "", color = "#ec4899" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="13.5" cy="6.5" r=".5" fill={color} />
                <circle cx="17.5" cy="10.5" r=".5" fill={color} />
                <circle cx="8.5" cy="7.5" r=".5" fill={color} />
                <circle cx="6.5" cy="12.5" r=".5" fill={color} />
                <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
            </svg>
        ),
        Clipboard: ({ className = "", color = "#3b82f6" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                <path d="M9 12h6" />
                <path d="M9 16h6" />
            </svg>
        ),
        Tag: ({ className = "", color = "#3b82f6" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                <line x1="7" y1="7" x2="7.01" y2="7" />
            </svg>
        ),
        Check: ({ className = "", color = "#10b981" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
            </svg>
        ),
        ArrowRight: ({ className = "" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
            </svg>
        ),
        User: ({ className = "", color = "#64748b" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
            </svg>
        )
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
        setTransactions([]);
        setLoading(false);
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
                        setVisibleTransactions(prev => new Set([...prev, transactionId]));
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
    }, [initialLoadComplete, sortBy]);

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
                    {sortedTransactions.map((transaction, index) => (
                        <div
                            key={transaction.id}
                            ref={el => transactionRefs.current[index] = el}
                            data-transaction-id={transaction.id}
                            className={`transaction-card ${visibleTransactions.has(transaction.id) ? 'visible' : ''}`}
                            style={{
                                animationDelay: visibleTransactions.has(transaction.id) ? `${index * 0.1}s` : '0s'
                            }}
                        >
                            <div className="transaction-left">
                                <div className="transaction-icon-wrapper">
                                    <div className="transaction-icon">{transaction.serviceIcon}</div>
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
                                    <div className="payment-method-badge">
                                        <span className="method-icon"><Icons.CreditCard color="#1e3a8a" /></span>
                                        {transaction.paymentMethod}
                                    </div>
                                </div>
                            </div>

                            <div className="transaction-right">
                                <div className="transaction-amount">
                                    ${transaction.amount.toLocaleString()}
                                </div>
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
