/* ============================================
   ADMIN DASHBOARD - BOOKINGS MANAGEMENT
   Uses real API calls for booking data
   ============================================ */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from '../../components/common/AdminNavbar';
import { getAdminAppointments, updateAppointmentStatus, deleteAppointment } from '../../services/api';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [activeFilter, setActiveFilter] = useState('all');
    const [bookings, setBookings] = useState([]);
    const [filteredBookings, setFilteredBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        completed: 0,
    });

    /* ==========================================
       SVG ICONS COMPONENT - COLORFUL GRADIENTS
       ========================================== */
    const Icons = {
        BarChart: ({ className = "" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="url(#adBarChartGrad)">
                <defs>
                    <linearGradient id="adBarChartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                </defs>
                <path d="M3 3v18h18M9 17V10m4 7V7m4 10v-4" stroke="url(#adBarChartGrad)" strokeWidth="2" fill="none" strokeLinecap="round" />
                <path d="M7 17h2v-7H7v7zm4 0h2V7h-2v10zm4 0h2v-4h-2v4z" />
            </svg>
        ),
        Clipboard: ({ className = "" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="url(#adClipboardGrad)">
                <defs>
                    <linearGradient id="adClipboardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                </defs>
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                <rect x="8" y="2" width="8" height="4" rx="1" />
            </svg>
        ),
        Hourglass: ({ className = "" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="url(#adHourglassGrad)">
                <defs>
                    <linearGradient id="adHourglassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#f59e0b" />
                        <stop offset="100%" stopColor="#ef4444" />
                    </linearGradient>
                </defs>
                <path d="M6 2h12v4l-6 6 6 6v4H6v-4l6-6-6-6V2z" />
            </svg>
        ),
        CheckCircle: ({ className = "" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="url(#adCheckCircleGrad)">
                <defs>
                    <linearGradient id="adCheckCircleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#059669" />
                    </linearGradient>
                </defs>
                <circle cx="12" cy="12" r="10" />
                <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" />
            </svg>
        ),
        XCircle: ({ className = "" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="url(#adXCircleGrad)">
                <defs>
                    <linearGradient id="adXCircleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#ef4444" />
                        <stop offset="100%" stopColor="#dc2626" />
                    </linearGradient>
                </defs>
                <circle cx="12" cy="12" r="10" />
                <path d="M15 9l-6 6M9 9l6 6" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
        ),
        Ticket: ({ className = "" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="url(#adTicketGrad)">
                <defs>
                    <linearGradient id="adTicketGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#ec4899" />
                        <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                </defs>
                <path d="M2 9a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v1.5a1.5 1.5 0 0 1 0 3V15a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-1.5a1.5 1.5 0 0 1 0-3V9z" />
            </svg>
        ),
        User: ({ className = "" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="url(#adUserGrad)">
                <defs>
                    <linearGradient id="adUserGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                </defs>
                <circle cx="12" cy="8" r="4" />
                <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" fill="none" stroke="url(#adUserGrad)" strokeWidth="2" />
            </svg>
        ),
        Mail: ({ className = "" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="url(#adMailGrad)">
                <defs>
                    <linearGradient id="adMailGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                </defs>
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <path d="M22 6l-10 7L2 6" stroke="white" strokeWidth="2" fill="none" />
            </svg>
        ),
        Calendar: ({ className = "" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="url(#adCalendarGrad)">
                <defs>
                    <linearGradient id="adCalendarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#6366f1" />
                    </linearGradient>
                </defs>
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <path d="M16 2v4M8 2v4M3 10h18" stroke="white" strokeWidth="2" fill="none" />
            </svg>
        ),
        Clock: ({ className = "" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="url(#adClockGrad)">
                <defs>
                    <linearGradient id="adClockGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#f59e0b" />
                        <stop offset="100%" stopColor="#ef4444" />
                    </linearGradient>
                </defs>
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" />
            </svg>
        ),
        MapPin: ({ className = "" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="url(#adMapPinGrad)">
                <defs>
                    <linearGradient id="adMapPinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#ef4444" />
                        <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                </defs>
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" fill="white" />
            </svg>
        ),
        Eye: ({ className = "" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke="url(#adEyeGrad)" strokeWidth="2">
                <defs>
                    <linearGradient id="adEyeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#06b6d4" />
                        <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                </defs>
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
            </svg>
        ),
        Trash: ({ className = "" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke="url(#adTrashGrad)" strokeWidth="2">
                <defs>
                    <linearGradient id="adTrashGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#ef4444" />
                        <stop offset="100%" stopColor="#dc2626" />
                    </linearGradient>
                </defs>
                <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6" strokeLinecap="round" />
            </svg>
        ),
        Inbox: ({ className = "" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="url(#adInboxGrad)">
                <defs>
                    <linearGradient id="adInboxGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#9ca3af" />
                        <stop offset="100%" stopColor="#6b7280" />
                    </linearGradient>
                </defs>
                <path d="M22 12h-6l-2 3h-4l-2-3H2" fill="none" stroke="url(#adInboxGrad)" strokeWidth="2" />
                <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
            </svg>
        ),
        Check: ({ className = "" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke="url(#adCheckGrad)" strokeWidth="3">
                <defs>
                    <linearGradient id="adCheckGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#059669" />
                    </linearGradient>
                </defs>
                <polyline points="20 6 9 17 4 12" />
            </svg>
        ),
        Complete: ({ className = "" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke="url(#adCompleteGrad)" strokeWidth="2">
                <defs>
                    <linearGradient id="adCompleteGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#059669" />
                    </linearGradient>
                </defs>
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" strokeLinecap="round" />
                <polyline points="22 4 12 14.01 9 11.01" strokeLinecap="round" />
            </svg>
        ),
        Loader: ({ className = "" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeLinecap="round" />
            </svg>
        ),
        // Service Icons from MyBookings
        Car: ({ className = "" }) => <svg className={className} viewBox="0 0 24 24" fill="url(#dashRedGradient)"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" /></svg>,
        Wrench: ({ className = "" }) => <svg className={className} viewBox="0 0 24 24" fill="url(#dashGreenGradient)"><path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z" /></svg>,
        Package: ({ className = "" }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="url(#dashBlueGradient)" strokeWidth="2"><path d="M16.5 9.4l-9-5.19M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></svg>,
        Tool: ({ className = "" }) => <svg className={className} viewBox="0 0 24 24" fill="url(#dashOrangeGradient)"><path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z" /></svg>,
        Magnifier: ({ className = "" }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="url(#dashCyanGradient)" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>,
        Camera: ({ className = "" }) => <svg className={className} viewBox="0 0 24 24" fill="url(#dashPurpleRocketGradient)"><rect x="2" y="6" width="20" height="14" rx="2" /><circle cx="12" cy="13" r="4" /></svg>,
        Speaker: ({ className = "" }) => <svg className={className} viewBox="0 0 24 24" fill="url(#dashPurpleGradient)"><path d="M12 2L6 8H2v8h4l6 6V2z" /><path d="M15.54 8.46a5 5 0 0 1 0 7.07" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14" /></svg>,
        Battery: ({ className = "" }) => <svg className={className} viewBox="0 0 24 24" fill="url(#dashYellowLightGradient)"><rect x="1" y="6" width="18" height="12" rx="2" /><path d="M23 13v-2M5 10v4M8 10v4M14 9l-3 6" /></svg>,
        Snowflake: ({ className = "" }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="url(#dashGreenGradient)" strokeWidth="2"><line x1="12" y1="2" x2="12" y2="22" /><line x1="20" y1="12" x2="4" y2="12" /><line x1="17.66" y1="6.34" x2="6.34" y2="17.66" /><line x1="17.66" y1="17.66" x2="6.34" y2="6.34" /></svg>,
        Brakes: ({ className = "" }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="url(#dashRedGradient)" strokeWidth="2"><circle cx="12" cy="12" r="9" /><path d="M12 7v10M7 12h10" /><path d="M15 15l2 2M9 9l-2-2M15 9l2-2M9 15l-2 2" /></svg>,
        Engine: ({ className = "" }) => <svg className={className} viewBox="0 0 24 24" fill="url(#dashOrangeGradient)"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" /><path d="M12 5l-4 10h8l-4-10z" /></svg>,
        ShieldCheck: ({ className = "" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke="url(#dashGreenGradient)" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="m9 12 2 2 4-4" />
            </svg>
        ),
        OilCan: ({ className = "" }) => <svg className={className} viewBox="0 0 24 24" fill="url(#dashBlueGradient)"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5L12 2 8 9.5c-2 1.6-3 3.5-3 5.5a7 7 0 0 0 7 7z" /></svg>,
        Cog: ({ className = "" }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="url(#dashOrangeGradient)" strokeWidth="2"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>,
        Plug: ({ className = "" }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="url(#dashYellowGradient)" strokeWidth="2"><path d="M12 2v2M5 8v2a7 7 0 0 0 14 0V8M6 2v4M18 2v4M12 17v5" /></svg>,
        Zap: ({ className = "" }) => <svg className={className} viewBox="0 0 24 24" fill="url(#dashYellowGradient)"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>,
        Bulb: ({ className = "" }) => <svg className={className} viewBox="0 0 24 24" fill="url(#dashPurpleGradient)"><path d="M9 21c0 .5.4 1 1 1h4c.6 0 1-.5 1-1v-1H9v1zm3-19C8.1 2 5 5.1 5 9c0 2.4 1.2 4.5 3 5.7V17c0 .5.4 1 1 1h6c.6 0 1-.5 1-1v-2.3c1.8-1.3 3-3.4 3-5.7 0-3.9-3.1-7-7-7z" /></svg>,
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
        if (!iconName) return <Icons.Wrench />;

        let IconComponent = Icons[iconName];
        if (!IconComponent) {
            // Case-insensitive lookup
            const entry = Object.entries(Icons).find(([key]) => key.toLowerCase() === iconName.toLowerCase());
            IconComponent = entry ? entry[1] : (Icons.Wrench || Icons.Tool);
        }
        return <IconComponent />;
    };

    /* ==========================================
       FETCH BOOKINGS FROM API
       ========================================== */
    const fetchBookings = async () => {
        setLoading(true);
        try {
            const response = await getAdminAppointments();
            if (response.success && response.data) {
                const mapped = response.data.map(b => ({
                    id: b.bookingId,
                    displayId: `BK-${String(b.bookingId).padStart(3, '0')}`,
                    userName: b.userName || 'Unknown User',
                    userEmail: b.userEmail || '—',
                    serviceName: b.serviceNames || 'Service Appointment',
                    serviceIcon: b.serviceIcon || '🔧',
                    date: b.date,
                    startTime: b.startTime,
                    endTime: b.endTime,
                    address: b.address || '—',
                    totalAmount: Number(b.totalAmount) || 0,
                    status: (b.status || 'PENDING').toLowerCase(),
                    vehicleInfo: b.vehicleMake && b.vehicleModel ? `${b.vehicleMake} ${b.vehicleModel}` : null,
                    createdAt: b.createdAt
                }));
                setBookings(mapped);
                calculateStats(mapped);
            }
        } catch (error) {
            console.error('Error fetching bookings:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    /* ==========================================
       CALCULATE STATISTICS
       ========================================== */
    const calculateStats = (data) => {
        setStats({
            total: data.length,
            pending: data.filter(b => b.status === 'pending').length,
            completed: data.filter(b => b.status === 'completed').length,
        });
    };

    /* ==========================================
       FILTER BOOKINGS
       ========================================== */
    useEffect(() => {
        // Remove visible class from all cards first
        document.querySelectorAll('.adm-booking-card').forEach((card) => {
            card.classList.remove('visible');
        });

        // Filter bookings
        if (activeFilter === 'all') {
            setFilteredBookings(bookings);
        } else {
            setFilteredBookings(bookings.filter(b => b.status === activeFilter));
        }

        // Re-animate cards after filter change
        setTimeout(() => {
            document.querySelectorAll('.adm-booking-card').forEach((card, index) => {
                setTimeout(() => {
                    card.classList.add('visible');
                }, index * 100);
            });
        }, 50);
    }, [activeFilter, bookings]);

    /* ==========================================
       HANDLE COMPLETE BOOKING
       ========================================== */
    const handleCompleteBooking = async (booking) => {
        const confirmComplete = window.confirm(
            `Mark booking ${booking.displayId} as completed?\n\nCustomer: ${booking.userName}\nService: ${booking.serviceName}`
        );

        if (confirmComplete) {
            try {
                const response = await updateAppointmentStatus(booking.id, 'COMPLETED');
                if (response.success) {
                    // Re-fetch all bookings to get fresh data
                    await fetchBookings();
                    alert(`✅ Booking ${booking.displayId} has been marked as completed!`);
                } else {
                    alert(`❌ Failed to update booking: ${response.message}`);
                }
            } catch (error) {
                console.error('Error completing booking:', error);
                alert('❌ An error occurred while updating the booking.');
            }
        }
    };

    /* ==========================================
       HANDLE DELETE BOOKING
       ========================================== */
    const handleDeleteBooking = async (booking) => {
        const confirmDelete = window.confirm(
            `Are you sure you want to delete booking ${booking.displayId}?\n\nThis action cannot be undone.`
        );

        if (confirmDelete) {
            try {
                const response = await deleteAppointment(booking.id);
                if (response.success) {
                    // Re-fetch all bookings to get fresh data
                    await fetchBookings();
                    alert(`✅ Booking ${booking.displayId} has been deleted successfully!`);
                } else {
                    alert(`❌ Failed to delete booking: ${response.message}`);
                }
            } catch (error) {
                console.error('Error deleting booking:', error);
                alert('❌ An error occurred while deleting the booking.');
            }
        }
    };

    /* ==========================================
       FORMAT HELPERS
       ========================================== */
    const formatDate = (dateString) => {
        if (!dateString) return '—';
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    const formatTime = (timeStr) => {
        if (!timeStr) return '';
        const [hours, minutes] = timeStr.split(':').map(Number);
        const period = hours >= 12 ? 'PM' : 'AM';
        const displayHour = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
        return `${String(displayHour).padStart(2, '0')}:${String(minutes).padStart(2, '0')} ${period}`;
    };

    const formatTimeSlot = (startTime, endTime) => {
        if (!startTime) return '—';
        const start = formatTime(startTime);
        const end = endTime ? formatTime(endTime) : '';
        return end ? `${start} - ${end}` : start;
    };

    /* ==========================================
       RENDER COMPONENT
       ========================================== */
    return (
        <div className="admin-dashboard-container">
            <Gradients />
            {/* Common Navbar */}
            <AdminNavbar />

            {/* Main Content */}
            <div className="admin-dashboard-main">
                {/* Page Header */}
                <div className="adm-page-header">
                    <div className="adm-header-left">
                        <h1 className="adm-page-title">
                            <span className="adm-title-icon">
                                <Icons.BarChart />
                            </span>
                            Admin Dashboard
                        </h1>
                    </div>
                </div>

                {/* Statistics Row */}
                <div className="adm-stats-row">
                    <div className="adm-stat-box blue">
                        <div className="adm-stat-icon-circle blue">
                            <span><Icons.Clipboard /></span>
                        </div>
                        <div className="adm-stat-details">
                            <div className="adm-stat-value">{stats.total}</div>
                            <div className="adm-stat-label">Total Bookings</div>
                        </div>
                    </div>

                    <div className="adm-stat-box orange">
                        <div className="adm-stat-icon-circle orange">
                            <span><Icons.Hourglass /></span>
                        </div>
                        <div className="adm-stat-details">
                            <div className="adm-stat-value">{stats.pending}</div>
                            <div className="adm-stat-label">Pending</div>
                        </div>
                    </div>

                    <div className="adm-stat-box green">
                        <div className="adm-stat-icon-circle green">
                            <span><Icons.CheckCircle /></span>
                        </div>
                        <div className="adm-stat-details">
                            <div className="adm-stat-value">{stats.completed}</div>
                            <div className="adm-stat-label">Completed</div>
                        </div>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="adm-filter-tabs">
                    <button
                        className={`adm-filter-tab ${activeFilter === 'all' ? 'active' : ''}`}
                        onClick={() => setActiveFilter('all')}
                    >
                        <span className="adm-tab-icon"><Icons.Clipboard /></span>
                        All Bookings
                        <span className="adm-tab-count">{stats.total}</span>
                    </button>

                    <button
                        className={`adm-filter-tab ${activeFilter === 'pending' ? 'active' : ''}`}
                        onClick={() => setActiveFilter('pending')}
                    >
                        <span className="adm-tab-icon"><Icons.Hourglass /></span>
                        Pending
                        <span className="adm-tab-count">{stats.pending}</span>
                    </button>

                    <button
                        className={`adm-filter-tab ${activeFilter === 'completed' ? 'active' : ''}`}
                        onClick={() => setActiveFilter('completed')}
                    >
                        <span className="adm-tab-icon"><Icons.CheckCircle /></span>
                        Completed
                        <span className="adm-tab-count">{stats.completed}</span>
                    </button>
                </div>

                {/* Bookings List */}
                <div className="adm-bookings-list">
                    {loading ? (
                        <div className="adm-loading-container">
                            <div className="processing-spinner"></div>
                            <p>Loading bookings...</p>
                        </div>
                    ) : filteredBookings.length === 0 ? (
                        <div className="adm-empty-state">
                            <div className="adm-empty-icon"><Icons.Inbox /></div>
                            <h3>No bookings found</h3>
                            <p>There are no {activeFilter !== 'all' ? activeFilter : ''} bookings at the moment.</p>
                        </div>
                    ) : (
                        filteredBookings.map((booking) => (
                            <div key={booking.id} className="adm-booking-card">
                                {/* Booking Header */}
                                <div className="adm-booking-header">
                                    <div className="adm-booking-id-section">
                                        <span className="adm-booking-id"><Icons.Ticket /> {booking.displayId}</span>
                                        <span className={`adm-status-badge ${booking.status}`}>
                                            {booking.status === 'pending' && <Icons.Hourglass className="adm-status-icon" />}
                                            {booking.status === 'completed' && <Icons.CheckCircle className="adm-status-icon" />}
                                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                        </span>
                                    </div>
                                    <div className="adm-booking-date">
                                        <span className="adm-date-label">Booked On</span>
                                        <span className="adm-date-value">{formatDate(booking.createdAt)}</span>
                                    </div>
                                </div>

                                {/* Customer Info */}
                                <div className="adm-customer-info">
                                    <div className="adm-customer-avatar">
                                        <span><Icons.User /></span>
                                    </div>
                                    <div className="adm-customer-details">
                                        <div className="adm-customer-name">{booking.userName}</div>
                                        <div className="adm-customer-contact">
                                            <span><Icons.Mail className="adm-contact-icon" /> {booking.userEmail}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Booking Body */}
                                <div className="adm-booking-body">
                                    <div className="adm-service-info">
                                        <div className="adm-service-icon-large">
                                            {getIconComponent(booking.serviceIcon)}
                                        </div>
                                        <div className="adm-service-details">
                                            <div className="adm-service-name">{booking.serviceName}</div>
                                            <div className="adm-service-meta">
                                                <div className="adm-meta-item">
                                                    <span className="adm-meta-icon"><Icons.Calendar /></span>
                                                    <span className="adm-meta-text">{formatDate(booking.date)}</span>
                                                </div>
                                                <div className="adm-meta-item">
                                                    <span className="adm-meta-icon"><Icons.Clock /></span>
                                                    <span className="adm-meta-text">{formatTimeSlot(booking.startTime, booking.endTime)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="adm-price-section">
                                        <span className="adm-price-label">Total Amount</span>
                                        <span className="adm-price-value">${booking.totalAmount.toLocaleString()}</span>
                                    </div>
                                </div>

                                {/* Booking Footer */}
                                <div className="adm-booking-footer">
                                    <div className="adm-address-info">
                                        <span className="adm-address-icon"><Icons.MapPin /></span>
                                        <span>{booking.address}</span>
                                    </div>

                                    <div className="adm-booking-actions">
                                        {(booking.status === 'pending' || booking.status === 'confirmed') && (
                                            <button
                                                className="adm-action-btn complete"
                                                onClick={() => handleCompleteBooking(booking)}
                                            >
                                                <span><Icons.Complete /></span>
                                                Mark Completed
                                            </button>
                                        )}
                                        <button
                                            className="adm-action-btn danger"
                                            onClick={() => handleDeleteBooking(booking)}
                                        >
                                            <span><Icons.Trash /></span>
                                            Delete Booking
                                        </button>
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

export default AdminDashboard;