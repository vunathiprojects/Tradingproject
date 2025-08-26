import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase"; // Ensure this path is correct for your project structure
import { ref, onValue, off } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";

// Custom hook for responsive media queries
const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(window.matchMedia(query).matches);

  useEffect(() => {
    const media = window.matchMedia(query);
    const listener = () => setMatches(media.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [query]);

  return matches;
};

// Helper function to format timestamps properly
const formatTimestamp = (timestamp, isMobile = false) => {
  if (!timestamp) return "--";
  
  const date = new Date(timestamp);
  const now = new Date();
  const diffInHours = (now - date) / (1000 * 60 * 60);
  
  // If it's today, show time with AM/PM
  if (diffInHours < 24 && date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  }
  
  // If it's within a week, show day and time
  if (diffInHours < 168) { // 7 days
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }
  
  // For older dates, show full date
  if (isMobile) {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  }
  
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
};

// TradingView Widget Component
function TradingViewWidget({ symbol }) {
  useEffect(() => {
    const containerId = "tradingview_chart_container";
    
    const createWidget = () => {
      if (document.getElementById(containerId) && 'TradingView' in window) {
        document.getElementById(containerId).innerHTML = ''; // Clear previous widget
        new window.TradingView.widget({
          autosize: true,
          symbol: symbol,
          interval: "D",
          timezone: "Etc/UTC",
          theme: "light",
          style: "1",
          locale: "en",
          toolbar_bg: "#f1f3f6",
          enable_publishing: false,
          allow_symbol_change: true,
          container_id: containerId
        });
      }
    };

    if (!window.TradingView) {
      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/tv.js";
      script.async = true;
      script.onload = createWidget;
      document.body.appendChild(script);
      
      return () => {
        document.body.removeChild(script);
      };
    } else {
      createWidget();
    }
    
  }, [symbol]);

  return (
    <div style={{ height: "400px", marginTop: "1rem", width: "100%" }}>
      <div id="tradingview_chart_container" style={{ height: "100%", width: "100%" }}></div>
    </div>
  );
}

// Modal component
function DetailModal({ open, onClose, title, children }) {
  const isMobile = useMediaQuery("(max-width: 768px)");

  if (!open) return null;

  return (
    <div style={overlayStyle(isMobile)}>
      <div style={modalStyle(isMobile)}>
        <div style={modalHeaderStyle(isMobile)}>
          <h3 style={modalTitleStyle(isMobile)}>{title}</h3>
          <button onClick={onClose} style={closeBtnStyle(isMobile)}>×</button>
        </div>
        <div style={modalContentWrapperStyle(isMobile)}>{children}</div>
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
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
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
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!userId) {
      setWallet({});
      setPositions([]);
      setOrders([]);
      setPnlData({});
      setTotalPnL(0);
      return;
    };

    setLoading(true);
    const walletRef = ref(db, "wallet");
    const positionsRef = ref(db, "open_positions");
    const tradesRef = ref(db, "executed_trades");
    const pnlRef = ref(db, "pnl_data");

    const unsubWallet = onValue(walletRef, (snap) => setWallet(snap.val() || {}));
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

  const openModal = (title, body) => setModalInfo({ open: true, title, body });
  const closeModal = () => setModalInfo({ ...modalInfo, open: false });

  const totalNetWorth = wallet.net || 0;

  const isPositionActive = (position) => {
    const status = (position.status || '').toUpperCase();
    const quantity = position.quantity || position.Qty || 0;
    if (quantity === 0) return false;
    if (status === "EXITED" || status === "INACTIVE") return false;
    return true;
  };

  const activePositions = positions.filter(isPositionActive);
  const allPositions = positions;

  const portfolioBody = (
    <div style={modalContentStyle(isMobile)}>
      <div style={metricRowStyle(isMobile)}>
        <div style={metricItemStyle(isMobile)}><span style={metricLabelStyle}>Total Net Worth</span><span style={metricValueStyle(isMobile)}>₹{totalNetWorth.toLocaleString()}</span></div>
        <div style={metricItemStyle(isMobile)}><span style={metricLabelStyle}>Invested Amount</span><span style={metricValueStyle(isMobile)}>₹{investmentAmount.toLocaleString()}</span></div>
      </div>
      <div style={metricRowStyle(isMobile)}>
        <div style={metricItemStyle(isMobile)}><span style={metricLabelStyle}>Opening Funds</span><span style={metricValueStyle(isMobile)}>₹{(wallet.available?.cash || wallet.available?.live_balance || 0).toLocaleString()}</span></div>
        <div style={metricItemStyle(isMobile)}>
          <span style={metricLabelStyle}>Total Returns</span>
          <div>
            <span style={{ ...metricValueStyle(isMobile), color: totalPnL >= 0 ? "#16a34a" : "#dc2626" }}>{investmentAmount > 0 ? `${((totalPnL / investmentAmount) * 100).toFixed(2)}%` : "0%"}</span>
            <span style={{ ...metricSubValueStyle, color: totalPnL >= 0 ? "#16a34a" : "#dc2626" }}>{totalPnL >= 0 ? "+" : ""}₹{Math.abs(totalPnL).toFixed(2)}</span>
          </div>
        </div>
      </div>
      <div style={dividerStyle} /><p style={infoTextStyle}>Click on any position below to view detailed breakdown</p>
    </div>
  );

  const fundsBody = (
    <div style={modalContentStyle(isMobile)}>
      <div style={largeMetricStyle(isMobile)}>
        <span style={metricLabelStyle}>Opening Balance</span>
        <span style={{ ...metricValueStyle(isMobile), fontSize: isMobile ? "1.8rem" : "2.2rem" }}>₹{(wallet.available?.cash || wallet.available?.live_balance || 0).toLocaleString()}</span>
      </div>
      <div style={dividerStyle} />

    </div>
  );

  const pnlBody = (
    <div style={modalContentStyle(isMobile)}>
      <div style={largeMetricStyle(isMobile)}>
        <span style={metricLabelStyle}>Total P&L</span>
        <span style={{ ...metricValueStyle(isMobile), color: totalPnL >= 0 ? "#16a34a" : "#dc2626", fontSize: isMobile ? "1.8rem" : "2.2rem" }}>{totalPnL >= 0 ? "+" : ""}₹{Math.abs(totalPnL).toFixed(2)}</span>
      </div>
      <div style={dividerStyle} />
      <div style={actionButtonsContainer(isMobile)}><button style={actionButtonStyle("#3b82f6", isMobile)} onClick={() => window.location.reload()}>Refresh Data</button></div>
    </div>
  );

  const investmentBody = (
    <div style={modalContentStyle(isMobile)}>
      <div style={largeMetricStyle(isMobile)}>
        <span style={metricLabelStyle}>Total Investment</span>
        <span style={{ ...metricValueStyle(isMobile), fontSize: isMobile ? "1.8rem" : "2.2rem" }}>₹{investmentAmount.toLocaleString()}</span>
      </div>
      <div style={dividerStyle} />
      <div style={metricRowStyle(isMobile)}>
        <div style={metricItemStyle(isMobile)}><span style={metricLabelStyle}>Active Positions</span><span style={metricValueStyle(isMobile)}>{activePositions.length}</span></div>
        <div style={metricItemStyle(isMobile)}><span style={metricLabelStyle}>Total Positions</span><span style={metricValueStyle(isMobile)}>{positions.length}</span></div>
      </div>
    </div>
  );
  
  const cardCommon = { flex: "1 1 160px", minWidth: 160, borderRadius: 13, padding: "1rem 1.3rem", cursor: "pointer", transition: "all 0.3s ease", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", minHeight: 100 };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "1rem" }}>
      <div style={paperStyle(isMobile)}>
        <h1 style={titleStyle(isMobile)}>Dashboard Overview</h1>
        
        <div style={cardRowStyle(isMobile)}>
          <div style={{ ...cardCommon, background: "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)" }}>
            <div style={cardLabelStyle("#065f46", isMobile)}>Total P&L</div>
            {loading ? <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '40px'}}><span>Loading...</span></div> : (
              <div style={{ ...cardValueStyle(isMobile), color: totalPnL >= 0 ? "#065f46" : "#b91c1c" }}>{totalPnL >= 0 ? "+" : ""}₹{Math.abs(totalPnL).toFixed(2)}</div>
            )}
          </div>
          
          <div style={{ ...cardCommon, background: "linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 100%)" }}>
            <div style={cardLabelStyle("#00838f", isMobile)}>Total Net Worth</div>
            <div style={cardValueStyle(isMobile)}>₹{totalNetWorth.toLocaleString()}</div>
            <div style={{ fontSize: 14, color: "#00838f", marginTop: 4 }}>{activePositions.length} active positions</div>
          </div>
          
          <div style={{ ...cardCommon, background: "linear-gradient(135deg, #ede7f6 0%, #d1c4e9 100%)" }}>
             <div style={cardLabelStyle("#5e35b1", isMobile)}>Investment Amount</div>
            <div style={cardValueStyle(isMobile)}>₹{investmentAmount.toLocaleString()}</div> 
            <div style={{ fontSize: 14, color: "#5e35b1", marginTop: 4 }}>{positions.length} total positions</div>
          </div>
          
          <div style={{ ...cardCommon, background: "linear-gradient(135deg, #fff9c4 0%, #fff176 100%)" }}>
            <div style={cardLabelStyle("#999022", isMobile)}>Opening Funds</div>
            <div style={cardValueStyle(isMobile)}>₹{(wallet.available?.cash || wallet.available?.live_balance || 0).toLocaleString()}</div>
          </div>
        </div>

        <SectionTable
          title="All Positions"
          headers={["Symbol", "Quantity", "Avg Price", "LTP", "P&L", "Status"]}
          isMobile={isMobile}
          rows={allPositions.map(p => {
              const isActive = isPositionActive(p);
              const statusText = isActive ? 'ACTIVE' : 'INACTIVE';
              const statusColor = isActive ? "#16a34a" : "#6b7280";
              return {
                isActive: isActive,
                cells: [
                  p.tradingsymbol || p.Symbol,
                  p.quantity || p.Qty,
                  `₹${(p.average_price || p.Avg_price || 0).toFixed(2)}`,
                  `₹${(p.last_price || p.ltp || 0).toFixed(2)}`,
                  <span style={{ color: (p.pnl || 0) >= 0 ? "#16a34a" : "#dc2626", fontWeight: 500 }}>{`${(p.pnl || 0) >= 0 ? "+" : ""}₹${Math.abs(p.pnl || 0).toFixed(2)}`}</span>,
                  <span style={{ color: statusColor, fontWeight: "600" }}>{statusText}</span>
                ]
              };
            }
          )}
          onRowClick={idx => {
            const p = allPositions[idx];
            const isActive = isPositionActive(p);
            const statusText = isActive ? 'ACTIVE' : 'INACTIVE';
            const positionStatusTagStyle = {
                padding: '0.4rem 0.8rem',
                borderRadius: '20px',
                backgroundColor: isActive ? '#dcfce7' : '#f3f4f6',
                color: isActive ? '#166534' : '#374151',
                fontSize: '0.8rem',
                fontWeight: '600',
            };

            openModal( `Position • ${p.tradingsymbol || p.Symbol}`,
              <div>
                <div style={tradeHeaderStyle(isMobile)}>
                    <span style={tradeSymbolStyle(isMobile)}>{p.tradingsymbol || p.Symbol}</span>
                    <span style={positionStatusTagStyle}>{statusText}</span>
                </div>
                <div style={tradeMetricsStyle}>
                    <div style={tradeMetricRow}><span style={tradeMetricLabel}>Quantity:</span><span style={tradeMetricValue}>{p.quantity || p.Qty}</span></div>
                    <div style={tradeMetricRow}><span style={tradeMetricLabel}>Average Price:</span><span style={tradeMetricValue}>₹{(p.average_price || p.Avg_price || 0).toFixed(2)}</span></div>
                    <div style={tradeMetricRow}><span style={tradeMetricLabel}>Last Price:</span><span style={tradeMetricValue}>₹{(p.last_price || p.ltp || 0).toFixed(2)}</span></div>
                    <div style={tradeMetricRow}>
                        <span style={tradeMetricLabel}>P&L:</span>
                        <span style={{ ...tradeMetricValue, color: (p.pnl || 0) >= 0 ? '#16a34a' : '#dc2626' }}>
                            {(p.pnl || 0) >= 0 ? '+' : ''}₹{Math.abs(p.pnl || 0).toFixed(2)}
                        </span>
                    </div>
                    {(p.timestamp || p.created_at || p.entry_time) && (
                      <div style={tradeMetricRow}>
                        <span style={tradeMetricLabel}>Entry Time:</span>
                        <span style={tradeMetricValue}>{formatTimestamp(p.timestamp || p.created_at || p.entry_time, isMobile)}</span>
                      </div>
                    )}
                </div>
                <TradingViewWidget symbol={p.tradingsymbol || p.Symbol} />
              </div>
            );
          }}
        />

        <SectionTable
          title="Recent Trades"
          isMobile={isMobile}
          headers={["Time", "Symbol", "Type", "Qty", "Price", "Status"]}
          rows={orders.slice(0, 8).map(o => ({
            cells: [
              formatTimestamp(o.timestamp || o.order_timestamp || o.fill_timestamp || o.created_at, isMobile),
              o.tradingsymbol || o.symbol,
              <span style={tradeTypeStyle(o.transaction_type || o.type)}>{o.transaction_type || o.type}</span>,
              o.quantity || o.qty, 
              `₹${o.price?.toFixed(2) ?? "--"}`,
              <span style={statusStyle("COMPLETE")}>COMPLETED</span>
            ]
          }))}
          onRowClick={idx => {
            const o = orders[idx];
            openModal( `Trade • ${o.tradingsymbol || o.symbol}`,
              <div>
                <div style={tradeHeaderStyle(isMobile)}>
                  <span style={tradeSymbolStyle(isMobile)}>{o.tradingsymbol || o.symbol}</span>
                  <span style={tradeTypeTagStyle(o.transaction_type || o.type)}>{o.transaction_type || o.type}</span>
                </div>
                <div style={tradeMetricsStyle}>
                  <div style={tradeMetricRow}><span style={tradeMetricLabel}>Quantity:</span><span style={tradeMetricValue}>{o.quantity || o.qty}</span></div>
                  <div style={tradeMetricRow}><span style={tradeMetricLabel}>Price:</span><span style={tradeMetricValue}>₹{o.price?.toFixed(2) ?? "--"}</span></div>
                  <div style={tradeMetricRow}><span style={tradeMetricLabel}>Status:</span><span style={{ ...tradeMetricValue, ...statusStyle("COMPLETE") }}>COMPLETED</span></div>
                  <div style={tradeMetricRow}>
                    <span style={tradeMetricLabel}>Time:</span>
                    <span style={tradeMetricValue}>{formatTimestamp(o.timestamp || o.order_timestamp || o.fill_timestamp || o.created_at)}</span>
                  </div>
                  {(o.order_id || o.trade_id) && (
                    <div style={tradeMetricRow}>
                      <span style={tradeMetricLabel}>Order ID:</span>
                      <span style={tradeMetricValue}>{o.order_id || o.trade_id}</span>
                    </div>
                  )}
                </div>
                <TradingViewWidget symbol={o.tradingsymbol || o.symbol} />
              </div>
            );
          }}
        />
      </div>

      <DetailModal open={modalInfo.open} onClose={closeModal} title={modalInfo.title}>{modalInfo.body}</DetailModal>
    </div>
  );
}

function SectionTable({ title, headers, rows, onRowClick, isMobile }) {
  return (
    <div style={{ marginBottom: "2.5rem" }}>
      <h2 style={subTitleStyle(isMobile)}>{title}</h2>
      <div style={tableWrapperStyle(isMobile)}>
        <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0" }}>
          <thead>
            <tr style={headerRowStyle}>
              {headers.map((h, index) => (
                <th key={index} style={{...thStyle(isMobile), borderLeft: index === 0 ? "none" : "1px solid #e5e7eb", borderTopLeftRadius: index === 0 ? "10px" : "0", borderTopRightRadius: index === headers.length - 1 ? "10px" : "0" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {!rows || rows.length === 0 ? (
              <tr><td colSpan={headers.length} style={emptyCellStyle(isMobile)}>No Data Available</td></tr>
            ) : (
              rows.map((row, rIdx) => {
                  const isRowActive = row.isActive !== undefined ? row.isActive : true;
                  const rowStyle = {
                    cursor: "pointer",
                    backgroundColor: rIdx % 2 === 0 ? "#ffffff" : "#f9fafb",
                    transition: "all 0.3s ease",
                    opacity: isRowActive ? 1 : 0.6,
                  };

                  return (
                    <tr key={rIdx} style={rowStyle} onClick={() => onRowClick?.(rIdx)}>
                      {row.cells.map((c, cIdx) => (
                        <td key={cIdx} style={{...tdStyle(isMobile), borderLeft: cIdx === 0 ? "none" : "1px solid #e5e7eb", borderBottom: rIdx === rows.length - 1 ? "none" : "1px solid #e5e7eb", fontWeight: cIdx === 0 ? "600" : "normal", color: "#1f2937" }}>
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

// Styles
const paperStyle = isMobile => ({ width: "100%", maxWidth: "1200px", backgroundColor: "white", borderRadius: isMobile ? "8px" : "12px", padding: isMobile ? "1rem" : "2rem", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" });
const titleStyle = isMobile => ({ fontSize: isMobile ? "1.5rem" : "1.8rem", fontWeight: "700", color: "#1f2937", marginBottom: isMobile ? "1.5rem" : "2rem", textAlign: "center" });
const subTitleStyle = isMobile => ({ fontSize: isMobile ? "1.1rem" : "1.3rem", fontWeight: "600", color: "#374151", marginBottom: "1rem" });
const cardRowStyle = isMobile => ({ display: "flex", gap: isMobile ? "1rem" : "1.2rem", marginBottom: isMobile ? "2rem" : "2.5rem", flexWrap: "wrap", flexDirection: isMobile ? "column" : "row" });
const cardLabelStyle = (color, isMobile) => ({ fontSize: isMobile ? "0.8rem" : "0.9rem", fontWeight: "600", color, marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.5px" });
const cardValueStyle = isMobile => ({ fontSize: isMobile ? "1.2rem" : "1.5rem", fontWeight: "700", color: "#1f2937" });
const tableWrapperStyle = isMobile => ({ border: "1px solid #e5e7eb", borderRadius: isMobile ? "8px" : "10px", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", overflowX: "auto" });
const headerRowStyle = { backgroundColor: "#f9fafb" };
const thStyle = isMobile => ({ padding: isMobile ? "0.7rem 0.8rem" : "0.9rem 1rem", textAlign: "left", fontWeight: "600", color: "#374151", fontSize: isMobile ? "0.8rem" : "0.9rem", borderBottom: "1px solid #e5e7eb", backgroundColor: "#f3f4f6" });
const tdStyle = isMobile => ({ padding: isMobile ? "0.7rem 0.8rem" : "0.9rem 1rem", borderBottom: "1px solid #e5e7eb", fontSize: isMobile ? "0.85rem" : "0.95rem" });
const emptyCellStyle = isMobile => ({ padding: isMobile ? "1.5rem" : "2rem", textAlign: "center", color: "#6b7280", fontStyle: "italic" });
const overlayStyle = isMobile => ({ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000, padding: isMobile ? "0.5rem" : "1rem" });
const modalStyle = isMobile => ({ backgroundColor: "white", borderRadius: isMobile ? "8px" : "12px", width: "90%", maxWidth: "800px", maxHeight: "90vh", overflow: "hidden", boxShadow: "0 10px 25px rgba(0,0,0,0.2)", display: "flex", flexDirection: "column" });
const modalHeaderStyle = isMobile => ({ display: "flex", justifyContent: "space-between", alignItems: "center", padding: isMobile ? "1rem" : "1.2rem 1.5rem", borderBottom: "1px solid #e5e7eb", backgroundColor: "#f9fafb", flexShrink: 0 });
const modalTitleStyle = isMobile => ({ fontSize: isMobile ? "1rem" : "1.2rem", fontWeight: "600", color: "#1f2937", margin: 0 });
const closeBtnStyle = isMobile => ({ background: "none", border: "none", fontSize: isMobile ? "1.3rem" : "1.5rem", cursor: "pointer", color: "#6b7280", padding: 0, width: isMobile ? "25px" : "30px", height: isMobile ? "25px" : "30px", display: "flex", justifyContent: "center", alignItems: "center", borderRadius: "50%" });
const modalContentWrapperStyle = isMobile => ({ overflowY: "auto", padding: isMobile ? "1rem" : "1.5rem" });
const modalContentStyle = isMobile => ({});
const metricRowStyle = isMobile => ({ display: "flex", gap: isMobile ? "1rem" : "1.5rem", marginBottom: "1.5rem", flexDirection: isMobile ? "column" : "row" });
const metricItemStyle = isMobile => ({ flex: 1, padding: isMobile ? "1rem" : "1.2rem", borderRadius: "8px", backgroundColor: "#f9fafb", border: "1px solid #e5e7eb" });
const metricLabelStyle = { display: "block", fontSize: "0.85rem", fontWeight: "600", color: "#6b7280", marginBottom: "0.5rem", textTransform: "uppercase" };
const metricValueStyle = isMobile => ({ display: "block", fontSize: isMobile ? "1.3rem" : "1.5rem", fontWeight: "700", color: "#1f2937" });
const metricSubValueStyle = { display: "block", fontSize: "1rem", fontWeight: "600", marginTop: "0.3rem" };
const largeMetricStyle = isMobile => ({ textAlign: "center", padding: isMobile ? "1rem" : "1.5rem", borderRadius: "8px", backgroundColor: "#f9fafb", border: "1px solid #e5e7eb", marginBottom: "1.5rem" });
const dividerStyle = { height: "1px", backgroundColor: "#e5e7eb", margin: "1.5rem 0" };
const infoTextStyle = { fontSize: "0.9rem", color: "#6b7280", textAlign: "center", fontStyle: "italic", margin: 0 };
const actionButtonsContainer = isMobile => ({ display: "flex", gap: "1rem", justifyContent: "center", flexDirection: isMobile ? "column" : "row" });
const actionButtonStyle = (color, isMobile) => ({ padding: isMobile ? "0.8rem 1.2rem" : "0.7rem 1.5rem", backgroundColor: color, color: "white", border: "none", borderRadius: "6px", fontWeight: "600", cursor: "pointer", transition: "all 0.2s ease" });
const tradeHeaderStyle = isMobile => ({ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexDirection: isMobile ? "column" : "row", alignItems: isMobile ? "flex-start" : "center", gap: isMobile ? "0.5rem" : "0" });
const tradeSymbolStyle = isMobile => ({ fontSize: isMobile ? "1.2rem" : "1.4rem", fontWeight: "700", color: "#1f2937" });
const tradeTypeTagStyle = type => ({ padding: "0.4rem 0.8rem", borderRadius: "20px", backgroundColor: type === "BUY" ? "#dcfce7" : "#fee2e2", color: type === "BUY" ? "#166534" : "#991b1b", fontSize: "0.8rem", fontWeight: "600" });
const tradeMetricsStyle = { marginBottom: "1.5rem" };
const tradeMetricRow = { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.7rem 0", borderBottom: "1px solid #f3f4f6" };
const tradeMetricLabel = { fontSize: "0.95rem", color: "#6b7280", fontWeight: "500" };
const tradeMetricValue = { fontSize: "1rem", fontWeight: "600", color: "#1f2937" };
const tradeTypeStyle = type => ({ padding: "0.3rem 0.6rem", borderRadius: "4px", backgroundColor: type === "BUY" ? "#dcfce7" : "#fee2e2", color: type === "BUY" ? "#166534" : "#991b1b", fontSize: "0.8rem", fontWeight: "600" });
const statusStyle = status => ({ padding: "0.3rem 0.6rem", borderRadius: "4px", backgroundColor: status === "COMPLETE" ? "#dcfce7" : "#ffedd5", color: status === "COMPLETE" ? "#166534" : "#9a3412", fontSize: "0.8rem", fontWeight: "600" });








