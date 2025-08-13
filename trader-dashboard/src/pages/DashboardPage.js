
// this is good //

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { db } from "../firebase";
import { ref, onValue } from "firebase/database";

// Memoized Modal component
const DetailModal = React.memo(({ open, onClose, title, children }) => {
  if (!open) return null;
  
  const overlayStyle = {
    position: "fixed",
    top: 0, left: 0, right: 0, bottom: 0,
    background: "rgba(0,0,0,0.35)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 50,
    backdropFilter: "blur(4px)"
  };
  
  const modalStyle = {
    background: "#fff",
    padding: "1.8rem 2rem",
    borderRadius: 16,
    width: "90%",
    maxWidth: 480,
    boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
    border: "1px solid rgba(255,255,255,0.2)"
  };
  
  const closeBtnStyle = {
    marginTop: 22,
    padding: "10px 18px",
    borderRadius: 8,
    border: "none",
    background: "#3b82f6",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "0.9rem",
    transition: "all 0.2s ease",
    "&:hover": {
      background: "#2563eb",
      transform: "translateY(-1px)"
    }
  };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <h3 style={{ marginBottom: 18, color: "#1f2937", fontSize: "1.4rem" }}>{title}</h3>
        <div style={{ maxHeight: 380, overflowY: "auto" }}>{children}</div>
        <button onClick={onClose} style={closeBtnStyle}>Close</button>
      </div>
    </div>
  );
});

// Memoized Table component
const SectionTable = React.memo(({ 
  title, 
  headers, 
  rows, 
  onRowClick,
  isLoading 
}) => {
  const subTitleStyle = {
    fontWeight: 700,
    fontSize: "1.3rem",
    marginBottom: 18,
    color: "#1f2937",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem"
  };
  
  const tableWrapperStyle = {
    overflowX: "auto",
    borderRadius: 12,
    boxShadow: "0 2px 10px rgba(60,60,60,0.08)",
    background: "#fafbfc",
    border: "1px solid #e5e7eb",
    maxHeight: 300,
    overflowY: "auto"
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
  
  const loadingCell = {
    padding: "22px 0",
    textAlign: "center",
    color: "#3b82f6",
    fontSize: "0.95rem"
  };

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
            {isLoading ? (
              <tr>
                <td colSpan={headers.length} style={loadingCell}>
                  Loading data...
                </td>
              </tr>
            ) : rows.length === 0 ? (
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
                    cursor: onRowClick ? "pointer" : "default",
                    backgroundColor: rIdx % 2 === 0 ? "#ffffff" : "#f9fafb"
                  }}
                  onClick={onRowClick ? () => onRowClick(rIdx) : undefined}
                >
                  {cells.map((c, cIdx) => (
                    <td
                      key={cIdx}
                      style={{
                        ...tdStyle,
                        borderLeft: cIdx === 0 ? "none" : "1px solid #e5e7eb",
                        borderBottom: rIdx === rows.length - 1 ? "none" : "1px solid #e5e7eb",
                        fontWeight: cIdx === 4 ? "600" : "normal"
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
});

export default function DashboardPage() {
  const [summary, setSummary] = useState({});
  const [allPositions, setAllPositions] = useState([]);
  const [orders, setOrders] = useState([]);
  const [modalInfo, setModalInfo] = useState({ 
    open: false, 
    title: "", 
    body: null 
  });
  const [isLoading, setIsLoading] = useState({
    positions: true,
    orders: true,
    summary: true
  });

  // Derived state
  const activePositions = useMemo(() => 
    allPositions.filter(p => p.quantity !== 0), 
    [allPositions]
  );
  
  const totalPnlToday = useMemo(() => 
    activePositions.reduce((sum, position) => sum + (position.pnl || 0), 0),
    [activePositions]
  );

  // Optimized Firebase listeners
  useEffect(() => {
    setIsLoading(prev => ({...prev, positions: true}));
    const positionsRef = ref(db, "dashboard/positions");
    
    const unsubscribePositions = onValue(positionsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const dataArray = Array.isArray(data) ? data : Object.values(data);
        const cleaned = dataArray.map(item => {
          const ltpValue = item.ltp || item.lastPrice || item.last_price || 0;
          
          return {
            tradingsymbol: item.tradingsymbol || item.tradingSymbol || "N/A",
            quantity: Number(item.quantity) || 0,
            average_price: Number(item.average_price || item.averagePrice) || 0,
            ltp: Number(ltpValue) || 0,
            pnl: Number(item.pnl || item.unrealised) || 0
          }
        });
        
        setAllPositions(cleaned);
      }
      setIsLoading(prev => ({...prev, positions: false}));
    });

    return unsubscribePositions;
  }, []);

  useEffect(() => {
    setIsLoading(prev => ({...prev, orders: true}));
    const tradesRef = ref(db, "trades");
    
    const unsubscribeTrades = onValue(tradesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const dataArray = Array.isArray(data) ? data : Object.values(data);
        const sorted = dataArray
          .map(trade => ({
            ...trade,
            timestamp: Number(trade.timestamp) || 0,
            price: Number(trade.price) || 0,
            qty: Number(trade.qty) || 0
          }))
          .sort((a, b) => b.timestamp - a.timestamp);
        
        setOrders(sorted.slice(0, 8));
      }
      setIsLoading(prev => ({...prev, orders: false}));
    });
   
    return unsubscribeTrades;
  }, []);

  useEffect(() => {
    setIsLoading(prev => ({...prev, summary: true}));
    const summaryRef = ref(db, "dashboard/summary");
    
    const unsubscribeSummary = onValue(summaryRef, (snapshot) => {
      const data = snapshot.val() || {};
      const convertedData = {
        ...data,
        portfolioValue: Number(data.portfolioValue) || 0,
        holdingsValue: Number(data.holdingsValue) || 0,
        funds: Number(data.funds) || 0,
        invested: Number(data.invested) || 0,
        totalReturnsPct: Number(data.totalReturnsPct) || 0,
        totalReturnsAmt: Number(data.totalReturnsAmt) || 0
      };
      
      setSummary(convertedData);
      setIsLoading(prev => ({...prev, summary: false}));
    });
    
    return unsubscribeSummary;
  }, []);

  // Memoized modal handlers
  const openModal = useCallback((title, body) => 
    setModalInfo({ open: true, title, body }), []);
    
  const closeModal = useCallback(() => 
    setModalInfo(prev => ({ ...prev, open: false })), []);

  // Memoized modal content
  const holdingsBody = useMemo(() => {
    const modalContentStyle = {
      padding: "0.5rem 0.2rem",
      display: "flex",
      flexDirection: "column",
      gap: "1.2rem"
    };
    
    const metricRowStyle = {
      display: "flex",
      gap: "1.5rem",
      justifyContent: "space-between"
    };
    
    const metricItemStyle = {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      gap: "0.3rem"
    };
    
    const metricLabelStyle = {
      fontSize: "0.9rem",
      color: "#6b7280",
      fontWeight: 500
    };
    
    const metricValueStyle = {
      fontSize: "1.4rem",
      fontWeight: 700,
      color: "#1f2937"
    };
    
    const metricSubValueStyle = {
      fontSize: "0.9rem",
      fontWeight: 500,
      marginLeft: "0.5rem"
    };
    
    const dividerStyle = {
      height: "1px",
      background: "#e5e7eb",
      width: "100%",
      margin: "0.2rem 0"
    };
    
    const infoTextStyle = {
      fontSize: "0.85rem",
      color: "#9ca3af",
      textAlign: "center",
      marginTop: "0.5rem"
    };

    return (
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
              <span style={{ ...metricValueStyle, color: (summary.totalReturnsPct || 0) >= 0 ? "#16a34a" : "#dc2626" }}>
                {(summary.totalReturnsPct || 0) >= 0 ? "+" : ""}{summary.totalReturnsPct ?? 0}%
              </span>
              <span style={{ ...metricSubValueStyle, color: (summary.totalReturnsAmt || 0) >= 0 ? "#16a34a" : "#dc2626" }}>
                {(summary.totalReturnsAmt || 0) >= 0 ? "+" : ""}₹{summary.totalReturnsAmt?.toLocaleString() ?? "0"}
              </span>
            </div>
          </div>
        </div>
        <div style={dividerStyle} />
        <p style={infoTextStyle}>Click on any position below to view detailed breakdown</p>
      </div>
    );
  }, [summary]);

  const fundsBody = useMemo(() => {
    const modalContentStyle = {
      padding: "0.5rem 0.2rem",
      display: "flex",
      flexDirection: "column",
      gap: "1.2rem"
    };
    
    const largeMetricStyle = {
      display: "flex",
      flexDirection: "column",
      gap: "0.5rem",
      alignItems: "center",
      marginBottom: "0.5rem"
    };
    
    const metricLabelStyle = {
      fontSize: "0.9rem",
      color: "#6b7280",
      fontWeight: 500
    };
    
    const metricValueStyle = {
      fontSize: "1.4rem",
      fontWeight: 700,
      color: "#1f2937"
    };
    
    const dividerStyle = {
      height: "1px",
      background: "#e5e7eb",
      width: "100%",
      margin: "0.2rem 0"
    };
    
    const actionButtonsContainer = {
      display: "flex",
      gap: "1rem",
      justifyContent: "center"
    };
    
    const actionButtonStyle = (bgColor) => ({
      padding: "0.5rem 1rem",
      borderRadius: "8px",
      border: "none",
      background: bgColor,
      color: "#fff",
      cursor: "pointer",
      fontWeight: 600,
      fontSize: "0.9rem",
      minWidth: "120px",
      transition: "all 0.2s ease",
      "&:hover": {
        opacity: 0.9,
        transform: "translateY(-1px)"
      }
    });

    return (
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
  }, [summary]);

  const pnlBody = useMemo(() => {
    const modalContentStyle = {
      padding: "0.5rem 0.2rem",
      display: "flex",
      flexDirection: "column",
      gap: "1.2rem"
    };
    
    const largeMetricStyle = {
      display: "flex",
      flexDirection: "column",
      gap: "0.5rem",
      alignItems: "center",
      marginBottom: "0.5rem"
    };
    
    const metricLabelStyle = {
      fontSize: "0.9rem",
      color: "#6b7280",
      fontWeight: 500
    };
    
    const metricValueStyle = {
      fontSize: "1.4rem",
      fontWeight: 700,
      color: "#1f2937"
    };
    
    const metricRowStyle = {
      display: "flex",
      gap: "1.5rem",
      justifyContent: "space-between"
    };
    
    const metricItemStyle = {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      gap: "0.3rem"
    };
    
    const dividerStyle = {
      height: "1px",
      background: "#e5e7eb",
      width: "100%",
      margin: "0.2rem 0"
    };
    
    const positivePnl = activePositions
      .filter(p => p.pnl > 0)
      .reduce((sum, p) => sum + p.pnl, 0);
      
    const negativePnl = activePositions
      .filter(p => p.pnl < 0)
      .reduce((sum, p) => sum + p.pnl, 0);

    return (
      <div style={modalContentStyle}>
        <div style={largeMetricStyle}>
          <span style={metricLabelStyle}>Today's Total P&L</span>
          <span style={{ ...metricValueStyle, fontSize: "2.2rem", color: totalPnlToday >= 0 ? "#16a34a" : "#dc2626" }}>
            {totalPnlToday >= 0 ? "+" : ""}₹{totalPnlToday.toLocaleString()}
          </span>
        </div>
        <div style={dividerStyle} />
        <div style={metricRowStyle}>
          <div style={metricItemStyle}>
            <span style={metricLabelStyle}>Positive P&L</span>
            <span style={{ ...metricValueStyle, color: "#16a34a" }}>
              +₹{positivePnl.toLocaleString()}
            </span>
          </div>
          <div style={metricItemStyle}>
            <span style={metricLabelStyle}>Negative P&L</span>
            <span style={{ ...metricValueStyle, color: "#dc2626" }}>
              {negativePnl.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    );
  }, [totalPnlToday, activePositions]);

  // Memoized card styles
  const cardCommon = useMemo(() => ({
    flex: 1,
    minWidth: 160,
    borderRadius: 13,
    padding: "1rem 1.3rem",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
  }), []);

  // Helper function to check if a trade's symbol is in the active positions
  const isTradeActive = useCallback((trade, positions) => {
    return positions.some(p => p.tradingsymbol === trade.symbol && p.quantity !== 0);
  }, []);

  // Style for the trade symbol text
  const getTradeSymbolStyle = useCallback((trade, positions) => {
    const baseStyle = {
      fontWeight: "600"
    };
    return isTradeActive(trade, positions)
      ? baseStyle
      : { ...baseStyle, color: "#9ca3af" };
  }, [isTradeActive]);

  // Trade type style
  const tradeTypeStyle = useCallback((type) => ({
    color: type === "BUY" ? "#166534" : "#991b1b",
    fontWeight: 600,
    background: type === "BUY" ? "#dcfce7" : "#fee2e2",
    padding: "0.2rem 0.5rem",
    borderRadius: "6px",
    fontSize: "0.85rem"
  }), []);

  // P&L span style
  const pnlSpanStyle = useCallback((pnl) => ({
    color: pnl >= 0 ? "#16a34a" : "#dc2626",
    fontWeight: "600"
  }), []);

  // Trade detail style
  const tradeDetailStyle = useCallback((o) => {
    const tradeDetail = {
      display: "flex",
      flexDirection: "column",
      gap: "1.5rem"
    };
    
    const tradeHeaderStyle = {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      paddingBottom: "0.5rem",
      borderBottom: "1px solid #e5e7eb"
    };
    
    const tradeSymbolStyle = {
      fontSize: "1.3rem",
      fontWeight: 700,
      color: "#1f2937"
    };
    
    const tradeTypeTagStyle = {
      fontSize: "0.9rem",
      color: o.type === "BUY" ? "#166534" : "#991b1b",
      background: o.type === "BUY" ? "#dcfce7" : "#fee2e2",
      padding: "0.3rem 0.6rem",
      borderRadius: "12px",
      fontWeight: 600
    };
    
    const tradeMetricsStyle = {
      display: "flex",
      flexDirection: "column",
      gap: "0.8rem"
    };
    
    const tradeMetricRow = {
      display: "flex",
      justifyContent: "space-between"
    };
    
    const tradeMetricLabel = {
      fontSize: "0.9rem",
      color: "#6b7280",
      fontWeight: 500
    };
    
    const tradeMetricValue = {
      fontSize: "0.95rem",
      fontWeight: 600,
      color: "#1f2937"
    };
    
    const tradeAdditionalInfo = {
      marginTop: "1rem"
    };

    return (
      <div style={tradeDetail}>
        <div style={tradeHeaderStyle}>
          <span style={tradeSymbolStyle}>{o.symbol}</span>
          <span style={tradeTypeTagStyle}>{o.type}</span>
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
  }, []);

  // Page styles
  const pageStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "1rem"
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
  
  const pnlValueStyle = (pnl) => ({
    fontSize: 15,
    fontWeight: 500,
    color: pnl >= 0 ? "#16a34a" : "#dc2626",
    marginTop: 4
  });

  return (
    <div style={pageStyle}>
      <div style={paperStyle}>
        <h1 style={titleStyle}>Dashboard Overview</h1>
       
        {/* Summary Cards */}
        <div style={cardRowStyle}>
          {/* Portfolio Card */}
          <div
            style={{ ...cardCommon, background: "linear-gradient(135deg, #e0e8f3 0%, #e9f4fb 100%)" }}
            onClick={() => openModal("Portfolio Details", pnlBody)}
          >
            <div style={cardLabelStyle("#5745af")}>Portfolio</div>
            <div style={cardValueStyle}>
              ₹{(summary.portfolioValue || summary.holdingsValue || 0).toLocaleString()}
            </div>
            <div style={pnlValueStyle(totalPnlToday)}>
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
          {/* Funds Card */}
          <div
            style={{ ...cardCommon, background: "linear-gradient(135deg, #fff9c4 0%, #fff176 100%)" }}
            onClick={() => openModal("Available Funds", fundsBody)}
          >
            <div style={cardLabelStyle("#999022")}>Available Funds</div>
            <div style={cardValueStyle}>₹{summary.funds?.toLocaleString() ?? "0"}</div>
          </div>
        </div>
        {/* Active Positions Table */}
        <SectionTable
          title={`Active Positions (${activePositions.length})`}
          headers={["Symbol", "Qty", "Avg Price", "LTP", "P&L"]}
          rows={activePositions.map(p => [
            p.tradingsymbol,
            p.quantity,
            `₹${(p.average_price || 0).toFixed(2)}`,
            `₹${(p.ltp || 0).toFixed(2)}`,
            <span style={pnlSpanStyle(p.pnl)}>
              {p.pnl >= 0 ? "+" : ""}₹{(p.pnl || 0).toFixed(2)}
            </span>
          ])}
          isLoading={isLoading.positions}
        />
        {/* Recent Trades Table */}
        <SectionTable
          title="Recent Trades"
          headers={["Time", "Symbol", "Type", "Qty", "Price"]}
          rows={orders.map(o => [
            o.timestamp ? new Date(o.timestamp).toLocaleTimeString() : "--",
            <span style={getTradeSymbolStyle(o, allPositions)}>{o.symbol}</span>,
            <span style={tradeTypeStyle(o.type)}>{o.type}</span>,
            o.qty,
            `₹${o.price?.toFixed(2) ?? "--"}`
          ])}
          onRowClick={idx => {
            const o = orders[idx];
            openModal(
              `Trade • ${o.symbol}`,
              tradeDetailStyle(o)
            );
          }}
          isLoading={isLoading.orders}
        />
      </div>
      <DetailModal open={modalInfo.open} onClose={closeModal} title={modalInfo.title}>
        {modalInfo.body}
      </DetailModal>
    </div>
  );
}