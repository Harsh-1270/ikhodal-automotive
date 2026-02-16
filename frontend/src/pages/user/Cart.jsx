import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getCartItems, updateCartItem, removeCartItem, clearCart as clearCartApi } from '../../services/api';
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
        // Service Icons - matching Dashboard's icon set
        Car: ({ className = "" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="#ef4444">
                <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
            </svg>
        ),
        Package: ({ className = "" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2">
                <path d="M16.5 9.4l-9-5.19M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
        ),
        Tool: ({ className = "" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="#f97316">
                <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z" />
            </svg>
        ),
        Magnifier: ({ className = "", color = "#06b6d4" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
            </svg>
        ),
        Camera: ({ className = "" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="#8b5cf6">
                <rect x="2" y="6" width="20" height="14" rx="2" />
                <circle cx="12" cy="13" r="4" />
            </svg>
        ),
        Speaker: ({ className = "" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="#a855f7">
                <path d="M12 2L6 8H2v8h4l6 6V2z" />
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
            </svg>
        ),
        Battery: ({ className = "" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="#fbbf24">
                <rect x="1" y="6" width="18" height="12" rx="2" />
                <path d="M23 13v-2" />
                <path d="M5 10v4" />
                <path d="M8 10v4" />
                <path d="M14 9l-3 6" />
            </svg>
        ),
        Snowflake: ({ className = "" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2">
                <line x1="12" y1="2" x2="12" y2="22" /><line x1="20" y1="12" x2="4" y2="12" /><line x1="17.66" y1="6.34" x2="6.34" y2="17.66" /><line x1="17.66" y1="17.66" x2="6.34" y2="6.34" />
            </svg>
        ),
        Brakes: ({ className = "" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v10M7 12h10" />
                <path d="M15 15l2 2M9 9l-2-2M15 9l2-2M9 15l-2 2" />
            </svg>
        ),
        Engine: ({ className = "" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="#f97316">
                <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" />
                <path d="M12 5l-4 10h8l-4-10z" />
            </svg>
        ),
        ShieldCheck: ({ className = "" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="m9 12 2 2 4-4" />
            </svg>
        ),
        OilCan: ({ className = "" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="#3b82f6">
                <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5L12 2 8 9.5c-2 1.6-3 3.5-3 5.5a7 7 0 0 0 7 7z" />
            </svg>
        ),
        Cog: ({ className = "" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
        ),
        Plug: ({ className = "" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2">
                <path d="M12 2v2M5 8v2a7 7 0 0 0 14 0V8M6 2v4M18 2v4M12 17v5" />
            </svg>
        ),
        Zap: ({ className = "" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="#fbbf24">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
        ),
        Bulb: ({ className = "" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="#a855f7">
                <path d="M9 21c0 .5.4 1 1 1h4c.6 0 1-.5 1-1v-1H9v1zm3-19C8.1 2 5 5.1 5 9c0 2.4 1.2 4.5 3 5.7V17c0 .5.4 1 1 1h6c.6 0 1-.5 1-1v-2.3c1.8-1.3 3-3.4 3-5.7 0-3.9-3.1-7-7-7z" />
            </svg>
        ),
        Wrench: ({ className = "" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="#22c55e">
                <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z" />
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
        Clock: ({ className = "", color = "#64748b" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
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

    // State for cart items (fetched from API)
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);

    // Icon mapping helper - maps icon name from API to SVG component
    const getIconComponent = (iconName) => {
        const IconComponent = Icons[iconName] || Icons.Wrench;
        return <IconComponent />;
    };

    // Fetch cart items from API on mount
    useEffect(() => {
        const fetchCart = async () => {
            try {
                setLoading(true);
                const response = await getCartItems();
                if (response.success) {
                    // Map API response to match rendering expectations
                    const mappedItems = response.data.map(item => ({
                        id: item.serviceId,
                        name: item.serviceName,
                        icon: getIconComponent(item.serviceIcon),
                        description: item.serviceDescription,
                        price: Number(item.price),
                        duration: item.duration,
                        quantity: item.quantity
                    }));
                    setCartItems(mappedItems);
                }
            } catch (error) {
                console.error('Error fetching cart:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCart();
    }, []);

    // Cart functions
    const updateQuantity = async (id, newQuantity) => {
        if (newQuantity < 1) return;
        try {
            const response = await updateCartItem(id, { quantity: newQuantity });
            if (response.success) {
                setCartItems(cartItems.map(item =>
                    item.id === id ? { ...item, quantity: newQuantity } : item
                ));
            }
        } catch (error) {
            console.error('Error updating quantity:', error);
        }
    };

    const removeItem = async (id) => {
        try {
            const response = await removeCartItem(id);
            if (response.success) {
                setCartItems(cartItems.filter(item => item.id !== id));
            }
        } catch (error) {
            console.error('Error removing item:', error);
        }
    };

    const clearCart = async () => {
        try {
            const response = await clearCartApi();
            if (response.success) {
                setCartItems([]);
            }
        } catch (error) {
            console.error('Error clearing cart:', error);
        }
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
                                                        ${item.price.toLocaleString()} per service
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
                                                    ${(item.price * item.quantity).toLocaleString()}
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
                                            <span className="row-value">${subtotal.toLocaleString()}</span>
                                        </div>
                                        <div className="summary-row">
                                            <span className="row-label">GST (18%)</span>
                                            <span className="row-value">${Math.round(tax).toLocaleString()}</span>
                                        </div>
                                    </div>

                                    <div className="summary-divider"></div>

                                    <div className="summary-total">
                                        <span className="total-label">Total Amount</span>
                                        <span className="total-value">${Math.round(total).toLocaleString()}</span>
                                    </div>

                                    <button className="checkout-btn" onClick={() => navigate('/schedule', {
                                        state: {
                                            serviceIds: cartItems.map(item => item.id),
                                            cartItems: cartItems.map(({ icon, ...rest }) => rest)
                                        }
                                    })}>
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
