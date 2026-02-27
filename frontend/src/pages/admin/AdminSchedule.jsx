/* ============================================
   ADMIN SCHEDULE MANAGEMENT
   ============================================ */

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from '../../components/common/AdminNavbar';
import { getTimeSlots, getScheduleOverrides, createScheduleOverride, deleteScheduleOverride } from '../../services/api';
import './AdminSchedule.css';

const AdminSchedule = () => {
    /* ==========================================
       SVG ICONS COMPONENT
       ========================================== */
    const Icons = {
        Calendar: ({ className = "", color = "#3b82f6" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
        ),
        Settings: ({ className = "", color = "#64748b" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M12 1v6m0 6v6m8.66-15l-5.2 3m-6.92 4l-5.2 3M23 12h-6m-6 0H1m17.66 8l-5.2-3m-6.92-4l-5.2-3" />
            </svg>
        ),
        PartyPopper: ({ className = "", color = "#f59e0b" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5.8 11.3L2 22l10.7-3.79" />
                <path d="M4 3h.01M22 8h.01M15 2h.01M22 20h.01" />
                <path d="M22 2l-2.24.75a2.9 2.9 0 0 0-1.96 3.12v0c.1.86-.57 1.63-1.45 1.63h-.38c-.86 0-1.6.6-1.76 1.44L14 10" />
                <path d="M22 13l-.82-.33c-.86-.34-1.82.2-1.98 1.11v0c-.11.7-.72 1.22-1.43 1.22H17" />
                <circle cx="12" cy="12" r="2" />
            </svg>
        ),
        XCircle: ({ className = "", color = "#ef4444" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
        ),
        CheckCircle: ({ className = "", color = "#10b981" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="9 12 11 14 15 10" />
            </svg>
        ),
        Clock: ({ className = "", color = "#64748b" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
            </svg>
        ),
        Info: ({ className = "", color = "#3b82f6" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
        ),
        ChevronLeft: ({ className = "", color = "currentColor" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
            </svg>
        ),
        ChevronRight: ({ className = "", color = "currentColor" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
            </svg>
        ),
        User: ({ className = "", color = "#3b82f6" }) => (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
            </svg>
        )
    };

    const navigate = useNavigate();
    const [selectedDate, setSelectedDate] = useState(null);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [overrides, setOverrides] = useState([]);
    const [timeSlots, setTimeSlots] = useState([]);
    const [dateIsHoliday, setDateIsHoliday] = useState(false);
    const [dateIsUnavailable, setDateIsUnavailable] = useState(false);
    const [loadingSlots, setLoadingSlots] = useState(false);

    // Toast state
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    /* ==========================================
       TOAST NOTIFICATION
       ========================================== */
    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => {
            setToast({ show: false, message: '', type: 'success' });
        }, 3000);
    };

    /* ==========================================
       FETCH OVERRIDES FOR CURRENT MONTH
       ========================================== */
    const fetchOverrides = useCallback(async () => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth() + 1;
        const result = await getScheduleOverrides(year, month);
        if (result.success) {
            setOverrides(result.data || []);
        }
    }, [currentMonth]);

    useEffect(() => {
        fetchOverrides();
    }, [fetchOverrides]);

    /* ==========================================
       FETCH TIME SLOTS FOR SELECTED DATE
       ========================================== */
    const fetchTimeSlots = useCallback(async (date) => {
        if (!date) return;
        setLoadingSlots(true);
        const sunday = date.getDay() === 0;
        const dateStr = formatDateToString(date);
        const result = await getTimeSlots(dateStr);
        if (result.success && result.data) {
            setTimeSlots(sunday ? [] : (result.data.slots || []));
            setDateIsHoliday(sunday || result.data.holiday || false);
            setDateIsUnavailable(result.data.unavailable || false);
        } else {
            setTimeSlots([]);
            setDateIsHoliday(sunday);
            setDateIsUnavailable(false);
        }
        setLoadingSlots(false);
    }, []);

    useEffect(() => {
        if (selectedDate) {
            fetchTimeSlots(selectedDate);
        } else {
            setTimeSlots([]);
            setDateIsHoliday(false);
            setDateIsUnavailable(false);
        }
    }, [selectedDate, fetchTimeSlots]);

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

    const getOverridesForDate = (date) => {
        if (!date) return [];
        const dateStr = formatDateToString(date);
        return overrides.filter(o => o.date === dateStr);
    };

    const isSunday = (date) => {
        if (!date) return false;
        return date.getDay() === 0;
    };

    const isHoliday = (date) => {
        if (isSunday(date)) return true;
        return getOverridesForDate(date).some(o => o.overrideType === 'HOLIDAY');
    };

    const isUnavailable = (date) => {
        return getOverridesForDate(date).some(o => o.overrideType === 'UNAVAILABLE');
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

    const handleMarkAsHoliday = async () => {
        if (!selectedDate) return;
        const dateStr = formatDateToString(selectedDate);

        if (isHoliday(selectedDate)) {
            // Remove holiday
            const result = await deleteScheduleOverride({ date: dateStr, overrideType: 'HOLIDAY' });
            if (result.success) {
                showToast(`${dateStr} removed from holidays!`, 'success');
                await fetchOverrides();
                await fetchTimeSlots(selectedDate);
            } else {
                showToast(result.message, 'error');
            }
        } else {
            // Mark as holiday
            const result = await createScheduleOverride({ date: dateStr, overrideType: 'HOLIDAY' });
            if (result.success) {
                showToast(`${dateStr} marked as holiday!`, 'success');
                await fetchOverrides();
                await fetchTimeSlots(selectedDate);
            } else {
                showToast(result.message, 'error');
            }
        }
    };

    const handleMarkAsUnavailable = async () => {
        if (!selectedDate) return;
        const dateStr = formatDateToString(selectedDate);

        if (isUnavailable(selectedDate)) {
            // Remove unavailable
            const result = await deleteScheduleOverride({ date: dateStr, overrideType: 'UNAVAILABLE' });
            if (result.success) {
                showToast(`${dateStr} is now available!`, 'success');
                await fetchOverrides();
                await fetchTimeSlots(selectedDate);
            } else {
                showToast(result.message, 'error');
            }
        } else {
            // Mark as unavailable
            const result = await createScheduleOverride({ date: dateStr, overrideType: 'UNAVAILABLE' });
            if (result.success) {
                showToast(`${dateStr} marked as unavailable!`, 'success');
                await fetchOverrides();
                await fetchTimeSlots(selectedDate);
            } else {
                showToast(result.message, 'error');
            }
        }
    };

    const handleMarkAsAvailable = async () => {
        if (!selectedDate) return;
        const dateStr = formatDateToString(selectedDate);

        // Remove all overrides for this date
        if (isHoliday(selectedDate)) {
            await deleteScheduleOverride({ date: dateStr, overrideType: 'HOLIDAY' });
        }
        if (isUnavailable(selectedDate)) {
            await deleteScheduleOverride({ date: dateStr, overrideType: 'UNAVAILABLE' });
        }
        // Remove slot-level overrides
        const slotOverrides = getOverridesForDate(selectedDate)
            .filter(o => o.overrideType === 'SLOT_BLOCKED');
        for (const so of slotOverrides) {
            await deleteScheduleOverride({
                date: dateStr,
                overrideType: 'SLOT_BLOCKED',
                startTime: so.startTime,
                endTime: so.endTime
            });
        }

        showToast(`${dateStr} is now fully available!`, 'success');
        await fetchOverrides();
        await fetchTimeSlots(selectedDate);
    };

    /* ==========================================
       TIME SLOT MANAGEMENT
       ========================================== */
    const handleTimeSlotToggle = async (slot) => {
        if (!selectedDate) return;
        if (slot.status === 'BOOKED') return; // Can't toggle booked slots

        const dateStr = formatDateToString(selectedDate);

        if (slot.status === 'BLOCKED') {
            // Try to unblock — remove the slot override
            const result = await deleteScheduleOverride({
                date: dateStr,
                overrideType: 'SLOT_BLOCKED',
                startTime: slot.start,
                endTime: slot.end
            });
            if (result.success) {
                showToast(`Time slot ${formatTime(slot.start)} is now available!`, 'success');
                await fetchTimeSlots(selectedDate);
            } else {
                showToast(result.message, 'error');
            }
        } else {
            // Block the slot
            const result = await createScheduleOverride({
                date: dateStr,
                overrideType: 'SLOT_BLOCKED',
                startTime: slot.start,
                endTime: slot.end
            });
            if (result.success) {
                showToast(`Time slot ${formatTime(slot.start)} marked as unavailable!`, 'success');
                await fetchTimeSlots(selectedDate);
            } else {
                showToast(result.message, 'error');
            }
        }
    };

    /* ==========================================
       FORMAT TIME (HH:mm to 12hr format)
       ========================================== */
    const formatTime = (timeStr) => {
        if (!timeStr) return '';
        const [hours, minutes] = timeStr.split(':');
        const h = parseInt(hours, 10);
        const ampm = h >= 12 ? 'PM' : 'AM';
        const displayHour = h % 12 || 12;
        return `${String(displayHour).padStart(2, '0')}:${minutes} ${ampm}`;
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

    // Prevent navigating back before the real current month
    const today = new Date();
    const isCurrentMonth =
        currentMonth.getFullYear() === today.getFullYear() &&
        currentMonth.getMonth() === today.getMonth();

    return (
        <div className="adm-sch-container">
            {/* Admin Navbar */}
            <AdminNavbar />

            {/* Toast Notification */}
            {toast.show && (
                <div className={`adm-sch-toast ${toast.type}`}>
                    <div className="adm-sch-toast-icon">
                        {toast.type === 'success' ? <Icons.CheckCircle color="#ffffff" /> : <Icons.XCircle color="#ffffff" />}
                    </div>
                    <span className="adm-sch-toast-message">{toast.message}</span>
                    <button className="adm-sch-toast-close" onClick={() => setToast({ show: false, message: '', type: 'success' })}>
                        ×
                    </button>
                </div>
            )}

            {/* Main Content */}
            <div className="adm-sch-main">
                {/* Page Header */}
                <div className="adm-sch-page-header">
                    <div className="adm-sch-header-left">
                        <h1 className="adm-sch-page-title">
                            <span className="adm-sch-title-icon"><Icons.Calendar /></span>
                            Schedule Management
                        </h1>
                    </div>
                </div>

                {/* Legend */}
                <div className="adm-sch-legend-section">
                    <div className="adm-sch-legend-item">
                        <div className="adm-sch-legend-color available"></div>
                        <span>Available</span>
                    </div>
                    <div className="adm-sch-legend-item">
                        <div className="adm-sch-legend-color holiday"></div>
                        <span>Holiday</span>
                    </div>
                    <div className="adm-sch-legend-item">
                        <div className="adm-sch-legend-color unavailable"></div>
                        <span>Not Available</span>
                    </div>
                    <div className="adm-sch-legend-item">
                        <div className="adm-sch-legend-color booked"></div>
                        <span>Booked</span>
                    </div>
                    <div className="adm-sch-legend-item">
                        <div className="adm-sch-legend-color selected"></div>
                        <span>Selected</span>
                    </div>
                </div>

                {/* Main Grid */}
                <div className="adm-sch-grid">
                    {/* Left Side - Calendar */}
                    <div className="adm-sch-calendar-section">
                        <div className="adm-sch-calendar-card">
                            {/* Calendar Header */}
                            <div className="adm-sch-calendar-header">
                                <button
                                    className="adm-sch-month-nav-btn"
                                    onClick={handlePrevMonth}
                                    disabled={isCurrentMonth}
                                >
                                    <span><Icons.ChevronLeft /></span>
                                </button>
                                <h2 className="adm-sch-calendar-month">
                                    {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                                </h2>
                                <button className="adm-sch-month-nav-btn" onClick={handleNextMonth}>
                                    <span><Icons.ChevronRight /></span>
                                </button>
                            </div>

                            {/* Day Names */}
                            <div className="adm-sch-days-header">
                                {dayNames.map(day => (
                                    <div key={day} className="adm-sch-day-name">{day}</div>
                                ))}
                            </div>

                            {/* Calendar Grid */}
                            <div className="adm-sch-calendar-grid">
                                {days.map((date, index) => {
                                    if (!date) {
                                        return <div key={`empty-${index}`} className="adm-sch-day empty"></div>;
                                    }

                                    const status = getDayStatus(date);
                                    const isSelected = selectedDate &&
                                        date.toDateString() === selectedDate.toDateString();

                                    return (
                                        <div
                                            key={index}
                                            className={`adm-sch-day ${status} ${isSelected ? 'selected' : ''}`}
                                            onClick={() => handleDateClick(date)}
                                        >
                                            <span className="adm-sch-day-number">{date.getDate()}</span>
                                            {status === 'holiday' && <span className="adm-sch-day-label">{isSunday(date) ? 'Sunday' : 'Holiday'}</span>}
                                            {status === 'unavailable' && <span className="adm-sch-day-label">Closed</span>}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Controls */}
                    <div className="adm-sch-controls-section">
                        <div className="adm-sch-controls-card">
                            {selectedDate ? (
                                <>
                                    <div className="adm-sch-controls-header">
                                        <h3 className="adm-sch-controls-title">
                                            <span className="adm-sch-title-icon"><Icons.Settings /></span>
                                            Manage Availability
                                        </h3>
                                        <p className="adm-sch-selected-date">
                                            {selectedDate.toLocaleDateString('en-IN', {
                                                weekday: 'long',
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric'
                                            })}
                                        </p>
                                    </div>

                                    {/* Date Status Actions */}
                                    <div className="adm-sch-date-actions">
                                        <h4 className="adm-sch-section-title">Date Status</h4>
                                        <div className="adm-sch-action-buttons">
                                            <button
                                                className="adm-sch-action-btn holiday"
                                                onClick={handleMarkAsHoliday}
                                            >
                                                <span className="adm-sch-btn-icon"><Icons.PartyPopper /></span>
                                                <span>{isHoliday(selectedDate) ? 'Remove Holiday' : 'Mark as Holiday'}</span>
                                            </button>
                                            <button
                                                className="adm-sch-action-btn unavailable"
                                                onClick={handleMarkAsUnavailable}
                                            >
                                                <span className="adm-sch-btn-icon"><Icons.XCircle /></span>
                                                <span>{isUnavailable(selectedDate) ? 'Make Available' : 'Mark Unavailable'}</span>
                                            </button>
                                            <button
                                                className="adm-sch-action-btn available"
                                                onClick={handleMarkAsAvailable}
                                            >
                                                <span className="adm-sch-btn-icon"><Icons.CheckCircle /></span>
                                                <span>Clear All Restrictions</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Time Slots Management */}
                                    {!dateIsHoliday && !dateIsUnavailable && (
                                        <div className="adm-sch-timeslots-mgmt">
                                            <h4 className="adm-sch-section-title">
                                                <span><Icons.Clock /></span>
                                                Time Slot Availability
                                            </h4>
                                            <p className="adm-sch-section-subtitle">
                                                Click on time slots to toggle availability. Booked slots cannot be modified.
                                            </p>
                                            {loadingSlots ? (
                                                <p className="adm-sch-section-subtitle">Loading time slots...</p>
                                            ) : (
                                                <div className="adm-sch-timeslots-grid">
                                                    {timeSlots.map((slot, idx) => {
                                                        const slotStatus = slot.status || (slot.available ? 'AVAILABLE' : 'BLOCKED');
                                                        const statusClass = slotStatus === 'BOOKED' ? 'booked' :
                                                            slotStatus === 'BLOCKED' ? 'unavailable' : 'available';
                                                        const isClickable = slotStatus !== 'BOOKED';

                                                        return (
                                                            <div
                                                                key={idx}
                                                                className={`adm-sch-time-slot ${statusClass}`}
                                                                onClick={() => isClickable && handleTimeSlotToggle(slot)}
                                                                style={{ cursor: isClickable ? 'pointer' : 'default' }}
                                                            >
                                                                <div className="adm-sch-slot-status-icon">
                                                                    {slotStatus === 'BOOKED' ? <Icons.User color="#1e3a8a" /> :
                                                                        slotStatus === 'BLOCKED' ? <Icons.XCircle /> :
                                                                            <Icons.CheckCircle />}
                                                                </div>
                                                                <div className="adm-sch-slot-details">
                                                                    <div className="adm-sch-slot-time">{formatTime(slot.start)}</div>
                                                                    <div className="adm-sch-slot-duration">{formatTime(slot.start)} - {formatTime(slot.end)}</div>
                                                                </div>
                                                                <div className="adm-sch-slot-status-text">
                                                                    {slotStatus === 'BOOKED' ? 'Booked' :
                                                                        slotStatus === 'BLOCKED' ? 'Unavailable' : 'Available'}
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Info Message */}
                                    {(dateIsHoliday || dateIsUnavailable) && (
                                        <div className="adm-sch-info-message">
                                            <div className="adm-sch-info-icon"><Icons.Info /></div>
                                            <div className="adm-sch-info-text">
                                                {dateIsHoliday &&
                                                    'This date is marked as a holiday. All time slots are unavailable.'}
                                                {dateIsUnavailable &&
                                                    'This date is marked as unavailable. All time slots are blocked.'}
                                            </div>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="adm-sch-no-date">
                                    <div className="adm-sch-no-date-icon"><Icons.Calendar color="#94a3b8" /></div>
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
