





import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiUser, FiMail, FiCreditCard, FiHash, FiAward,
  FiShield, FiPhone, FiTrendingUp, FiDollarSign, FiBriefcase,
  FiPieChart, FiBarChart2, FiTarget, FiActivity, FiStar,
  FiArrowUpRight, FiArrowDownRight, FiEye, FiSettings
} from "react-icons/fi";
import { db, auth } from "../firebase"; // Ensure you have firebase config
import { ref, onValue } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";

export default function AccountPage() {
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userId = user.uid;
        const userRef = ref(db, `users/${userId}`);

        onValue(userRef, (snapshot) => {
          if (snapshot.exists()) {
            setAccount(snapshot.val());
          } else {
            setAccount(null);
          }
          setLoading(false);
        });
      } else {
        setAccount(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
        <motion.div className="flex flex-col items-center space-y-8">
          <motion.div className="relative">
            <motion.div
              animate={{
                rotate: 360,
                scale: [1, 1.1, 1],
              }}
              transition={{
                rotate: { repeat: Infinity, duration: 1, ease: "linear" },
                scale: { repeat: Infinity, duration: 2, ease: "easeInOut" }
              }}
              className="w-20 h-20 border-4 border-blue-400 border-t-transparent rounded-full"
            />
            <motion.div
              animate={{
                rotate: -360,
                scale: [1.2, 1, 1.2],
              }}
              transition={{
                rotate: { repeat: Infinity, duration: 1.5, ease: "linear" },
                scale: { repeat: Infinity, duration: 2, ease: "easeInOut" }
              }}
              className="absolute inset-2 w-16 h-16 border-2 border-orange-400 border-b-transparent rounded-full"
            />
          </motion.div>
          <motion.div
            animate={{
              opacity: [0.4, 1, 0.4],
              y: [0, -5, 0]
            }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-center"
          >
            <p className="text-gray-800 text-xl font-bold">Loading Dashboard</p>
            <p className="text-gray-600 text-sm mt-1">Preparing your account data...</p>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  if (!account) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="p-8 sm:p-10 max-w-lg bg-gradient-to-br from-red-100 to-red-200 backdrop-blur-sm border border-red-300 rounded-2xl shadow-lg text-center relative overflow-hidden bg-white"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-red-100 to-red-200 opacity-50"></div>
          <motion.div
            animate={{
              rotate: [0, 15, -15, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="relative z-10"
          >
            <FiShield className="text-red-600 text-7xl sm:text-8xl mx-auto mb-6" />
          </motion.div>
          <div className="relative z-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-red-700 mb-4">Access Denied</h2>
            <p className="text-red-600 text-base sm:text-lg">Please verify your credentials and try again.</p>
          </div>
        </motion.div>
      </div>
    );
  }

  const fieldDisplay = [
    {
      icon: FiUser,
      label: "Name",
      value: account.name,
      color: "from-blue-50 to-blue-100",
      border: "border-blue-200",
      glow: "shadow-blue-200",
      iconBg: "from-blue-500 to-blue-600",
      textColor: "text-blue-700"
    },
    {
      icon: FiMail,
      label: "Email",
      value: account.email,
      color: "from-green-50 to-green-100",
      border: "border-green-200",
      glow: "shadow-green-200",
      iconBg: "from-green-500 to-green-600",
      textColor: "text-green-700"
    },
    {
      icon: FiPhone,
      label: "Phone",
      value: account.phone,
      color: "from-orange-50 to-orange-100",
      border: "border-orange-200",
      glow: "shadow-orange-200",
      iconBg: "from-orange-500 to-orange-600",
      textColor: "text-orange-700"
    },
    {
      icon: FiHash,
      label: "User ID",
      value: account.userId,
      color: "from-purple-50 to-purple-100",
      border: "border-purple-200",
      glow: "shadow-purple-200",
      iconBg: "from-purple-500 to-purple-600",
      textColor: "text-purple-700"
    },
    {
      icon: FiDollarSign,
      label: "Investment Amount",
      value: account.investedAmount || "0",
      color: "from-red-50 to-red-100",
      border: "border-red-200",
      glow: "shadow-red-200",
      iconBg: "from-red-500 to-red-600",
      textColor: "text-red-700"
    },
    {
      icon: FiBriefcase,
      label: "Broker",
      value: account.broker || "Zerodha",
      color: "from-indigo-50 to-indigo-100",
      border: "border-indigo-200",
      glow: "shadow-indigo-200",
      iconBg: "from-indigo-500 to-indigo-600",
      textColor: "text-indigo-700"
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-x-hidden">
      {/* Subtle background elements */}
      <div className="absolute inset-0 overflow-hidden opacity-30">
        <motion.div
          animate={{
            x: [-100, 100, -100],
            y: [-50, 50, -50],
          }}
          transition={{
            repeat: Infinity,
            duration: 20,
            ease: "linear"
          }}
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-200 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [100, -100, 100],
            y: [50, -50, 50],
          }}
          transition={{
            repeat: Infinity,
            duration: 25,
            ease: "linear"
          }}
          className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-orange-200 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [-75, 75, -75],
            y: [75, -75, 75],
          }}
          transition={{
            repeat: Infinity,
            duration: 18,
            ease: "easeInOut"
          }}
          className="absolute top-1/2 left-1/2 w-56 h-56 bg-green-200 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 py-12 px-4 sm:px-6 lg:px-8">
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-7xl mx-auto"
          >
            {/* Header Section */}
            <div className="text-center mb-12 sm:mb-16">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="flex flex-col sm:flex-row items-center justify-center mb-6"
              >
                <motion.div
                  animate={{
                    rotate: 360,
                    scale: [1, 1.05, 1]
                  }}
                  transition={{
                    rotate: { repeat: Infinity, duration: 15, ease: "linear" },
                    scale: { repeat: Infinity, duration: 3, ease: "easeInOut" }
                  }}
                  className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-3xl mb-4 sm:mb-0 sm:mr-4 shadow-lg shadow-blue-500/30"
                >
                  <FiActivity className="text-2xl text-white" />
                </motion.div>
                <div>
                  <h1 className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                    Your <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">Account</span>
                  </h1>
                  <p className="text-gray-600 text-md sm:text-lg mt-2 font-light">Comprehensive account management & insights</p>
                </div>
              </motion.div>
            </div>

            {/* Account Details Grid */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {fieldDisplay.map(({ icon: Icon, label, value, color, border, glow, iconBg, textColor }, index) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 40, rotateX: -20 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ delay: 0.15 * index, duration: 0.8, type: "spring" }}
                  whileHover={{
                    y: -10,
                    rotateX: 5,
                    scale: 1.03,
                  }}
                  className={`bg-gradient-to-br ${color} backdrop-blur-sm border ${border} p-6 sm:p-8 rounded-2xl transition-all duration-500 group hover:border-opacity-80 hover:shadow-lg hover:${glow} relative overflow-hidden bg-white`}
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className={`absolute inset-0 bg-gradient-to-r ${color} opacity-30`}></div>
                  </div>
                  <div className="flex items-start space-x-4 sm:space-x-6 relative z-10">
                    <motion.div
                      whileHover={{ rotate: 20, scale: 1.2 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className={`p-3 bg-gradient-to-r ${iconBg} backdrop-blur-sm rounded-2xl shadow-xl group-hover:shadow-2xl transition-all duration-500`}
                    >
                      <Icon className="text-white text-xl" />
                    </motion.div>
                    <div className="flex-1">
                      <h3 className="text-gray-500 text-xs sm:text-sm font-bold uppercase tracking-widest mb-2 group-hover:text-gray-600 transition-colors duration-300">{label}</h3>
                      <motion.p
                        className={`text-lg sm:text-xl font-black ${textColor} break-all group-hover:scale-105 transition-transform duration-300`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 + (index * 0.1) }}
                      >
                        {value || "N/A"}
                      </motion.p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Enhanced Account Summary */}
            <motion.div
              className="bg-white backdrop-blur-sm border border-gray-200 rounded-2xl shadow-lg overflow-hidden"
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 1, type: "spring" }}
            >
              <div className="p-6 sm:p-10">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 sm:mb-10">
                  <div className="flex items-center space-x-4 sm:space-x-6 mb-4 sm:mb-0">
                    <motion.div
                      whileHover={{ rotate: 15, scale: 1.1 }}
                      className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl shadow-lg shadow-blue-500/30"
                    >
                      <FiPieChart className="text-2xl text-white" />
                    </motion.div>
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-black text-gray-800">Account Summary</h2>
                      <p className="text-gray-600 text-sm sm:text-base">Essential information overview</p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 10 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-300 shadow-sm self-end sm:self-center"
                  >
                    <FiSettings className="text-gray-600 text-lg" />
                  </motion.button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                  <motion.div
                    className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 p-6 sm:p-8 rounded-2xl relative overflow-hidden group bg-white"
                    whileHover={{ scale: 1.05, y: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-blue-200 opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
                    <div className="flex items-center justify-between mb-4 relative z-10">
                      <p className="text-blue-700 font-bold text-base">Risk Appetite</p>
                      <FiShield className="text-blue-600 text-xl" />
                    </div>
                    <p className="text-2xl sm:text-3xl font-black text-blue-800 capitalize relative z-10">
                      {account.riskLevel || "Moderate"}
                    </p>
                    <p className="text-blue-600 text-sm mt-3 relative z-10">Investment strategy level</p>
                  </motion.div>

                  <motion.div
                    className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 p-6 sm:p-8 rounded-2xl relative overflow-hidden group bg-white"
                    whileHover={{ scale: 1.05, y: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-green-100 to-green-200 opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
                    <div className="flex items-center justify-between mb-4 relative z-10">
                      <p className="text-green-700 font-bold text-base">Experience Level</p>
                      <FiStar className="text-green-600 text-xl" />
                    </div>
                    <p className="text-2xl sm:text-3xl font-black text-green-800 capitalize relative z-10">
                      {account.experience || "Intermediate"}
                    </p>
                    <p className="text-green-600 text-sm mt-3 relative z-10">Market participation expertise</p>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}