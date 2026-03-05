/* ============================================
   AUTH CONTEXT - AUTHENTICATION STATE MANAGEMENT
   Manages user/admin login state across the app
   ============================================ */

import React, { createContext, useState, useEffect, useContext } from "react";
import { logoutUser } from "../services/api";

// Create Auth Context
export const AuthContext = createContext();

/* ==========================================
   JWT DECODE UTILITY
   Decodes JWT payload without a library.
   Returns null if the token is invalid.
   ========================================== */
const decodeJwt = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};

/* ==========================================
   TOKEN VALIDITY CHECK
   Returns true only if the token exists AND
   has not expired (with a 10-second buffer).
   ========================================== */
const isTokenValid = (token) => {
  if (!token) return false;
  const payload = decodeJwt(token);
  if (!payload || !payload.exp) return false;
  // exp is in seconds, Date.now() is in milliseconds
  return payload.exp * 1000 > Date.now() + 10_000;
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  // State: stores current user data (null if not logged in)
  const [user, setUser] = useState(null);

  // State: tracks if user is admin
  const [isAdmin, setIsAdmin] = useState(false);

  // State: loading state during authentication checks
  const [loading, setLoading] = useState(true);

  const clearStorage = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("refreshToken");
  };

  // Check if user data exists in localStorage and the token is still valid
  const checkAuthStatus = () => {
    try {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");
      const storedIsAdmin = localStorage.getItem("isAdmin");
      const storedRefreshToken = localStorage.getItem("refreshToken");

      if (storedUser && storedToken) {
        if (isTokenValid(storedToken)) {
          // Access token is still fresh — restore session immediately
          setUser(JSON.parse(storedUser));
          setIsAdmin(storedIsAdmin === "true");
        } else if (storedRefreshToken) {
          // Access token expired but refresh token exists —
          // keep stored user so the redirect to dashboard still happens;
          // the axios interceptor will silently renew on the first API call.
          setUser(JSON.parse(storedUser));
          setIsAdmin(storedIsAdmin === "true");
        } else {
          // Both tokens are gone or expired → clear everything
          clearStorage();
        }
      }
    } catch (error) {
      console.error("Error checking auth status:", error);
      clearStorage();
    } finally {
      setLoading(false);
    }
  };

  /* ==========================================
       CHECK IF USER IS ALREADY LOGGED IN
       Runs once when app loads
       ========================================== */
  useEffect(() => {
    checkAuthStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ==========================================
       USER LOGIN FUNCTION
       ========================================== */
  const login = (userData, token, adminStatus = false, refreshToken = null) => {
    try {
      // Save to state
      setUser(userData);
      setIsAdmin(adminStatus);

      // Save to localStorage for persistence
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", token);
      localStorage.setItem("isAdmin", adminStatus.toString());

      if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
      }

      return true;
    } catch (error) {
      console.error("Error during login:", error);
      return false;
    }
  };

  /* ==========================================
       USER LOGOUT FUNCTION
       ========================================== */
  const logout = async () => {
    try {
      // Call backend to set isOnline = false (fire-and-forget)
      await logoutUser().catch(() => {});

      // Clear state
      setUser(null);
      setIsAdmin(false);

      // Clear all stored auth data including refresh token
      clearStorage();

      return true;
    } catch (error) {
      console.error("Error during logout:", error);
      return false;
    }
  };

  /* ==========================================
       GET AUTH TOKEN (for API calls)
       ========================================== */
  const getToken = () => {
    return localStorage.getItem("token");
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
      localStorage.setItem("user", JSON.stringify(updatedUser));
      return true;
    } catch (error) {
      console.error("Error updating user:", error);
      return false;
    }
  };

  /* ==========================================
       CONTEXT VALUE - Available to all components
       ========================================== */
  const value = {
    user, // Current user data
    isAdmin, // Is user an admin?
    loading, // Is auth check in progress?
    login, // Login function
    logout, // Logout function
    getToken, // Get auth token
    isAuthenticated, // Check if logged in
    updateUser, // Update user data
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
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};
