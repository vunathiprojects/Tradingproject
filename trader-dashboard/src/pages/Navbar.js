// import React from "react";
// import { motion } from "framer-motion";
// import { FiHome, FiUser, FiDollarSign, FiTrendingUp, FiGrid, FiLogOut } from "react-icons/fi";
// import { auth } from "../firebase";
// import { signOut } from "firebase/auth";
// import { useNavigate, useLocation } from "react-router-dom";

// export default function Navbar() {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const navItems = [
//     { id: "/", label: "Home", icon: <FiHome /> },
//     { id: "/dashboard", label: "Dashboard", icon: <FiGrid /> },
//     { id: "/account", label: "Account", icon: <FiUser /> },
//     { id: "/wallet", label: "Wallet", icon: <FiDollarSign /> },
//     { id: "/trades", label: "Live Trades", icon: <FiTrendingUp /> },
//   ];

//   const handleLogout = async () => {
//     try {
//       await signOut(auth);
//       navigate("/login");
//     } catch (error) {
//       console.error("Logout error:", error);
//     }
//   };

//   return (
//     <motion.div
//       className="navbar-container"
//       initial={{ y: -60, opacity: 0 }}
//       animate={{ y: 0, opacity: 1 }}
//       transition={{ type: "spring", stiffness: 100 }}
//     >
//       <div className="navbar-glass">
//         {navItems.map((item) => (
//           <motion.div
//             key={item.id}
//             className={`nav-item ${location.pathname === item.id ? "active" : ""}`}
//             onClick={() => navigate(item.id)}
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             initial={{ opacity: 0, x: -20 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ delay: 0.1 * navItems.indexOf(item) }}
//           >
//             <span className="nav-icon">{item.icon}</span>
//             <motion.span
//               className="nav-label"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ delay: 0.2 }}
//             >
//               {item.label}
//             </motion.span>
//             {location.pathname === item.id && (
//               <motion.div
//                 className="nav-indicator"
//                 layoutId="nav-indicator"
//                 transition={{ type: "spring", bounce: 0.2 }}
//               />
//             )}
//           </motion.div>
//         ))}
//         <motion.div
//           className="nav-item logout-button"
//           onClick={handleLogout}
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.95 }}
//           initial={{ opacity: 0, x: 20 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ delay: 0.1 * navItems.length }}
//         >
//           <span className="nav-icon">
//             <FiLogOut />
//           </span>
//           <motion.span
//             className="nav-label"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 0.2 }}
//           >
//             Logout
//           </motion.span>
//         </motion.div>
//       </div>

//       <style jsx>{`
//         .navbar-container {
//           display: flex;
//           justify-content: center;
//           margin-bottom: 2rem;
//           width: 100%;
//           position: fixed;
//           top: 0;
//           z-index: 1000;
//         }
//         .navbar-glass {
//           display: flex;
//           background: rgba(31, 41, 55, 0.8);
//           backdrop-filter: blur(10px);
//           padding: 0.75rem 1.5rem;
//           border-radius: 0 0 12px 12px;
//           box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
//           border: 1px solid rgba(255, 255, 255, 0.1);
//           border-top: none;
//           align-items: center;
//         }
//         .nav-item {
//           position: relative;
//           display: flex;
//           align-items: center;
//           margin: 0 1rem;
//           padding: 0.75rem 1.25rem;
//           color: #e5e7eb;
//           cursor: pointer;
//           border-radius: 8px;
//           transition: all 0.3s ease;
//           user-select: none;
//         }
//         .nav-item:hover {
//           background: rgba(255, 255, 255, 0.1);
//         }
//         .nav-item.active {
//           color: #ffffff;
//           font-weight: 600;
//         }
//         .nav-icon {
//           margin-right: 0.5rem;
//           font-size: 1.1rem;
//         }
//         .nav-label {
//           font-weight: 500;
//           font-size: 0.95rem;
//         }
//         .nav-indicator {
//           position: absolute;
//           bottom: -6px;
//           left: 0;
//           right: 0;
//           height: 3px;
//           background: #3b82f6;
//           border-radius: 3px;
//         }
//         .logout-button {
//           margin-left: auto;
//           color: #f87171;
//         }
//         .logout-button:hover {
//           color: #ef4444;
//           background: rgba(239, 68, 68, 0.1);
//         }
//       `}</style>
//     </motion.div>
//   );
// }


                                    //resposiveness

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
      
      // Close mobile menu when switching to desktop view
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
            <>
              {navItems.map((item) => (
                <motion.div
                  key={item.id}
                  className={`nav-item ${location.pathname === item.id ? "active" : ""}`}
                  onClick={() => navigate(item.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * navItems.indexOf(item) }}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <motion.span
                    className="nav-label"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    {item.label}
                  </motion.span>
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
                <span className="nav-icon">
                  <FiLogOut />
                </span>
                <motion.span
                  className="nav-label"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  Logout
                </motion.span>
              </motion.div>
            </>
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
                transition={{ type: "spring", damping: 25 }}
              >
                <div className="mobile-menu-content">
                  {navItems.map((item) => (
                    <motion.div
                      key={item.id}
                      className={`mobile-nav-item ${location.pathname === item.id ? "active" : ""}`}
                      onClick={() => handleNavClick(item.id)}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * navItems.indexOf(item) * 0.1 }}
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
                    transition={{ delay: 0.1 * navItems.length * 0.1 }}
                  >
                    <span className="mobile-nav-icon">
                      <FiLogOut />
                    </span>
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
            margin-bottom: 2rem;
            width: 100%;
            position: fixed;
            top: 0;
            z-index: 1000;
          }
          .navbar-glass {
            display: flex;
            background: rgba(31, 41, 55, 0.8);
            backdrop-filter: blur(10px);
            padding: 0.75rem 1.5rem;
            border-radius: 0 0 12px 12px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-top: none;
            align-items: center;
            width: 100%;
            max-width: 1200px;
          }
          .nav-item {
            position: relative;
            display: flex;
            align-items: center;
            margin: 0 1rem;
            padding: 0.75rem 1.25rem;
            color: #e5e7eb;
            cursor: pointer;
            border-radius: 8px;
            transition: all 0.3s ease;
            user-select: none;
          }
          .nav-item:hover {
            background: rgba(255, 255, 255, 0.1);
          }
          .nav-item.active {
            color: #ffffff;
            font-weight: 600;
          }
          .nav-icon {
            margin-right: 0.5rem;
            font-size: 1.1rem;
          }
          .nav-label {
            font-weight: 500;
            font-size: 0.95rem;
          }
          .nav-indicator {
            position: absolute;
            bottom: -6px;
            left: 0;
            right: 0;
            height: 3px;
            background: #3b82f6;
            border-radius: 3px;
          }
          .logout-button {
            margin-left: auto;
            color: #f87171;
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
            background: rgba(0, 0, 0, 0.5);
            z-index: 999;
          }
          
          /* Mobile menu */
          .mobile-menu {
            position: fixed;
            top: 0;
            left: 0;
            bottom: 0;
            width: 75%;
            max-width: 300px;
            background: rgba(31, 41, 55, 0.95);
            backdrop-filter: blur(10px);
            z-index: 1000;
            padding: 1rem;
            box-shadow: 4px 0 15px rgba(0, 0, 0, 0.2);
            border-right: 1px solid rgba(255, 255, 255, 0.1);
          }
          .mobile-menu-content {
            display: flex;
            flex-direction: column;
            padding-top: 3rem;
          }
          .mobile-nav-item {
            position: relative;
            display: flex;
            align-items: center;
            padding: 1rem 1.25rem;
            color: #e5e7eb;
            cursor: pointer;
            border-radius: 8px;
            transition: all 0.3s ease;
            margin-bottom: 0.5rem;
          }
          .mobile-nav-item:hover {
            background: rgba(255, 255, 255, 0.1);
          }
          .mobile-nav-item.active {
            color: #ffffff;
            font-weight: 600;
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
            left: 0;
            top: 0;
            bottom: 0;
            width: 4px;
            background: #3b82f6;
            border-radius: 0 3px 3px 0;
          }
          
          /* Responsive styles */
          @media (max-width: 768px) {
            .navbar-glass {
              padding: 0.75rem 1rem;
              justify-content: space-between;
            }
            .nav-item:not(.logout-button) {
              display: none;
            }
            .logout-button {
              margin-left: 0;
            }
          }
          
          @media (max-width: 480px) {
            .navbar-glass {
              padding: 0.5rem;
            }
          }
        `}</style>
      </motion.div>
      
      {/* Add padding to prevent content from being hidden behind navbar */}
      <style jsx global>{`
        body {
          padding-top: ${isMobile ? '60px' : '80px'};
        }
      `}</style>
    </>
  );
}