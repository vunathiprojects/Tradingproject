




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
