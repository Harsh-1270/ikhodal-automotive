/* ============================================
   API SERVICE - ALL API CALLS
   Centralized API communication layer
   ============================================ */

import axios from 'axios';

// Base API URL from environment variables
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

/* ==========================================
   AXIOS INSTANCE with default config
   ========================================== */
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 seconds timeout
});

/* ==========================================
   REQUEST INTERCEPTOR
   Automatically adds auth token to requests
   ========================================== */
api.interceptors.request.use(
    (config) => {
        // Get token from localStorage
        const token = localStorage.getItem('token');

        // Add token to headers if exists
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

/* ==========================================
   RESPONSE INTERCEPTOR
   Handles common error responses
   ========================================== */
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle 401 Unauthorized (token expired)
        if (error.response?.status === 401) {
            // Clear auth data
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            localStorage.removeItem('isAdmin');

            // Redirect to login
            window.location.href = '/login';
        }

        return Promise.reject(error);
    }
);

/* ============================================
   AUTHENTICATION APIs
   ============================================ */

/* User Registration
   POST /auth/register
   Body: { name, email, password }
*/
export const registerUser = async (userData) => {
    try {
        const response = await api.post('/auth/register', userData);
        return {
            success: true,
            data: response.data,
            message: 'Registration successful'
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Registration failed'
        };
    }
};

/* User Login
   POST /auth/login
   Body: { email, password }
*/
export const loginUser = async (credentials) => {
    try {
        const response = await api.post('/auth/login', credentials);
        return {
            success: true,
            data: response.data,
            message: 'Login successful'
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Login failed'
        };
    }
};

/* Admin Login
   POST /auth/admin/login
   Body: { email, password }
*/
export const loginAdmin = async (credentials) => {
    try {
        const response = await api.post('/auth/admin/login', credentials);
        return {
            success: true,
            data: response.data,
            message: 'Admin login successful'
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Admin login failed'
        };
    }
};

/* ============================================
   SERVICE APIs
   ============================================ */

/* Get All Services
   GET /services
*/
export const getServices = async () => {
    try {
        const response = await api.get('/services');
        return {
            success: true,
            data: response.data,
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch services',
            data: []
        };
    }
};

/* Get Service by ID
   GET /services/:id
*/
export const getServiceById = async (serviceId) => {
    try {
        const response = await api.get(`/services/${serviceId}`);
        return {
            success: true,
            data: response.data,
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch service'
        };
    }
};

/* ============================================
   BOOKING APIs
   ============================================ */

/* Create Booking
   POST /bookings
   Body: { serviceId, date, time, customerDetails }
*/
export const createBooking = async (bookingData) => {
    try {
        const response = await api.post('/bookings', bookingData);
        return {
            success: true,
            data: response.data,
            message: 'Booking created successfully'
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to create booking'
        };
    }
};

/* Get User Bookings
   GET /bookings/user
*/
export const getUserBookings = async () => {
    try {
        const response = await api.get('/bookings/user');
        return {
            success: true,
            data: response.data,
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch bookings',
            data: []
        };
    }
};

/* Get Booking by ID
   GET /bookings/:id
*/
export const getBookingById = async (bookingId) => {
    try {
        const response = await api.get(`/bookings/${bookingId}`);
        return {
            success: true,
            data: response.data,
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch booking'
        };
    }
};

/* ============================================
   AVAILABILITY APIs
   ============================================ */

/* Get Available Time Slots
   GET /availability/slots
   Query: ?date=YYYY-MM-DD&serviceId=123
*/
export const getAvailableSlots = async (date, serviceId) => {
    try {
        const response = await api.get('/availability/slots', {
            params: { date, serviceId }
        });
        return {
            success: true,
            data: response.data,
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch available slots',
            data: []
        };
    }
};

/* Check if Date is Available
   GET /availability/check
   Query: ?date=YYYY-MM-DD
*/
export const checkDateAvailability = async (date) => {
    try {
        const response = await api.get('/availability/check', {
            params: { date }
        });
        return {
            success: true,
            data: response.data,
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to check availability'
        };
    }
};

/* ============================================
   PAYMENT APIs (Stripe Integration)
   ============================================ */

/* Create Payment Intent
   POST /payment/create-intent
   Body: { amount, bookingId }
*/
export const createPaymentIntent = async (paymentData) => {
    try {
        const response = await api.post('/payment/create-intent', paymentData);
        return {
            success: true,
            data: response.data,
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to create payment intent'
        };
    }
};

/* Confirm Payment
   POST /payment/confirm
   Body: { paymentIntentId, bookingId }
*/
export const confirmPayment = async (paymentData) => {
    try {
        const response = await api.post('/payment/confirm', paymentData);
        return {
            success: true,
            data: response.data,
            message: 'Payment confirmed successfully'
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Payment confirmation failed'
        };
    }
};

/* ============================================
   ADMIN - APPOINTMENT APIs
   ============================================ */

/* Get All Appointments (Admin)
   GET /admin/appointments
   Query: ?status=pending or ?status=completed
*/
export const getAdminAppointments = async (status = '') => {
    try {
        const response = await api.get('/admin/appointments', {
            params: status ? { status } : {}
        });
        return {
            success: true,
            data: response.data,
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch appointments',
            data: []
        };
    }
};

/* Update Appointment Status
   PUT /admin/appointments/:id/status
   Body: { status: 'completed' }
*/
export const updateAppointmentStatus = async (appointmentId, status) => {
    try {
        const response = await api.put(`/admin/appointments/${appointmentId}/status`, {
            status
        });
        return {
            success: true,
            data: response.data,
            message: 'Appointment status updated successfully'
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to update appointment status'
        };
    }
};

/* Delete Appointment
   DELETE /admin/appointments/:id
*/
export const deleteAppointment = async (appointmentId) => {
    try {
        const response = await api.delete(`/admin/appointments/${appointmentId}`);
        return {
            success: true,
            message: 'Appointment deleted successfully'
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to delete appointment'
        };
    }
};

/* ============================================
   ADMIN - USER MANAGEMENT APIs
   ============================================ */

/* Get All Users
   GET /admin/users
*/
export const getAllUsers = async () => {
    try {
        const response = await api.get('/admin/users');
        return {
            success: true,
            data: response.data,
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch users',
            data: []
        };
    }
};

/* Delete User
   DELETE /admin/users/:id
*/
export const deleteUser = async (userId) => {
    try {
        const response = await api.delete(`/admin/users/${userId}`);
        return {
            success: true,
            message: 'User deleted successfully'
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to delete user'
        };
    }
};

/* Get User Stats (for dashboard)
   GET /admin/stats/users
*/
export const getUserStats = async () => {
    try {
        const response = await api.get('/admin/stats/users');
        return {
            success: true,
            data: response.data,
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch user stats',
            data: { totalUsers: 0, activeUsers: 0 }
        };
    }
};

/* ============================================
   ADMIN - AVAILABILITY MANAGEMENT APIs
   ============================================ */

/* Get All Availability Rules
   GET /admin/availability
*/
export const getAvailabilityRules = async () => {
    try {
        const response = await api.get('/admin/availability');
        return {
            success: true,
            data: response.data,
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch availability rules',
            data: []
        };
    }
};

/* Create Availability Rule
   POST /admin/availability
   Body: { day: 'Monday', startTime: '10:00', endTime: '14:00', type: 'unavailable' }
*/
export const createAvailabilityRule = async (ruleData) => {
    try {
        const response = await api.post('/admin/availability', ruleData);
        return {
            success: true,
            data: response.data,
            message: 'Availability rule created successfully'
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to create availability rule'
        };
    }
};

/* Update Availability Rule
   PUT /admin/availability/:id
   Body: { startTime, endTime, type }
*/
export const updateAvailabilityRule = async (ruleId, ruleData) => {
    try {
        const response = await api.put(`/admin/availability/${ruleId}`, ruleData);
        return {
            success: true,
            data: response.data,
            message: 'Availability rule updated successfully'
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to update availability rule'
        };
    }
};

/* Delete Availability Rule
   DELETE /admin/availability/:id
*/
export const deleteAvailabilityRule = async (ruleId) => {
    try {
        const response = await api.delete(`/admin/availability/${ruleId}`);
        return {
            success: true,
            message: 'Availability rule deleted successfully'
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to delete availability rule'
        };
    }
};

/* ============================================
   ADMIN - DASHBOARD STATS APIs
   ============================================ */

/* Get Dashboard Statistics
   GET /admin/stats/dashboard
*/
export const getDashboardStats = async () => {
    try {
        const response = await api.get('/admin/stats/dashboard');
        return {
            success: true,
            data: response.data,
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch dashboard stats',
            data: {
                totalAppointments: 0,
                pendingAppointments: 0,
                completedAppointments: 0,
                totalRevenue: 0
            }
        };
    }
};

/* ============================================
   EMAIL APIs (Confirmation emails)
   ============================================ */

/* Send Booking Confirmation Email
   POST /email/booking-confirmation
   Body: { bookingId, email, type: 'user' | 'admin' }
*/
export const sendBookingConfirmation = async (emailData) => {
    try {
        const response = await api.post('/email/booking-confirmation', emailData);
        return {
            success: true,
            message: 'Confirmation email sent successfully'
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to send confirmation email'
        };
    }
};

/* ============================================
   EXPORT ALL FUNCTIONS
   ============================================ */
export default {
    // Auth
    registerUser,
    loginUser,
    loginAdmin,

    // Services
    getServices,
    getServiceById,

    // Bookings
    createBooking,
    getUserBookings,
    getBookingById,

    // Availability
    getAvailableSlots,
    checkDateAvailability,

    // Payment
    createPaymentIntent,
    confirmPayment,

    // Admin - Appointments
    getAdminAppointments,
    updateAppointmentStatus,
    deleteAppointment,

    // Admin - Users
    getAllUsers,
    deleteUser,
    getUserStats,

    // Admin - Availability
    getAvailabilityRules,
    createAvailabilityRule,
    updateAvailabilityRule,
    deleteAvailabilityRule,

    // Admin - Stats
    getDashboardStats,

    // Email
    sendBookingConfirmation
};