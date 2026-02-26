/* ============================================
   API SERVICE - ALL API CALLS
   Centralized API communication layer
   ============================================ */

import axios from 'axios';

// Base API URL from environment variables
const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8082/api';

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

/* User Signup (Step 1: sends OTP to email)
   POST /auth/signup
   Body: { name, email, password }
   Response: { message: "OTP sent to email" }
*/
export const registerUser = async (userData) => {
    try {
        const response = await api.post('/auth/signup', userData);
        return {
            success: true,
            data: response.data,
            message: response.data?.message || 'OTP sent to email'
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Registration failed'
        };
    }
};

/* Verify OTP (Step 2: verify email with OTP)
   POST /auth/verify-otp
   Body: { email, otp }
   Response: { message: "Account verified" }
*/
export const verifyOtp = async (otpData) => {
    try {
        const response = await api.post('/auth/verify-otp', otpData);
        return {
            success: true,
            data: response.data,
            message: response.data?.message || 'Account verified'
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'OTP verification failed'
        };
    }
};

/* User Login
   POST /auth/login
   Body: { email, password }
   Response: { token, message }
*/
export const loginUser = async (credentials) => {
    try {
        const response = await api.post('/auth/login', credentials);
        return {
            success: true,
            data: response.data,
            message: response.data?.message || 'Login successful'
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

/* User Logout
   POST /auth/logout
   Sets user isOnline = false in database
*/
export const logoutUser = async () => {
    try {
        const response = await api.post('/auth/logout');
        return {
            success: true,
            message: response.data?.message || 'Logged out successfully'
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Logout failed'
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
   POST /createBooking
   Body: { date, startTime, endTime, serviceIds }
*/
export const createBooking = async (bookingData) => {
    try {
        const response = await api.post('/createBooking', bookingData);
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
   GET /bookings/my
*/
export const getUserBookings = async () => {
    try {
        const response = await api.get('/bookings/my');
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
   PAYMENT FUNCTIONS
   ============================================ */

/* Create Payment Intent
   POST /payments/create-intent
   Body: { appointmentId }
   Returns: { clientSecret }
*/
export const createPaymentIntent = async (appointmentId) => {
    try {
        const response = await api.post('/payments/create-intent', { appointmentId });
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

/* Get Payment History
   GET /payments/history
*/
export const getPaymentHistory = async () => {
    try {
        const response = await api.get('/payments/history');
        return {
            success: true,
            data: response.data,
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch payment history',
            data: []
        };
    }
};

/* ============================================
   AVAILABILITY APIs
   ============================================ */

/* Verify Payment Status (server-side check with Stripe API)
   POST /payments/verify/{appointmentId}
   Returns: { status }
*/
export const verifyPayment = async (appointmentId) => {
    try {
        const response = await api.post(`/payments/verify/${appointmentId}`);
        return {
            success: true,
            data: response.data,
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to verify payment'
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

/* Get Time Slots for a Specific Date (Admin Schedule)
   GET /availability/slots
   Query: ?date=YYYY-MM-DD
*/
export const getTimeSlots = async (date) => {
    try {
        const response = await api.get('/availability/slots', {
            params: { date }
        });
        return {
            success: true,
            data: response.data,
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch time slots',
            data: { slots: [] }
        };
    }
};

/* Get Schedule Overrides (Public - for user calendar)
   GET /availability/overrides?year=2026&month=2
*/
export const getPublicScheduleOverrides = async (year, month) => {
    try {
        const response = await api.get('/availability/overrides', {
            params: { year, month }
        });
        return {
            success: true,
            data: response.data,
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch schedule overrides',
            data: []
        };
    }
};

/* ============================================
   ADMIN - SCHEDULE OVERRIDE APIs
   ============================================ */

/* Get Schedule Overrides for a Month
   GET /admin/schedule/overrides?year=2026&month=2
*/
export const getScheduleOverrides = async (year, month) => {
    try {
        const response = await api.get('/admin/schedule/overrides', {
            params: { year, month }
        });
        return {
            success: true,
            data: response.data,
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch schedule overrides',
            data: []
        };
    }
};

/* Create Schedule Override
   POST /admin/schedule/override
   Body: { date, overrideType, startTime?, endTime? }
*/
export const createScheduleOverride = async (overrideData) => {
    try {
        const response = await api.post('/admin/schedule/override', overrideData);
        return {
            success: true,
            data: response.data,
            message: 'Override created successfully'
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to create schedule override'
        };
    }
};

/* Delete Schedule Override
   DELETE /admin/schedule/override
   Body: { date, overrideType, startTime?, endTime? }
*/
export const deleteScheduleOverride = async (overrideData) => {
    try {
        const response = await api.delete('/admin/schedule/override', {
            data: overrideData
        });
        return {
            success: true,
            message: 'Override removed successfully'
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to remove schedule override'
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
   CART APIs
   ============================================ */

/* Get Cart Items
   GET /cart
*/
export const getCartItems = async () => {
    try {
        const response = await api.get('/cart');
        return {
            success: true,
            data: response.data,
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch cart items',
            data: []
        };
    }
};

/* Add to Cart
   POST /cart
   Body: { serviceId, quantity }
*/
export const addToCart = async (cartData) => {
    try {
        const response = await api.post('/cart', cartData);
        return {
            success: true,
            data: response.data,
            message: 'Item added to cart'
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to add item to cart'
        };
    }
};

/* Update Cart Item Quantity
   PUT /cart/:serviceId
   Body: { quantity }
*/
export const updateCartItem = async (serviceId, cartData) => {
    try {
        const response = await api.put(`/cart/${serviceId}`, cartData);
        return {
            success: true,
            data: response.data,
            message: 'Cart item updated'
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to update cart item'
        };
    }
};

/* Remove Item from Cart
   DELETE /cart/:serviceId
*/
export const removeCartItem = async (serviceId) => {
    try {
        await api.delete(`/cart/${serviceId}`);
        return {
            success: true,
            message: 'Item removed from cart'
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to remove item from cart'
        };
    }
};

/* Clear Entire Cart
   DELETE /cart
*/
export const clearCart = async () => {
    try {
        await api.delete('/cart');
        return {
            success: true,
            message: 'Cart cleared'
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to clear cart'
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
    verifyOtp,
    loginUser,
    loginAdmin,
    logoutUser,

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
    getPaymentHistory,

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
    getTimeSlots,
    getScheduleOverrides,
    createScheduleOverride,
    deleteScheduleOverride,

    // Admin - Stats
    getDashboardStats,

    // Cart
    getCartItems,
    addToCart,
    updateCartItem,
    removeCartItem,
    clearCart,

    // Email
    sendBookingConfirmation
};
