import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { db } from "../firebase";
import { ref, onValue } from "firebase/database";

export default function WalletPage() {
  const [wallet, setWallet] = useState({});

  useEffect(() => {
    // Listen to the `/wallet` node for REALTIME data as pushed by your backend
    const walletRef = ref(db, "wallet");
    const unsub = onValue(walletRef, (snap) => {
      setWallet(snap.val() || {});
    });
    return () => unsub();
  }, []);

  const formatAmount = (amount) =>
    typeof amount === "number" ? amount.toLocaleString("en-IN", { maximumFractionDigits: 2 }) : "0";

  return (
    <motion.div
      style={{
        padding: "24px",
        background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
        borderRadius: "16px",
        boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
        border: "1px solid rgba(0,0,0,0.05)",
        maxWidth: 400,
        margin: "2rem auto",
      }}
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <motion.h2
        style={{
          margin: "0 0 20px 0",
          color: "#2c3e50",
          fontSize: "24px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
        initial={{ x: -10 }}
        animate={{ x: 0 }}
        transition={{ delay: 0.1 }}
      >
        <motion.span animate={{ rotate: [0, 10, -5, 0] }} transition={{ duration: 0.5 }}>
          💰
        </motion.span>
        Wallet Overview
      </motion.h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {[
          { label: "Available Funds", color: "#28a745", bg: "#e8f8ee", value: wallet.cash },
          { label: "Total Net Worth", color: "#0d6efd", bg: "#eff7fd", value: wallet.net },
          { label: "Invested Amount", color: "#ffc107", bg: "#fffbea", value: wallet.invested },
          { label: "Profit / Loss", color: wallet.pnl >= 0 ? "#28a745" : "#dc3545", bg: wallet.pnl >= 0 ? "#e6fbe9" : "#fdf1f3", value: wallet.pnl },
        ].map(({ label, color, bg, value }) => (
          <motion.div
            key={label}
            style={{ background: bg, padding: 16, borderRadius: 12, borderLeft: `4px solid ${color}` }}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <p style={{ margin: "0 0 4px 0", color: "#495057", fontSize: "14px" }}>{label}</p>
            <p style={{ margin: 0, fontSize: "24px", fontWeight: "700", color }}>{`₹${formatAmount(value)}`}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
