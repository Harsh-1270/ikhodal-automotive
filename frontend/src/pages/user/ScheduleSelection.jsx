import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getAvailableSlots, checkDateAvailability } from '../../services/api';
import UserNavbar from '../../components/common/UserNavbar';
import './ScheduleSelection.css';

const ScheduleSelection = () => {
    const navigate = useNavigate();
    const location = useLocation();

    /* ==========================================
       SVG ICONS COMPONENT
       ========================================== */
    const Icons = {
        Calendar: ({ className = "", stroke = "#3b82f6", strokeWidth = "2" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 4H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
        ),
        Clock: ({ className = "" }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="url(#dashPurpleGradient)" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>,
        Check: ({ className = "" }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>,
        ChevronLeft: ({ className = "" }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>,
        ChevronRight: ({ className = "" }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 6 15 12 9 18" /></svg>,
        ArrowRight: ({ className = "" }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>,
        Wrench: ({ className = "" }) => <svg className={className} viewBox="0 0 24 24" fill="url(#dashGreenGradient)"><path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z" /></svg>
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

    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [timeSlots, setTimeSlots] = useState([]);
    const [slotsLoading, setSlotsLoading] = useState(false);
    const [unavailableDates, setUnavailableDates] = useState([]);

    // Get cart data from navigation state
    const serviceIds = location.state?.serviceIds || [];
    const cartItems = location.state?.cartItems || [];

    // Redirect to cart if accessed without state (e.g. direct URL or refresh)
    useEffect(() => {
        if (!location.state || !location.state.serviceIds || location.state.serviceIds.length === 0) {
            navigate('/cart', { replace: true });
        }
    }, [location.state, navigate]);
    // Generate calendar days
    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const days = [];

        // Add empty slots for days before month starts
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(null);
        }

        // Add all days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            days.push(new Date(year, month, day));
        }

        return days;
    };

    const formatDateToString = (date) => {
        if (!date) return '';
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const isHoliday = (date) => {
        if (!date) return false;
        // Sundays are treated as holidays
        return date.getDay() === 0;
    };

    const isUnavailable = (date) => {
        if (!date) return false;
        return unavailableDates.includes(formatDateToString(date));
    };

    const isPastDate = (date) => {
        if (!date) return false;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date < today;
    };

    const getDayStatus = (date) => {
        if (!date || isPastDate(date)) return 'disabled';
        if (isHoliday(date)) return 'holiday';
        if (isUnavailable(date)) return 'unavailable';
        return 'available';
    };

    const handlePrevMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
        setSelectedDate(null);
        setSelectedTime(null);
    };

    const handleNextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
        setSelectedDate(null);
        setSelectedTime(null);
    };

    const handleDateClick = async (date) => {
        const status = getDayStatus(date);
        if (status === 'available') {
            setSelectedDate(date);
            setSelectedTime(null);

            // Fetch time slots from API
            try {
                setSlotsLoading(true);
                const dateStr = formatDateToString(date);
                const response = await getAvailableSlots(dateStr);
                if (response.success && response.data && response.data.slots) {
                    // Map API SlotDTO to rendering format
                    const mappedSlots = response.data.slots.map((slot, index) => {
                        const startTime = formatTimeForDisplay(slot.start);
                        const endTime = formatTimeForDisplay(slot.end);
                        return {
                            id: index + 1,
                            time: startTime,
                            duration: `${startTime} - ${endTime}`,
                            available: slot.available,
                            start: slot.start,
                            end: slot.end
                        };
                    });
                    setTimeSlots(mappedSlots);
                } else {
                    setTimeSlots([]);
                }
            } catch (error) {
                console.error('Error fetching time slots:', error);
                setTimeSlots([]);
            } finally {
                setSlotsLoading(false);
            }
        }
    };

    // Helper to format 24h time ("08:00") to 12h display ("08:00 AM")
    const formatTimeForDisplay = (timeStr) => {
        if (!timeStr) return '';
        const [hours, minutes] = timeStr.split(':').map(Number);
        const period = hours >= 12 ? 'PM' : 'AM';
        const displayHour = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
        return `${String(displayHour).padStart(2, '0')}:${String(minutes).padStart(2, '0')} ${period}`;
    };

    const handleTimeClick = (slot) => {
        if (slot.available) {
            setSelectedTime(slot);
        }
    };

    const handleContinue = () => {
        if (selectedDate && selectedTime) {
            // Navigate to next step (booking form or payment)
            navigate('/booking-form', {
                state: {
                    selectedDate: formatDateToString(selectedDate),
                    selectedTime: selectedTime,
                    serviceIds: serviceIds,
                    cartItems: cartItems
                }
            });
        }
    };

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const days = getDaysInMonth(currentMonth);

    // Prevent navigating back before the real current month
    const today = new Date();
    const isCurrentMonth =
        currentMonth.getFullYear() === today.getFullYear() &&
        currentMonth.getMonth() === today.getMonth();

    // Handle browser back button
    useEffect(() => {
        const handlePopState = (e) => {
            e.preventDefault();
            navigate('/dashboard', { replace: true });
        };

        window.history.pushState(null, '', window.location.href);
        window.addEventListener('popstate', handlePopState);

        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, [navigate]);

    return (
        <div className="schedule-container">
            <Gradients />
            <UserNavbar />

            <div className="schedule-main">
                {/* Page Header */}
                <div className="page-header">
                    <div className="header-left">
                        <h1 className="page-title">
                            <span className="title-icon"><Icons.Calendar /></span>
                            Select Date & Time
                        </h1>
                        {/* <p className="page-subtitle">Choose your preferred appointment slot</p> */}
                    </div>
                </div>

                {/* Legend */}
                <div className="legend-section">
                    <div className="legend-item">
                        <div className="legend-color available"></div>
                        <span>Available</span>
                    </div>
                    <div className="legend-item">
                        <div className="legend-color holiday"></div>
                        <span>Holiday</span>
                    </div>
                    <div className="legend-item">
                        <div className="legend-color unavailable"></div>
                        <span>Not Available</span>
                    </div>
                    <div className="legend-item">
                        <div className="legend-color selected"></div>
                        <span>Selected</span>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="schedule-grid">
                    {/* Left Side - Calendar */}
                    <div className="calendar-section">
                        <div className="calendar-card">
                            {/* Calendar Header */}
                            <div className="calendar-header">
                                <button
                                    className="month-nav-btn"
                                    onClick={handlePrevMonth}
                                    disabled={isCurrentMonth}
                                >
                                    <Icons.ChevronLeft />
                                </button>
                                <h2 className="calendar-month">
                                    {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                                </h2>
                                <button className="month-nav-btn" onClick={handleNextMonth}>
                                    <Icons.ChevronRight />
                                </button>
                            </div>

                            {/* Day Names */}
                            <div className="calendar-days-header">
                                {dayNames.map(day => (
                                    <div key={day} className="day-name">{day}</div>
                                ))}
                            </div>

                            {/* Calendar Grid */}
                            <div className="calendar-grid">
                                {days.map((date, index) => {
                                    if (!date) {
                                        return <div key={`empty-${index}`} className="calendar-day empty"></div>;
                                    }

                                    const status = getDayStatus(date);
                                    const isSelected = selectedDate &&
                                        date.toDateString() === selectedDate.toDateString();

                                    return (
                                        <div
                                            key={index}
                                            className={`calendar-day ${status} ${isSelected ? 'selected' : ''}`}
                                            onClick={() => handleDateClick(date)}
                                        >
                                            <span className="day-number">{date.getDate()}</span>
                                            {status === 'holiday' && <span className="day-label">Holiday</span>}
                                            {status === 'unavailable' && <span className="day-label">Full</span>}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Time Slots */}
                    <div className="timeslots-section">
                        <div className="timeslots-card">
                            {selectedDate ? (
                                <>
                                    <div className="timeslots-header">
                                        <h3 className="timeslots-title">
                                            <span className="title-icon"><Icons.Clock /></span>
                                            Available Time Slots
                                        </h3>
                                        <p className="selected-date-display">
                                            {selectedDate.toLocaleDateString('en-IN', {
                                                weekday: 'long',
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric'
                                            })}
                                        </p>
                                    </div>

                                    {slotsLoading ? (
                                        <div className="no-date-selected">
                                            <div className="no-date-icon"><Icons.Clock /></div>
                                            <h3>Loading Slots...</h3>
                                            <p>Fetching available time slots for the selected date</p>
                                        </div>
                                    ) : (
                                        <div className="timeslots-grid">
                                            {timeSlots.map(slot => (
                                                <div
                                                    key={slot.id}
                                                    className={`time-slot ${!slot.available ? 'booked' : ''} ${selectedTime?.id === slot.id ? 'selected' : ''
                                                        }`}
                                                    onClick={() => handleTimeClick(slot)}
                                                >
                                                    <div className="time-main">{slot.time}</div>
                                                    <div className="time-duration">{slot.duration}</div>
                                                    {!slot.available && (
                                                        <div className="booked-badge">Booked</div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Selected Summary */}
                                    {selectedTime && (
                                        <div className="selection-summary">
                                            <div className="summary-header">
                                                <span className="summary-icon"><Icons.Check /></span>
                                                <span className="summary-title">Your Selection</span>
                                            </div>
                                            <div className="summary-details">
                                                <div className="summary-row">
                                                    <span className="summary-label">Date:</span>
                                                    <span className="summary-value">
                                                        {selectedDate.toLocaleDateString('en-IN', {
                                                            day: 'numeric',
                                                            month: 'short',
                                                            year: 'numeric'
                                                        })}
                                                    </span>
                                                </div>
                                                <div className="summary-row">
                                                    <span className="summary-label">Time:</span>
                                                    <span className="summary-value">{selectedTime.duration}</span>
                                                </div>
                                            </div>
                                            <button className="continue-btn" onClick={handleContinue}>
                                                Continue to Booking
                                                <span className="btn-arrow"><Icons.ArrowRight /></span>
                                            </button>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="no-date-selected">
                                    <div className="no-date-icon"><Icons.Calendar /></div>
                                    <h3>Select a Date</h3>
                                    <p>Please select an available date from the calendar to view time slots</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScheduleSelection;
