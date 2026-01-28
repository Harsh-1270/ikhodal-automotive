import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import UserNavbar from '../../components/common/UserNavbar';
import './ScheduleSelection.css';

const ScheduleSelection = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [currentMonth, setCurrentMonth] = useState(new Date());

    // Mock data - Admin configured unavailable dates and holidays
    const adminConfig = {
        holidays: [
            '2025-02-01', // Weekend/Holiday
            '2025-02-15', // Holiday
            '2025-02-26', // Republic Day
        ],
        unavailableDates: [
            '2025-02-05', // Fully booked
            '2025-02-12', // Maintenance day
            '2025-02-20', // Staff unavailable
        ]
    };

    // Mock time slots with availability
    const timeSlots = [
        { id: 1, time: '09:00 AM', duration: '9:00 AM - 11:00 AM', available: true },
        { id: 2, time: '10:00 AM', duration: '10:00 AM - 12:00 PM', available: true },
        { id: 3, time: '11:00 AM', duration: '11:00 AM - 01:00 PM', available: false },
        { id: 4, time: '12:00 PM', duration: '12:00 PM - 02:00 PM', available: true },
        { id: 5, time: '02:00 PM', duration: '02:00 PM - 04:00 PM', available: true },
        { id: 6, time: '03:00 PM', duration: '03:00 PM - 05:00 PM', available: false },
        { id: 7, time: '04:00 PM', duration: '04:00 PM - 06:00 PM', available: true },
        { id: 8, time: '05:00 PM', duration: '05:00 PM - 07:00 PM', available: true },
    ];

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
        return adminConfig.holidays.includes(formatDateToString(date));
    };

    const isUnavailable = (date) => {
        if (!date) return false;
        return adminConfig.unavailableDates.includes(formatDateToString(date));
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

    const handleDateClick = (date) => {
        const status = getDayStatus(date);
        if (status === 'available') {
            setSelectedDate(date);
            setSelectedTime(null);
        }
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
                    selectedTime: selectedTime
                }
            });
        }
    };

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const days = getDaysInMonth(currentMonth);

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
            <UserNavbar />

            <div className="schedule-main">
                {/* Page Header */}
                <div className="page-header">
                    <div className="header-left">
                        <h1 className="page-title">
                            <span className="title-icon">📅</span>
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
                                            <span className="title-icon">⏰</span>
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

                                    <div className="timeslots-grid">
                                        {timeSlots.map(slot => (
                                            <div
                                                key={slot.id}
                                                className={`time-slot ${!slot.available ? 'booked' : ''} ${
                                                    selectedTime?.id === slot.id ? 'selected' : ''
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

                                    {/* Selected Summary */}
                                    {selectedTime && (
                                        <div className="selection-summary">
                                            <div className="summary-header">
                                                <span className="summary-icon">✓</span>
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
                                                <span className="btn-arrow">→</span>
                                            </button>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="no-date-selected">
                                    <div className="no-date-icon">📅</div>
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
