

  //resposivesness 
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { db, auth } from "../firebase";
import { ref, onValue } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";

export default function WalletPage() {
  const [wallet, setWallet] = useState({});
  const [pnlData, setPnlData] = useState({});
  const [positions, setPositions] = useState([]);
  const [trades, setTrades] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [investmentAmount, setInvestmentAmount] = useState(0);
  const [user, setUser] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        const userId = user.uid;
        
        // Fetch user data to get investment amount
        const userRef = ref(db, `users/${userId}`);
        onValue(userRef, (snapshot) => {
          if (snapshot.exists()) {
            const userData = snapshot.val();
            setInvestmentAmount(userData.investedAmount || userData.investmentAmount || 0);
          }
        });
      }
    });

    const walletRef = ref(db, "wallet");
    const unsubWallet = onValue(walletRef, (snap) => {
      setWallet(snap.val() || {});
    });
    
    const pnlRef = ref(db, "pnl_data");
    const unsubPnl = onValue(pnlRef, (snap) => {
      setPnlData(snap.val() || {});
    });
    
    const positionsRef = ref(db, "open_positions");
    const unsubPositions = onValue(positionsRef, (snap) => {
      const data = snap.val();
      setPositions(Array.isArray(data) ? data : data ? Object.values(data) : []);
    });
    
    const tradesRef = ref(db, "executed_trades");
    const unsubTrades = onValue(tradesRef, (snap) => {
      const data = snap.val();
      const arr = data ? Object.values(data) : [];
      arr.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
      setTrades(arr);
    });

    // Fetch portfolio data
    const portfolioRef = ref(db, "portfolio");
    const unsubPortfolio = onValue(portfolioRef, (snap) => {
      const data = snap.val();
      const portfolioData = data ? Object.values(data) : [];
      setPortfolio(portfolioData);
    });

    return () => {
      unsubscribe();
      unsubWallet();
      unsubPnl();
      unsubPositions();
      unsubTrades();
      unsubPortfolio();
    };
  }, []);

  const formatAmount = (amount) =>
    typeof amount === "number" ? amount.toLocaleString("en-IN", { maximumFractionDigits: 2 }) : "0";

  // Calculate total P&L (realized + unrealized)
  const totalPnL = (pnlData.realised || 0) + (pnlData.unrealised || 0);

  // Calculate Return on Investment (ROI)
  const roi = investmentAmount > 0 ? (totalPnL / investmentAmount) * 100 : 0;

  return (
    <div style={{ 
      padding: isMobile ? "16px" : "20px", 
      maxWidth: 1200, 
      margin: "0 auto",
      background: "linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)",
      minHeight: "100vh"
    }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ textAlign: "center", marginBottom: isMobile ? "1.5rem" : "2rem" }}
      >
        <h1 style={{ 
          fontSize: isMobile ? "2rem" : "2.5rem", 
          fontWeight: "800", 
          background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          marginBottom: "0.5rem"
        }}>
          Portfolio Dashboard
        </h1>
        <p style={{ color: "#6c757d", fontSize: isMobile ? "1rem" : "1.1rem" }}>
          Track your investments in real-time
        </p>
      </motion.div>

      {/* Wallet Overview */}
      <motion.div
        style={{
          padding: isMobile ? "20px" : "28px",
          background: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(10px)",
          borderRadius: "24px",
          boxShadow: "0 15px 35px rgba(0,0,0,0.1)",
          border: "1px solid rgba(255, 255, 255, 0.5)",
          marginBottom: isMobile ? "2rem" : "2.5rem",
        }}
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <motion.div
          style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            alignItems: isMobile ? "flex-start" : "center",
            justifyContent: "space-between",
            marginBottom: isMobile ? "20px" : "28px",
            gap: isMobile ? "16px" : "0"
          }}
        >
          <motion.h2
            style={{
              margin: 0,
              color: "#2c3e50",
              fontSize: isMobile ? "22px" : "26px",
              fontWeight: "700",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
            initial={{ x: -10 }}
            animate={{ x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <motion.div
              animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 5 }}
              style={{ fontSize: isMobile ? "24px" : "28px" }}
            >
              💰
            </motion.div>
            Wallet Overview
          </motion.h2>
          
          {/* Total P&L Indicator */}
          <motion.div
            style={{
              padding: isMobile ? "8px 14px" : "10px 18px",
              borderRadius: "20px",
              background: totalPnL >= 0 ? 
                "linear-gradient(90deg, rgba(52, 199, 89, 0.15) 0%, rgba(52, 199, 89, 0.05) 100%)" : 
                "linear-gradient(90deg, rgba(255, 59, 48, 0.15) 0%, rgba(255, 59, 48, 0.05) 100%)",
              border: `1px solid ${totalPnL >= 0 ? "rgba(52, 199, 89, 0.2)" : "rgba(255, 59, 48, 0.2)"}`,
              display: "flex",
              alignItems: "center",
              gap: "8px",
              alignSelf: isMobile ? "flex-start" : "center"
            }}
            whileHover={{ scale: 1.05 }}
          >
            <span style={{ 
              fontSize: isMobile ? "13px" : "14px", 
              color: totalPnL >= 0 ? "#34c759" : "#ff3b30",
              fontWeight: "600"
            }}>
              Total P&L
            </span>
            <span style={{ 
              fontSize: isMobile ? "16px" : "18px", 
              fontWeight: "800", 
              color: totalPnL >= 0 ? "#34c759" : "#ff3b30" 
            }}>
              {totalPnL >= 0 ? "↑" : "↓"} ₹{formatAmount(totalPnL)}
            </span>
          </motion.div>
        </motion.div>

        <div style={{ 
          display: "grid", 
          gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(280px, 1fr))", 
          gap: isMobile ? "16px" : "20px" 
        }}>
          {[
            { 
              label: "Available Funds", 
              icon: "💳",
              color: "#007AFF", 
              bg: "linear-gradient(135deg, rgba(0, 122, 255, 0.1) 0%, rgba(0, 122, 255, 0.05) 100%)", 
              value: wallet.available?.cash || wallet.available?.live_balance || 0,
              border: "1px solid rgba(0, 122, 255, 0.2)"
            },
            { 
              label: "Total Net Worth", 
              icon: "📈",
              color: "#5856D6", 
              bg: "linear-gradient(135deg, rgba(88, 86, 214, 0.1) 0%, rgba(88, 86, 214, 0.05) 100%)", 
              value: wallet.net,
              border: "1px solid rgba(88, 86, 214, 0.2)"
            },
            { 
              label: "Investment Amount", 
              icon: "🔒",
              color: "#FF9500", 
              bg: "linear-gradient(135deg, rgba(255, 149, 0, 0.1) 0%, rgba(255, 149, 0, 0.05) 100%)", 
              value: investmentAmount,
              border: "1px solid rgba(255, 149, 0, 0.2)"
            },
          ].map(({ label, icon, color, bg, value, border }, index) => (
            <motion.div
              key={label}
              style={{ 
                background: bg, 
                padding: isMobile ? "18px" : "22px", 
                borderRadius: "20px", 
                border: border,
                boxShadow: "0 5px 15px rgba(0,0,0,0.05)",
                position: "relative",
                overflow: "hidden"
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ 
                y: -5,
                boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
              }}
            >
              <div style={{ 
                position: "absolute", 
                top: "-10px", 
                right: "-10px", 
                fontSize: isMobile ? "36px" : "42px", 
                opacity: 0.1,
                transform: "rotate(15deg)"
              }}>
                {icon}
              </div>
              
              <div style={{ display: "flex", alignItems: "center", marginBottom: isMobile ? "10px" : "12px" }}>
                <div style={{ 
                  width: isMobile ? "36px" : "40px", 
                  height: isMobile ? "36px" : "40px", 
                  borderRadius: "12px", 
                  background: "rgba(255, 255, 255, 0.7)", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center",
                  marginRight: isMobile ? "10px" : "12px",
                  fontSize: isMobile ? "16px" : "18px"
                }}>
                  {icon}
                </div>
                <p style={{ 
                  margin: 0, 
                  color: "#6c757d", 
                  fontSize: isMobile ? "13px" : "14px", 
                  fontWeight: "600" 
                }}>
                  {label}
                </p>
              </div>
              
              <p style={{ 
                margin: 0, 
                fontSize: isMobile ? "22px" : "26px", 
                fontWeight: "800", 
                color,
                textShadow: "0 2px 4px rgba(0,0,0,0.05)"
              }}>
                ₹{formatAmount(value)}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(250px, 1fr))",
          gap: isMobile ? "16px" : "20px",
          marginBottom: isMobile ? "2rem" : "2.5rem"
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <motion.div
          style={{
            padding: isMobile ? "20px" : "24px",
            background: "rgba(255, 255, 255, 0.8)",
            backdropFilter: "blur(10px)",
            borderRadius: "20px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
            border: "1px solid rgba(255, 255, 255, 0.5)",
            textAlign: "center"
          }}
          whileHover={{ y: -5, scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div style={{ 
            width: isMobile ? "45px" : "50px", 
            height: isMobile ? "45px" : "50px", 
            borderRadius: "50%", 
            background: "linear-gradient(135deg, #007AFF 0%, #5856D6 100%)", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center",
            margin: "0 auto 15px",
            fontSize: isMobile ? "18px" : "20px"
          }}>
            📊
          </div>
          <h3 style={{ 
            margin: "0 0 8px 0", 
            color: "#2c3e50", 
            fontSize: isMobile ? "16px" : "18px" 
          }}>
            Active Positions
          </h3>
          <p style={{ 
            margin: 0, 
            fontSize: isMobile ? "28px" : "32px", 
            fontWeight: "800", 
            color: "#007AFF" 
          }}>
            {positions.length}
          </p>
        </motion.div>

        <motion.div
          style={{
            padding: isMobile ? "20px" : "24px",
            background: "rgba(255, 255, 255, 0.8)",
            backdropFilter: "blur(10px)",
            borderRadius: "20px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
            border: "1px solid rgba(255, 255, 255, 0.5)",
            textAlign: "center"
          }}
          whileHover={{ y: -5, scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div style={{ 
            width: isMobile ? "45px" : "50px", 
            height: isMobile ? "45px" : "50px", 
            borderRadius: "50%", 
            background: "linear-gradient(135deg, #FF9500 0%, #FF2D55 100%)", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center",
            margin: "0 auto 15px",
            fontSize: isMobile ? "18px" : "20px"
          }}>
            🔄
          </div>
          <h3 style={{ 
            margin: "0 0 8px 0", 
            color: "#2c3e50", 
            fontSize: isMobile ? "16px" : "18px" 
          }}>
            Total Trades
          </h3>
          <p style={{ 
            margin: 0, 
            fontSize: isMobile ? "28px" : "32px", 
            fontWeight: "800", 
            color: "#FF9500" 
          }}>
            {trades.length}
          </p>
        </motion.div>

        <motion.div
          style={{
            padding: isMobile ? "20px" : "24px",
            background: "rgba(255, 255, 255, 0.8)",
            backdropFilter: "blur(10px)",
            borderRadius: "20px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
            border: "1px solid rgba(255, 255, 255, 0.5)",
            textAlign: "center"
          }}
          whileHover={{ y: -5, scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div style={{ 
            width: isMobile ? "45px" : "50px", 
            height: isMobile ? "45px" : "50px", 
            borderRadius: "50%", 
            background: "linear-gradient(135deg, #34C759 0%, #5AC8FA 100%)", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center",
            margin: "0 auto 15px",
            fontSize: isMobile ? "18px" : "20px"
          }}>
            📅
          </div>
          <h3 style={{ 
            margin: "0 0 8px 0", 
            color: "#2c3e50", 
            fontSize: isMobile ? "16px" : "18px" 
          }}>
            Today's Trades
          </h3>
          <p style={{ 
            margin: 0, 
            fontSize: isMobile ? "28px" : "32px", 
            fontWeight: "800", 
            color: "#34C759" 
          }}>
            {trades.filter(trade => {
              const tradeDate = new Date(trade.timestamp || 0).toISOString().split('T')[0];
              const today = new Date().toISOString().split('T')[0];
              return tradeDate === today;
            }).length}
          </p>
        </motion.div>
      </motion.div>

      {/* Performance Summary */}
      <motion.div
        style={{
          padding: isMobile ? "20px" : "28px",
          background: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(10px)",
          borderRadius: "24px",
          boxShadow: "0 15px 35px rgba(0,0,0,0.1)",
          border: "1px solid rgba(255, 255, 255, 0.5)",
          marginBottom: isMobile ? "2rem" : "2.5rem",
          textAlign: "center"
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <h3 style={{ 
          margin: "0 0 20px 0", 
          color: "#2c3e50", 
          fontSize: isMobile ? "20px" : "22px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px"
        }}>
          <motion.span
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            📈
          </motion.span>
          Performance Summary
        </h3>
        
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(200px, 1fr))", 
          gap: isMobile ? "16px" : "20px" 
        }}>
          <motion.div
            style={{
              padding: isMobile ? "16px" : "20px",
              background: "linear-gradient(135deg, rgba(0, 122, 255, 0.1) 0%, rgba(0, 122, 255, 0.05) 100%)",
              borderRadius: "16px",
              border: "1px solid rgba(0, 122, 255, 0.2)"
            }}
            whileHover={{ scale: 1.05 }}
          >
            <h4 style={{ 
              margin: "0 0 10px 0", 
              color: "#007AFF", 
              fontSize: isMobile ? "14px" : "16px" 
            }}>
              Return on Investment
            </h4>
            <p style={{ 
              margin: 0, 
              fontSize: isMobile ? "20px" : "24px", 
              fontWeight: "800", 
              color: "#007AFF" 
            }}>
              {roi.toFixed(2)}%
            </p>
          </motion.div>
          
          <motion.div
            style={{
              padding: isMobile ? "16px" : "20px",
              background: "linear-gradient(135deg, rgba(52, 199, 89, 0.1) 0%, rgba(52, 199, 89, 0.05) 100%)",
              borderRadius: "16px",
              border: "1px solid rgba(52, 199, 89, 0.2)"
            }}
            whileHover={{ scale: 1.05 }}
          >
            <h4 style={{ 
              margin: "0 0 10px 0", 
              color: "#34C759", 
              fontSize: isMobile ? "14px" : "16px" 
            }}>
              Profit Ratio
            </h4>
            <p style={{ 
              margin: 0, 
              fontSize: isMobile ? "20px" : "24px", 
              fontWeight: "800", 
              color: "#34C759" 
            }}>
              {trades.length > 0 ? `${((trades.filter(t => t.pnl > 0).length / trades.length) * 100).toFixed(1)}%` : "0%"}
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}



