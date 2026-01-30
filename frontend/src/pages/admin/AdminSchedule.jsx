/* ============================================
   ADMIN SCHEDULE MANAGEMENT
   ============================================ */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from '../../components/common/AdminNavbar';
import './AdminSchedule.css';

const AdminSchedule = () => {
    const navigate = useNavigate();
    const [selectedDate, setSelectedDate] = useState(null);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [unavailableDates, setUnavailableDates] = useState([]);
    const [holidays, setHolidays] = useState([]);
    const [unavailableTimeSlots, setUnavailableTimeSlots] = useState({});

    /* ==========================================
       MOCK DATA - INITIAL CONFIGURATION
       ========================================== */
    useEffect(() => {
        // Load initial unavailable dates
        setUnavailableDates([
            '2026-02-05',
            '2026-02-12',
            '2026-02-20',
        ]);

        // Load initial holidays
        setHolidays([
            '2026-02-01',
            '2026-02-15',
            '2026-02-26',
        ]);

        // Load initial unavailable time slots per date
        setUnavailableTimeSlots({
            '2026-02-08': [3, 6], // Time slot IDs that are unavailable
            '2026-02-10': [1, 4, 7],
        });
    }, []);

    /* ==========================================
       TIME SLOTS CONFIGURATION
       ========================================== */
    const timeSlots = [
        { id: 1, time: '09:00 AM', duration: '9:00 AM - 11:00 AM' },
        { id: 2, time: '10:00 AM', duration: '10:00 AM - 12:00 PM' },
        { id: 3, time: '11:00 AM', duration: '11:00 AM - 01:00 PM' },
        { id: 4, time: '12:00 PM', duration: '12:00 PM - 02:00 PM' },
        { id: 5, time: '02:00 PM', duration: '02:00 PM - 04:00 PM' },
        { id: 6, time: '03:00 PM', duration: '03:00 PM - 05:00 PM' },
        { id: 7, time: '04:00 PM', duration: '04:00 PM - 06:00 PM' },
        { id: 8, time: '05:00 PM', duration: '05:00 PM - 07:00 PM' },
    ];

    /* ==========================================
       CALENDAR FUNCTIONS
       ========================================== */
    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const days = [];
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(null);
        }
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
        return holidays.includes(formatDateToString(date));
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
        if (!date || isPastDate(date)) return 'past';
        if (isHoliday(date)) return 'holiday';
        if (isUnavailable(date)) return 'unavailable';
        return 'available';
    };

    /* ==========================================
       DATE MANAGEMENT FUNCTIONS
       ========================================== */
    const handleDateClick = (date) => {
        if (isPastDate(date)) return;
        setSelectedDate(date);
    };

    const handleMarkAsHoliday = () => {
        if (!selectedDate) return;
        const dateStr = formatDateToString(selectedDate);

        if (holidays.includes(dateStr)) {
            setHolidays(holidays.filter(d => d !== dateStr));
            alert(`✅ ${dateStr} removed from holidays!`);
        } else {
            setHolidays([...holidays, dateStr]);
            // Remove from unavailable if it was there
            setUnavailableDates(unavailableDates.filter(d => d !== dateStr));
            alert(`✅ ${dateStr} marked as holiday!`);
        }
    };

    const handleMarkAsUnavailable = () => {
        if (!selectedDate) return;
        const dateStr = formatDateToString(selectedDate);

        if (unavailableDates.includes(dateStr)) {
            setUnavailableDates(unavailableDates.filter(d => d !== dateStr));
            alert(`✅ ${dateStr} is now available!`);
        } else {
            setUnavailableDates([...unavailableDates, dateStr]);
            // Remove from holidays if it was there
            setHolidays(holidays.filter(d => d !== dateStr));
            alert(`✅ ${dateStr} marked as unavailable!`);
        }
    };

    const handleMarkAsAvailable = () => {
        if (!selectedDate) return;
        const dateStr = formatDateToString(selectedDate);

        setUnavailableDates(unavailableDates.filter(d => d !== dateStr));
        setHolidays(holidays.filter(d => d !== dateStr));
        // Also clear time slot restrictions for this date
        const newTimeSlots = { ...unavailableTimeSlots };
        delete newTimeSlots[dateStr];
        setUnavailableTimeSlots(newTimeSlots);

        alert(`✅ ${dateStr} is now fully available!`);
    };

    /* ==========================================
       TIME SLOT MANAGEMENT
       ========================================== */
    const isTimeSlotUnavailable = (slotId) => {
        if (!selectedDate) return false;
        const dateStr = formatDateToString(selectedDate);
        return unavailableTimeSlots[dateStr]?.includes(slotId) || false;
    };

    const handleTimeSlotToggle = (slotId) => {
        if (!selectedDate) return;
        const dateStr = formatDateToString(selectedDate);

        const currentSlots = unavailableTimeSlots[dateStr] || [];

        if (currentSlots.includes(slotId)) {
            // Make available
            const newSlots = currentSlots.filter(id => id !== slotId);
            setUnavailableTimeSlots({
                ...unavailableTimeSlots,
                [dateStr]: newSlots.length > 0 ? newSlots : undefined
            });
            alert(`✅ Time slot ${timeSlots.find(s => s.id === slotId).time} is now available!`);
        } else {
            // Make unavailable
            setUnavailableTimeSlots({
                ...unavailableTimeSlots,
                [dateStr]: [...currentSlots, slotId]
            });
            alert(`✅ Time slot ${timeSlots.find(s => s.id === slotId).time} marked as unavailable!`);
        }
    };

    /* ==========================================
       MONTH NAVIGATION
       ========================================== */
    const handlePrevMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
        setSelectedDate(null);
    };

    const handleNextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
        setSelectedDate(null);
    };

    /* ==========================================
       RENDER
       ========================================== */
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const days = getDaysInMonth(currentMonth);

    return (
        <div className="admin-schedule-container">
            {/* Admin Navbar */}
            <AdminNavbar />

            {/* Main Content */}
            <div className="admin-schedule-main">
                {/* Page Header */}
                <div className="page-header">
                    <div className="header-left">
                        <h1 className="page-title">
                            <span className="title-icon">📅</span>
                            Schedule Management
                        </h1>
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

                {/* Main Grid */}
                <div className="schedule-grid">
                    {/* Left Side - Calendar */}
                    <div className="calendar-section">
                        <div className="calendar-card">
                            {/* Calendar Header */}
                            <div className="calendar-header">
                                <button className="month-nav-btn" onClick={handlePrevMonth}>
                                    <span>←</span>
                                </button>
                                <h2 className="calendar-month">
                                    {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                                </h2>
                                <button className="month-nav-btn" onClick={handleNextMonth}>
                                    <span>→</span>
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
                                            {status === 'unavailable' && <span className="day-label">Closed</span>}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Controls */}
                    <div className="controls-section">
                        <div className="controls-card">
                            {selectedDate ? (
                                <>
                                    <div className="controls-header">
                                        <h3 className="controls-title">
                                            <span className="title-icon">⚙️</span>
                                            Manage Availability
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

                                    {/* Date Status Actions */}
                                    <div className="date-actions">
                                        <h4 className="section-title">Date Status</h4>
                                        <div className="action-buttons">
                                            <button
                                                className="action-btn holiday"
                                                onClick={handleMarkAsHoliday}
                                            >
                                                <span className="btn-icon">🎉</span>
                                                <span>{isHoliday(selectedDate) ? 'Remove Holiday' : 'Mark as Holiday'}</span>
                                            </button>
                                            <button
                                                className="action-btn unavailable"
                                                onClick={handleMarkAsUnavailable}
                                            >
                                                <span className="btn-icon">❌</span>
                                                <span>{isUnavailable(selectedDate) ? 'Make Available' : 'Mark Unavailable'}</span>
                                            </button>
                                            <button
                                                className="action-btn available"
                                                onClick={handleMarkAsAvailable}
                                            >
                                                <span className="btn-icon">✅</span>
                                                <span>Clear All Restrictions</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Time Slots Management */}
                                    {getDayStatus(selectedDate) === 'available' && (
                                        <div className="timeslots-management">
                                            <h4 className="section-title">
                                                <span>⏰</span>
                                                Time Slot Availability
                                            </h4>
                                            <p className="section-subtitle">
                                                Click on time slots to toggle availability
                                            </p>
                                            <div className="timeslots-grid">
                                                {timeSlots.map(slot => {
                                                    const isUnavail = isTimeSlotUnavailable(slot.id);
                                                    return (
                                                        <div
                                                            key={slot.id}
                                                            className={`time-slot-item ${isUnavail ? 'unavailable' : 'available'}`}
                                                            onClick={() => handleTimeSlotToggle(slot.id)}
                                                        >
                                                            <div className="slot-status-icon">
                                                                {isUnavail ? '❌' : '✅'}
                                                            </div>
                                                            <div className="slot-details">
                                                                <div className="slot-time">{slot.time}</div>
                                                                <div className="slot-duration">{slot.duration}</div>
                                                            </div>
                                                            <div className="slot-status-text">
                                                                {isUnavail ? 'Unavailable' : 'Available'}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    {/* Info Message */}
                                    {(isHoliday(selectedDate) || isUnavailable(selectedDate)) && (
                                        <div className="info-message">
                                            <div className="info-icon">ℹ️</div>
                                            <div className="info-text">
                                                {isHoliday(selectedDate) &&
                                                    'This date is marked as a holiday. All time slots are unavailable.'}
                                                {isUnavailable(selectedDate) &&
                                                    'This date is marked as unavailable. All time slots are blocked.'}
                                            </div>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="no-date-selected">
                                    <div className="no-date-icon">📅</div>
                                    <h3>Select a Date</h3>
                                    <p>Click on a date in the calendar to manage its availability settings</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminSchedule;
