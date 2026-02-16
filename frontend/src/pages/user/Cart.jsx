import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import UserNavbar from '../../components/common/UserNavbar';
import './Cart.css';

const Cart = () => {
    const navigate = useNavigate();
    const location = useLocation();

    /* ==========================================
       SVG ICONS COMPONENT
       ========================================== */
    const Icons = {
        ShoppingCart: ({ className = "", color = "#3b82f6" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
        ),
        Trash: ({ className = "", color = "currentColor" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                <line x1="10" y1="11" x2="10" y2="17" />
                <line x1="14" y1="11" x2="14" y2="17" />
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
        Clock: ({ className = "", color = "#64748b" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
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
        Calendar: ({ className = "", color = "#ffffff" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
        ),
        Magnifier: ({ className = "", color = "#ffffff" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
        ),
        ChevronLeft: ({ className = "", color = "currentColor" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
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

    // Mock user data
    const user = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        avatar: <Icons.User />
    };

    // Mock cart data (in real app, this will come from context/state)
    const [cartItems, setCartItems] = useState([
        {
            id: 1,
            name: 'General Service',
            icon: <Icons.Wrench />,
            description: 'Complete car checkup & maintenance',
            price: 2499,
            duration: '2-3 hours',
            quantity: 1
        },
        {
            id: 2,
            name: 'AC Service',
            icon: <Icons.Snowflake />,
            description: 'AC repair, gas refill & cleaning',
            price: 1799,
            duration: '1-2 hours',
            quantity: 2
        },
        {
            id: 7,
            name: 'Car Spa',
            icon: <Icons.Bubbles />,
            description: 'Premium wash, polish & waxing',
            price: 799,
            duration: '1 hour',
            quantity: 1
        }
    ]);

    // Cart functions
    const updateQuantity = (id, newQuantity) => {
        if (newQuantity < 1) return;
        setCartItems(cartItems.map(item =>
            item.id === id ? { ...item, quantity: newQuantity } : item
        ));
    };

    const removeItem = (id) => {
        setCartItems(cartItems.filter(item => item.id !== id));
    };

    const clearCart = () => {
        setCartItems([]);
    };

    // Calculate totals
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.18; // 18% GST
    const total = subtotal + tax;

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
        <div className="cart-container">
            <UserNavbar cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)} />

            <div className="cart-main">
                {/* Page Header */}
                <div className="page-header">
                    <div className="header-left">
                        <h1 className="page-title">
                            <span className="title-icon"><Icons.ShoppingCart /></span>
                            My Cart
                        </h1>
                        {/* <p className="page-subtitle">
                            {cartItems.length} {cartItems.length === 1 ? 'service' : 'services'} in your cart
                        </p> */}
                    </div>
                    {cartItems.length > 0 && (
                        <button className="clear-cart-btn" onClick={clearCart}>
                            <span className="clear-icon"><Icons.Trash /></span>
                            Clear Cart
                        </button>
                    )}
                </div>

                <div className="cart-content">
                    {cartItems.length === 0 ? (
                        /* Empty Cart State */
                        <div className="empty-cart">
                            <div className="empty-icon"><Icons.ShoppingCart color="#94a3b8" /></div>
                            <h2>Your cart is empty</h2>
                            <p>Add services to your cart to get started!</p>
                            <button className="browse-btn" onClick={() => navigate('/dashboard')}>
                                <span className="browse-icon"><Icons.Magnifier /></span>
                                Browse Services
                            </button>
                        </div>
                    ) : (
                        /* Cart Items Grid */
                        <div className="cart-grid">
                            {/* Left Column - Cart Items */}
                            <div className="cart-items-section">
                                <div className="items-list">
                                    {cartItems.map((item) => (
                                        <div key={item.id} className="cart-item">
                                            <div className="item-icon-wrapper">
                                                <div className="item-icon">{item.icon}</div>
                                            </div>

                                            <div className="item-details">
                                                <h3 className="item-name">{item.name}</h3>
                                                <p className="item-description">{item.description}</p>
                                                <div className="item-meta">
                                                    <span className="meta-badge">
                                                        <span className="meta-icon"><Icons.Clock /></span>
                                                        {item.duration}
                                                    </span>
                                                    <span className="price-per-item">
                                                        ₹{item.price.toLocaleString()} per service
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="item-actions">
                                                <div className="quantity-controls">
                                                    <button
                                                        className="qty-btn"
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    >
                                                        −
                                                    </button>
                                                    <span className="qty-value">{item.quantity}</span>
                                                    <button
                                                        className="qty-btn"
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    >
                                                        +
                                                    </button>
                                                </div>

                                                <div className="item-price">
                                                    ₹{(item.price * item.quantity).toLocaleString()}
                                                </div>

                                                <button
                                                    className="remove-btn"
                                                    onClick={() => removeItem(item.id)}
                                                >
                                                    <span className="remove-icon"><Icons.Trash /></span>
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Right Column - Order Summary */}
                            <div className="order-summary-section">
                                <div className="summary-card sticky-summary">
                                    <h3 className="summary-title">
                                        <span className="summary-icon"><Icons.Clipboard /></span>
                                        Order Summary
                                    </h3>

                                    <div className="summary-rows">
                                        <div className="summary-row">
                                            <span className="row-label">Subtotal</span>
                                            <span className="row-value">₹{subtotal.toLocaleString()}</span>
                                        </div>
                                        <div className="summary-row">
                                            <span className="row-label">GST (18%)</span>
                                            <span className="row-value">₹{Math.round(tax).toLocaleString()}</span>
                                        </div>
                                    </div>

                                    <div className="summary-divider"></div>

                                    <div className="summary-total">
                                        <span className="total-label">Total Amount</span>
                                        <span className="total-value">₹{Math.round(total).toLocaleString()}</span>
                                    </div>

                                    <button className="checkout-btn" onClick={() => navigate('/schedule')}>
                                        <span className="checkout-icon"><Icons.Calendar /></span>
                                        Schedule Appointment
                                    </button>
                                </div>

                                {/* Continue Shopping */}
                                <button
                                    className="continue-shopping-btn"
                                    onClick={() => navigate('/dashboard')}
                                >
                                    <span className="back-arrow"><Icons.ChevronLeft /></span>
                                    Continue Shopping
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Cart;
