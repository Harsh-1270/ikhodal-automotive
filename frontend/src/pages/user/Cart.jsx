import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserNavbar from '../../components/common/UserNavbar';
import './Cart.css';

const Cart = () => {
    const navigate = useNavigate();

    // Mock user data
    const user = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        avatar: '👤'
    };

    // Mock cart data (in real app, this will come from context/state)
    const [cartItems, setCartItems] = useState([
        {
            id: 1,
            name: 'General Service',
            icon: '🔧',
            description: 'Complete car checkup & maintenance',
            price: 2499,
            duration: '2-3 hours',
            quantity: 1
        },
        {
            id: 2,
            name: 'AC Service',
            icon: '❄️',
            description: 'AC repair, gas refill & cleaning',
            price: 1799,
            duration: '1-2 hours',
            quantity: 2
        },
        {
            id: 7,
            name: 'Car Spa',
            icon: '🧼',
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

    return (
        <div className="cart-container">
            <UserNavbar cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)} />

            <div className="cart-main">
                {/* Page Header */}
                <div className="page-header">
                    <div className="header-left">
                        <h1 className="page-title">
                            <span className="title-icon">🛒</span>
                            My Cart
                        </h1>
                        {/* <p className="page-subtitle">
                            {cartItems.length} {cartItems.length === 1 ? 'service' : 'services'} in your cart
                        </p> */}
                    </div>
                    {cartItems.length > 0 && (
                        <button className="clear-cart-btn" onClick={clearCart}>
                            <span className="clear-icon">🗑️</span>
                            Clear Cart
                        </button>
                    )}
                </div>

                <div className="cart-content">
                    {cartItems.length === 0 ? (
                        /* Empty Cart State */
                        <div className="empty-cart">
                            <div className="empty-icon">🛒</div>
                            <h2>Your cart is empty</h2>
                            <p>Add services to your cart to get started!</p>
                            <button className="browse-btn" onClick={() => navigate('/dashboard')}>
                                <span className="browse-icon">🔍</span>
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
                                                        <span className="meta-icon">⏱️</span>
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
                                                    <span className="remove-icon">🗑️</span>
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
                                        <span className="summary-icon">📋</span>
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

                                    <button className="checkout-btn" onClick={() => navigate('/payment')}>
                                        <span className="checkout-icon">💳</span>
                                        Proceed to Checkout
                                    </button>

                                    <div className="summary-info">
                                        <div className="info-item">
                                            <span className="info-icon">✓</span>
                                            <span className="info-text">Secure Payment</span>
                                        </div>
                                        <div className="info-item">
                                            <span className="info-icon">✓</span>
                                            <span className="info-text">Professional Service</span>
                                        </div>
                                        <div className="info-item">
                                            <span className="info-icon">✓</span>
                                            <span className="info-text">Quality Guaranteed</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Continue Shopping */}
                                <button
                                    className="continue-shopping-btn"
                                    onClick={() => navigate('/dashboard')}
                                >
                                    <span className="back-arrow">←</span>
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
