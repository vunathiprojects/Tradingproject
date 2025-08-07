import React from "react";
import { motion } from "framer-motion";
import { FiArrowUpRight, FiArrowDownRight } from "react-icons/fi";

export default function LiveTradesPage({ trades }) {
  // Defensive fallback: empty array if no trades
  const displayTrades = trades && trades.length > 0 ? trades : [];

  return (
    <motion.div
      className="trades-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="trades-header"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h2>Live Trades</h2>
        <p>Real-time updates of your current positions (read only)</p>
      </motion.div>

      <motion.div
        className="trades-table-container"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
      >
        {displayTrades.length === 0 ? (
          <p style={{ textAlign: "center", color: "#6b7280", padding: "1rem" }}>
            No trades available
          </p>
        ) : (
          <table className="trades-table" aria-label="Live Trades Table">
            <thead>
              <tr>
                <th>Symbol</th>
                <th>Buy Price</th>
                <th>Quantity</th>
                <th>Current Price</th>
                <th>P&L</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {displayTrades.map((trade, i) => (
                <motion.tr
                  key={i}
                  className="trade-row"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i }}
                  whileHover={{
                    backgroundColor: "rgba(59, 130, 246, 0.05)",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
                  }}
                >
                  <td className="symbol-cell">
                    <span className="symbol">
                      {trade.symbol || trade.tradingsymbol || "-"}
                    </span>
                  </td>
                  <td>₹{trade.buy_price ?? trade.price ?? "-"}</td>
                  <td>{trade.quantity ?? trade.qty ?? "-"}</td>
                  <td>₹{trade.last_price ?? "-"}</td>
                  <td className={trade.pnl >= 0 ? "profit" : "loss"}>
                    {trade.pnl >= 0 ? (
                      <FiArrowUpRight className="trend-icon" aria-label="Profit" />
                    ) : (
                      <FiArrowDownRight className="trend-icon" aria-label="Loss" />
                    )}
                    ₹{Math.abs(trade.pnl ?? 0).toFixed(2)}
                  </td>
                  <td>
                    <span
                      className={`status-badge ${
                        trade.pnl >= 0 ? "profit" : "loss"
                      }`}
                      aria-label={trade.pnl >= 0 ? "Profit" : "Loss"}
                    >
                      {trade.pnl >= 0 ? "Profit" : "Loss"}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </motion.div>

      <style jsx>{`
        .trades-container {
          padding: 1rem;
          width: 100%;
        }
        .trades-header {
          margin-bottom: 2rem;
          text-align: center;
        }
        .trades-header h2 {
          font-size: 1.8rem;
          color: #1f2937;
          margin-bottom: 0.5rem;
        }
        .trades-header p {
          color: #6b7280;
          font-size: 0.9rem;
        }
        .trades-table-container {
          background: #ffffff;
          border-radius: 16px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
          overflow: hidden;
          padding: 1.5rem;
        }
        .trades-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
        }
        .trades-table th {
          background: #f9fafb;
          color: #6b7280;
          font-weight: 600;
          text-transform: uppercase;
          font-size: 0.75rem;
          letter-spacing: 0.5px;
          padding: 1rem;
          text-align: left;
          border-bottom: 1px solid #e5e7eb;
        }
        .trades-table td {
          padding: 1.25rem 1rem;
          border-bottom: 1px solid #f3f4f6;
          color: #4b5563;
          font-weight: 500;
        }
        .trade-row:last-child td {
          border-bottom: none;
        }
        .symbol-cell {
          display: flex;
          align-items: center;
        }
        .symbol {
          background: #f0f9ff;
          color: #0369a1;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-weight: 600;
          font-size: 0.85rem;
        }
        .profit {
          color: #10b981;
        }
        .loss {
          color: #ef4444;
        }
        .trend-icon {
          margin-right: 0.5rem;
          vertical-align: middle;
        }
        .status-badge {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
        }
        .status-badge.profit {
          background: #d1fae5;
        }
        .status-badge.loss {
          background: #fee2e2;
        }
      `}</style>
    </motion.div>
  );
}
