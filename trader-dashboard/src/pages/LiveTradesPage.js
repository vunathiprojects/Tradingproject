// import React from "react";
// import { motion } from "framer-motion";
// import { FiArrowUpRight, FiArrowDownRight } from "react-icons/fi";

// export default function LiveTradesPage({ trades }) {
//   // Defensive fallback: empty array if no trades
//   const displayTrades = trades && trades.length > 0 ? trades : [];

//   return (
//     <motion.div
//       className="trades-container"
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       transition={{ duration: 0.5 }}
//     >
//       <motion.div
//         className="trades-header"
//         initial={{ y: -20, opacity: 0 }}
//         animate={{ y: 0, opacity: 1 }}
//         transition={{ delay: 0.2 }}
//       >
//         <h2>Live Trades</h2>
//         <p>Real-time updates of your current positions (read only)</p>
//       </motion.div>

//       <motion.div
//         className="trades-table-container"
//         initial={{ opacity: 0, scale: 0.98 }}
//         animate={{ opacity: 1, scale: 1 }}
//         transition={{ delay: 0.4 }}
//       >
//         {displayTrades.length === 0 ? (
//           <p style={{ textAlign: "center", color: "#6b7280", padding: "1rem" }}>
//             No trades available
//           </p>
//         ) : (
//           <table className="trades-table" aria-label="Live Trades Table">
//             <thead>
//               <tr>
//                 <th>Symbol</th>
//                 <th>Buy Price</th>
//                 <th>Quantity</th>
//                 <th>Current Price</th>
//                 <th>P&L</th>
//                 <th>Status</th>
//               </tr>
//             </thead>
//             <tbody>
//               {displayTrades.map((trade, i) => (
//                 <motion.tr
//                   key={i}
//                   className="trade-row"
//                   initial={{ opacity: 0, y: 10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: 0.1 * i }}
//                   whileHover={{
//                     backgroundColor: "rgba(59, 130, 246, 0.05)",
//                     boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
//                   }}
//                 >
//                   <td className="symbol-cell">
//                     <span className="symbol">
//                       {trade.symbol || trade.tradingsymbol || "-"}
//                     </span>
//                   </td>
//                   <td>₹{trade.buy_price ?? trade.price ?? "-"}</td>
//                   <td>{trade.quantity ?? trade.qty ?? "-"}</td>
//                   <td>₹{trade.last_price ?? "-"}</td>
//                   <td className={trade.pnl >= 0 ? "profit" : "loss"}>
//                     {trade.pnl >= 0 ? (
//                       <FiArrowUpRight className="trend-icon" aria-label="Profit" />
//                     ) : (
//                       <FiArrowDownRight className="trend-icon" aria-label="Loss" />
//                     )}
//                     ₹{Math.abs(trade.pnl ?? 0).toFixed(2)}
//                   </td>
//                   <td>
//                     <span
//                       className={`status-badge ${
//                         trade.pnl >= 0 ? "profit" : "loss"
//                       }`}
//                       aria-label={trade.pnl >= 0 ? "Profit" : "Loss"}
//                     >
//                       {trade.pnl >= 0 ? "Profit" : "Loss"}
//                     </span>
//                   </td>
//                 </motion.tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </motion.div>

//       <style jsx>{`
//         .trades-container {
//           padding: 1rem;
//           width: 100%;
//         }
//         .trades-header {
//           margin-bottom: 2rem;
//           text-align: center;
//         }
//         .trades-header h2 {
//           font-size: 1.8rem;
//           color: #1f2937;
//           margin-bottom: 0.5rem;
//         }
//         .trades-header p {
//           color: #6b7280;
//           font-size: 0.9rem;
//         }
//         .trades-table-container {
//           background: #ffffff;
//           border-radius: 16px;
//           box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
//           overflow: hidden;
//           padding: 1.5rem;
//         }
//         .trades-table {
//           width: 100%;
//           border-collapse: separate;
//           border-spacing: 0;
//         }
//         .trades-table th {
//           background: #f9fafb;
//           color: #6b7280;
//           font-weight: 600;
//           text-transform: uppercase;
//           font-size: 0.75rem;
//           letter-spacing: 0.5px;
//           padding: 1rem;
//           text-align: left;
//           border-bottom: 1px solid #e5e7eb;
//         }
//         .trades-table td {
//           padding: 1.25rem 1rem;
//           border-bottom: 1px solid #f3f4f6;
//           color: #4b5563;
//           font-weight: 500;
//         }
//         .trade-row:last-child td {
//           border-bottom: none;
//         }
//         .symbol-cell {
//           display: flex;
//           align-items: center;
//         }
//         .symbol {
//           background: #f0f9ff;
//           color: #0369a1;
//           padding: 0.25rem 0.75rem;
//           border-radius: 20px;
//           font-weight: 600;
//           font-size: 0.85rem;
//         }
//         .profit {
//           color: #10b981;
//         }
//         .loss {
//           color: #ef4444;
//         }
//         .trend-icon {
//           margin-right: 0.5rem;
//           vertical-align: middle;
//         }
//         .status-badge {
//           display: inline-block;
//           padding: 0.25rem 0.75rem;
//           border-radius: 20px;
//           font-size: 0.75rem;
//           font-weight: 600;
//           text-transform: uppercase;
//         }
//         .status-badge.profit {
//           background: #d1fae5;
//         }
//         .status-badge.loss {
//           background: #fee2e2;
//         }
//       `}</style>
//     </motion.div>
//   );
// }


// import React, { useState, useEffect } from 'react';
// import { initializeApp } from 'firebase/app';
// import { getDatabase, ref, onValue } from 'firebase/database';
// import { format } from 'date-fns';

// // Initialize Firebase (you'll need to add your config)
// const firebaseConfig = {
//   apiKey: "YOUR_API_KEY",
//   authDomain: "YOUR_AUTH_DOMAIN",
//   databaseURL: "YOUR_DATABASE_URL",
//   projectId: "YOUR_PROJECT_ID",
//   storageBucket: "YOUR_STORAGE_BUCKET",
//   messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
//   appId: "YOUR_APP_ID"
// };

// const app = initializeApp(firebaseConfig);
// const database = getDatabase(app);

// const LiveTradesPage = () => {
//   const [executedTrades, setExecutedTrades] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const dbRef = ref(database, "executed_trades");
    
//     const unsubscribe = onValue(dbRef, (snapshot) => {
//       const data = snapshot.val();

//       // Debug: Print the raw data structure
//       console.log("Raw Firebase data:", data);

//       let trades = [];
//       if (Array.isArray(data)) {
//         trades = data.filter(item => typeof item === 'object' && item !== null);
//       } else if (typeof data === 'object' && data !== null) {
//         trades = Object.values(data).map(item => ({ ...item }));
//       }

//       // Debug: Print processed trades
//       console.log("Processed trades count:", trades.length);
//       if (trades.length > 0) {
//         console.log("First trade data:", trades[0]);
//         console.log("Available keys:", Object.keys(trades[0]));
//       }

//       // Sort latest first
//       trades.sort((a, b) => {
//         const aTime = a.timestamp || 0;
//         const bTime = b.timestamp || 0;
//         return bTime - aTime;
//       });

//       setExecutedTrades(trades);
//       setIsLoading(false);
//     });

//     return () => unsubscribe();
//   }, []);

//   const parseTimestamp = (timestamp) => {
//     if (!timestamp) return null;
//     try {
//       if (typeof timestamp === 'number') {
//         return new Date(timestamp);
//       }
//       if (typeof timestamp === 'string') {
//         const raw = timestamp.trim();
//         let parsed = new Date(raw);
//         if (isNaN(parsed.getTime())) {
//           parsed = new Date(raw.replace(' ', 'T'));
//         }
//         if (!isNaN(parsed.getTime())) return parsed;
//       }
//     } catch (e) {
//       console.error("Error parsing timestamp:", e);
//     }
//     return null;
//   };

//   const formatTime = (timestamp) => {
//     const dt = parseTimestamp(timestamp);
//     if (!dt) return "-";
//     return format(dt, 'HH:mm:ss');
//   };

//   const formatPrice = (price) => {
//     if (price === undefined || price === null) return "-";
//     return parseFloat(price).toFixed(2);
//   };

//   const getSymbolName = (trade) => {
//     const possibleKeys = [
//       'symbol', 'Symbol', 'SYMBOL',
//       'tradingsymbol', 'trading_symbol', 'TradingSymbol',
//       'instrument_token', 'scrip_name', 'name',
//       'stock_name', 'security_id'
//     ];
    
//     for (const key of possibleKeys) {
//       if (trade[key] !== undefined && trade[key] !== null && trade[key].toString().trim() !== '') {
//         console.log("Found symbol in key '" + key + "':", trade[key]);
//         return trade[key].toString();
//       }
//     }
    
//     console.log("No symbol found in trade:", trade);
//     return "UNKNOWN";
//   };

//   const toDouble = (value) => {
//     if (value === undefined || value === null) return 0.0;
//     if (typeof value === 'number') return value;
//     const parsed = parseFloat(value);
//     return isNaN(parsed) ? 0.0 : parsed;
//   };

//   const InfoTile = ({ title, value }) => (
//     <div style={{
//       padding: '10px 12px',
//       backgroundColor: '#111820',
//       borderRadius: 8,
//       border: '0.5px solid rgba(255, 255, 255, 0.12)'
//     }}>
//       <div style={{ color: '#9ca3af', fontSize: 11 }}>{title}</div>
//       <div style={{ 
//         color: 'white', 
//         fontSize: 14, 
//         fontWeight: 600,
//         marginTop: 4
//       }}>{value}</div>
//     </div>
//   );

//   const TradeItem = ({ trade }) => {
//     const type = (trade.type || trade.transaction_type || "-").toString().toUpperCase();
//     const qtyFilled = `${trade.filled_qty || trade.filled_quantity || trade.qty || 0}/${trade.qty || trade.quantity || 0}`;
//     const symbol = getSymbolName(trade);
//     const exchange = trade.exchange || trade.Exchange || "NSE";
//     const status = trade.status || trade.Status || "COMPLETE";
//     const avgPrice = trade.avg_price || trade.average_price || trade.price || trade.Price;
//     const orderType = trade.product || trade.Product || "";
//     const validity = trade.order_type || trade.validity || "";

//     const isBuy = type === "BUY";
//     const typeColor = isBuy ? "#10B981" : "#EF4444";

//     return (
//       <div 
//         onClick={() => showTradeDetails(trade)}
//         style={{
//           padding: '14px 12px',
//           backgroundColor: '#0F1419',
//           borderBottom: '0.5px solid rgba(255, 255, 255, 0.12)',
//           cursor: 'pointer'
//         }}
//       >
//         <div style={{ display: 'flex', alignItems: 'center' }}>
//           {/* BUY / SELL Badge */}
//           <div style={{
//             padding: '5px 10px',
//             backgroundColor: `${typeColor}26`,
//             borderRadius: 4
//           }}>
//             <span style={{
//               color: typeColor,
//               fontWeight: 'bold',
//               fontSize: 12
//             }}>{type}</span>
//           </div>
          
//           <div style={{ width: 10 }} />

//           {/* Qty + Symbol */}
//           <div style={{ flex: 1 }}>
//             <div style={{ color: 'white', fontSize: 13 }}>{qtyFilled}</div>
//             <div style={{
//               color: 'white',
//               fontSize: 15,
//               fontWeight: 500
//             }}>{symbol}</div>
//             <div style={{ color: '#9ca3af', fontSize: 12 }}>{exchange}</div>
//           </div>

//           {/* Time + Status + Avg Price + Order type */}
//           <div style={{ textAlign: 'right' }}>
//             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
//               <span style={{ color: '#9ca3af', fontSize: 12 }}>
//                 {formatTime(trade.timestamp)}
//               </span>
//               <div style={{ width: 6 }} />
//               <div style={{
//                 padding: '2px 6px',
//                 backgroundColor: 'rgba(16, 185, 129, 0.15)',
//                 borderRadius: 4
//               }}>
//                 <span style={{
//                   color: '#10B981',
//                   fontSize: 10,
//                   fontWeight: 'bold'
//                 }}>{status}</span>
//               </div>
//             </div>
//             <div style={{ color: 'white', fontSize: 13 }}>
//               Avg. {formatPrice(avgPrice)}
//             </div>
//             <div style={{ color: '#9ca3af', fontSize: 11 }}>
//               {orderType} {validity}
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   const showTradeDetails = (trade) => {
//     const symbol = getSymbolName(trade);
//     const symbolTrades = executedTrades.filter(t => getSymbolName(t) === symbol);
    
//     symbolTrades.sort((a, b) => {
//       const ad = parseTimestamp(a.timestamp)?.getTime() || 0;
//       const bd = parseTimestamp(b.timestamp)?.getTime() || 0;
//       return bd - ad;
//     });

//     let totalBuyQty = 0;
//     let totalSellQty = 0;
//     let buyCost = 0;
//     let sellProceeds = 0;
//     let firstBuyTime = null;
//     let firstSellTime = null;
//     let lastBuyTime = null;
//     let lastSellTime = null;

//     symbolTrades.forEach(t => {
//       const tType = (t.type || t.transaction_type || "").toString().toUpperCase();
//       const qty = toDouble(t.filled_qty || t.filled_quantity || t.qty || t.quantity);
//       const price = toDouble(t.avg_price || t.average_price || t.price || t.Price);
//       const ts = parseTimestamp(t.timestamp);

//       if (tType === "BUY") {
//         totalBuyQty += qty;
//         buyCost += price * qty;
//         if (!firstBuyTime || (ts && ts < firstBuyTime)) firstBuyTime = ts;
//         if (!lastBuyTime || (ts && ts > lastBuyTime)) lastBuyTime = ts;
//       } else if (tType === "SELL") {
//         totalSellQty += qty;
//         sellProceeds += price * qty;
//         if (!firstSellTime || (ts && ts < firstSellTime)) firstSellTime = ts;
//         if (!lastSellTime || (ts && ts > lastSellTime)) lastSellTime = ts;
//       }
//     });

//     const matchedQty = Math.min(totalBuyQty, totalSellQty);
//     const avgBuy = totalBuyQty > 0 ? buyCost / totalBuyQty : 0.0;
//     const avgSell = totalSellQty > 0 ? sellProceeds / totalSellQty : 0.0;
//     const realizedPnL = matchedQty * (avgSell - avgBuy);
//     const isProfit = realizedPnL >= 0;

//     // Here you would implement your modal display logic
//     // For example using a modal library or custom component
//     console.log("Showing trade details for:", symbol);
//     console.log("Realized P&L:", realizedPnL);
//     console.log("All trades:", symbolTrades);
    
//     // In a real app, you would render a modal here with the details
//     alert(`Trade details for ${symbol}\nRealized P&L: ${realizedPnL.toFixed(2)}`);
//   };

//   const TradesList = () => {
//     if (executedTrades.length === 0) {
//       return (
//         <div style={{
//           display: 'flex',
//           justifyContent: 'center',
//           alignItems: 'center',
//           height: '100%',
//           padding: 20
//         }}>
//           <span style={{ color: 'rgba(255, 255, 255, 0.54)', fontSize: 16 }}>
//             No Executed Trades
//           </span>
//         </div>
//       );
//     }

//     return (
//       <div>
//         {executedTrades.map((trade, index) => (
//           <TradeItem key={index} trade={trade} />
//         ))}
//       </div>
//     );
//   };

//   return (
//     <div style={{ 
//       backgroundColor: '#0F1419',
//       minHeight: '100vh'
//     }}>
//       <div style={{
//         backgroundColor: '#1E3A8A',
//         color: 'white',
//         padding: '16px 0',
//         textAlign: 'center',
//         fontSize: 20,
//         fontWeight: 'bold'
//       }}>
//         Executed Trades
//       </div>
      
//       {isLoading ? (
//         <div style={{
//           display: 'flex',
//           justifyContent: 'center',
//           alignItems: 'center',
//           height: 'calc(100vh - 56px)'
//         }}>
//           <div className="spinner-border text-primary" role="status">
//             <span className="visually-hidden">Loading...</span>
//           </div>
//         </div>
//       ) : (
//         <TradesList />
//       )}
//     </div>
//   );
// };

// export default LiveTradesPage;





// src/pages/LiveTradesPage.js
import React, { useState, useEffect } from 'react';
import { db } from "../firebase";   // ✅ use the shared firebase.js
import { ref, onValue } from 'firebase/database';
import { format } from 'date-fns';

const LiveTradesPage = () => {
  const [executedTrades, setExecutedTrades] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const dbRef = ref(db, "executed_trades");

    const unsubscribe = onValue(dbRef, (snapshot) => {
      const data = snapshot.val();

      let trades = [];
      if (Array.isArray(data)) {
        trades = data.filter(item => typeof item === 'object' && item !== null);
      } else if (typeof data === 'object' && data !== null) {
        trades = Object.values(data).map(item => ({ ...item }));
      }

      // Sort latest first
      trades.sort((a, b) => {
        const aTime = a.timestamp || 0;
        const bTime = b.timestamp || 0;
        return bTime - aTime;
      });

      setExecutedTrades(trades);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const parseTimestamp = (timestamp) => {
    if (!timestamp) return null;
    try {
      if (typeof timestamp === 'number') {
        return new Date(timestamp);
      }
      if (typeof timestamp === 'string') {
        const raw = timestamp.trim();
        let parsed = new Date(raw);
        if (isNaN(parsed.getTime())) {
          parsed = new Date(raw.replace(' ', 'T'));
        }
        if (!isNaN(parsed.getTime())) return parsed;
      }
    } catch (e) {
      console.error("Error parsing timestamp:", e);
    }
    return null;
  };

  const formatTime = (timestamp) => {
    const dt = parseTimestamp(timestamp);
    if (!dt) return "-";
    return format(dt, 'HH:mm:ss');
  };

  const formatPrice = (price) => {
    if (price === undefined || price === null) return "-";
    return parseFloat(price).toFixed(2);
  };

  const getSymbolName = (trade) => {
    const possibleKeys = [
      'symbol', 'Symbol', 'SYMBOL',
      'tradingsymbol', 'trading_symbol', 'TradingSymbol',
      'instrument_token', 'scrip_name', 'name',
      'stock_name', 'security_id'
    ];
    
    for (const key of possibleKeys) {
      if (trade[key] !== undefined && trade[key] !== null && trade[key].toString().trim() !== '') {
        return trade[key].toString();
      }
    }
    return "UNKNOWN";
  };

  const toDouble = (value) => {
    if (value === undefined || value === null) return 0.0;
    if (typeof value === 'number') return value;
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0.0 : parsed;
  };

  const TradeItem = ({ trade }) => {
    const type = (trade.type || trade.transaction_type || "-").toString().toUpperCase();
    const qtyFilled = `${trade.filled_qty || trade.filled_quantity || trade.qty || 0}/${trade.qty || trade.quantity || 0}`;
    const symbol = getSymbolName(trade);
    const exchange = trade.exchange || trade.Exchange || "NSE";
    const status = trade.status || trade.Status || "COMPLETE";
    const avgPrice = trade.avg_price || trade.average_price || trade.price || trade.Price;
    const orderType = trade.product || trade.Product || "";
    const validity = trade.order_type || trade.validity || "";

    const isBuy = type === "BUY";
    const typeColor = isBuy ? "#10B981" : "#EF4444";

    return (
      <div 
        onClick={() => showTradeDetails(trade)}
        style={{
          padding: '14px 12px',
          backgroundColor: '#0F1419',
          borderBottom: '0.5px solid rgba(255, 255, 255, 0.12)',
          cursor: 'pointer'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {/* BUY / SELL Badge */}
          <div style={{
            padding: '5px 10px',
            backgroundColor: `${typeColor}26`,
            borderRadius: 4
          }}>
            <span style={{
              color: typeColor,
              fontWeight: 'bold',
              fontSize: 12
            }}>{type}</span>
          </div>
          
          <div style={{ width: 10 }} />

          {/* Qty + Symbol */}
          <div style={{ flex: 1 }}>
            <div style={{ color: 'white', fontSize: 13 }}>{qtyFilled}</div>
            <div style={{
              color: 'white',
              fontSize: 15,
              fontWeight: 500
            }}>{symbol}</div>
            <div style={{ color: '#9ca3af', fontSize: 12 }}>{exchange}</div>
          </div>

          {/* Time + Status + Avg Price + Order type */}
          <div style={{ textAlign: 'right' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
              <span style={{ color: '#9ca3af', fontSize: 12 }}>
                {formatTime(trade.timestamp)}
              </span>
              <div style={{ width: 6 }} />
              <div style={{
                padding: '2px 6px',
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                borderRadius: 4
              }}>
                <span style={{
                  color: '#10B981',
                  fontSize: 10,
                  fontWeight: 'bold'
                }}>{status}</span>
              </div>
            </div>
            <div style={{ color: 'white', fontSize: 13 }}>
              Avg. {formatPrice(avgPrice)}
            </div>
            <div style={{ color: '#9ca3af', fontSize: 11 }}>
              {orderType} {validity}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const showTradeDetails = (trade) => {
    const symbol = getSymbolName(trade);
    const symbolTrades = executedTrades.filter(t => getSymbolName(t) === symbol);
    
    symbolTrades.sort((a, b) => {
      const ad = parseTimestamp(a.timestamp)?.getTime() || 0;
      const bd = parseTimestamp(b.timestamp)?.getTime() || 0;
      return bd - ad;
    });

    let totalBuyQty = 0;
    let totalSellQty = 0;
    let buyCost = 0;
    let sellProceeds = 0;

    symbolTrades.forEach(t => {
      const tType = (t.type || t.transaction_type || "").toString().toUpperCase();
      const qty = toDouble(t.filled_qty || t.filled_quantity || t.qty || t.quantity);
      const price = toDouble(t.avg_price || t.average_price || t.price || t.Price);

      if (tType === "BUY") {
        totalBuyQty += qty;
        buyCost += price * qty;
      } else if (tType === "SELL") {
        totalSellQty += qty;
        sellProceeds += price * qty;
      }
    });

    const matchedQty = Math.min(totalBuyQty, totalSellQty);
    const avgBuy = totalBuyQty > 0 ? buyCost / totalBuyQty : 0.0;
    const avgSell = totalSellQty > 0 ? sellProceeds / totalSellQty : 0.0;
    const realizedPnL = matchedQty * (avgSell - avgBuy);

    alert(`Trade details for ${symbol}\nRealized P&L: ${realizedPnL.toFixed(2)}`);
  };

  const TradesList = () => {
    if (executedTrades.length === 0) {
      return (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          padding: 20
        }}>
          <span style={{ color: 'rgba(255, 255, 255, 0.54)', fontSize: 16 }}>
            No Executed Trades
          </span>
        </div>
      );
    }

    return (
      <div>
        {executedTrades.map((trade, index) => (
          <TradeItem key={index} trade={trade} />
        ))}
      </div>
    );
  };

  return (
    <div style={{ 
      backgroundColor: '#0F1419',
      minHeight: '100vh'
    }}>
      <div style={{
        backgroundColor: '#1E3A8A',
        color: 'white',
        padding: '16px 0',
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold'
      }}>
        Executed Trades
      </div>
      
      {isLoading ? (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 'calc(100vh - 56px)'
        }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <TradesList />
      )}
    </div>
  );
};

export default LiveTradesPage;
