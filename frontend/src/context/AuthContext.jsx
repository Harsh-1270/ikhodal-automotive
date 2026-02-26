/* ============================================
   AUTH CONTEXT - AUTHENTICATION STATE MANAGEMENT
   Manages user/admin login state across the app
   ============================================ */

import React, { createContext, useState, useEffect, useContext } from 'react';
import { logoutUser } from '../services/api';

// Create Auth Context
export const AuthContext = createContext();

// Auth Provider Component
export const AuthProvider = ({ children }) => {
    // State: stores current user data (null if not logged in)
    const [user, setUser] = useState(null);

    // State: tracks if user is admin
    const [isAdmin, setIsAdmin] = useState(false);

    // State: loading state during authentication checks
    const [loading, setLoading] = useState(true);

    /* ==========================================
       CHECK IF USER IS ALREADY LOGGED IN
       Runs once when app loads
       ========================================== */
    useEffect(() => {
        checkAuthStatus();
    }, []);

    // Check if user data exists in localStorage
    const checkAuthStatus = () => {
        try {
            // Get user data from localStorage
            const storedUser = localStorage.getItem('user');
            const storedToken = localStorage.getItem('token');
            const storedIsAdmin = localStorage.getItem('isAdmin');

            // If user data exists, restore login state
            if (storedUser && storedToken) {
                setUser(JSON.parse(storedUser));
                setIsAdmin(storedIsAdmin === 'true');
            }
        } catch (error) {
            console.error('Error checking auth status:', error);
        } finally {
            setLoading(false);
        }
    };

    /* ==========================================
       USER LOGIN FUNCTION
       ========================================== */
    const login = (userData, token, adminStatus = false) => {
        try {
            // Save to state
            setUser(userData);
            setIsAdmin(adminStatus);

            // Save to localStorage for persistence
            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('token', token);
            localStorage.setItem('isAdmin', adminStatus.toString());

            return true;
        } catch (error) {
            console.error('Error during login:', error);
            return false;
        }
    };

    /* ==========================================
       USER LOGOUT FUNCTION
       ========================================== */
    const logout = async () => {
        try {
            // Call backend to set isOnline = false (fire-and-forget)
            await logoutUser().catch(() => { });

            // Clear state
            setUser(null);
            setIsAdmin(false);

            // Clear localStorage
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            localStorage.removeItem('isAdmin');

            return true;
        } catch (error) {
            console.error('Error during logout:', error);
            return false;
        }
    };

    /* ==========================================
       GET AUTH TOKEN (for API calls)
       ========================================== */
    const getToken = () => {
        return localStorage.getItem('token');
    };

    /* ==========================================
       CHECK IF USER IS AUTHENTICATED
       ========================================== */
    const isAuthenticated = () => {
        return user !== null && getToken() !== null;
    };

    /* ==========================================
       UPDATE USER DATA (after profile update)
       ========================================== */
    const updateUser = (updatedData) => {
        try {
            const updatedUser = { ...user, ...updatedData };
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
            return true;
        } catch (error) {
            console.error('Error updating user:', error);
            return false;
        }
    };

    /* ==========================================
       CONTEXT VALUE - Available to all components
       ========================================== */
    const value = {
        user,              // Current user data
        isAdmin,           // Is user an admin?
        loading,           // Is auth check in progress?
        login,             // Login function
        logout,            // Logout function
        getToken,          // Get auth token
        isAuthenticated,   // Check if logged in
        updateUser         // Update user data
    };

    /* ==========================================
       RENDER PROVIDER
       ========================================== */
    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

/* ==========================================
   CUSTOM HOOK - useAuth()
   Usage: const { user, login, logout } = useAuth();
   ========================================== */
export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }

    return context;
};
