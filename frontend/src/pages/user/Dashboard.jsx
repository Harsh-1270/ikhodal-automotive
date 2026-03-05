import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import UserNavbar from "../../components/common/UserNavbar";
import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState("all");
  const [viewMode] = useState("grid"); // 'grid' or 'list'
  const [visibleSections, setVisibleSections] = useState(new Set());
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [cart, setCart] = useState([]);
  const [showCartNotification, setShowCartNotification] = useState("");

  /* ==========================================
       SVG ICONS COMPONENT - COLORFUL GRADIENTS
       ========================================== */
  const Icons = {
    // Core Service Icons
    Car: ({ className = "" }) => (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="url(#dashRedGradient)"
      >
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
        </defs>
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
        <defs>
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
        </defs>
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
        <defs>
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
        </defs>
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
        <defs>
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
        </defs>
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>
    ),
    // New Icons for Specific Services
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
        <path d="M23 13v-2" />
        <path d="M5 10v4" />
        <path d="M8 10v4" />
        <path d="M14 9l-3 6" />
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
        <defs>
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
        </defs>
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
    Clipboard: ({ className = "" }) => (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="url(#dashCyanGradient)"
        strokeWidth="2"
      >
        <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
        <path d="M9 12h6M9 16h6" />
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
        <defs>
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
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
    Bulb: ({ className = "" }) => (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="url(#dashPurpleGradient)"
      >
        <defs>
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
        </defs>
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

    // UI Icons
    User: ({ className = "" }) => (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
    Wave: ({ className = "" }) => (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="url(#dashHandGradient)"
      >
        <defs>
          <linearGradient
            id="dashHandGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
        </defs>
        <path d="M7.5 11c.8 0 1.5-.7 1.5-1.5V3c0-.8-.7-1.5-1.5-1.5S6 2.2 6 3v6.5C6 10.3 6.7 11 7.5 11zM4.5 13c-.8 0-1.5.7-1.5 1.5V21c0 .8.7 1.5 1.5 1.5S6 21.8 6 21v-6.5C6 13.7 5.3 13 4.5 13zM13.5 7c-.8 0-1.5.7-1.5 1.5V21c0 .8.7 1.5 1.5 1.5s1.5-.7 1.5-1.5V8.5C15 7.7 14.3 7 13.5 7zM10.5 1C9.7 1 9 1.7 9 2.5V21c0 .8.7 1.5 1.5 1.5S12 21.8 12 21V2.5C12 1.7 11.3 1 10.5 1z" />
      </svg>
    ),
    Calendar: ({ className = "" }) => (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
    MapPin: ({ className = "" }) => (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
    Star: ({ className = "" }) => (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="currentColor"
        style={{ color: "#fbbf24" }}
      >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ),
    Rocket: ({ className = "" }) => (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="url(#dashPurpleRocketGradient)"
      >
        <defs>
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
        </defs>
        <path d="M12 2c-4 0-8 .5-8 4 0 1.5.5 3 1 4l-1 4c0 .5.5 1 1 1h2v3c0 .5.5 1 1 1s1-.5 1-1v-3h4v3c0 .5.5 1 1 1s1-.5 1-1v-3h2c.5 0 1-.5 1-1l-1-4c.5-1 1-2.5 1-4 0-3.5-4-4-8-4zm0 2c2.4 0 4.7.3 5.7 1.3.3.3.3.6.3 1.2 0 1-.4 2.2-.8 3.2L16 12H8l-1.2-2.3c-.4-1-.8-2.2-.8-3.2 0-.6 0-.9.3-1.2C7.3 4.3 9.6 4 12 4z" />
      </svg>
    ),
    Lightning: ({ className = "" }) => (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="url(#dashYellowLightGradient)"
      >
        <defs>
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
        </defs>
        <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" />
      </svg>
    ),
    Fire: ({ className = "" }) => (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="url(#dashRedFireGradient)"
      >
        <defs>
          <linearGradient
            id="dashRedFireGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#ef4444" />
          </linearGradient>
        </defs>
        <path d="M13.5 0c-.8 2.5-1.5 5-2.8 6.5-1.3-2-2.5-4-4.2-6 0 0-2.5 4.5-2.5 9.5 0 5 4 9 9 9s9-4 9-9c0-4-2-7-3-8.5-.5 1.5-1.5 3-3 4-1-2.5-1.5-4-2.5-5.5z" />
      </svg>
    ),
    Sparkles: ({ className = "" }) => (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="url(#dashGoldGradient)"
      >
        <defs>
          <linearGradient
            id="dashGoldGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
        </defs>
        <path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8L12 2z" />
        <path d="M5 5l1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3z" />
      </svg>
    ),
    DollarSign: ({ className = "" }) => (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="#16a34a"
        strokeWidth="2"
      >
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
    Clock: ({ className = "" }) => (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="#ca8a04"
        strokeWidth="2"
      >
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    ShoppingCart: ({ className = "" }) => (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
    ),
    ArrowRight: ({ className = "" }) => (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12 5 19 12 12 19" />
      </svg>
    ),
    Check: ({ className = "" }) => (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
      >
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
    Target: ({ className = "" }) => (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
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
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
      </svg>
    ),
    List: ({ className = "" }) => (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <line x1="8" y1="6" x2="21" y2="6" />
        <line x1="8" y1="12" x2="21" y2="12" />
        <line x1="8" y1="18" x2="21" y2="18" />
        <line x1="3" y1="6" x2="3.01" y2="6" />
        <line x1="3" y1="12" x2="3.01" y2="12" />
        <line x1="3" y1="18" x2="3.01" y2="18" />
      </svg>
    ),
    Phone: ({ className = "" }) => (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
    Mail: ({ className = "" }) => (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
  };

  // Cart functions
  const addToCart = async (service) => {
    try {
      const { addToCart: addToCartApi } = require("../../services/api");
      const response = await addToCartApi({
        serviceId: service.id,
        quantity: 1,
      });
      if (response.success) {
        const existingItem = cart.find((item) => item.serviceId === service.id);
        if (existingItem) {
          setCart(
            cart.map((item) =>
              item.serviceId === service.id
                ? { ...item, quantity: item.quantity + 1 }
                : item,
            ),
          );
        } else {
          setCart([...cart, { ...response.data, id: response.data.id }]);
        }

        // Show notification
        setShowCartNotification(service.name);
        setTimeout(() => setShowCartNotification(""), 3000);
      } else {
        console.error("Failed to add to cart:", response.message);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const removeFromCart = async (serviceId) => {
    try {
      const { removeCartItem } = require("../../services/api");
      const response = await removeCartItem(serviceId);
      if (response.success) {
        setCart(cart.filter((item) => item.serviceId !== serviceId));
      }
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  };

  const isInCart = (serviceId) => {
    return cart.some((item) => item.serviceId === serviceId);
  };

  const getTotalItems = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  };

  // Refs for sections
  const sectionRefs = {
    welcome: useRef(null),
    popular: useRef(null),
    category: useRef(null),
    services: useRef(null),
    whyChoose: useRef(null),
    stats: useRef(null),
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
      rootMargin: "0px 0px 300px 0px", // Load 300px BEFORE element is visible
      threshold: 0, // Trigger immediately when element starts to appear
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionName = entry.target.dataset.section;
          setVisibleSections((prev) => new Set([...prev, sectionName]));
        }
      });
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions,
    );

    Object.values(sectionRefs).forEach((ref) => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });

    return () => {
      Object.values(sectionRefs).forEach((ref) => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      });
    };
  }, [initialLoadComplete]); // eslint-disable-line react-hooks/exhaustive-deps

  const userName = user?.name || user?.email?.split("@")[0] || "User";

  const [services, setServices] = useState([]);

  // Fetch services from API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        // Import API function locally to avoid circular dependency issues if any
        const { getServices } = require("../../services/api");
        const response = await getServices();
        if (response.success) {
          setServices(response.data);
        } else {
          console.error("Failed to fetch services:", response.message);
        }
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    if (initialLoadComplete) {
      fetchServices();
    }
  }, [initialLoadComplete]);

  // Fetch cart items from API
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const { getCartItems } = require("../../services/api");
        const response = await getCartItems();
        if (response.success) {
          setCart(response.data);
        }
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };

    if (initialLoadComplete) {
      fetchCart();
    }
  }, [initialLoadComplete]);

  // Navigate to cart
  const goToCart = () => {
    navigate("/cart");
  };

  // Icon mapping helper
  const getIconComponent = (iconName) => {
    const IconComponent = Icons[iconName] || Icons.Wrench;
    return <IconComponent />;
  };

  const categories = [
    {
      id: "all",
      name: "All Services",
      icon: <Icons.Wrench />,
      count: services.length,
    },
    {
      id: "mobile",
      name: "Mobile Call-Out",
      icon: <Icons.Car />,
      count: services.filter((s) => s.category === "mobile").length,
    },
    {
      id: "service-packages",
      name: "Service Packages",
      icon: <Icons.Package />,
      count: services.filter((s) => s.category === "service-packages").length,
    },
    {
      id: "repairs",
      name: "Repairs",
      icon: <Icons.Tool />,
      count: services.filter((s) => s.category === "repairs").length,
    },
    {
      id: "diagnostics",
      name: "Diagnostics",
      icon: <Icons.Magnifier />,
      count: services.filter((s) => s.category === "diagnostics").length,
    },
    {
      id: "electrical",
      name: "Electrical",
      icon: <Icons.Bulb />,
      count: services.filter((s) => s.category === "electrical").length,
    },
    {
      id: "inspection",
      name: "Inspection",
      icon: <Icons.Tool />,
      count: services.filter((s) => s.category === "inspection").length,
    },
    {
      id: "accessories",
      name: "Accessories",
      icon: <Icons.Zap />,
      count: services.filter((s) => s.category === "accessories").length,
    },
  ];

  const filteredServices =
    activeFilter === "all"
      ? services
      : services.filter((service) => service.category === activeFilter);

  // Prevent browser back button from going to login/home page after logging in
  useEffect(() => {
    const handlePopState = (e) => {
      e.preventDefault();
      // Push the current page back into history so user stays on dashboard
      window.history.pushState(null, "", window.location.href);
    };

    // Add a history entry to trap the back button
    window.history.pushState(null, "", window.location.href);

    // Listen for back button
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  return (
    <div className="dashboard-container">
      {/* Top Navigation Bar */}
      <UserNavbar cartCount={getTotalItems()} />

      {/* Cart Notification */}
      {showCartNotification && (
        <div className="cart-notification">
          <div className="notification-top">
            <div className="notification-icon-circle">
              <Icons.Check />
            </div>
            <div className="notification-body">
              <p className="notification-heading">Added to Cart!</p>
              <p className="notification-service-name">
                {showCartNotification}
              </p>
            </div>
            <button className="view-cart-btn" onClick={goToCart}>
              View Cart
              <span className="view-cart-arrow">
                <Icons.ArrowRight />
              </span>
            </button>
          </div>
          <div className="notification-progress-track">
            <div className="notification-progress-fill"></div>
          </div>
        </div>
      )}

      {/* Main Scrollable Content */}
      <div className="dashboard-main">
        {/* Welcome Banner */}
        <div
          ref={sectionRefs.welcome}
          data-section="welcome"
          className={`welcome-banner ${visibleSections.has("welcome") ? "section-visible" : ""}`}
        >
          <div className="banner-content">
            <div className="banner-left">
              <div className="greeting">
                <h1 className="welcome-title">
                  <span className="wave-emoji">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                        fill="#159ea3"
                        stroke="rgba(255,255,255,0.6)"
                        strokeWidth="1"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  Welcome back,{" "}
                  <span className="user-highlight">
                    {userName.split(" ")[0]}
                  </span>
                  !
                </h1>
              </div>
              <p className="welcome-text">
                Book premium car services in minutes. Professional mobile
                mechanic care for your vehicle.
              </p>
              <div className="quick-actions">
                <button
                  className="quick-btn primary"
                  onClick={() =>
                    sectionRefs.services.current?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    })
                  }
                >
                  <span className="btn-icon">
                    <Icons.Calendar />
                  </span>
                  Book Service
                </button>
                <button
                  className="quick-btn secondary"
                  onClick={() => navigate("/my-bookings")}
                >
                  <span className="btn-icon">
                    <Icons.MapPin />
                  </span>
                  Track Bookings
                </button>
              </div>
            </div>
            <div className="banner-right">
              {/* Highlight Cards — overlapping stack */}
              <div className="highlight-cards">
                <div className="highlight-card hc-1">
                  <div className="hc-glow"></div>
                  <div className="hc-icon">
                    <Icons.Star />
                  </div>
                  <div className="hc-info">
                    <span className="hc-value">
                      4.9<small>/5</small>
                    </span>
                    <span className="hc-label">Customer Rating</span>
                  </div>
                </div>
                <div className="highlight-card hc-2">
                  <div className="hc-glow"></div>
                  <div className="hc-icon">
                    <Icons.Rocket />
                  </div>
                  <div className="hc-info">
                    <span className="hc-value">5K+</span>
                    <span className="hc-label">Happy Customers</span>
                  </div>
                </div>
                <div className="highlight-card hc-3">
                  <div className="hc-glow"></div>
                  <div className="hc-icon">
                    <Icons.Car />
                  </div>
                  <div className="hc-info">
                    <span className="hc-value">24/7</span>
                    <span className="hc-label">Mobile Service</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Popular Services Quick Access */}
        <div
          ref={sectionRefs.popular}
          data-section="popular"
          className={`popular-services-section ${visibleSections.has("popular") ? "section-visible" : ""}`}
        >
          <h2 className="section-title">
            <Icons.Lightning className="section-title-icon" /> Most Popular
            Services
          </h2>
          <div className="popular-grid">
            {services
              .filter((s) => s.isPopular)
              .slice(0, 4)
              .map((service) => (
                <div key={service.id} className="popular-card">
                  <div className="popular-icon">
                    {getIconComponent(service.icon)}
                  </div>
                  <div className="popular-name">{service.name}</div>
                  <div className="popular-price">
                    ${service.price.toLocaleString()}
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Category Filter Pills */}
        <div
          ref={sectionRefs.category}
          data-section="category"
          className={`category-section ${visibleSections.has("category") ? "section-visible" : ""}`}
        >
          <h2 className="section-title">Browse by Category</h2>
          <div className="category-pills">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveFilter(category.id)}
                className={`pill ${activeFilter === category.id ? "active" : ""}`}
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
          className={`services-section ${visibleSections.has("services") ? "section-visible" : ""}`}
        >
          <div className="section-header-row">
            <h2 className="section-title">All Services</h2>
          </div>

          <div className={`services-${viewMode}`}>
            {filteredServices.map((service, index) => (
              <div
                key={service.id}
                className="service-card-new"
                style={{
                  animationDelay: visibleSections.has("services")
                    ? `${index * 0.15}s`
                    : "0s",
                }}
              >
                <div className="service-header-badges">
                  {service.isPopular && (
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

                <div className="service-icon-large">
                  {getIconComponent(service.icon)}
                </div>

                <div className="service-content">
                  <h3 className="service-title">{service.name}</h3>
                  <p className="service-desc">{service.description}</p>

                  <div className="service-info-row">
                    <div className="info-item">
                      <span className="info-icon">
                        <Icons.DollarSign />
                      </span>
                      <span className="info-text price-text">
                        {service.price === 0
                          ? "Free"
                          : `$${service.price.toLocaleString()}`}
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
                    className={`add-cart-btn ${isInCart(service.id) ? "in-cart" : ""}`}
                    onClick={() =>
                      isInCart(service.id)
                        ? removeFromCart(service.id)
                        : addToCart(service)
                    }
                  >
                    <span className="cart-icon">
                      <Icons.ShoppingCart />
                    </span>
                    {isInCart(service.id) ? "Added" : "Add"}
                  </button>
                  <button
                    className="service-book-btn"
                    onClick={() =>
                      navigate("/schedule", {
                        state: {
                          serviceIds: [service.id],
                          cartItems: [
                            {
                              serviceId: service.id,
                              name: service.name,
                              price: service.price,
                              quantity: 1,
                              icon: service.icon,
                            },
                          ],
                        },
                      })
                    }
                  >
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
          className={`why-choose-section ${visibleSections.has("whyChoose") ? "section-visible" : ""}`}
        >
          <h2 className="section-title-center">
            Why Choose I Khodal Automotive?
          </h2>
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
          className={`stats-section ${visibleSections.has("stats") ? "section-visible" : ""}`}
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
