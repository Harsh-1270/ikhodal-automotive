/* ============================================
   APP.JS - CORRECTED ROUTING
   Landing page is public, services after login
   ============================================ */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import ForgotPassword from './pages/auth/ForgotPassword';
import BookingDetails from './pages/user/BookingDetails';
import './App.css';

// Import Pages - Auth
import Register from './pages/auth/Register';
import Login from './pages/auth/Login';
import AdminLogin from './pages/auth/AdminLogin';

// Import Pages - User
import Home from './pages/user/Home';
import MyBookings from './pages/user/MyBookings';
import Payment from './pages/user/Payment';
import Dashboard from './pages/user/Dashboard';
import Cart from './pages/user/Cart';
import ScheduleSelection from './pages/user/ScheduleSelection';

// Import Pages - Admin
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';

/* ==========================================
   PROTECTED ROUTE - For authenticated users only
   ========================================== */
const ProtectedRoute = ({ children }) => {
  const { user, isAdmin } = React.useContext(AuthContext);

  // If not logged in, redirect to login
  if (!user && !isDev) {
    return <Navigate to="/login" replace />;
  }

  // If admin trying to access user routes, redirect to admin dashboard
  if (isAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
};

const isDev = process.env.NODE_ENV === "development";

/* ==========================================
   ADMIN ROUTE - For admin only
   ========================================== */
const AdminRoute = ({ children }) => {
  const { user, isAdmin } = React.useContext(AuthContext);

  // If not logged in, redirect to admin login
  if (!user || !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

/* ==========================================
   PUBLIC ROUTE - Redirect if already logged in
   ========================================== */
const PublicRoute = ({ children }) => {
  const { user, isAdmin } = React.useContext(AuthContext);

  // If already logged in as user, redirect to my-bookings
  if (user && !isAdmin) {
    return <Navigate to="/my-bookings" replace />;
  }

  // If already logged in as admin, redirect to admin dashboard
  if (user && isAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
};

/* ==========================================
   MAIN APP COMPONENT
   ========================================== */
function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <main className="main-content">
            <Routes>
              {/* ========== PUBLIC LANDING PAGE ========== */}
              <Route path="/" element={<Home />} />

              {/* ========== AUTH ROUTES ========== */}

              {/* User Auth */}
              <Route
                path="/register"
                element={
                  <PublicRoute>
                    <Register />
                  </PublicRoute>
                }
              />

              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                }
              />

              <Route
                path="/forgot-password"
                element={
                  <PublicRoute>
                    <ForgotPassword />
                  </PublicRoute>
                }
              />

              {/* Admin Auth */}
              <Route
                path="/admin/login"
                element={
                  <PublicRoute>
                    <AdminLogin />
                  </PublicRoute>
                }
              />

              {/* ========== USER ROUTES (PROTECTED) ========== */}

              <Route
                path="/my-bookings"
                element={
                  <ProtectedRoute>
                    <MyBookings />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/booking-details/:bookingId"
                element={
                  <ProtectedRoute>
                    <BookingDetails />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/cart"
                element={
                  <ProtectedRoute>
                    <Cart />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/payment"
                element={
                  <ProtectedRoute>
                    <Payment />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/schedule"
                element={
                  <ProtectedRoute>
                    <ScheduleSelection />
                  </ProtectedRoute>
                }
              />

              {/* ========== ADMIN ROUTES ========== */}

              <Route
                path="/admin/dashboard"
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                }
              />

              <Route
                path="/admin/users"
                element={
                  <AdminRoute>
                    <AdminUsers />
                  </AdminRoute>
                }
              />

              {/* ========== FALLBACK ROUTE ========== */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
