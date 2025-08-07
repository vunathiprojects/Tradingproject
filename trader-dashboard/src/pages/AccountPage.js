// import React, { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import { FiUser, FiMail, FiCreditCard, FiHash, FiAward, FiShield, FiPhone, FiTrendingUp } from "react-icons/fi";
// import { auth, db } from "../firebase"; // Adjust path if needed
// import { onValue, ref } from "firebase/database";

// export default function AccountPage() {
//   const [account, setAccount] = useState({});
//   const [wallet, setWallet] = useState({});

//   useEffect(() => {
//     const user = auth.currentUser;
//     if (!user) return;

//     // Listen to profile in Realtime DB for additional user fields
//     const profileRef = ref(db, `users/${user.uid}/profile`);
//     const unsubscribeProfile = onValue(profileRef, (snap) => {
//       const profile = snap.val() || {};
//       setAccount({
//         name: user.displayName || profile.name || "-",
//         email: user.email || profile.email || "-",
//         user_id: profile.user_id || "-",
//         broker: profile.broker || "-",
//         mobile: profile.mobile || "-",
//       });
//     });

//     // Listen to wallet data
//     const walletRef = ref(db, `users/${user.uid}/wallet`);
//     const unsubscribeWallet = onValue(walletRef, (snap) => {
//       setWallet(snap.val() || {});
//     });

//     return () => {
//       unsubscribeProfile();
//       unsubscribeWallet();
//     };
//   }, []);

//   const formatCurrency = (amount) => {
//     const num = Number(amount) || 0;
//     return `₹${num.toLocaleString("en-IN")}`;
//   };

//   const stats = [
//     { icon: <FiUser size={20} />, label: "Name", value: account.name || "Loading...", color: "#6366f1" },
//     { icon: <FiHash size={20} />, label: "User ID", value: account.user_id || "-", color: "#10b981" },
//     { icon: <FiMail size={20} />, label: "Email", value: account.email || "-", color: "#f59e0b" },
//     { icon: <FiCreditCard size={20} />, label: "Broker", value: account.broker || "-", color: "#3b82f6" },
//     { icon: <FiPhone size={20} />, label: "Mobile", value: account.mobile || "-", color: "#ef4444" },
//     { icon: <FiTrendingUp size={20} />, label: "Investment Amount", value: formatCurrency(wallet.invested), color: "#22c55e" },
//     { icon: <FiAward size={20} />, label: "Account Status", value: "Verified", color: "#8b5cf6" },
//     { icon: <FiShield size={20} />, label: "Security Level", value: "High", color: "#ec4899" },
//   ];

//   return (
//     <motion.div className="account-container" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
//       <motion.div className="account-card" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2, duration: 0.5 }}>
//         <motion.div className="account-header" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
//           <motion.h2 initial={{ y: -10 }} animate={{ y: 0 }} transition={{ delay: 0.5 }}>
//             Account Overview
//           </motion.h2>
//           <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
//             Your personalized account dashboard
//           </motion.p>
//         </motion.div>

//         <div className="account-stats">
//           {stats.map((stat, index) => (
//             <motion.div
//               key={index}
//               className="stat-card"
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.3 + index * 0.1, type: "spring", stiffness: 100 }}
//               whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
//             >
//               <div className="stat-icon" style={{ background: stat.color }}>
//                 {stat.icon}
//               </div>
//               <div className="stat-content">
//                 <span className="stat-label">{stat.label}</span>
//                 <motion.span className="stat-value" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 + index * 0.1 }}>
//                   {stat.value}
//                 </motion.span>
//               </div>
//             </motion.div>
//           ))}
//         </div>

//         <motion.div className="account-footer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
//           <div className="security-badge">
//             <FiShield size={18} />
//             <span>Secure & Encrypted Connection</span>
//           </div>
//         </motion.div>
//       </motion.div>

//       <style jsx>{`
//         .account-container {
//           padding: 2rem;
//           width: 100%;
//           max-width: 1200px;
//           margin: 0 auto;
//         }
//         .account-card {
//           background: white;
//           border-radius: 24px;
//           box-shadow: 0 20px 50px rgba(0, 0, 0, 0.08);
//           overflow: hidden;
//           padding: 3rem;
//           position: relative;
//           z-index: 1;
//           backdrop-filter: blur(10px);
//           border: 1px solid rgba(255, 255, 255, 0.2);
//           background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%);
//         }
//         .account-card::before {
//           content: "";
//           position: absolute;
//           top: -50%;
//           left: -50%;
//           width: 200%;
//           height: 200%;
//           background: radial-gradient(circle at center, rgba(99, 102, 241, 0.05) 0%, transparent 70%);
//           z-index: -1;
//           animation: rotate 20s linear infinite;
//         }
//         .account-header {
//           margin-bottom: 3rem;
//           text-align: center;
//         }
//         .account-header h2 {
//           font-size: 2.2rem;
//           color: #1f2937;
//           margin-bottom: 0.5rem;
//           font-weight: 700;
//           background: linear-gradient(90deg, #3b82f6, #8b5cf6);
//           -webkit-background-clip: text;
//           -webkit-text-fill-color: transparent;
//         }
//         .account-header p {
//           color: #6b7280;
//           font-size: 1rem;
//           max-width: 500px;
//           margin: 0 auto;
//         }
//         .account-stats {
//           display: grid;
//           grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
//           gap: 2rem;
//           margin-bottom: 3rem;
//         }
//         .stat-card {
//           background: rgba(255, 255, 255, 0.8);
//           border-radius: 16px;
//           padding: 1.75rem;
//           display: flex;
//           align-items: center;
//           transition: all 0.3s ease;
//           border: 1px solid rgba(0, 0, 0, 0.05);
//           backdrop-filter: blur(5px);
//           position: relative;
//           overflow: hidden;
//         }
//         .stat-card:hover {
//           transform: translateY(-5px);
//           border-color: rgba(0, 0, 0, 0.1);
//         }
//         .stat-icon {
//           color: white;
//           width: 48px;
//           height: 48px;
//           border-radius: 12px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           margin-right: 1.5rem;
//           flex-shrink: 0;
//           box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
//         }
//         .stat-content {
//           display: flex;
//           flex-direction: column;
//         }
//         .stat-label {
//           font-size: 0.85rem;
//           color: #6b7280;
//           text-transform: uppercase;
//           letter-spacing: 0.5px;
//           margin-bottom: 0.5rem;
//           font-weight: 600;
//         }
//         .stat-value {
//           font-size: 1.25rem;
//           font-weight: 700;
//           color: #1f2937;
//         }
//         .account-footer {
//           text-align: center;
//           padding-top: 2rem;
//           border-top: 1px solid rgba(0, 0, 0, 0.05);
//         }
//         .security-badge {
//           display: inline-flex;
//           align-items: center;
//           gap: 0.5rem;
//           color: #6b7280;
//           font-size: 0.9rem;
//           padding: 0.5rem 1rem;
//           border-radius: 20px;
//           background: rgba(0, 0, 0, 0.02);
//           border: 1px solid rgba(0, 0, 0, 0.05);
//         }
//         @keyframes rotate {
//           from {
//             transform: rotate(0deg);
//           }
//           to {
//             transform: rotate(360deg);
//           }
//         }
//       `}</style>
//     </motion.div>
//   );
// }


// // src/pages/AccountPage.jsx
// import React, { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import {
//   FiUser, FiMail, FiCreditCard, FiHash, FiAward,
//   FiShield, FiPhone, FiTrendingUp
// } from "react-icons/fi";
// import { db, auth } from "../firebase"; // ✅ your firebase config
// import { ref, onValue } from "firebase/database";
// import { onAuthStateChanged } from "firebase/auth";

// export default function AccountPage() {
//   const [account, setAccount] = useState({});
//   const [wallet, setWallet] = useState({});
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
//       if (user) {
//         const uid = user.uid;
//         const profileRef = ref(db, `account/${uid}`);
//         const walletRef = ref(db, `wallet/${uid}`);

//         const unsubProfile = onValue(profileRef, (snap) => {
//           setAccount(snap.val() || {});
//         });

//         const unsubWallet = onValue(walletRef, (snap) => {
//           setWallet(snap.val() || {});
//         });

//         setLoading(false);

//         // Cleanup listeners
//         return () => {
//           unsubProfile();
//           unsubWallet();
//         };
//       } else {
//         setAccount({});
//         setWallet({});
//         setLoading(false);
//       }
//     });

//     return () => unsubscribeAuth();
//   }, []);

//   const formatCurrency = (amount) => {
//     const num = Number(amount) || 0;
//     return `₹${num.toLocaleString("en-IN")}`;
//   };

//   const stats = [
//     { icon: <FiUser size={20} />, label: "Name", value: account.name || "Loading...", color: "#6366f1" },
//     { icon: <FiHash size={20} />, label: "User ID", value: account.user_id || "-", color: "#10b981" },
//     { icon: <FiMail size={20} />, label: "Email", value: account.email || "-", color: "#f59e0b" },
//     { icon: <FiCreditCard size={20} />, label: "Broker", value: account.broker || "-", color: "#3b82f6" },
//     { icon: <FiPhone size={20} />, label: "Mobile", value: account.mobile || "-", color: "#ef4444" },
//     { icon: <FiTrendingUp size={20} />, label: "Investment Amount", value: formatCurrency(wallet.invested), color: "#22c55e" },
//     { icon: <FiAward size={20} />, label: "Account Status", value: "Verified", color: "#8b5cf6" },
//     { icon: <FiShield size={20} />, label: "Security Level", value: "High", color: "#ec4899" },
//   ];

//   if (loading) {
//     return (
//       <div style={{ textAlign: "center", padding: "3rem", fontSize: "1.2rem" }}>
//         Loading your account...
//       </div>
//     );
//   }

//   return (
//     <motion.div className="account-container" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
//       <motion.div className="account-card" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2, duration: 0.5 }}>
//         <motion.div className="account-header" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
//           <motion.h2 initial={{ y: -10 }} animate={{ y: 0 }} transition={{ delay: 0.5 }}>
//             Account Overview
//           </motion.h2>
//           <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
//             Your personalized account dashboard
//           </motion.p>
//         </motion.div>

//         <div className="account-stats">
//           {stats.map((stat, index) => (
//             <motion.div
//               key={index}
//               className="stat-card"
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.3 + index * 0.1, type: "spring", stiffness: 100 }}
//               whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
//             >
//               <div className="stat-icon" style={{ background: stat.color }}>
//                 {stat.icon}
//               </div>
//               <div className="stat-content">
//                 <span className="stat-label">{stat.label}</span>
//                 <motion.span className="stat-value" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 + index * 0.1 }}>
//                   {stat.value}
//                 </motion.span>
//               </div>
//             </motion.div>
//           ))}
//         </div>

//         <motion.div className="account-footer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
//           <div className="security-badge">
//             <FiShield size={18} />
//             <span>Secure & Encrypted Connection</span>
//           </div>
//         </motion.div>
//       </motion.div>

//       {/* --- Custom Styles --- */}
//       <style jsx>{`
//         .account-container {
//           padding: 2rem;
//           width: 100%;
//           max-width: 1200px;
//           margin: 0 auto;
//         }
//         .account-card {
//           background: white;
//           border-radius: 24px;
//           box-shadow: 0 20px 50px rgba(0, 0, 0, 0.08);
//           padding: 3rem;
//           position: relative;
//           backdrop-filter: blur(10px);
//           border: 1px solid rgba(255, 255, 255, 0.2);
//           background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%);
//         }
//         .account-card::before {
//           content: "";
//           position: absolute;
//           top: -50%;
//           left: -50%;
//           width: 200%;
//           height: 200%;
//           background: radial-gradient(circle at center, rgba(99, 102, 241, 0.05) 0%, transparent 70%);
//           z-index: -1;
//           animation: rotate 20s linear infinite;
//         }
//         .account-header {
//           margin-bottom: 3rem;
//           text-align: center;
//         }
//         .account-header h2 {
//           font-size: 2.2rem;
//           color: #1f2937;
//           margin-bottom: 0.5rem;
//           font-weight: 700;
//           background: linear-gradient(90deg, #3b82f6, #8b5cf6);
//           -webkit-background-clip: text;
//           -webkit-text-fill-color: transparent;
//         }
//         .account-header p {
//           color: #6b7280;
//           font-size: 1rem;
//           max-width: 500px;
//           margin: 0 auto;
//         }
//         .account-stats {
//           display: grid;
//           grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
//           gap: 2rem;
//           margin-bottom: 3rem;
//         }
//         .stat-card {
//           background: rgba(255, 255, 255, 0.8);
//           border-radius: 16px;
//           padding: 1.75rem;
//           display: flex;
//           align-items: center;
//           transition: all 0.3s ease;
//           border: 1px solid rgba(0, 0, 0, 0.05);
//           backdrop-filter: blur(5px);
//         }
//         .stat-icon {
//           color: white;
//           width: 48px;
//           height: 48px;
//           border-radius: 12px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           margin-right: 1.5rem;
//           flex-shrink: 0;
//           box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
//         }
//         .stat-content {
//           display: flex;
//           flex-direction: column;
//         }
//         .stat-label {
//           font-size: 0.85rem;
//           color: #6b7280;
//           text-transform: uppercase;
//           letter-spacing: 0.5px;
//           margin-bottom: 0.5rem;
//           font-weight: 600;
//         }
//         .stat-value {
//           font-size: 1.25rem;
//           font-weight: 700;
//           color: #1f2937;
//         }
//         .account-footer {
//           text-align: center;
//           padding-top: 2rem;
//           border-top: 1px solid rgba(0, 0, 0, 0.05);
//         }
//         .security-badge {
//           display: inline-flex;
//           align-items: center;
//           gap: 0.5rem;
//           color: #6b7280;
//           font-size: 0.9rem;
//           padding: 0.5rem 1rem;
//           border-radius: 20px;
//           background: rgba(0, 0, 0, 0.02);
//           border: 1px solid rgba(0, 0, 0, 0.05);
//         }
//         @keyframes rotate {
//           from {
//             transform: rotate(0deg);
//           }
//           to {
//             transform: rotate(360deg);
//           }
//         }
//       `}</style>
//     </motion.div>
//   );
// }










// import React, { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import {
//   FiUser, FiMail, FiCreditCard, FiHash, FiAward,
//   FiShield, FiPhone, FiTrendingUp
// } from "react-icons/fi";
// import { db, auth } from "../firebase";
// import { ref, onValue, off } from "firebase/database";
// import { onAuthStateChanged } from "firebase/auth";

// export default function AccountPage() {
//   const [account, setAccount] = useState({});
//   const [wallet, setWallet] = useState({});
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     let profileRef = null;
//     let walletRef = null;

//     const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
//       if (user) {
//         const uid = user.uid;
//         profileRef = ref(db, `account/${uid}`);
//         walletRef = ref(db, `wallet/${uid}`);

//         onValue(profileRef, (snap) => {
//           setAccount(snap.val() || {});
//         });

//         onValue(walletRef, (snap) => {
//           setWallet(snap.val() || {});
//         });

//         setLoading(false);
//       } else {
//         setAccount({});
//         setWallet({});
//         setLoading(false);
//       }
//     });

//     return () => {
//       if (profileRef) off(profileRef);
//       if (walletRef) off(walletRef);
//       unsubscribeAuth();
//     };
//   }, []);

//   const formatCurrency = (amount) => {
//     const num = Number(amount) || 0;
//     return `₹${num.toLocaleString("en-IN")}`;
//   };

//   const stats = [
//     { icon: <FiUser size={20} />, label: "Name", value: account.name || "N/A", color: "#6366f1" },
//     { icon: <FiHash size={20} />, label: "User ID", value: account.user_id || "N/A", color: "#10b981" },
//     { icon: <FiMail size={20} />, label: "Email", value: account.email || "N/A", color: "#f59e0b" },
//     { icon: <FiCreditCard size={20} />, label: "Broker", value: account.broker || "N/A", color: "#3b82f6" },
//     { icon: <FiPhone size={20} />, label: "Mobile", value: account.mobile || "N/A", color: "#ef4444" },
//     { icon: <FiTrendingUp size={20} />, label: "Investment Amount", value: formatCurrency(wallet.invested), color: "#22c55e" },
//     { icon: <FiAward size={20} />, label: "Account Status", value: "Verified", color: "#8b5cf6" },
//     { icon: <FiShield size={20} />, label: "Security Level", value: "High", color: "#ec4899" },
//   ];

//   if (loading) {
//     return (
//       <div style={{ textAlign: "center", padding: "3rem", fontSize: "1.2rem" }}>
//         Loading your account...
//       </div>
//     );
//   }

//   return (
//     <motion.div className="account-container" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
//       <motion.div className="account-card" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2, duration: 0.5 }}>
//         <motion.div className="account-header" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
//           <motion.h2 initial={{ y: -10 }} animate={{ y: 0 }} transition={{ delay: 0.5 }}>
//             Account Overview
//           </motion.h2>
//           <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
//             Your personalized account dashboard
//           </motion.p>
//         </motion.div>

//         <div className="account-stats">
//           {stats.map((stat, index) => (
//             <motion.div
//               key={index}
//               className="stat-card"
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.3 + index * 0.1, type: "spring", stiffness: 100 }}
//               whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
//             >
//               <div className="stat-icon" style={{ background: stat.color }}>
//                 {stat.icon}
//               </div>
//               <div className="stat-content">
//                 <span className="stat-label">{stat.label}</span>
//                 <motion.span className="stat-value" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 + index * 0.1 }}>
//                   {stat.value}
//                 </motion.span>
//               </div>
//             </motion.div>
//           ))}
//         </div>

//         <motion.div className="account-footer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
//           <div className="security-badge">
//             <FiShield size={18} />
//             <span>Secure & Encrypted Connection</span>
//           </div>
//         </motion.div>
//       </motion.div>

//       <style jsx>{`
//         .account-container {
//           padding: 2rem;
//           width: 100%;
//           max-width: 1200px;
//           margin: 0 auto;
//         }
//         .account-card {
//           background: white;
//           border-radius: 24px;
//           box-shadow: 0 20px 50px rgba(0, 0, 0, 0.08);
//           padding: 3rem;
//           position: relative;
//           backdrop-filter: blur(10px);
//           border: 1px solid rgba(255, 255, 255, 0.2);
//           background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%);
//         }
//         .account-card::before {
//           content: "";
//           position: absolute;
//           top: -50%;
//           left: -50%;
//           width: 200%;
//           height: 200%;
//           background: radial-gradient(circle at center, rgba(99, 102, 241, 0.05) 0%, transparent 70%);
//           z-index: -1;
//           animation: rotate 20s linear infinite;
//         }
//         .account-header {
//           margin-bottom: 3rem;
//           text-align: center;
//         }
//         .account-header h2 {
//           font-size: 2.2rem;
//           color: #1f2937;
//           margin-bottom: 0.5rem;
//           font-weight: 700;
//           background: linear-gradient(90deg, #3b82f6, #8b5cf6);
//           -webkit-background-clip: text;
//           -webkit-text-fill-color: transparent;
//         }
//         .account-header p {
//           color: #6b7280;
//           font-size: 1rem;
//           max-width: 500px;
//           margin: 0 auto;
//         }
//         .account-stats {
//           display: grid;
//           grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
//           gap: 2rem;
//           margin-bottom: 3rem;
//         }
//         .stat-card {
//           background: rgba(255, 255, 255, 0.8);
//           border-radius: 16px;
//           padding: 1.75rem;
//           display: flex;
//           align-items: center;
//           transition: all 0.3s ease;
//           border: 1px solid rgba(0, 0, 0, 0.05);
//           backdrop-filter: blur(5px);
//         }
//         .stat-icon {
//           color: white;
//           width: 48px;
//           height: 48px;
//           border-radius: 12px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           margin-right: 1.5rem;
//           flex-shrink: 0;
//           box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
//         }
//         .stat-content {
//           display: flex;
//           flex-direction: column;
//         }
//         .stat-label {
//           font-size: 0.85rem;
//           color: #6b7280;
//           text-transform: uppercase;
//           letter-spacing: 0.5px;
//           margin-bottom: 0.5rem;
//           font-weight: 600;
//         }
//         .stat-value {
//           font-size: 1.25rem;
//           font-weight: 700;
//           color: #1f2937;
//         }
//         .account-footer {
//           text-align: center;
//           padding-top: 2rem;
//           border-top: 1px solid rgba(0, 0, 0, 0.05);
//         }
//         .security-badge {
//           display: inline-flex;
//           align-items: center;
//           gap: 0.5rem;
//           color: #6b7280;
//           font-size: 0.9rem;
//           padding: 0.5rem 1rem;
//           border-radius: 20px;
//           background: rgba(0, 0, 0, 0.02);
//           border: 1px solid rgba(0, 0, 0, 0.05);
//         }
//         @keyframes rotate {
//           from {
//             transform: rotate(0deg);
//           }
//           to {
//             transform: rotate(360deg);
//           }
//         }
//       `}</style>
//     </motion.div>
//   );
// }

// import React, { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import {
//   FiUser, FiMail, FiCreditCard, FiHash, FiAward,
//   FiShield, FiPhone, FiTrendingUp
// } from "react-icons/fi";
// import { db, auth } from "../firebase";
// import { ref, onValue } from "firebase/database";
// import { onAuthStateChanged } from "firebase/auth";

// export default function AccountPage() {
//   const [account, setAccount] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Wait for the user to be authenticated
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       if (user) {
//         const userId = user.uid;
//         const userRef = ref(db, `users/${userId}`);

//         onValue(userRef, (snapshot) => {
//           if (snapshot.exists()) {
//             setAccount(snapshot.val());
//           } else {
//             setAccount(null);
//           }
//           setLoading(false);
//         });
//       } else {
//         setAccount(null);
//         setLoading(false);
//       }
//     });

//     return () => unsubscribe(); // Clean up the listener on unmount
//   }, []);

//   if (loading) {
//     return <p className="p-4 text-lg text-gray-600">Loading...</p>;
//   }

//   if (!account) {
//     return <p className="p-4 text-lg text-red-600">No user data found.</p>;
//   }

//   const fieldDisplay = [
//     { icon: FiUser, label: "Name", value: account.name },
//     { icon: FiMail, label: "Email", value: account.email },
//     { icon: FiPhone, label: "Phone", value: account.phone },
//     { icon: FiCreditCard, label: "Account Number", value: account.accountNumber },
//     { icon: FiTrendingUp, label: "Trading Style", value: account.tradingStyle },
//     { icon: FiHash, label: "User ID", value: account.userId },
//     { icon: FiAward, label: "Experience", value: account.experience },
//     { icon: FiShield, label: "Risk Level", value: account.riskLevel },
//   ];

//   return (
//     <div className="p-6 max-w-3xl mx-auto bg-white rounded-lg shadow-md">
//       <h1 className="text-2xl font-semibold mb-6 text-center">Your Account</h1>
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//         {fieldDisplay.map(({ icon: Icon, label, value }) => (
//           <motion.div
//             key={label}
//             whileHover={{ scale: 1.03 }}
//             className="flex items-center gap-4 p-4 border rounded-md shadow-sm"
//           >
//             <Icon className="text-blue-600 text-xl" />
//             <div>
//               <p className="text-sm text-gray-600">{label}</p>
//               <p className="text-md font-medium">{value || "N/A"}</p>
//             </div>
//           </motion.div>
//         ))}
//       </div>
//     </div>
//   );
// }


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





