import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getCartItems,
  updateCartItem,
  removeCartItem,
  clearCart as clearCartApi,
} from "../../services/api";
import UserNavbar from "../../components/common/UserNavbar";
import "./Cart.css";

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);

  /* ==========================================
       SVG ICONS COMPONENT
       ========================================== */
  const Icons = {
    ShoppingCart: ({ className = "", variant = "stroke" }) => (
      <svg
        className={className}
        viewBox="0 0 26 26"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {variant === "gradient" && (
          <defs>
            <linearGradient id="cartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#1d4ed8" />
            </linearGradient>
          </defs>
        )}
        {/* Cart handle */}
        <path
          d="M2 3h2.5l2.8 11.2a2.5 2.5 0 0 0 2.4 1.8h8.6a2.5 2.5 0 0 0 2.4-1.8L22.5 7H6.5"
          stroke={variant === "gradient" ? "url(#cartGrad)" : "currentColor"}
          strokeWidth="1.8"
          fill="none"
        />
        {/* Wheels */}
        <circle
          cx="10"
          cy="21"
          r="1.5"
          stroke={variant === "gradient" ? "url(#cartGrad)" : "currentColor"}
          strokeWidth="1.6"
          fill="none"
        />
        <circle
          cx="19"
          cy="21"
          r="1.5"
          stroke={variant === "gradient" ? "url(#cartGrad)" : "currentColor"}
          strokeWidth="1.6"
          fill="none"
        />
        {/* Cart internal lines for detail */}
        <line
          x1="9"
          y1="10"
          x2="21"
          y2="10"
          stroke={variant === "gradient" ? "url(#cartGrad)" : "currentColor"}
          strokeWidth="1.2"
          opacity="0.5"
        />
      </svg>
    ),
    Trash: ({ className = "" }) => (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        <line x1="10" y1="11" x2="10" y2="17" />
        <line x1="14" y1="11" x2="14" y2="17" />
      </svg>
    ),
    Car: ({ className = "" }) => (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="url(#dashRedGradient)"
      >
        <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
      </svg>
    ),
    Package: ({ className = "" }) => (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="url(#dashBlueGradient)"
        strokeWidth="2"
      >
        <path d="M16.5 9.4l-9-5.19M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    ),
    Tool: ({ className = "" }) => (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="url(#dashOrangeGradient)"
      >
        <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z" />
      </svg>
    ),
    Magnifier: ({ className = "" }) => (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="url(#dashCyanGradient)"
        strokeWidth="2"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>
    ),
    Camera: ({ className = "" }) => (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="url(#dashPurpleRocketGradient)"
      >
        <rect x="2" y="6" width="20" height="14" rx="2" />
        <circle cx="12" cy="13" r="4" />
      </svg>
    ),
    Speaker: ({ className = "" }) => (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="url(#dashPurpleGradient)"
      >
        <path d="M12 2L6 8H2v8h4l6 6V2z" />
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
      </svg>
    ),
    Battery: ({ className = "" }) => (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="url(#dashYellowLightGradient)"
      >
        <rect x="1" y="6" width="18" height="12" rx="2" />
        <path d="M23 13v-2M5 10v4M8 10v4M14 9l-3 6" />
      </svg>
    ),
    Snowflake: ({ className = "" }) => (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="url(#dashGreenGradient)"
        strokeWidth="2"
      >
        <line x1="12" y1="2" x2="12" y2="22" />
        <line x1="20" y1="12" x2="4" y2="12" />
        <line x1="17.66" y1="6.34" x2="6.34" y2="17.66" />
        <line x1="17.66" y1="17.66" x2="6.34" y2="6.34" />
      </svg>
    ),
    Brakes: ({ className = "" }) => (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="url(#dashRedGradient)"
        strokeWidth="2"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v10M7 12h10" />
        <path d="M15 15l2 2M9 9l-2-2M15 9l2-2M9 15l-2 2" />
      </svg>
    ),
    Engine: ({ className = "" }) => (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="url(#dashOrangeGradient)"
      >
        <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" />
        <path d="M12 5l-4 10h8l-4-10z" />
      </svg>
    ),
    ShieldCheck: ({ className = "" }) => (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="url(#dashGreenGradient)"
        strokeWidth="2"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
    OilCan: ({ className = "" }) => (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="url(#dashBlueGradient)"
      >
        <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5L12 2 8 9.5c-2 1.6-3 3.5-3 5.5a7 7 0 0 0 7 7z" />
      </svg>
    ),
    Cog: ({ className = "" }) => (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="url(#dashOrangeGradient)"
        strokeWidth="2"
      >
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
    Plug: ({ className = "" }) => (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="url(#dashYellowGradient)"
        strokeWidth="2"
      >
        <path d="M12 2v2M5 8v2a7 7 0 0 0 14 0V8M6 2v4M18 2v4M12 17v5" />
      </svg>
    ),
    Zap: ({ className = "" }) => (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="url(#dashYellowGradient)"
      >
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
    Bulb: ({ className = "" }) => (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="url(#dashPurpleGradient)"
      >
        <path d="M9 21c0 .5.4 1 1 1h4c.6 0 1-.5 1-1v-1H9v1zm3-19C8.1 2 5 5.1 5 9c0 2.4 1.2 4.5 3 5.7V17c0 .5.4 1 1 1h6c.6 0 1-.5 1-1v-2.3c1.8-1.3 3-3.4 3-5.7 0-3.9-3.1-7-7-7z" />
      </svg>
    ),
    Wrench: ({ className = "" }) => (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="url(#dashGreenGradient)"
      >
        <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z" />
      </svg>
    ),
    Clipboard: ({
      className = "",
      stroke = "url(#dashCyanGradient)",
      strokeWidth = "2",
    }) => (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
        <path d="M9 12h6M9 16h6" />
      </svg>
    ),
    Clock: ({ className = "" }) => (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="url(#dashPurpleGradient)"
        strokeWidth="2"
      >
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    Calendar: ({ className = "", stroke = "#3b82f6", strokeWidth = "2" }) => (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M19 4H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
    ChevronLeft: ({ className = "" }) => (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="15 18 9 12 15 6" />
      </svg>
    ),
    User: ({ className = "" }) => (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="url(#dashPurpleGradient)"
        strokeWidth="2"
      >
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  };

  const Gradients = () => (
    <svg style={{ width: 0, height: 0, position: "absolute" }}>
      <defs>
        <linearGradient
          id="dashRedGradient"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#ef4444" />
          <stop offset="100%" stopColor="#b91c1c" />
        </linearGradient>
        <linearGradient
          id="dashBlueGradient"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>
        <linearGradient
          id="dashOrangeGradient"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#c2410c" />
        </linearGradient>
        <linearGradient
          id="dashCyanGradient"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#0891b2" />
        </linearGradient>
        <linearGradient
          id="dashPurpleRocketGradient"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
        <linearGradient
          id="dashPurpleGradient"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#7e22ce" />
        </linearGradient>
        <linearGradient
          id="dashYellowLightGradient"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
        <linearGradient
          id="dashGreenGradient"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#22c55e" />
          <stop offset="100%" stopColor="#15803d" />
        </linearGradient>
        <linearGradient
          id="dashYellowGradient"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
      </defs>
    </svg>
  );

  const getIconComponent = (iconName) => {
    let IconComponent = Icons[iconName];
    if (!IconComponent) {
      const entry = Object.entries(Icons).find(
        ([key]) => key.toLowerCase() === (iconName || "").toLowerCase(),
      );
      IconComponent = entry ? entry[1] : Icons.Wrench;
    }
    return <IconComponent />;
  };

  // Fetch cart items from API on mount
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await getCartItems();
        if (response.success) {
          // Map API response to match rendering expectations
          const mappedItems = response.data.map((item) => ({
            id: item.serviceId,
            name: item.serviceName,
            icon: getIconComponent(item.serviceIcon),
            description: item.serviceDescription,
            price: Number(item.price),
            duration: item.duration,
            quantity: item.quantity,
          }));
          setCartItems(mappedItems);
        }
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };

    fetchCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Cart functions
  const updateQuantity = async (id, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      const response = await updateCartItem(id, { quantity: newQuantity });
      if (response.success) {
        setCartItems(
          cartItems.map((item) =>
            item.id === id ? { ...item, quantity: newQuantity } : item,
          ),
        );
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const removeItem = async (id) => {
    try {
      const response = await removeCartItem(id);
      if (response.success) {
        setCartItems(cartItems.filter((item) => item.id !== id));
      }
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const clearCart = async () => {
    try {
      const response = await clearCartApi();
      if (response.success) {
        setCartItems([]);
      }
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };

  // Calculate total
  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  // Handle browser back button - always redirect to dashboard
  useEffect(() => {
    const handlePopState = (e) => {
      e.preventDefault();
      navigate("/dashboard", { replace: true });
    };

    // Add a history entry
    window.history.pushState(null, "", window.location.href);

    // Listen for back button
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [navigate]);

  return (
    <div className="cart-container">
      <Gradients />
      <UserNavbar
        cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
      />

      <div className="cart-main">
        {/* Page Header */}
        <div className="page-header">
          <div className="header-left">
            <h1 className="page-title">
              <span className="title-icon">
                <Icons.ShoppingCart />
              </span>
              My Cart
            </h1>
            {/* <p className="page-subtitle">
                            {cartItems.length} {cartItems.length === 1 ? 'service' : 'services'} in your cart
                        </p> */}
          </div>
          {cartItems.length > 0 && (
            <button className="clear-cart-btn" onClick={clearCart}>
              <span className="clear-icon">
                <Icons.Trash />
              </span>
              Clear Cart
            </button>
          )}
        </div>

        <div className="cart-content">
          {cartItems.length === 0 ? (
            /* Empty Cart State */
            <div className="empty-cart">
              <div className="empty-cart-visual">
                <div className="empty-cart-glow"></div>
                <div className="empty-icon-wrap">
                  <Icons.ShoppingCart variant="gradient" />
                </div>
              </div>
              <h2 className="empty-cart-title">Your Cart is Empty</h2>
              <p className="empty-cart-sub">
                Looks like you haven't added any services yet.
                <br />
                Discover our premium automotive solutions!
              </p>
              <div className="empty-perks">
                <div className="empty-perk">
                  <span className="perk-icon-wrap perk-blue">
                    <Icons.Car />
                  </span>
                  <span className="perk-label">Mobile Call-Out</span>
                </div>
                <div className="perk-divider"></div>
                <div className="empty-perk">
                  <span className="perk-icon-wrap perk-green">
                    <Icons.ShieldCheck />
                  </span>
                  <span className="perk-label">Expert Technicians</span>
                </div>
                <div className="perk-divider"></div>
                <div className="empty-perk">
                  <span className="perk-icon-wrap perk-orange">
                    <Icons.Tool />
                  </span>
                  <span className="perk-label">Professional Repairs</span>
                </div>
              </div>
              <button
                className="browse-btn"
                onClick={() => navigate("/dashboard")}
              >
                <span className="browse-icon">
                  <Icons.Magnifier />
                </span>
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
                            <span className="meta-icon">
                              <Icons.Clock />
                            </span>
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
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                          >
                            −
                          </button>
                          <span className="qty-value">{item.quantity}</span>
                          <button
                            className="qty-btn"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
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
                          <span className="remove-icon">
                            <Icons.Trash />
                          </span>
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
                    <span className="summary-icon">
                      <Icons.Clipboard />
                    </span>
                    Order Summary
                  </h3>

                  <div className="summary-rows">
                    <div className="summary-row">
                      <span className="row-label">Total Amount</span>
                      <span className="row-value">
                        ${total.toLocaleString()}
                      </span>
                    </div>
                    <span
                      style={{
                        fontSize: "0.7rem",
                        color: "#94a3b8",
                        fontStyle: "italic",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        marginTop: "2px",
                      }}
                    >
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#94a3b8"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="16" x2="12" y2="12" />
                        <line x1="12" y1="8" x2="12.01" y2="8" />
                      </svg>
                      All taxes included
                    </span>
                  </div>

                  <div className="summary-divider"></div>

                  <button
                    className="checkout-btn"
                    onClick={() =>
                      navigate("/schedule", {
                        state: {
                          serviceIds: cartItems.map((item) => item.id),
                          cartItems: cartItems.map(({ icon, ...rest }) => rest),
                        },
                      })
                    }
                  >
                    <span className="checkout-icon">
                      <Icons.Calendar stroke="#ffffff" />
                    </span>
                    Schedule Appointment
                  </button>

                  {/* Continue Shopping - inside card so it sticks with the summary */}
                  <button
                    className="continue-shopping-btn"
                    onClick={() => navigate("/dashboard")}
                  >
                    <span className="back-arrow">
                      <Icons.ChevronLeft />
                    </span>
                    Continue Shopping
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
