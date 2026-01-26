import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import UserNavbar from '../../components/common/UserNavbar';
import './Payment.css';

const Payments = () => {
    const navigate = useNavigate();
    const [sortBy, setSortBy] = useState('newest');
    const [visibleTransactions, setVisibleTransactions] = useState(new Set());
    const [initialLoadComplete, setInitialLoadComplete] = useState(false);
    const transactionRefs = useRef([]);

    // Mock user data
    const user = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        avatar: '👤'
    };

    // Mock transactions data
    const transactions = [
        {
            id: 'TXN123456789',
            bookingId: 'BK001',
            serviceName: 'General Service',
            serviceIcon: '🔧',
            amount: 2499,
            date: '2024-01-20',
            time: '10:30 AM',
            paymentMethod: 'UPI',
            status: 'success',
            invoiceNumber: 'INV-2024-001'
        },
        {
            id: 'TXN987654321',
            bookingId: 'BK002',
            serviceName: 'AC Service',
            serviceIcon: '❄️',
            amount: 1799,
            date: '2024-01-22',
            time: '02:15 PM',
            paymentMethod: 'Credit Card',
            status: 'success',
            invoiceNumber: 'INV-2024-002'
        },
        {
            id: 'TXN456789123',
            bookingId: 'BK003',
            serviceName: 'Car Spa',
            serviceIcon: '🧼',
            amount: 799,
            date: '2024-01-18',
            time: '11:45 AM',
            paymentMethod: 'UPI',
            status: 'success',
            invoiceNumber: 'INV-2024-003'
        },
        {
            id: 'TXN789123456',
            bookingId: 'BK004',
            serviceName: 'Tyres & Wheels',
            serviceIcon: '⚙️',
            amount: 1199,
            date: '2024-01-24',
            time: '03:20 PM',
            paymentMethod: 'Debit Card',
            status: 'success',
            invoiceNumber: 'INV-2024-004'
        },
        {
            id: 'TXN321654987',
            bookingId: 'BK005',
            serviceName: 'Car Detailing',
            serviceIcon: '✨',
            amount: 1999,
            date: '2024-01-15',
            time: '09:30 AM',
            paymentMethod: 'UPI',
            status: 'success',
            invoiceNumber: 'INV-2024-005'
        },
        {
            id: 'TXN654987321',
            bookingId: 'BK006',
            serviceName: 'Battery Service',
            serviceIcon: '🔋',
            amount: 3499,
            date: '2024-01-26',
            time: '10:45 AM',
            paymentMethod: 'Credit Card',
            status: 'success',
            invoiceNumber: 'INV-2024-006'
        },
        {
            id: 'TXN147258369',
            bookingId: 'BK007',
            serviceName: 'Denting & Painting',
            serviceIcon: '🎨',
            amount: 4999,
            date: '2024-01-12',
            time: '01:00 PM',
            paymentMethod: 'UPI',
            status: 'success',
            invoiceNumber: 'INV-2024-007'
        },
        {
            id: 'TXN369258147',
            bookingId: 'BK008',
            serviceName: 'Full Inspection',
            serviceIcon: '📋',
            amount: 1499,
            date: '2024-01-28',
            time: '04:30 PM',
            paymentMethod: 'Debit Card',
            status: 'success',
            invoiceNumber: 'INV-2024-008'
        }
    ];

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
        lastTransaction: transactions.reduce((latest, t) => {
            return new Date(t.date) > new Date(latest.date) ? t : latest;
        }, transactions[0])
    };

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
                            <span className="title-icon">💳</span>
                            Payment History
                        </h1>
                        {/* <p className="page-subtitle">View all your transactions and payment details</p> */}
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="stats-row">
                    <div className="stat-box">
                        <div className="stat-icon-circle purple">💰</div>
                        <div className="stat-details">
                            <div className="stat-value">${stats.totalAmount.toLocaleString()}</div>
                            <div className="stat-label">Total Spent</div>
                        </div>
                    </div>

                    <div className="stat-box">
                        <div className="stat-icon-circle blue">📊</div>
                        <div className="stat-details">
                            <div className="stat-value">{stats.total}</div>
                            <div className="stat-label">Total Transactions</div>
                        </div>
                    </div>

                    <div className="stat-box">
                        <div className="stat-icon-circle green">📅</div>
                        <div className="stat-details">
                            <div className="stat-value">{stats.thisMonth}</div>
                            <div className="stat-label">This Month</div>
                        </div>
                    </div>

                    <div className="stat-box">
                        <div className="stat-icon-circle orange">⏱️</div>
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
                            <span className="filter-icon">🔍</span>
                            Sort Transactions
                        </h3>
                    </div>
                    <div className="filter-options">
                        <button
                            className={`filter-option ${sortBy === 'newest' ? 'active' : ''}`}
                            onClick={() => setSortBy('newest')}
                        >
                            <span className="option-icon">🆕</span>
                            Newest First
                        </button>

                        <button
                            className={`filter-option ${sortBy === 'oldest' ? 'active' : ''}`}
                            onClick={() => setSortBy('oldest')}
                        >
                            <span className="option-icon">📅</span>
                            Oldest First
                        </button>

                        <button
                            className={`filter-option ${sortBy === 'priceHighToLow' ? 'active' : ''}`}
                            onClick={() => setSortBy('priceHighToLow')}
                        >
                            <span className="option-icon">💸</span>
                            Price: High to Low
                        </button>

                        <button
                            className={`filter-option ${sortBy === 'priceLowToHigh' ? 'active' : ''}`}
                            onClick={() => setSortBy('priceLowToHigh')}
                        >
                            <span className="option-icon">💵</span>
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
                                            <span className="meta-icon">🔖</span>
                                            {transaction.invoiceNumber}
                                        </span>
                                        <span className="meta-item">
                                            <span className="meta-icon">📅</span>
                                            {new Date(transaction.date).toLocaleDateString('en-IN', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric'
                                            })}
                                        </span>
                                        <span className="meta-item">
                                            <span className="meta-icon">🕐</span>
                                            {transaction.time}
                                        </span>
                                    </div>
                                    <div className="payment-method-badge">
                                        <span className="method-icon">💳</span>
                                        {transaction.paymentMethod}
                                    </div>
                                </div>
                            </div>

                            <div className="transaction-right">
                                <div className="transaction-amount">
                                    ${transaction.amount.toLocaleString()}
                                </div>
                                <div className="transaction-status success">
                                    <span className="status-icon">✓</span>
                                    Success
                                </div>
                                <button
                                    className="view-booking-btn"
                                    onClick={() => navigate(`/booking-details/${transaction.bookingId}`)}
                                >
                                    View Booking
                                    <span className="btn-arrow">→</span>
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
