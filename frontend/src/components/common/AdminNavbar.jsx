import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./AdminNavbar.css";

const AdminNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLogoutDropdown, setShowLogoutDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Get display name and email from AuthContext user
  const displayName = user?.name || user?.email?.split("@")[0] || "Admin";
  const displayEmail = user?.email || "admin@ikhodalautomotive.com";
  const userInitial = displayName.charAt(0).toUpperCase();

  /* ==========================================
       SVG ICONS COMPONENT - MATCHING USER NAVBAR
       ========================================== */
  const Icons = {
    Car: ({ className = "" }) => (
      <svg
        className={className}
        width="1em"
        height="1em"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
        <circle cx="7" cy="17" r="2" />
        <path d="M9 17h6" />
        <circle cx="17" cy="17" r="2" />
      </svg>
    ),
    Home: ({ className = "" }) => (
      <svg
        className={className}
        width="1em"
        height="1em"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
        <polyline points="9 22 9 12 15 12 15 22"></polyline>
      </svg>
    ),
    Users: ({ className = "" }) => (
      <svg
        className={className}
        width="1em"
        height="1em"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
      </svg>
    ),
    Calendar: ({ className = "" }) => (
      <svg
        className={className}
        width="1em"
        height="1em"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="16" y1="2" x2="16" y2="6"></line>
        <line x1="8" y1="2" x2="8" y2="6"></line>
        <line x1="3" y1="10" x2="21" y2="10"></line>
      </svg>
    ),
    Logout: ({ className = "" }) => (
      <svg
        className={className}
        width="1em"
        height="1em"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#dc2626"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
        <polyline points="16 17 21 12 16 7"></polyline>
        <line x1="21" y1="12" x2="9" y2="12"></line>
      </svg>
    ),
    Menu: ({ className = "" }) => (
      <svg
        className={className}
        width="1em"
        height="1em"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="3" y1="12" x2="21" y2="12"></line>
        <line x1="3" y1="6" x2="21" y2="6"></line>
        <line x1="3" y1="18" x2="21" y2="18"></line>
      </svg>
    ),
    Close: ({ className = "" }) => (
      <svg
        className={className}
        width="1em"
        height="1em"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    ),
    ChevronDown: ({ className = "" }) => (
      <svg
        className={className}
        width="1em"
        height="1em"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#64748b"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="6 9 12 15 18 9"></polyline>
      </svg>
    ),
    ChevronUp: ({ className = "" }) => (
      <svg
        className={className}
        width="1em"
        height="1em"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#64748b"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="18 15 12 9 6 15"></polyline>
      </svg>
    ),
  };

  const isActive = (path) => location.pathname === path;

  const handleNavigation = (path) => {
    if (!isActive(path)) {
      navigate(path);
    }
    setMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleLogoutDropdown = () => {
    setShowLogoutDropdown(!showLogoutDropdown);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
    setShowLogoutDropdown(false);
    setMobileMenuOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowLogoutDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="admin-navbar">
      <div className="admin-navbar-content">
        <div className="admin-navbar-left">
          <div
            className="admin-logo"
            onClick={() => handleNavigation("/admin/dashboard")}
          >
            <div className="admin-logo-wrapper">
              <span className="admin-logo-text">I Khodal Automotive</span>
              <span className="admin-badge">Admin Panel</span>
            </div>
          </div>
        </div>

        <div className="admin-navbar-right">
          {/* Desktop Nav Items */}
          <button
            className={`admin-nav-btn ${isActive("/admin/dashboard") ? "active" : ""}`}
            onClick={() => handleNavigation("/admin/dashboard")}
          >
            <span className="admin-icon">
              <Icons.Home />
            </span>
            <span className="admin-nav-label">Home</span>
          </button>

          <button
            className={`admin-nav-btn ${isActive("/admin/users") ? "active" : ""}`}
            onClick={() => handleNavigation("/admin/users")}
          >
            <span className="admin-icon">
              <Icons.Users />
            </span>
            <span className="admin-nav-label">Users</span>
          </button>

          <button
            className={`admin-nav-btn ${isActive("/admin/schedule") ? "active" : ""}`}
            onClick={() => handleNavigation("/admin/schedule")}
          >
            <span className="admin-icon">
              <Icons.Calendar />
            </span>
            <span className="admin-nav-label">Schedule</span>
          </button>

          {/* User Profile with Logout Dropdown */}
          <div className="admin-profile-wrapper" ref={dropdownRef}>
            <div className="admin-profile" onClick={toggleLogoutDropdown}>
              <div className="admin-avatar">{userInitial}</div>
              <div className="admin-info">
                <div className="admin-name">{displayName}</div>
                <div className="admin-email">{displayEmail}</div>
              </div>
              <span className="admin-dropdown-arrow">
                {showLogoutDropdown ? (
                  <Icons.ChevronUp />
                ) : (
                  <Icons.ChevronDown />
                )}
              </span>
            </div>

            {/* Logout Dropdown */}
            {showLogoutDropdown && (
              <div className="admin-logout-dropdown">
                <button
                  className="admin-logout-dropdown-btn"
                  onClick={handleLogout}
                >
                  <span>
                    <Icons.Logout />
                  </span>
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button onClick={toggleMobileMenu} className="admin-mobile-menu-btn">
            {mobileMenuOpen ? <Icons.Close /> : <Icons.Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="admin-mobile-menu active">
          {/* User Profile Section */}
          <div className="admin-mobile-user-section">
            <div className="admin-mobile-user-profile">
              <div className="admin-mobile-user-avatar">
                <span>{userInitial}</span>
              </div>
              <div className="admin-mobile-user-details">
                <div className="admin-mobile-user-name">{displayName}</div>
                <div className="admin-mobile-user-email">{displayEmail}</div>
              </div>
            </div>
            <div className="admin-mobile-admin-badge">Administrator</div>
          </div>

          {/* Navigation Links */}
          <button
            onClick={() => handleNavigation("/admin/dashboard")}
            className={`admin-mobile-menu-link ${isActive("/admin/dashboard") ? "active" : ""}`}
          >
            <div className="admin-mobile-menu-link-content">
              <span className="admin-mobile-menu-icon">
                <Icons.Home />
              </span>
              <span>Dashboard</span>
            </div>
          </button>

          <button
            onClick={() => handleNavigation("/admin/users")}
            className={`admin-mobile-menu-link ${isActive("/admin/users") ? "active" : ""}`}
          >
            <div className="admin-mobile-menu-link-content">
              <span className="admin-mobile-menu-icon">
                <Icons.Users />
              </span>
              <span>Users</span>
            </div>
          </button>

          <button
            onClick={() => handleNavigation("/admin/schedule")}
            className={`admin-mobile-menu-link ${isActive("/admin/schedule") ? "active" : ""}`}
          >
            <div className="admin-mobile-menu-link-content">
              <span className="admin-mobile-menu-icon">
                <Icons.Calendar />
              </span>
              <span>Schedule Management</span>
            </div>
          </button>

          {/* Mobile Logout Button */}
          <div
            className="admin-mobile-user-section"
            style={{
              borderTop: "2px solid rgba(30, 58, 138, 0.1)",
              borderBottom: "none",
              marginTop: "0.5rem",
            }}
          >
            <button className="admin-mobile-logout-btn" onClick={handleLogout}>
              <span>
                <Icons.Logout />
              </span>
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default AdminNavbar;
