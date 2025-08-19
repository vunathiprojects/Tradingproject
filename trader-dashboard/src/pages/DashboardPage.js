// portfolio cart and remove the p&L cart ok

import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { ref, onValue, off } from "firebase/database";

// Modal component with enhanced graphics
function DetailModal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <div style={modalHeaderStyle}>
          <h3 style={modalTitleStyle}>{title}</h3>
          <button onClick={onClose} style={closeBtnStyle}>×</button>
        </div>
        <div style={modalContentWrapperStyle}>{children}</div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [summary, setSummary] = useState({});
  const [positions, setPositions] = useState([]);
  const [orders, setOrders] = useState([]);
  const [modalInfo, setModalInfo] = useState({ open: false, title: "", body: null });

  // Set up Firebase realtime listeners
  useEffect(() => {
    const summaryRef = ref(db, "dashboard/summary");
    const positionsRef = ref(db, "dashboard/positions");
    const tradesRef = ref(db, "trades");

    const unsubSummary = onValue(summaryRef, (snap) => {
      setSummary(snap.val() || {});
    });
    const unsubPositions = onValue(positionsRef, (snap) => {
      const val = snap.val();
      setPositions(Array.isArray(val) ? val : val ? Object.values(val) : []);
    });
    const unsubOrders = onValue(tradesRef, (snap) => {
      const val = snap.val();
      const arr = val ? Object.values(val) : [];
      arr.sort((a, b) => (b.timestamp ?? 0) - (a.timestamp ?? 0));
      setOrders(arr.slice(0, 32));
    });

    return () => {
      off(summaryRef, "value", unsubSummary);
      off(positionsRef, "value", unsubPositions);
      off(tradesRef, "value", unsubOrders);
    };
  }, []);

  // Helpers to open/close Modal with content
  const openModal = (title, body) => setModalInfo({ open: true, title, body });
  const closeModal = () => setModalInfo({ ...modalInfo, open: false });

  // Combined P&L Today: Unrealized + Realized
  const totalPnlToday = (Number(summary.pnlToday) || 0) + (Number(summary.realizedPnl) || 0);

  // Modal bodies for cards
  const holdingsBody = (
    <div style={modalContentStyle}>
      <div style={metricRowStyle}>
        <div style={metricItemStyle}>
          <span style={metricLabelStyle}>Total Value</span>
          <span style={metricValueStyle}>₹{summary.holdingsValue?.toLocaleString() ?? "0"}</span>
        </div>
        <div style={metricItemStyle}>
          <span style={metricLabelStyle}>Invested Amount</span>
          <span style={metricValueStyle}>₹{summary.invested?.toLocaleString() ?? "0"}</span>
        </div>
      </div>
      <div style={metricRowStyle}>
        <div style={metricItemStyle}>
          <span style={metricLabelStyle}>Total Returns</span>
          <div>
            <span style={{ ...metricValueStyle, color: summary.totalReturnsPct >= 0 ? "#16a34a" : "#dc2626" }}>
              {summary.totalReturnsPct >= 0 ? "+" : ""}{summary.totalReturnsPct ?? 0}%
            </span>
            <span style={{ ...metricSubValueStyle, color: summary.totalReturnsAmt >= 0 ? "#16a34a" : "#dc2626" }}>
              {summary.totalReturnsAmt >= 0 ? "+" : ""}₹{summary.totalReturnsAmt?.toLocaleString() ?? "0"}
            </span>
          </div>
        </div>
      </div>
      <div style={dividerStyle} />
      <p style={infoTextStyle}>Click on any position below to view detailed breakdown</p>
    </div>
  );

  const fundsBody = (
    <div style={modalContentStyle}>
      <div style={largeMetricStyle}>
        <span style={metricLabelStyle}>Available Balance</span>
        <span style={{ ...metricValueStyle, fontSize: "2.2rem" }}>₹{summary.funds?.toLocaleString() ?? "0"}</span>
      </div>
      <div style={dividerStyle} />
      <div style={actionButtonsContainer}>
        <button style={actionButtonStyle("#3b82f6")}>Add Funds</button>
        <button style={actionButtonStyle("#10b981")}>Withdraw</button>
      </div>
    </div>
  );

  const portfolioBody = (
    <div style={modalContentStyle}>
      <div style={largeMetricStyle}>
        <span style={metricLabelStyle}>Portfolio Balance</span>
        <span style={{ ...metricValueStyle, fontSize: "2rem" }}>
          ₹{(summary.portfolioValue ?? summary.holdingsValue ?? 0).toLocaleString()}
        </span>
      </div>
      <div style={dividerStyle} />
      <div style={largeMetricStyle}>
        <span style={metricLabelStyle}>Today's Total P&L</span>
        <span
          style={{
            ...metricValueStyle,
            fontSize: "1.7rem",
            color: totalPnlToday >= 0 ? "#16a34a" : "#dc2626"
          }}
        >
          {totalPnlToday >= 0 ? "+" : ""}₹{totalPnlToday.toLocaleString()}
        </span>
      </div>
      <div style={metricRowStyle}>
        <div style={metricItemStyle}>
          <span style={metricLabelStyle}>Intraday (Unrealized) P&L</span>
          <span style={{ ...metricValueStyle, color: summary.pnlToday >= 0 ? "#16a34a" : "#dc2626" }}>
            {summary.pnlToday >= 0 ? "+" : ""}₹{summary.pnlToday?.toLocaleString() ?? "0"}
          </span>
        </div>
        <div style={metricItemStyle}>
          <span style={metricLabelStyle}>Realized P&L</span>
          <span style={{ ...metricValueStyle, color: summary.realizedPnl >= 0 ? "#16a34a" : "#dc2626" }}>
            {summary.realizedPnl >= 0 ? "+" : ""}₹{summary.realizedPnl?.toLocaleString() ?? "0"}
          </span>
        </div>
      </div>
    </div>
  );

  const cardCommon = {
    flex: 1,
    minWidth: 160,
    borderRadius: 13,
    padding: "1rem 1.3rem",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "1rem" }}>
      <div style={paperStyle}>
        <h1 style={titleStyle}>Dashboard Overview</h1>
        {/* Summary Cards */}
        <div style={cardRowStyle}>
          {/* Portfolio Card */}
          <div
            style={{ ...cardCommon, background: "linear-gradient(135deg, #e0e8f3 0%, #e9f4fb 100%)" }}
            onClick={() => openModal("Portfolio Details", portfolioBody)}
          >
            <div style={cardLabelStyle("#5745af")}>Portfolio</div>
            <div style={cardValueStyle}>
              ₹{(summary.portfolioValue ?? summary.holdingsValue ?? 0).toLocaleString()}
            </div>
            <div
              style={{
                fontSize: 15,
                fontWeight: 500,
                color: totalPnlToday >= 0 ? "#16a34a" : "#dc2626",
                marginTop: 4
              }}
            >
              {totalPnlToday >= 0 ? "+" : ""}₹{totalPnlToday.toLocaleString()}
            </div>
          </div>

          {/* Holdings Card */}
          <div
            style={{ ...cardCommon, background: "linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 100%)" }}
            onClick={() => openModal("Holdings Details", holdingsBody)}
          >
            <div style={cardLabelStyle("#00838f")}>Holdings</div>
            <div style={cardValueStyle}>₹{summary.holdingsValue?.toLocaleString() ?? "0"}</div>
          </div>
          {/* Available Funds Card */}
          <div
            style={{ ...cardCommon, background: "linear-gradient(135deg, #fff9c4 0%, #fff176 100%)" }}
            onClick={() => openModal("Available Funds", fundsBody)}
          >
            <div style={cardLabelStyle("#999022")}>Available Funds</div>
            <div style={cardValueStyle}>₹{summary.funds?.toLocaleString() ?? "0"}</div>
          </div>
        </div>

        {/* Positions Table */}
        <SectionTable
          title="Active Positions"
          headers={["Symbol", "Qty", "Avg Price", "LTP", "P&L"]}
          rows={positions.map(p => [
            p.symbol,
            p.qty,
            `₹${(p.avg_price ?? 0).toFixed(2)}`,
            `₹${(p.ltp ?? 0).toFixed(2)}`,
            (p.pnl ?? p.unrealized ?? 0)
          ])}
          onRowClick={idx => {
            const p = positions[idx];
            openModal(
              `Position • ${p.symbol}`,
              <div style={positionDetailStyle}>
                <div style={positionHeaderStyle}>
                  <span style={symbolStyle}>{p.symbol}</span>
                  <span style={qtyStyle}>{p.qty} Shares</span>
                </div>
                <div style={positionMetricsStyle}>
                  <div style={metricCardStyle("#e3f2fd")}>
                    <span style={metricCardLabel}>Avg. Price</span>
                    <span style={metricCardValue}>₹{(p.avg_price ?? 0).toFixed(2)}</span>
                  </div>
                  <div style={metricCardStyle("#e8f5e9")}>
                    <span style={metricCardLabel}>LTP</span>
                    <span style={metricCardValue}>₹{(p.ltp ?? 0).toFixed(2)}</span>
                  </div>
                  <div style={metricCardStyle(p.pnl >= 0 ? "#e8f5e9" : "#ffebee")}>
                    <span style={metricCardLabel}>P&L</span>
                    <span style={{ ...metricCardValue, color: p.pnl >= 0 ? "#2e7d32" : "#c62828" }}>
                      {p.pnl >= 0 ? "+" : ""}₹{(p.pnl ?? 0).toFixed(2)}
                    </span>
                  </div>
                </div>
                <div style={additionalInfoStyle}>
                  <pre style={{ whiteSpace: "pre-wrap", fontFamily: "inherit", fontSize: "0.9rem" }}>
                    {JSON.stringify(p, null, 2)}
                  </pre>
                </div>
              </div>
            );
          }}
        />

        {/* Recent Trades Table */}
        <SectionTable
          title="Recent Trades"
          headers={["Time", "Symbol", "Type", "Qty", "Price", "Status"]}
          rows={orders.slice(0, 8).map(o => [
            o.timestamp ? new Date(o.timestamp).toLocaleTimeString() : "--",
            o.symbol,
            <span style={tradeTypeStyle(o.type)}>{o.type}</span>,
            o.qty,
            `₹${o.price?.toFixed(2) ?? "--"}`,
            <span style={statusStyle(o.status)}>{o.status}</span>
          ])}
          onRowClick={idx => {
            const o = orders[idx];
            openModal(
              `Trade • ${o.symbol}`,
              <div style={tradeDetailStyle}>
                <div style={tradeHeaderStyle}>
                  <span style={tradeSymbolStyle}>{o.symbol}</span>
                  <span style={tradeTypeTagStyle(o.type)}>{o.type}</span>
                </div>
                <div style={tradeMetricsStyle}>
                  <div style={tradeMetricRow}>
                    <span style={tradeMetricLabel}>Quantity:</span>
                    <span style={tradeMetricValue}>{o.qty}</span>
                  </div>
                  <div style={tradeMetricRow}>
                    <span style={tradeMetricLabel}>Price:</span>
                    <span style={tradeMetricValue}>₹{o.price?.toFixed(2) ?? "--"}</span>
                  </div>
                  <div style={tradeMetricRow}>
                    <span style={tradeMetricLabel}>Status:</span>
                    <span style={{ ...tradeMetricValue, ...statusStyle(o.status) }}>{o.status}</span>
                  </div>
                  <div style={tradeMetricRow}>
                    <span style={tradeMetricLabel}>Time:</span>
                    <span style={tradeMetricValue}>
                      {o.timestamp ? new Date(o.timestamp).toLocaleString() : "--"}
                    </span>
                  </div>
                </div>
                <div style={tradeAdditionalInfo}>
                  <pre style={{ whiteSpace: "pre-wrap", fontFamily: "inherit", fontSize: "0.9rem" }}>
                    {JSON.stringify(o, null, 2)}
                  </pre>
                </div>
              </div>
            );
          }}
        />
      </div>

      <DetailModal open={modalInfo.open} onClose={closeModal} title={modalInfo.title}>
        {modalInfo.body}
      </DetailModal>
    </div>
  );
}

// Reusable SectionTable component
function SectionTable({ title, headers, rows, onRowClick }) {
  return (
    <div style={{ marginBottom: "2.5rem" }}>
      <h2 style={subTitleStyle}>{title}</h2>
      <div style={tableWrapperStyle}>
        <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0" }}>
          <thead>
            <tr style={headerRowStyle}>
              {headers.map((h, index) => (
                <th
                  key={h}
                  style={{
                    ...thStyle,
                    borderLeft: index === 0 ? "none" : "1px solid #e5e7eb",
                    borderTopLeftRadius: index === 0 ? "10px" : "0",
                    borderTopRightRadius: index === headers.length - 1 ? "10px" : "0"
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={headers.length} style={emptyCellStyle}>
                  No Data Available
                </td>
              </tr>
            ) : (
              rows.map((cells, rIdx) => (
                <tr
                  key={rIdx}
                  style={{
                    cursor: "pointer",
                    backgroundColor: rIdx % 2 === 0 ? "#ffffff" : "#f9fafb",
                    transition: "background-color 0.2s ease"
                  }}
                  onClick={() => onRowClick?.(rIdx)}
                >
                  {cells.map((c, cIdx) => (
                    <td
                      key={cIdx}
                      style={{
                        ...tdStyle,
                        borderLeft: cIdx === 0 ? "none" : "1px solid #e5e7eb",
                        borderBottom: rIdx === rows.length - 1 ? "none" : "1px solid #e5e7eb",
                        color:
                          title === "Active Positions" && cIdx === 4
                            ? typeof c === "number"
                              ? c >= 0
                                ? "#16a34a"
                                : "#dc2626"
                              : "#374151"
                            : undefined,
                        fontWeight: title === "Active Positions" && cIdx === 4 ? "600" : "normal"
                      }}
                    >
                      {c}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// --------- Styles -----------

const subTitleStyle = {
  fontWeight: 700,
  fontSize: "1.3rem",
  marginBottom: 18,
  color: "#1f2937",
  display: "flex",
  alignItems: "center",
  gap: "0.5rem"
};

const modalContentStyle = {
  padding: "1rem",
  display: "flex",
  flexDirection: "column",
  gap: "1.5rem",
  background: "linear-gradient(145deg, #ffffff, #f8fafc)",
  borderRadius: "12px",
  boxShadow: "inset 0 2px 8px rgba(0,0,0,0.05)"
};

const metricRowStyle = {
  display: "flex",
  gap: "1.5rem",
  justifyContent: "space-between",
  flexWrap: "wrap"
};

const metricItemStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  gap: "0.4rem",
  background: "#ffffff",
  padding: "0.8rem",
  borderRadius: "8px",
  boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
  transition: "transform 0.2s ease",
  "&:hover": {
    transform: "translateY(-2px)"
  }
};

const largeMetricStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "0.6rem",
  alignItems: "center",
  marginBottom: "0.8rem",
  padding: "1rem",
  background: "linear-gradient(145deg, #f8fafc, #ffffff)",
  borderRadius: "10px",
  boxShadow: "0 3px 10px rgba(0,0,0,0.05)"
};

const metricLabelStyle = {
  fontSize: "0.95rem",
  color: "#6b7280",
  fontWeight: 500,
  letterSpacing: "0.2px"
};

const metricValueStyle = {
  fontSize: "1.5rem",
  fontWeight: 700,
  color: "#1f2937",
  letterSpacing: "0.3px"
};

const metricSubValueStyle = {
  fontSize: "0.95rem",
  fontWeight: 500,
  marginLeft: "0.6rem"
};

const dividerStyle = {
  height: "1px",
  background: "linear-gradient(to right, #e5e7eb, #d1d5db, #e5e7eb)",
  width: "100%",
  margin: "0.5rem 0",
  borderRadius: "2px"
};

const infoTextStyle = {
  fontSize: "0.9rem",
  color: "#9ca3af",
  textAlign: "center",
  marginTop: "0.8rem",
  fontStyle: "italic"
};

const actionButtonsContainer = {
  display: "flex",
  gap: "1.2rem",
  justifyContent: "center",
  flexWrap: "wrap"
};

const actionButtonStyle = (bgColor) => ({
  padding: "0.6rem 1.2rem",
  borderRadius: "10px",
  border: "none",
  background: bgColor,
  color: "#fff",
  cursor: "pointer",
  fontWeight: 600,
  fontSize: "0.95rem",
  minWidth: "130px",
  transition: "all 0.3s ease",
  boxShadow: "0 3px 8px rgba(0,0,0,0.1)",
  "&:hover": {
    opacity: 0.9,
    transform: "translateY(-2px)",
    boxShadow: "0 5px 12px rgba(0,0,0,0.15)"
  }
});

const positionDetailStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "1.8rem",
  padding: "1rem",
  background: "linear-gradient(145deg, #ffffff, #f8fafc)",
  borderRadius: "12px"
};

const positionHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  paddingBottom: "0.8rem",
  borderBottom: "1px solid #e5e7eb"
};

const symbolStyle = {
  fontSize: "1.4rem",
  fontWeight: 700,
  color: "#1f2937",
  letterSpacing: "0.2px"
};

const qtyStyle = {
  fontSize: "0.95rem",
  color: "#6b7280",
  background: "#f3f4f6",
  padding: "0.4rem 0.8rem",
  borderRadius: "14px",
  fontWeight: 500
};

const positionMetricsStyle = {
  display: "flex",
  gap: "1.2rem",
  justifyContent: "space-between",
  flexWrap: "wrap"
};

const metricCardStyle = (bgColor) => ({
  flex: 1,
  background: bgColor,
  padding: "1.2rem",
  borderRadius: "12px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "0.4rem",
  boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
  transition: "transform 0.2s ease",
  "&:hover": {
    transform: "translateY(-2px)"
  }
});

const metricCardLabel = {
  fontSize: "0.85rem",
  color: "#6b7280",
  fontWeight: 500
};

const metricCardValue = {
  fontSize: "1.2rem",
  fontWeight: 700,
  color: "#1f2937"
};

const additionalInfoStyle = {
  marginTop: "1.2rem",
  background: "#f9fafb",
  padding: "1rem",
  borderRadius: "8px"
};

const tradeDetailStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "1.8rem",
  padding: "1rem",
  background: "linear-gradient(145deg, #ffffff, #f8fafc)",
  borderRadius: "12px"
};

const tradeHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  paddingBottom: "0.8rem",
  borderBottom: "1px solid #e5e7eb"
};

const tradeSymbolStyle = {
  fontSize: "1.4rem",
  fontWeight: 700,
  color: "#1f2937",
  letterSpacing: "0.2px"
};

const tradeTypeTagStyle = (type) => ({
  fontSize: "0.95rem",
  color: type === "BUY" ? "#166534" : "#991b1b",
  background: type === "BUY" ? "#dcfce7" : "#fee2e2",
  padding: "0.4rem 0.8rem",
  borderRadius: "14px",
  fontWeight: 600
});

const tradeMetricsStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "1rem"
};

const tradeMetricRow = {
  display: "flex",
  justifyContent: "space-between",
  padding: "0.5rem 0"
};

const tradeMetricLabel = {
  fontSize: "0.95rem",
  color: "#6b7280",
  fontWeight: 500
};

const tradeMetricValue = {
  fontSize: "1rem",
  fontWeight: 600,
  color: "#1f2937"
};

const tradeAdditionalInfo = {
  marginTop: "1.2rem",
  background: "#f9fafb",
  padding: "1rem",
  borderRadius: "8px"
};

const tradeTypeStyle = (type) => ({
  color: type === "BUY" ? "#166534" : "#991b1b",
  fontWeight: 600,
  background: type === "BUY" ? "#dcfce7" : "#fee2e2",
  padding: "0.3rem 0.6rem",
  borderRadius: "8px",
  fontSize: "0.9rem"
});

const statusStyle = (status) => {
  let color, bgColor;
  switch ((status ?? "").toLowerCase()) {
    case "complete":
    case "completed":
      color = "#166534";
      bgColor = "#dcfce7";
      break;
    case "pending":
      color = "#854d0e";
      bgColor = "#fef9c3";
      break;
    case "rejected":
      color = "#991b1b";
      bgColor = "#fee2e2";
      break;
    default:
      color = "#1f2937";
bgColor = "#f3f4f6";
}
return { color, background: bgColor, padding: "0.3rem 0.6rem", borderRadius: "8px", fontSize: "0.9rem", fontWeight: 500 };
};

const paperStyle = {
  background: "#fff",
  borderRadius: 24,
  boxShadow: "0 8px 32px rgba(60,60,60,0.11)",
  padding: "2.5rem 2rem",
  width: "100%",
  maxWidth: 950,
  marginTop: 16
};

const titleStyle = {
  fontWeight: 800,
  fontSize: "2.2rem",
  marginBottom: 36,
  color: "#1f2937",
  letterSpacing: "-0.5px"
};

const cardRowStyle = {
  display: "flex",
  gap: "2rem",
  marginBottom: "2.5rem",
  flexWrap: "wrap"
};

const cardLabelStyle = (color) => ({
  fontSize: 14,
  color,
  marginBottom: 5,
  fontWeight: 600,
  letterSpacing: "0.3px"
});

const cardValueStyle = {
  fontWeight: 700,
  fontSize: 22,
  letterSpacing: "0.5px"
};

const tableWrapperStyle = {
  overflowX: "auto",
  borderRadius: 12,
  boxShadow: "0 2px 10px rgba(60,60,60,0.08)",
  background: "#fafbfc",
  border: "1px solid #e5e7eb"
};

const headerRowStyle = {
  background: "linear-gradient(to right, #f9fafb, #f3f4f6)",
  borderRadius: "10px"
};

const thStyle = {
  padding: "14px 17px",
  fontWeight: 700,
  color: "#374151",
  fontSize: 14,
  textAlign: "left",
  borderBottom: "1px solid #e5e7eb",
  position: "sticky",
  top: 0,
  background: "inherit"
};

const tdStyle = {
  padding: "14px 15px",
  color: "#374151",
  fontSize: 13.5,
  borderBottom: "1px solid #e5e7eb",
  fontWeight: 500
};

const emptyCellStyle = {
  padding: "22px 0",
  textAlign: "center",
  color: "#9ca3af",
  fontSize: "0.95rem"
};

const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "rgba(0,0,0,0.4)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
  backdropFilter: "blur(8px)",
  transition: "all 0.3s ease"
};

const modalStyle = {
  background: "linear-gradient(145deg, #ffffff, #f0f4f8)",
  padding: "2rem",
  borderRadius: 16,
  width: "90%",
  maxWidth: 520,
  boxShadow: "0 12px 40px rgba(0,0,0,0.2), 0 4px 10px rgba(0,0,0,0.1)",
  border: "1px solid rgba(255,255,255,0.3)",
  position: "relative",
  animation: "modalFadeIn 0.3s ease-out"
};

const modalHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "1.5rem",
  borderBottom: "1px solid #e5e7eb"
};

const modalTitleStyle = {
  fontSize: "1.6rem",
  fontWeight: 700,
  color: "#1f2937",
  letterSpacing: "-0.2px"
};

const modalContentWrapperStyle = {
  maxHeight: "450px",
  overflowY: "auto",
  paddingRight: "0.5rem",
  "&::-webkit-scrollbar": {
    width: "8px"
  },
  "&::-webkit-scrollbar-track": {
    background: "#f1f5f9",
    borderRadius: "4px"
  },
  "&::-webkit-scrollbar-thumb": {
    background: "#cbd5e1",
    borderRadius: "4px",
    "&:hover": {
      background: "#94a3b8"
    }
  }
};

const closeBtnStyle = {
  background: "none",
  border: "none",
  fontSize: "1.2rem",
  color: "#6b7280",
  cursor: "pointer",
  padding: "0.5rem",
  transition: "color 0.2s ease",
  "&:hover": {
    color: "#1f2937"
  }
};

// Animation keyframes
const styles = `
@keyframes modalFadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
`;




