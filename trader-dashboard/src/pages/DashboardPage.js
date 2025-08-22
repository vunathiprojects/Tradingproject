                                         //mobile resposivness

import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { ref, onValue, off } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";

// Modal component
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
  const [wallet, setWallet] = useState({});
  const [pnlData, setPnlData] = useState({});
  const [positions, setPositions] = useState([]);
  const [orders, setOrders] = useState([]);
  const [modalInfo, setModalInfo] = useState({ open: false, title: "", body: null });
  const [totalPnL, setTotalPnL] = useState(0);
  const [loading, setLoading] = useState(true);
  const [investmentAmount, setInvestmentAmount] = useState(0);
  const [userId, setUserId] = useState(null);

  // Authentication and user data listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        
        // Fetch user data to get investment amount
        const userRef = ref(db, `users/${user.uid}`);
        const unsubUser = onValue(userRef, (snapshot) => {
          if (snapshot.exists()) {
            const userData = snapshot.val();
            setInvestmentAmount(userData.investedAmount || userData.investmentAmount || 0);
          } else {
            setInvestmentAmount(0);
          }
        });
        
        return () => off(userRef, "value", unsubUser);
      } else {
        setUserId(null);
        setInvestmentAmount(0);
      }
    });

    return () => unsubscribe();
  }, []);

  // Set up Firebase realtime listeners for trading data
  useEffect(() => {
    if (!userId) return;

    const walletRef = ref(db, "wallet");
    const positionsRef = ref(db, "open_positions");
    const tradesRef = ref(db, "executed_trades");
    const pnlRef = ref(db, "pnl_data");

    const unsubWallet = onValue(walletRef, (snap) => {
      setWallet(snap.val() || {});
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
    
    const unsubPnL = onValue(pnlRef, (snap) => {
      const data = snap.val() || {};
      setPnlData(data);
      setTotalPnL((data.realised || 0) + (data.unrealised || 0));
      setLoading(false);
    });

    return () => {
      off(walletRef, "value", unsubWallet);
      off(positionsRef, "value", unsubPositions);
      off(tradesRef, "value", unsubOrders);
      off(pnlRef, "value", unsubPnL);
    };
  }, [userId]);

  // Calculate total invested value from positions
  const totalInvested = positions.reduce((total, position) => {
    return total + ((position.average_price || 0) * (position.quantity || 0));
  }, 0);

  const openModal = (title, body) => setModalInfo({ open: true, title, body });
  const closeModal = () => setModalInfo({ ...modalInfo, open: false });

  // Get total net worth from wallet data
  const totalNetWorth = wallet.net || 0;

  // Check if a position is active
  const isPositionActive = (position) => {
    return !(position.status === "EXITED" || position.status === "INACTIVE" || 
            position.quantity === 0 || position.Qty === 0);
  };

  // Modal bodies for cards
  const portfolioBody = (
    <div style={modalContentStyle}>
      <div style={metricRowStyle}>
        <div style={metricItemStyle}>
          <span style={metricLabelStyle}>Total Net Worth</span>
          <span style={metricValueStyle}>₹{totalNetWorth.toLocaleString()}</span>
        </div>
        <div style={metricItemStyle}>
          <span style={metricLabelStyle}>Invested Amount</span>
          <span style={metricValueStyle}>₹{investmentAmount.toLocaleString()}</span>
        </div>
      </div>
      <div style={metricRowStyle}>
        <div style={metricItemStyle}>
          <span style={metricLabelStyle}>Available Funds</span>
          <span style={metricValueStyle}>₹{(wallet.available?.cash || wallet.available?.live_balance || 0).toLocaleString()}</span>
        </div>
        <div style={metricItemStyle}>
          <span style={metricLabelStyle}>Total Returns</span>
          <div>
            <span style={{ ...metricValueStyle, color: totalPnL >= 0 ? "#16a34a" : "#dc2626" }}>
              {investmentAmount > 0 ? `${((totalPnL / investmentAmount) * 100).toFixed(2)}%` : "0%"}
            </span>
            <span style={{ ...metricSubValueStyle, color: totalPnL >= 0 ? "#16a34a" : "#dc2626" }}>
              {totalPnL >= 0 ? "+" : ""}₹{Math.abs(totalPnL).toFixed(2)}
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
        <span style={{ ...metricValueStyle, fontSize: "2.2rem" }}>₹{(wallet.available?.cash || wallet.available?.live_balance || 0).toLocaleString()}</span>
      </div>
      <div style={dividerStyle} />
      <div style={actionButtonsContainer}>
        <button style={actionButtonStyle("#3b82f6")}>Add Funds</button>
        <button style={actionButtonStyle("#10b981")}>Withdraw</button>
      </div>
    </div>
  );

  const pnlBody = (
    <div style={modalContentStyle}>
      <div style={largeMetricStyle}>
        <span style={metricLabelStyle}>Total P&L</span>
        <span style={{ ...metricValueStyle, color: totalPnL >= 0 ? "#16a34a" : "#dc2626", fontSize: "2.2rem" }}>
          {totalPnL >= 0 ? "+" : ""}₹{Math.abs(totalPnL).toFixed(2)}
        </span>
      </div>
      <div style={dividerStyle} />
      <div style={actionButtonsContainer}>
        <button 
          style={actionButtonStyle("#3b82f6")}
          onClick={() => window.location.reload()}
        >
          Refresh Data
        </button>
      </div>
    </div>
  );

  const investmentBody = (
    <div style={modalContentStyle}>
      <div style={largeMetricStyle}>
        <span style={metricLabelStyle}>Total Investment</span>
        <span style={{ ...metricValueStyle, fontSize: "2.2rem" }}>₹{investmentAmount.toLocaleString()}</span>
      </div>
      <div style={dividerStyle} />
      <div style={metricRowStyle}>
        <div style={metricItemStyle}>
          <span style={metricLabelStyle}>Active Positions</span>
          <span style={metricValueStyle}>{positions.filter(p => isPositionActive(p)).length}</span>
        </div>
        <div style={metricItemStyle}>
          <span style={metricLabelStyle}>Total Positions</span>
          <span style={metricValueStyle}>{positions.length}</span>
        </div>
      </div>
    </div>
  );

  const cardCommon = {
    flex: "1 1 160px",
    minWidth: 160,
    borderRadius: 13,
    padding: "1rem 1.3rem",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    minHeight: 100
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "1rem" }}>
      <div style={paperStyle}>
        <h1 style={titleStyle}>Dashboard Overview</h1>
        
        {/* Summary Cards */}
        <div style={cardRowStyle}>
          {/* P&L Card */}
          <div
            style={{ ...cardCommon, background: "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)" }}
            onClick={() => openModal("P&L Overview", pnlBody)}
          >
            <div style={cardLabelStyle("#065f46")}>Total P&L</div>
            {loading ? (
              <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '40px'}}>
                <span>Loading...</span>
              </div>
            ) : (
              <div style={{ 
                ...cardValueStyle, 
                color: totalPnL >= 0 ? "#065f46" : "#b91c1c"
              }}>
                {totalPnL >= 0 ? "+" : ""}₹{Math.abs(totalPnL).toFixed(2)}
              </div>
            )}
          </div>
          
          {/* Net Worth Card */}
          <div
            style={{ ...cardCommon, background: "linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 100%)" }}
            onClick={() => openModal("Net Worth Details", portfolioBody)}
          >
            <div style={cardLabelStyle("#00838f")}>Total Net Worth</div>
            <div style={cardValueStyle}>₹{totalNetWorth.toLocaleString()}</div>
            <div style={{ fontSize: 14, color: "#00838f", marginTop: 4 }}>
              {positions.filter(p => isPositionActive(p)).length} active positions
            </div>
          </div>
          
          {/* Investment Amount Card */}
          <div
            style={{ ...cardCommon, background: "linear-gradient(135deg, #ede7f6 0%, #d1c4e9 100%)" }}
            onClick={() => openModal("Investment Details", investmentBody)}
          >
            <div style={cardLabelStyle("#5e35b1")}>Investment Amount</div>
            <div style={cardValueStyle}>₹{investmentAmount.toLocaleString()}</div>
            <div style={{ fontSize: 14, color: "#5e35b1", marginTop: 4 }}>
              {positions.length} total positions
            </div>
          </div>
          
          {/* Available Funds Card */}
          <div
            style={{ ...cardCommon, background: "linear-gradient(135deg, #fff9c4 0%, #fff176 100%)" }}
            onClick={() => openModal("Available Funds", fundsBody)}
          >
            <div style={cardLabelStyle("#999022")}>Available Funds</div>
            <div style={cardValueStyle}>₹{(wallet.available?.cash || wallet.available?.live_balance || 0).toLocaleString()}</div>
          </div>
        </div>

        {/* Positions Table */}
        <SectionTable
          title="All Positions"
          headers={["Symbol", "Quantity", "Avg Price", "LTP", "P&L", "Status"]}
          rows={positions.map(p => {
            const isActive = isPositionActive(p);
            return [
              p.tradingsymbol || p.Symbol,
              p.quantity || p.Qty,
              `₹${(p.average_price || p.Avg_price || 0).toFixed(2)}`,
              `₹${(p.last_price || p.ltp || 0).toFixed(2)}`,
              <span style={{ 
                color: (p.pnl || 0) >= 0 ? "#16a34a" : "#dc2626",
                fontWeight: 500
              }}>
                {`${(p.pnl || 0) >= 0 ? "+" : ""}₹${Math.abs(p.pnl || 0).toFixed(2)}`}
              </span>,
              <span style={{
                color: isActive ? "#1f2937" : "#6b7280",
                fontWeight: isActive ? "600" : "normal",
                fontStyle: isActive ? "normal" : "italic"
              }}>
                {isActive ? "ACTIVE" : "INACTIVE"}
              </span>
            ];
          })}
          onRowClick={idx => {
            const p = positions[idx];
            const isActive = isPositionActive(p);
            openModal(
              `Position • ${p.tradingsymbol || p.Symbol}`,
              <div style={positionDetailStyle}>
                <div style={positionHeaderStyle}>
                  <span style={{...symbolStyle, color: isActive ? "#1f2937" : "#6b7280"}}>
                    {p.tradingsymbol || p.Symbol}
                    {!isActive && <span style={{fontSize: "0.8rem", marginLeft: "0.5rem"}}>(Inactive)</span>}
                  </span>
                  <span style={{...qtyStyle, color: isActive ? "#6b7280" : "#9ca3af"}}>
                    {p.quantity || p.Qty} Shares
                  </span>
                </div>
                <div style={positionMetricsStyle}>
                  <div style={metricCardStyle(isActive ? "#e3f2fd" : "#f3f4f6")}>
                    <span style={{...metricCardLabel, color: isActive ? "#6b7280" : "#9ca3af"}}>Avg. Price</span>
                    <span style={{...metricCardValue, color: isActive ? "#1f2937" : "#6b7280"}}>
                      ₹{(p.average_price || p.Avg_price || 0).toFixed(2)}
                    </span>
                  </div>
                  <div style={metricCardStyle(isActive ? "#e8f5e9" : "#f3f4f6")}>
                    <span style={{...metricCardLabel, color: isActive ? "#6b7280" : "#9ca3af"}}>LTP</span>
                    <span style={{...metricCardValue, color: isActive ? "#1f2937" : "#6b7280"}}>
                      ₹{(p.last_price || p.ltp || 0).toFixed(2)}
                    </span>
                  </div>
                  <div style={metricCardStyle(isActive ? (p.pnl >= 0 ? "#e8f5e9" : "#ffebee") : "#f3f4f6")}>
                    <span style={{...metricCardLabel, color: isActive ? "#6b7280" : "#9ca3af"}}>P&L</span>
                    <span style={{ 
                      ...metricCardValue, 
                      color: isActive ? (p.pnl >= 0 ? "#2e7d32" : "#c62828") : "#6b7280"
                    }}>
                      {p.pnl >= 0 ? "+" : ""}₹{(p.pnl || 0).toFixed(2)}
                    </span>
                  </div>
                </div>
                <div style={additionalInfoStyle}>
                  <pre style={{ 
                    whiteSpace: "pre-wrap", 
                    fontFamily: "inherit", 
                    fontSize: "0.9rem",
                    color: isActive ? "#1f2937" : "#6b7280"
                  }}>
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
            o.tradingsymbol || o.symbol,
            <span style={tradeTypeStyle(o.transaction_type || o.type)}>
              {o.transaction_type || o.type}
            </span>,
            o.quantity || o.qty,
            `₹${o.price?.toFixed(2) ?? "--"}`,
            <span style={statusStyle(o.status)}>{o.status}</span>
          ])}
          onRowClick={idx => {
            const o = orders[idx];
            openModal(
              `Trade • ${o.tradingsymbol || o.symbol}`,
              <div style={tradeDetailStyle}>
                <div style={tradeHeaderStyle}>
                  <span style={tradeSymbolStyle}>{o.tradingsymbol || o.symbol}</span>
                  <span style={tradeTypeTagStyle(o.transaction_type || o.type)}>
                    {o.transaction_type || o.type}
                  </span>
                </div>
                <div style={tradeMetricsStyle}>
                  <div style={tradeMetricRow}>
                    <span style={tradeMetricLabel}>Quantity:</span>
                    <span style={tradeMetricValue}>{o.quantity || o.qty}</span>
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
                  key={index}
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
              rows.map((cells, rIdx) => {
                // Check if this row represents an inactive position
                const isInactive = cells[5] && cells[5].props.children === "INACTIVE";
                return (
                  <tr
                    key={rIdx}
                    style={{
                      cursor: "pointer",
                      backgroundColor: rIdx % 2 === 0 ? "#ffffff" : "#f9fafb",
                      transition: "background-color 0.2s ease",
                      opacity: isInactive ? 0.7 : 1
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
                          fontWeight: cIdx === 0 ? "600" : "normal",
                          color: isInactive ? "#6b7280" : "#1f2937"
                        }}
                      >
                        {c}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Styles with media queries for responsiveness
const paperStyle = {
  width: "100%",
  maxWidth: "1200px",
  backgroundColor: "white",
  borderRadius: "12px",
  padding: "2rem",
  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
  "@media (max-width: 768px)": {
    padding: "1rem",
    borderRadius: "8px"
  }
};

const titleStyle = {
  fontSize: "1.8rem",
  fontWeight: "700",
  color: "#1f2937",
  marginBottom: "2rem",
  textAlign: "center",
  "@media (max-width: 768px)": {
    fontSize: "1.5rem",
    marginBottom: "1.5rem"
  }
};

const subTitleStyle = {
  fontSize: "1.3rem",
  fontWeight: "600",
  color: "#374151",
  marginBottom: "1rem",
  "@media (max-width: 768px)": {
    fontSize: "1.1rem"
  }
};

const cardRowStyle = {
  display: "flex",
  gap: "1.2rem",
  marginBottom: "2.5rem",
  flexWrap: "wrap",
  "@media (max-width: 768px)": {
    gap: "1rem",
    marginBottom: "2rem",
    flexDirection: "column"
  }
};

const cardLabelStyle = (color) => ({
  fontSize: "0.9rem",
  fontWeight: "600",
  color: color,
  marginBottom: "0.5rem",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
  "@media (max-width: 768px)": {
    fontSize: "0.8rem"
  }
});

const cardValueStyle = {
  fontSize: "1.5rem",
  fontWeight: "700",
  color: "#1f2937",
  "@media (max-width: 768px)": {
    fontSize: "1.2rem"
  }
};

const tableWrapperStyle = {
  border: "1px solid #e5e7eb",
  borderRadius: "10px",
  overflow: "hidden",
  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
  overflowX: "auto",
  "@media (max-width: 768px)": {
    borderRadius: "8px"
  }
};

const headerRowStyle = {
  backgroundColor: "#f9fafb"
};

const thStyle = {
  padding: "0.9rem 1rem",
  textAlign: "left",
  fontWeight: "600",
  color: "#374151",
  fontSize: "0.9rem",
  borderBottom: "1px solid #e5e7eb",
  backgroundColor: "#f3f4f6",
  "@media (max-width: 768px)": {
    padding: "0.7rem 0.8rem",
    fontSize: "0.8rem"
  }
};

const tdStyle = {
  padding: "0.9rem 1rem",
  borderBottom: "1px solid #e5e7eb",
  fontSize: "0.95rem",
  "@media (max-width: 768px)": {
    padding: "0.7rem 0.8rem",
    fontSize: "0.85rem"
  }
};

const emptyCellStyle = {
  padding: "2rem",
  textAlign: "center",
  color: "#6b7280",
  fontStyle: "italic",
  "@media (max-width: 768px)": {
    padding: "1.5rem"
  }
};

const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
  padding: "1rem",
  "@media (max-width: 768px)": {
    padding: "0.5rem"
  }
};

const modalStyle = {
  backgroundColor: "white",
  borderRadius: "12px",
  width: "90%",
  maxWidth: "600px",
  maxHeight: "80vh",
  overflow: "hidden",
  boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
  "@media (max-width: 768px)": {
    width: "95%",
    borderRadius: "8px"
  }
};

const modalHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "1.2rem 1.5rem",
  borderBottom: "1px solid #e5e7eb",
  backgroundColor: "#f9fafb",
  "@media (max-width: 768px)": {
    padding: "1rem"
  }
};

const modalTitleStyle = {
  fontSize: "1.2rem",
  fontWeight: "600",
  color: "#1f2937",
  margin: 0,
  "@media (max-width: 768px)": {
    fontSize: "1rem"
  }
};

const closeBtnStyle = {
  background: "none",
  border: "none",
  fontSize: "1.5rem",
  cursor: "pointer",
  color: "#6b7280",
  padding: 0,
  width: "30px",
  height: "30px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: "50%",
  "@media (max-width: 768px)": {
    fontSize: "1.3rem",
    width: "25px",
    height: "25px"
  }
};

const modalContentWrapperStyle = {
  padding: "0",
  maxHeight: "calc(80vh - 65px)",
  overflowY: "auto"
};

const modalContentStyle = {
  padding: "1.5rem",
  "@media (max-width: 768px)": {
    padding: "1rem"
  }
};

const metricRowStyle = {
  display: "flex",
  gap: "1.5rem",
  marginBottom: "1.5rem",
  "@media (max-width: 768px)": {
    flexDirection: "column",
    gap: "1rem"
  }
};

const metricItemStyle = {
  flex: 1,
  padding: "1.2rem",
  borderRadius: "8px",
  backgroundColor: "#f9fafb",
  border: "1px solid #e5e7eb",
  "@media (max-width: 768px)": {
    padding: "1rem"
  }
};

const metricLabelStyle = {
  display: "block",
  fontSize: "0.85rem",
  fontWeight: "600",
  color: "#6b7280",
  marginBottom: "0.5rem",
  textTransform: "uppercase"
};

const metricValueStyle = {
  display: "block",
  fontSize: "1.5rem",
  fontWeight: "700",
  color: "#1f2937",
  "@media (max-width: 768px)": {
    fontSize: "1.3rem"
  }
};

const metricSubValueStyle = {
  display: "block",
  fontSize: "1rem",
  fontWeight: "600",
  marginTop: "0.3rem"
};

const largeMetricStyle = {
  textAlign: "center",
  padding: "1.5rem",
  borderRadius: "8px",
  backgroundColor: "#f9fafb",
  border: "1px solid #e5e7eb",
  marginBottom: "1.5rem",
  "@media (max-width: 768px)": {
    padding: "1rem"
  }
};

const dividerStyle = {
  height: "1px",
  backgroundColor: "#e5e7eb",
  margin: "1.5rem 0"
};

const infoTextStyle = {
  fontSize: "0.9rem",
  color: "#6b7280",
  textAlign: "center",
  fontStyle: "italic",
  margin: 0
};

const actionButtonsContainer = {
  display: "flex",
  gap: "1rem",
  justifyContent: "center",
  "@media (max-width: 768px)": {
    flexDirection: "column"
  }
};

const actionButtonStyle = (color) => ({
  padding: "0.7rem 1.5rem",
  backgroundColor: color,
  color: "white",
  border: "none",
  borderRadius: "6px",
  fontWeight: "600",
  cursor: "pointer",
  transition: "all 0.2s ease",
  ":hover": {
    opacity: 0.9
  },
  "@media (max-width: 768px)": {
    padding: "0.6rem 1rem"
  }
});

const positionDetailStyle = {
  padding: "0.5rem"
};

const positionHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "1.5rem",
  "@media (max-width: 768px)": {
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "0.5rem"
  }
};

const symbolStyle = {
  fontSize: "1.4rem",
  fontWeight: "700",
  color: "#1f2937",
  "@media (max-width: 768px)": {
    fontSize: "1.2rem"
  }
};

const qtyStyle = {
  fontSize: "1rem",
  color: "#6b7280",
  fontWeight: "500"
};

const positionMetricsStyle = {
  display: "flex",
  gap: "1rem",
  marginBottom: "1.5rem",
  "@media (max-width: 768px)": {
    flexDirection: "column"
  }
};

const metricCardStyle = (bgColor) => ({
  flex: 1,
  padding: "1rem",
  borderRadius: "8px",
  backgroundColor: bgColor,
  textAlign: "center",
  "@media (max-width: 768px)": {
    padding: "0.8rem"
  }
});

const metricCardLabel = {
  display: "block",
  fontSize: "0.8rem",
  color: "#6b7280",
  marginBottom: "0.5rem"
};

const metricCardValue = {
  display: "block",
  fontSize: "1.2rem",
  fontWeight: "700",
  color: "#1f2937",
  "@media (max-width: 768px)": {
    fontSize: "1.1rem"
  }
};

const additionalInfoStyle = {
  padding: "1rem",
  backgroundColor: "#f9fafb",
  borderRadius: "8px",
  border: "1px solid #e5e7eb",
  maxHeight: "200px",
  overflowY: "auto",
  "@media (max-width: 768px)": {
    padding: "0.8rem",
    maxHeight: "150px"
  }
};

const tradeDetailStyle = {
  padding: "0.5rem"
};

const tradeHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "1.5rem",
  "@media (max-width: 768px)": {
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "0.5rem"
  }
};

const tradeSymbolStyle = {
  fontSize: "1.4rem",
  fontWeight: "700",
  color: "#1f2937",
  "@media (max-width: 768px)": {
    fontSize: "1.2rem"
  }
};

const tradeTypeTagStyle = (type) => ({
  padding: "0.4rem 0.8rem",
  borderRadius: "20px",
  backgroundColor: type === "BUY" ? "#dcfce7" : "#fee2e2",
  color: type === "BUY" ? "#166534" : "#991b1b",
  fontSize: "0.8rem",
  fontWeight: "600"
});

const tradeMetricsStyle = {
  marginBottom: "1.5rem"
};

const tradeMetricRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "0.7rem 0",
  borderBottom: "1px solid #f3f4f6"
};

const tradeMetricLabel = {
  fontSize: "0.95rem",
  color: "#6b7280",
  fontWeight: "500"
};

const tradeMetricValue = {
  fontSize: "1rem",
  fontWeight: "600",
  color: "#1f2937"
};

const tradeAdditionalInfo = {
  padding: "1rem",
  backgroundColor: "#f9fafb",
  borderRadius: "8px",
  border: "1px solid #e5e7eb",
  maxHeight: "200px",
  overflowY: "auto",
  "@media (max-width: 768px)": {
    padding: "0.8rem",
    maxHeight: "150px"
  }
};

const tradeTypeStyle = (type) => ({
  padding: "0.3rem 0.6rem",
  borderRadius: "4px",
  backgroundColor: type === "BUY" ? "#dcfce7" : "#fee2e2",
  color: type === "BUY" ? "#166534" : "#991b1b",
  fontSize: "0.8rem",
  fontWeight: "600"
});

const statusStyle = (status) => ({
  padding: "0.3rem 0.6rem",
  borderRadius: "4px",
  backgroundColor: status === "COMPLETE" ? "#dcfce7" : "#ffedd5",
  color: status === "COMPLETE" ? "#166534" : "#9a3412",
  fontSize: "0.8rem",
  fontWeight: "600"
});



