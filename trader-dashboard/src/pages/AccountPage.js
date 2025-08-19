

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiUser, FiMail, FiCreditCard, FiHash, FiAward,
  FiShield, FiPhone, FiTrendingUp, FiDollarSign, FiBriefcase
} from "react-icons/fi";
import { db, auth } from "../firebase";
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
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!account) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 max-w-md bg-white rounded-xl shadow-lg text-center"
        >
          <h2 className="text-2xl font-bold text-red-500 mb-2">No User Data Found</h2>
          <p className="text-gray-600">Please check your account information or try again later.</p>
        </motion.div>
      </div>
    );
  }

  const fieldDisplay = [
    { icon: FiUser, label: "Name", value: account.name, color: "bg-blue-100" },
    { icon: FiMail, label: "Email", value: account.email, color: "bg-purple-100" },
    { icon: FiPhone, label: "Phone", value: account.phone, color: "bg-green-100" },
    { icon: FiHash, label: "User ID", value: account.userId, color: "bg-indigo-100" },
    // { icon: FiDollarSign, label: "Investment Amount", value: account.investmentAmount || "0", color: "bg-teal-100" },
    { icon: FiDollarSign, label: "Investment Amount", value: account.investedAmount || "0", color: "bg-teal-100" },
    { icon: FiBriefcase, label: "Broker", value: account.broker || "Zerodha", color: "bg-cyan-100" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-12">
            <motion.h1 
              className="text-4xl font-bold text-gray-800 mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Your <span className="text-blue-600">Account</span> Details
            </motion.h1>
            <motion.p 
              className="text-lg text-gray-600 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              View and manage your personal and investment information
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fieldDisplay.map(({ icon: Icon, label, value, color }, index) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ 
                  y: -5,
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)"
                }}
                className={`${color} p-6 rounded-2xl shadow-md transition-all duration-300`}
              >
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-white rounded-full shadow-sm">
                    <Icon className="text-blue-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{label}</h3>
                    <motion.p 
                      className="text-xl font-semibold text-gray-800 mt-1"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 + (index * 0.05) }}
                    >
                      {value || "N/A"}
                    </motion.p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* ✅ Indian Market Style Account Summary */}
          <motion.div 
            className="mt-12 bg-white rounded-2xl shadow-lg overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Account Summary</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-600 font-medium">Portfolio Value</p>
                  <p className="text-2xl font-bold text-gray-800 mt-2">
                    ₹{account.investmentAmount ? Number(account.investmentAmount).toLocaleString("en-IN") : "0"}
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-green-600 font-medium">Risk Appetite</p>
                  <p className="text-2xl font-bold text-gray-800 mt-2 capitalize">
                    {account.riskLevel || "Moderate"}
                  </p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-purple-600 font-medium">Market Participation Level</p>
                  <p className="text-2xl font-bold text-gray-800 mt-2 capitalize">
                    {account.experience || "Intermediate"}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}





