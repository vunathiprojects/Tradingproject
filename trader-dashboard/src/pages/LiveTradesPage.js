
                                       //mobile resposiveness

// src/pages/LiveTradesPage.js
import React, { useState, useEffect } from 'react';
import { db } from "../firebase";   // ✅ use the shared firebase.js
import { ref, onValue } from 'firebase/database';
import { format } from 'date-fns';

const LiveTradesPage = () => {
  const [executedTrades, setExecutedTrades] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  const TradeItem = ({ trade, index }) => {
    const type = (trade.type || trade.transaction_type || "-").toString().toUpperCase();
    const qtyFilled = `${trade.filled_qty || trade.filled_quantity || trade.qty || 0}/${trade.qty || trade.quantity || 0}`;
    const symbol = getSymbolName(trade);
    const exchange = trade.exchange || trade.Exchange || "NSE";
    const status = trade.status || trade.Status || "COMPLETE";
    const avgPrice = trade.avg_price || trade.average_price || trade.price || trade.Price;
    const orderType = trade.product || trade.Product || "";
    const validity = trade.order_type || trade.validity || "";

    const isBuy = type === "BUY";

    return (
      <div 
        onClick={() => showTradeDetails(trade)}
        style={{
          padding: isMobile ? '16px' : '24px',
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
          border: '1px solid rgba(255, 255, 255, 0.5)',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          marginBottom: '16px',
          opacity: 0,
          animation: `slideInUp 0.6s ease-out ${index * 0.1}s forwards`
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-5px) scale(1.02)';
          e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.15)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0) scale(1)';
          e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.08)';
        }}
      >
        <div style={{ 
          display: 'flex', 
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: isMobile ? 'flex-start' : 'center', 
          justifyContent: 'space-between',
          gap: isMobile ? '12px' : '0'
        }}>
          {/* Left side - BUY/SELL badge and symbol info */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '16px', 
            flex: 1,
            width: isMobile ? '100%' : 'auto'
          }}>
            {/* BUY / SELL Badge */}
            <div style={{
              padding: isMobile ? '6px 12px' : '8px 16px',
              background: isBuy ? 
                'linear-gradient(135deg, rgba(0, 122, 255, 0.15) 0%, rgba(0, 122, 255, 0.05) 100%)' : 
                'linear-gradient(135deg, rgba(255, 59, 48, 0.15) 0%, rgba(255, 59, 48, 0.05) 100%)',
              border: isBuy ? 
                '1px solid rgba(0, 122, 255, 0.2)' : 
                '1px solid rgba(255, 59, 48, 0.2)',
              borderRadius: '12px',
              minWidth: isMobile ? '60px' : '70px',
              textAlign: 'center'
            }}>
              <span style={{
                color: isBuy ? '#007AFF' : '#FF3B30',
                fontWeight: '700',
                fontSize: isMobile ? '11px' : '12px'
              }}>{type}</span>
            </div>

            {/* Symbol and quantity info */}
            <div style={{ flex: 1 }}>
              <div style={{
                color: '#2c3e50',
                fontSize: isMobile ? '16px' : '18px',
                fontWeight: '700',
                marginBottom: '4px'
              }}>{symbol}</div>
              <div style={{ 
                color: '#6c757d', 
                fontSize: isMobile ? '12px' : '13px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                flexWrap: 'wrap'
              }}>
                <span>Qty: {qtyFilled}</span>
                <span style={{
                  padding: '2px 8px',
                  background: 'rgba(108, 117, 125, 0.1)',
                  borderRadius: '8px',
                  fontSize: isMobile ? '10px' : '11px'
                }}>{exchange}</span>
              </div>
            </div>
          </div>

          {/* Right side - Price and status info */}
          <div style={{ 
            textAlign: isMobile ? 'left' : 'right', 
            minWidth: isMobile ? '100%' : '140px',
            display: isMobile ? 'flex' : 'block',
            justifyContent: isMobile ? 'space-between' : 'flex-start',
            alignItems: isMobile ? 'center' : 'flex-start'
          }}>
            <div style={{ 
              color: '#2c3e50', 
              fontSize: isMobile ? '16px' : '18px',
              fontWeight: '800',
              marginBottom: isMobile ? '0' : '4px'
            }}>
              ₹{formatPrice(avgPrice)}
            </div>
            <div style={{ 
              display: 'flex',
              alignItems: 'center',
              justifyContent: isMobile ? 'flex-end' : 'flex-end',
              gap: '8px',
              marginBottom: isMobile ? '0' : '4px'
            }}>
              <span style={{ 
                color: '#6c757d', 
                fontSize: isMobile ? '11px' : '12px',
                fontWeight: '600'
              }}>
                {formatTime(trade.timestamp)}
              </span>
              <div style={{
                padding: '3px 8px',
                background: 'linear-gradient(135deg, rgba(52, 199, 89, 0.15) 0%, rgba(52, 199, 89, 0.05) 100%)',
                border: '1px solid rgba(52, 199, 89, 0.2)',
                borderRadius: '8px'
              }}>
                <span style={{
                  color: '#34C759',
                  fontSize: isMobile ? '8px' : '9px',
                  fontWeight: '700',
                  textTransform: 'uppercase'
                }}>{status}</span>
              </div>
            </div>
            {!isMobile && (
              <div style={{ 
                color: '#6c757d', 
                fontSize: '11px',
                fontWeight: '600'
              }}>
                {orderType} {validity}
              </div>
            )}
          </div>
        </div>
        
        {/* Additional info for mobile view */}
        {isMobile && (
          <div style={{ 
            color: '#6c757d', 
            fontSize: '11px',
            fontWeight: '600',
            marginTop: '8px'
          }}>
            {orderType} {validity}
          </div>
        )}
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

    alert(`Trade details for ${symbol}\nRealized P&L: ₹${realizedPnL.toFixed(2)}`);
  };

  const TradesList = () => {
    if (executedTrades.length === 0) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: isMobile ? '40px 20px' : '60px 20px',
          textAlign: 'center'
        }}>
          <div style={{
            width: isMobile ? '60px' : '80px',
            height: isMobile ? '60px' : '80px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(0, 122, 255, 0.1) 0%, rgba(88, 86, 214, 0.1) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: isMobile ? '16px' : '24px',
            fontSize: isMobile ? '24px' : '32px',
            opacity: 0,
            animation: 'fadeInScale 0.8s ease-out 0.3s forwards'
          }}>
            📊
          </div>
          <h3 style={{ 
            color: '#2c3e50', 
            fontSize: isMobile ? '20px' : '24px',
            fontWeight: '700',
            marginBottom: '8px',
            opacity: 0,
            animation: 'fadeIn 0.6s ease-out 0.5s forwards'
          }}>
            No Executed Trades
          </h3>
          <p style={{ 
            color: '#6c757d', 
            fontSize: isMobile ? '14px' : '16px',
            opacity: 0,
            animation: 'fadeIn 0.6s ease-out 0.7s forwards'
          }}>
            Your executed trades will appear here
          </p>
        </div>
      );
    }

    return (
      <div>
        {executedTrades.map((trade, index) => (
          <TradeItem key={index} trade={trade} index={index} />
        ))}
      </div>
    );
  };

  return (
    <div style={{ 
      padding: isMobile ? "16px" : "20px", 
      maxWidth: 1200, 
      margin: "0 auto",
      background: "linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)",
      minHeight: "100vh"
    }}>
      {/* Header */}
      <div
        style={{ 
          textAlign: "center", 
          marginBottom: isMobile ? "1.5rem" : "2rem",
          opacity: 0,
          animation: 'fadeInUp 0.6s ease-out 0.2s forwards'
        }}
      >
        <h1 style={{ 
          fontSize: isMobile ? "2rem" : "2.5rem", 
          fontWeight: "800", 
          background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          marginBottom: "0.5rem"
        }}>
          📈 Executed Trades
        </h1>
        <p style={{ 
          color: "#6c757d", 
          fontSize: isMobile ? "1rem" : "1.1rem" 
        }}>
          Track your executed trades in real-time
        </p>
      </div>
      
      {isLoading ? (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '400px',
          textAlign: 'center'
        }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '4px solid rgba(102, 126, 234, 0.3)',
            borderTop: '4px solid #667eea',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            marginBottom: '20px'
          }} />
          <span style={{
            color: '#6c757d',
            fontSize: '16px',
            fontWeight: '600'
          }}>Loading trades...</span>
        </div>
      ) : (
        <div style={{
          background: 'rgba(255, 255, 255, 0.6)',
          backdropFilter: 'blur(10px)',
          borderRadius: '24px',
          padding: isMobile ? '16px' : '24px',
          boxShadow: '0 15px 35px rgba(0,0,0,0.1)',
          border: '1px solid rgba(255, 255, 255, 0.5)',
          opacity: 0,
          animation: 'fadeInUp 0.8s ease-out 0.4s forwards'
        }}>
          <TradesList />
        </div>
      )}

      <style>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LiveTradesPage;