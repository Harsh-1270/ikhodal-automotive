import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import UserNavbar from "../../components/common/UserNavbar";
import { getUserBookings, verifyPayment } from "../../services/api";
import "./MyBookings.css";

const MyBookings = () => {
  const navigate = useNavigate();

  /* ==========================================
       SVG ICONS COMPONENT
       ========================================== */
  const Icons = {
    // Core Service Icons
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
    CalendarCheck: ({ className = "", stroke = "currentColor" }) => (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="4" width="18" height="18" rx="3" ry="3" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
        <path d="m9 16 2 2 4-4" />
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
    BarChart: ({ className = "" }) => (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <line x1="12" y1="20" x2="12" y2="10" />
        <line x1="18" y1="20" x2="18" y2="4" />
        <line x1="6" y1="20" x2="6" y2="16" />
      </svg>
    ),
    Hourglass: ({ className = "" }) => (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M5 22h14" />
        <path d="M5 2h14" />
        <path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22" />
        <path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2" />
      </svg>
    ),
    CheckCircle: ({ className = "" }) => (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="#10b981"
        strokeWidth="2"
      >
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
    DollarSign: ({ className = "" }) => (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
    FileText: ({ className = "" }) => (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
    Inbox: ({ className = "" }) => (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
        <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
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
    Clock: ({ className = "" }) => (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
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
    File: ({ className = "" }) => (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
      </svg>
    ),
    Refresh: ({ className = "" }) => (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <polyline points="23 4 23 10 17 10" />
        <polyline points="1 20 1 14 7 14" />
        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
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

  const [activeTab, setActiveTab] = useState("all");
  const [visibleBookings, setVisibleBookings] = useState(new Set());
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const bookingRefs = useRef([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Helper to format 24h time ("08:00:00") to 12h display ("08:00 AM")
  const formatTime = (timeStr) => {
    if (!timeStr) return "";
    const [hours, minutes] = timeStr.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const displayHour = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    return `${String(displayHour).padStart(2, "0")}:${String(minutes).padStart(2, "0")} ${period}`;
  };

  // Fetch bookings from API
  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const response = await getUserBookings();
        if (response.success && response.data) {
          const mapped = response.data.map((b) => ({
            id: `BK${String(b.bookingId).padStart(3, "0")}`,
            bookingId: b.bookingId,
            serviceName: b.serviceNames || "Service Appointment",
            serviceIcon: getIconComponent(b.serviceIcon),
            price: Number(b.totalAmount) || 0,
            bookingDate: b.date,
            serviceDate: b.date,
            timeSlot: `${formatTime(b.startTime)} - ${formatTime(b.endTime)}`,
            status: (b.status || "PENDING").toLowerCase(),
            paymentStatus: "paid",
            vehicleNumber:
              b.vehicleMake && b.vehicleModel
                ? `${b.vehicleMake} ${b.vehicleModel}`
                : "—",
            address: b.address || "—",
          }));
          setBookings(mapped);
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Self-Healing Status Check: Verify pending bookings on load
  useEffect(() => {
    const verifyPending = async () => {
      // Find bookings that are locally pending
      const pendingBookings = bookings.filter((b) => b.status === "pending");

      if (pendingBookings.length === 0) return;

      let updatesFound = false;
      const updatedBookings = [...bookings];

      await Promise.all(
        pendingBookings.map(async (booking) => {
          try {
            // Call backend verification
            const response = await verifyPayment(booking.bookingId);
            if (response.success && response.data.status === "CONFIRMED") {
              // Update local state
              const index = updatedBookings.findIndex(
                (b) => b.bookingId === booking.bookingId,
              );
              if (index !== -1) {
                updatedBookings[index] = {
                  ...updatedBookings[index],
                  status: "confirmed",
                };
                updatesFound = true;
              }
            }
          } catch (error) {
            console.error(
              `Verification check failed for booking ${booking.bookingId}`,
              error,
            );
          }
        }),
      );

      if (updatesFound) {
        setBookings(updatedBookings);
      }
    };

    if (bookings.length > 0) {
      verifyPending();
    }
  }, [bookings.length]); // eslint-disable-line react-hooks/exhaustive-deps

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
      rootMargin: "-50px 0px -100px 0px",
      threshold: [0, 0.05, 0.1],
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.05) {
          const bookingId = entry.target.dataset.bookingId;
          setTimeout(() => {
            setVisibleBookings((prev) => new Set([...prev, bookingId]));
          }, 100);
        }
      });
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions,
    );

    bookingRefs.current.forEach((ref) => {
      if (ref) {
        observer.observe(ref);
      }
    });

    const refsSnapshot = bookingRefs.current;
    return () => {
      refsSnapshot.forEach((ref) => {
        if (ref) {
          observer.unobserve(ref);
        }
      });
    };
  }, [initialLoadComplete, activeTab, bookings]); // eslint-disable-line react-hooks/exhaustive-deps

  // Filter bookings based on active tab
  const filteredBookings =
    activeTab === "all"
      ? bookings
      : bookings.filter((booking) => booking.status === activeTab);

  // Calculate statistics
  const stats = {
    total: bookings.length,
    pending: bookings.filter((b) => b.status === "pending").length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    completed: bookings.filter((b) => b.status === "completed").length,
    totalSpent: bookings.reduce((sum, b) => sum + b.price, 0),
  };

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
    <div className="mybookings-container">
      <Gradients />
      <UserNavbar />

      {/* Main Content */}
      <div className="mybookings-main">
        {/* Page Header */}
        <div className="page-header">
          <div className="header-left">
            <h1 className="page-title">
              <span className="title-icon">
                <Icons.CalendarCheck stroke="#ffffff" />
              </span>
              My Bookings
            </h1>
            {/* <p className="page-subtitle">Track and manage all your service appointments</p> */}
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="stats-row">
          <div className="stat-box">
            <div className="stat-icon-circle blue">
              <Icons.BarChart />
            </div>
            <div className="stat-details">
              <div className="stat-value">{stats.total}</div>
              <div className="stat-label">Total Bookings</div>
            </div>
          </div>

          <div className="stat-box">
            <div className="stat-icon-circle orange">
              <Icons.Hourglass />
            </div>
            <div className="stat-details">
              <div className="stat-value">{stats.pending}</div>
              <div className="stat-label">Pending Services</div>
            </div>
          </div>

          <div className="stat-box">
            <div className="stat-icon-circle green">
              <Icons.CheckCircle />
            </div>
            <div className="stat-details">
              <div className="stat-value">{stats.completed}</div>
              <div className="stat-label">Completed</div>
            </div>
          </div>

          <div className="stat-box">
            <div className="stat-icon-circle purple">
              <Icons.DollarSign />
            </div>
            <div className="stat-details">
              <div className="stat-value">
                ${stats.totalSpent.toLocaleString()}
              </div>
              <div className="stat-label">Total Spent</div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="filter-tabs">
          <button
            className={`filter-tab ${activeTab === "all" ? "active" : ""}`}
            onClick={() => setActiveTab("all")}
          >
            <span className="tab-icon">
              <Icons.FileText />
            </span>
            All Bookings
            <span className="tab-count">{stats.total}</span>
          </button>

          <button
            className={`filter-tab ${activeTab === "pending" ? "active" : ""}`}
            onClick={() => setActiveTab("pending")}
          >
            <span className="tab-icon">
              <Icons.Hourglass />
            </span>
            Pending
            <span className="tab-count">{stats.pending}</span>
          </button>

          <button
            className={`filter-tab ${activeTab === "confirmed" ? "active" : ""}`}
            onClick={() => setActiveTab("confirmed")}
          >
            <span className="tab-icon">
              <Icons.CheckCircle />
            </span>
            Confirmed
            <span className="tab-count">{stats.confirmed}</span>
          </button>

          <button
            className={`filter-tab ${activeTab === "completed" ? "active" : ""}`}
            onClick={() => setActiveTab("completed")}
          >
            <span className="tab-icon">
              <Icons.CheckCircle />
            </span>
            Completed
            <span className="tab-count">{stats.completed}</span>
          </button>
        </div>

        {/* Bookings List */}
        <div className="bookings-list">
          {loading ? (
            <div className="empty-state">
              <div className="empty-icon">
                <Icons.Clock />
              </div>
              <h3>Loading bookings...</h3>
              <p>Please wait while we fetch your appointments.</p>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-visual">
                <div className="empty-state-glow"></div>
                <div className="empty-state-icon">
                  <Icons.CalendarCheck stroke="url(#dashCyanGradient)" />
                </div>
              </div>
              <h3 className="empty-state-title">No Bookings Found</h3>
              <p className="empty-state-sub">
                You don't have any {activeTab !== "all" ? activeTab + " " : ""}
                bookings yet.
                <br />
                Book your first service and get premium care!
              </p>
              <div className="empty-state-perks">
                <div className="empty-perk">
                  <span className="eperk-icon eperk-blue">
                    <Icons.Calendar />
                  </span>
                  <span className="eperk-label">Easy Booking</span>
                </div>
                <div className="eperk-divider"></div>
                <div className="empty-perk">
                  <span className="eperk-icon eperk-green">
                    <Icons.ShieldCheck />
                  </span>
                  <span className="eperk-label">Expert Technicians</span>
                </div>
                <div className="eperk-divider"></div>
                <div className="empty-perk">
                  <span className="eperk-icon eperk-orange">
                    <Icons.Zap />
                  </span>
                  <span className="eperk-label">Fast Service</span>
                </div>
              </div>
              <button
                className="empty-action-btn"
                onClick={() => navigate("/dashboard")}
              >
                <span className="empty-action-arrow">→</span>
                Browse Services
              </button>
            </div>
          ) : (
            filteredBookings.map((booking, index) => (
              <div
                key={booking.id}
                ref={(el) => (bookingRefs.current[index] = el)}
                data-booking-id={booking.id}
                className={`booking-card ${visibleBookings.has(booking.id) ? "visible" : ""}`}
                style={{
                  animationDelay: visibleBookings.has(booking.id)
                    ? `${index * 0.1}s`
                    : "0s",
                }}
              >
                <div className="booking-header">
                  <div className="booking-id-section">
                    <span className="booking-id">#{booking.id}</span>
                    <span className={`status-badge ${booking.status}`}>
                      {booking.status === "pending" ? (
                        <>
                          <Icons.Hourglass color="#92400e" /> Pending
                        </>
                      ) : booking.status === "confirmed" ? (
                        <>
                          <Icons.CheckCircle color="#065f46" /> Completed
                        </>
                      ) : (
                        <>
                          <Icons.CheckCircle color="#065f46" /> Completed
                        </>
                      )}
                    </span>
                  </div>
                  <div className="booking-date">
                    <span className="date-label">Booked on:</span>
                    <span className="date-value">
                      {new Date(booking.bookingDate).toLocaleDateString(
                        "en-IN",
                        { day: "numeric", month: "short", year: "numeric" },
                      )}
                    </span>
                  </div>
                </div>

                <div className="booking-body">
                  <div className="service-info">
                    <div className="service-icon-large">
                      {booking.serviceIcon}
                    </div>
                    <div className="service-details">
                      <h3 className="service-name">{booking.serviceName}</h3>
                      <div className="service-meta">
                        <div className="meta-item">
                          <span className="meta-icon">
                            <Icons.Calendar />
                          </span>
                          <span className="meta-text">
                            {new Date(booking.serviceDate).toLocaleDateString(
                              "en-IN",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              },
                            )}
                          </span>
                        </div>
                        <div className="meta-item">
                          <span className="meta-icon">
                            <Icons.Clock />
                          </span>
                          <span className="meta-text">{booking.timeSlot}</span>
                        </div>
                        <div className="meta-item">
                          <span className="meta-icon">
                            <Icons.Car />
                          </span>
                          <span className="meta-text">
                            {booking.vehicleNumber}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="price-section">
                    <div className="price-label">Total Amount</div>
                    <div className="price-value">
                      ${booking.price.toLocaleString()}
                    </div>
                    <div className="payment-status paid">
                      <span className="payment-icon">
                        <Icons.Check />
                      </span>
                      Paid
                    </div>
                  </div>
                </div>

                <div className="booking-footer">
                  <div className="address-info">
                    <span className="address-icon">
                      <Icons.MapPin />
                    </span>
                    <span className="address-text">{booking.address}</span>
                  </div>
                  <div className="booking-actions">
                    <button
                      className="action-btn secondary"
                      onClick={() =>
                        navigate(`/booking-details/${booking.bookingId}`, {
                          state: { from: "/my-bookings" },
                        })
                      }
                    >
                      <span className="action-btn-icon">
                        <Icons.File />
                      </span>
                      View Details
                    </button>
                    {booking.status === "completed" && (
                      <button className="action-btn primary">
                        <span className="action-btn-icon">
                          <Icons.Refresh />
                        </span>
                        Book Again
                      </button>
                    )}
                    {booking.status === "pending" && (
                      <button className="action-btn primary">
                        <span className="action-btn-icon">
                          <Icons.Phone />
                        </span>
                        Contact Support
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MyBookings;
