
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiHome, FiUser, FiDollarSign, FiTrendingUp, FiGrid, FiLogOut, FiMenu, FiX } from "react-icons/fi";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);

      if (!mobile && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileMenuOpen]);

  const navItems = [
    { id: "/", label: "Home", icon: <FiHome /> },
    { id: "/dashboard", label: "Dashboard", icon: <FiGrid /> },
    { id: "/account", label: "Account", icon: <FiUser /> },
    { id: "/wallet", label: "Wallet", icon: <FiDollarSign /> },
    { id: "/trades", label: "Live Trades", icon: <FiTrendingUp /> },
  ];

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleNavClick = (path) => {
    navigate(path);
    if (isMobile) {
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <>
      <motion.div
        className="navbar-container"
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        <div className="navbar-glass">
          {/* Logo */}
          <motion.div
            className="logo-container"
            onClick={() => navigate('/')}
            whileHover={{ scale: 1.05 }}
          >
            <img src="/Logo2.jpg" alt="Vunathi Capital Logo" className="logo-image" />
            {/* {!isMobile && <span className="logo-text">Vunathi Capital</span>} */}
          </motion.div>

          {/* Mobile menu button */}
          {isMobile && (
            <motion.div
              className="mobile-menu-button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              whileTap={{ scale: 0.95 }}
            >
              {isMobileMenuOpen ? <FiX /> : <FiMenu />}
            </motion.div>
          )}

          {/* Desktop navigation items */}
          {!isMobile && (
            <div className="desktop-nav-items">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  className={`nav-item ${location.pathname === item.id ? "active" : ""}`}
                  onClick={() => navigate(item.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label">{item.label}</span>
                  {location.pathname === item.id && (
                    <motion.div
                      className="nav-indicator"
                      layoutId="nav-indicator"
                      transition={{ type: "spring", bounce: 0.2 }}
                    />
                  )}
                </motion.div>
              ))}
              <motion.div
                className="nav-item logout-button"
                onClick={handleLogout}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * navItems.length }}
              >
                <span className="nav-icon"><FiLogOut /></span>
                <span className="nav-label">Logout</span>
              </motion.div>
            </div>
          )}
        </div>

        {/* Mobile menu overlay */}
        <AnimatePresence>
          {isMobile && isMobileMenuOpen && (
            <>
              <motion.div
                className="mobile-menu-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileMenuOpen(false)}
              />
              <motion.div
                className="mobile-menu"
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 150 }}
              >
                <div className="mobile-menu-content">
                  {/* Mobile Menu Header with Logo */}
                  <div className="mobile-menu-header">
                    <img src="/Logo2.jpg" alt="Vunathi Capital Logo" className="logo-image" />
                    <span className="logo-text">Vunathi Capital</span>
                  </div>

                  {navItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      className={`mobile-nav-item ${location.pathname === item.id ? "active" : ""}`}
                      onClick={() => handleNavClick(item.id)}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                    >
                      <span className="mobile-nav-icon">{item.icon}</span>
                      <span className="mobile-nav-label">{item.label}</span>
                      {location.pathname === item.id && (
                        <motion.div
                          className="mobile-nav-indicator"
                          layoutId="mobile-nav-indicator"
                          transition={{ type: "spring", bounce: 0.2 }}
                        />
                      )}
                    </motion.div>
                  ))}
                  <motion.div
                    className="mobile-nav-item logout-button"
                    onClick={handleLogout}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * navItems.length }}
                  >
                    <span className="mobile-nav-icon"><FiLogOut /></span>
                    <span className="mobile-nav-label">Logout</span>
                  </motion.div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <style jsx>{`
          .navbar-container {
            display: flex;
            justify-content: center;
            width: 100%;
            position: fixed;
            top: 1rem; /* Added some spacing from top */
            z-index: 1000;
            padding: 0 1rem; /* Added horizontal padding */
          }
          .navbar-glass {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: linear-gradient(135deg, rgba(31, 41, 55, 0.7), rgba(17, 24, 39, 0.7));
            backdrop-filter: blur(16px) saturate(180%);
            padding: 0.75rem 1.5rem;
            border-radius: 16px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
            border: 1.5px solid rgba(255, 255, 255, 0.15);
            width: 100%;
            max-width: 1200px;
          }

          .logo-container {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            cursor: pointer;
            flex-shrink: 0;
          }

          .logo-image {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            border: 1px solid rgba(255, 255, 255, 0.2);
          }

          .logo-text {
            font-weight: 600;
            color: #e5e7eb;
            font-size: 1.1rem;
          }

          .desktop-nav-items {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
          }

          .nav-item {
            position: relative;
            display: flex;
            align-items: center;
            margin: 0 0.5rem;
            padding: 0.5rem 1rem;
            color: #d1d5db;
            cursor: pointer;
            border-radius: 8px;
            transition: all 0.3s ease;
            user-select: none;
            white-space: nowrap;
          }
          .nav-item:hover {
            background: rgba(255, 255, 255, 0.1);
            color: #ffffff;
          }
          .nav-item.active {
            color: #ffffff;
          }
          .nav-icon {
            margin-right: 0.5rem;
            font-size: 1.1rem;
          }
          .nav-label {
            font-weight: 500;
            font-size: 0.9rem;
          }
          .nav-indicator {
            position: absolute;
            bottom: -6px;
            left: 20%;
            right: 20%;
            height: 2px;
            background: #3b82f6;
            border-radius: 3px;
          }
          .logout-button {
            margin-left: auto;
            color: #fca5a5;
          }
          .logout-button:hover {
            color: #ef4444;
            background: rgba(239, 68, 68, 0.1);
          }

          /* Mobile menu button */
          .mobile-menu-button {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0.5rem;
            color: #e5e7eb;
            cursor: pointer;
            font-size: 1.5rem;
            border-radius: 6px;
            transition: background 0.3s ease;
          }
          .mobile-menu-button:hover {
            background: rgba(255, 255, 255, 0.1);
          }

          /* Mobile menu overlay */
          .mobile-menu-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.6);
            z-index: 1001; /* Higher than navbar */
          }

          /* Mobile menu */
          .mobile-menu {
            position: fixed;
            top: 0;
            left: 0;
            bottom: 0;
            width: 75%;
            max-width: 300px;
            background: #1f2937;
            z-index: 1002;
            padding: 1rem;
            box-shadow: 4px 0 20px rgba(0, 0, 0, 0.3);
            border-right: 1px solid rgba(255, 255, 255, 0.1);
          }
          .mobile-menu-header {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding: 1rem 0.5rem;
            margin-bottom: 1rem;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          }
          .mobile-menu-content {
            display: flex;
            flex-direction: column;
            padding-top: 1rem;
          }
          .mobile-nav-item {
            position: relative;
            display: flex;
            align-items: center;
            padding: 1rem 0.75rem;
            color: #d1d5db;
            cursor: pointer;
            border-radius: 8px;
            transition: all 0.3s ease;
            margin-bottom: 0.5rem;
          }
          .mobile-nav-item:hover {
            background: rgba(255, 255, 255, 0.05);
          }
          .mobile-nav-item.active {
            color: #ffffff;
            background: rgba(59, 130, 246, 0.2);
          }
          .mobile-nav-icon {
            margin-right: 1rem;
            font-size: 1.25rem;
          }
          .mobile-nav-label {
            font-weight: 500;
            font-size: 1rem;
          }
          .mobile-nav-indicator {
            position: absolute;
            left: -1rem; /* Adjust to be outside the padding */
            top: 15%;
            bottom: 15%;
            width: 4px;
            background: #3b82f6;
            border-radius: 0 4px 4px 0;
          }
          .mobile-nav-item.logout-button {
            margin-top: auto;
            color: #fca5a5;
          }

          /* Responsive styles */
          @media (max-width: 768px) {
            .desktop-nav-items {
              display: none;
            }
          }

          @media (min-width: 768px) {
            .mobile-menu-button {
              display: none;
            }
          }
        `}</style>
      </motion.div>

      <div style={{ height: isMobile ? '60px' : '80px' }} />
    </>
  );
}