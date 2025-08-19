

// index.js this code is ok

// const express = require("express");
// const admin = require("firebase-admin");
// require("dotenv").config();
// const { KiteConnect } = require("kiteconnect");

// const app = express();
// app.use(express.json());

// // -------- Firebase Admin Setup --------
// admin.initializeApp({
//   credential: admin.credential.cert(require(process.env.FIREBASE_SERVICE_ACCOUNT)),
//   databaseURL: "https://traderapp-7e61b-default-rtdb.firebaseio.com/"
// });
// const db = admin.database();

// // -------- Zerodha Kite Connect Setup --------
// const kc = new KiteConnect({ api_key: process.env.API_KEY });
// kc.setAccessToken(process.env.ACCESS_TOKEN);

// // -------- Fetch and Store Account Profile --------
// const fetchProfile = async () => {
//   try {
//     const profile = await kc.getProfile();
//     db.ref("account").set({
//       name: profile.user_name || "",
//       user_id: profile.user_id || "",
//       email: profile.email || "",
//       broker: profile.broker || "ZERODHA",
//       mobile: profile.phone_number || "Not Available",
//       timestamp: Date.now()
//     });
//     console.log("✅ Profile synced:", profile.user_name);
//   } catch (err) {
//     console.error("❌ Error fetching profile:", err.message);
//   }
// };

// // -------- Fetch and Store Wallet/Funds --------
// const fetchWallet = async () => {
//   try {
//     const margins = await kc.getMargins();
//     const equity = margins?.equity || {};
//     const walletData = {
//       net: equity.net ?? 0,
//       cash: equity.available?.cash ?? 0,
//       invested: equity.used?.margin ?? 0,
//       pnl: equity.pnl ?? 0,
//       timestamp: Date.now()
//     };
//     db.ref("wallet").set(walletData);
//     // Optionally, update dashboard summary
//     db.ref("dashboard/summary").set({
//       portfolioValue: walletData.net,
//       funds: walletData.cash,
//       pnlToday: walletData.pnl
//     });
//     console.log("💰 Wallet updated:", walletData);
//   } catch (error) {
//     console.error("❌ Error fetching wallet:", error.message);
//   }
// };

// // -------- Fetch and Store Open Positions --------
// const fetchPositions = async () => {
//   try {
//     const positions = await kc.getPositions();
//     // You may want to use "day" or "net", example below uses "net" positions
//     const activePositions = positions?.net?.filter(pos => pos.quantity !== 0) || [];
//     db.ref("dashboard/positions").set(activePositions);
//     console.log("📈 Positions synced:", activePositions.length);
//   } catch (err) {
//     console.error("❌ Error fetching positions:", err.message);
//   }
// };

// // -------- Push Trades (Completed Orders) To Firebase --------
// const pushTradeToFirebase = (order) => {
//   const tradeRef = db.ref("trades").push();
//   tradeRef.set({
//     symbol: order.tradingsymbol || "",
//     qty: order.quantity ?? 0,
//     price: order.average_price ?? 0,
//     pnl: order.pnl ?? 0,
//     status: order.status || "",
//     type: order.transaction_type || "",
//     timestamp: Date.now()
//   });
//   console.log("✅ Trade pushed:", order.tradingsymbol);
// };

// // -------- Fetch and Store Orders --------
// const fetchOrders = async () => {
//   try {
//     const orders = await kc.getOrders();
//     orders.forEach(order => {
//       if (order.status === "COMPLETE") {
//         pushTradeToFirebase(order);
//       }
//     });
//   } catch (error) {
//     console.error("❌ Error fetching orders:", error.message);
//   }
// };

// // -------- Periodic Synchronization --------
// setInterval(fetchOrders, 5000);   // Every 5 seconds for trades
// setInterval(fetchWallet, 1000);  // Every 10 seconds for wallet/funds
// setInterval(fetchPositions, 7000); // Every 7 seconds for positions

// // Initial Fetch on Startup
// fetchProfile();
// fetchWallet();
// fetchPositions();
// fetchOrders();

// // -------- Test API Endpoint --------
// app.get("/", (req, res) => {
//   res.send("🚀 Zerodha trade tracker running");
// });

// const PORT = 3000;
// app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));









// 1.this is for testing


// const express = require("express");
// const admin = require("firebase-admin");
// require("dotenv").config();
// const { KiteConnect } = require("kiteconnect");

// const app = express();
// app.use(express.json());

// // Firebase Admin Setup
// admin.initializeApp({
//   credential: admin.credential.cert(require(process.env.FIREBASE_SERVICE_ACCOUNT)),
//   databaseURL: "https://traderapp-7e61b-default-rtdb.firebaseio.com/"
// });
// const db = admin.database();

// // Zerodha Kite Connect Setup
// const kc = new KiteConnect({ api_key: process.env.API_KEY });
// kc.setAccessToken(process.env.ACCESS_TOKEN);

// // Data Caching
// const dataCache = {
//   profile: null,
//   wallet: null,
//   positions: null,
//   orders: null,
//   lastUpdated: Date.now()
// };

// // Data processors
// const processProfile = (data) => ({
//   name: data.user_name || "",
//   user_id: data.user_id || "",
//   email: data.email || "",
//   broker: data.broker || "ZERODHA",
//   mobile: data.phone_number || "Not Available",
//   timestamp: Date.now()
// });

// const processWallet = (data) => {
//   const equity = data?.equity || {};
//   return {
//     net: equity.net ?? 0,
//     cash: equity.available?.cash ?? 0,
//     invested: equity.used?.margin ?? 0,
//     pnl: equity.pnl ?? 0,
//     timestamp: Date.now()
//   };
// };

// const processPositions = (data) => {
//   return data?.net?.filter(pos => pos.quantity !== 0) || [];
// };

// const processOrders = (data) => {
//   return data
//     .filter(o => o.status === "COMPLETE")
//     .map(o => ({
//       symbol: o.tradingsymbol || "",
//       qty: o.quantity ?? 0,
//       price: o.average_price ?? 0,
//       pnl: o.pnl ?? 0,
//       status: o.status || "",
//       type: o.transaction_type || "",
//       timestamp: Date.now()
//     }))
//     .slice(0, 8);
// };

// // Unified data fetcher
// const fetchData = async () => {
//   try {
//     const [profile, margins, positions, orders] = await Promise.all([
//       kc.getProfile(),
//       kc.getMargins(),
//       kc.getPositions(),
//       kc.getOrders()
//     ]);
    
//     return {
//       profile: processProfile(profile),
//       wallet: processWallet(margins),
//       positions: processPositions(positions),
//       orders: processOrders(orders)
//     };
//   } catch (error) {
//     console.error("Error fetching data:", error.message);
//     return null;
//   }
// };

// // Batched Firebase update
// const updateFirebase = async (data) => {
//   if (!data) return;
  
//   const updates = {};
//   const now = Date.now();
  
//   // Only update if data has changed
//   if (JSON.stringify(data.profile) !== JSON.stringify(dataCache.profile)) {
//     updates['account'] = data.profile;
//     dataCache.profile = data.profile;
//   }
  
//   if (JSON.stringify(data.wallet) !== JSON.stringify(dataCache.wallet)) {
//     updates['wallet'] = data.wallet;
//     dataCache.wallet = data.wallet;
//   }
  
//   if (JSON.stringify(data.positions) !== JSON.stringify(dataCache.positions)) {
//     updates['dashboard/positions'] = data.positions;
//     dataCache.positions = data.positions;
//   }
  
//   if (JSON.stringify(data.orders) !== JSON.stringify(dataCache.orders)) {
//     updates['trades'] = data.orders;
//     dataCache.orders = data.orders;
//   }
  
//   // Update dashboard summary
//   const summary = {
//     portfolioValue: (data.wallet.net || 0),
//     holdingsValue: (data.wallet.invested || 0),
//     funds: (data.wallet.cash || 0),
//     pnlToday: (data.wallet.pnl || 0),
//     timestamp: now
//   };
  
//   if (JSON.stringify(summary) !== JSON.stringify(dataCache.summary)) {
//     updates['dashboard/summary'] = summary;
//     dataCache.summary = summary;
//   }
  
//   // Perform batched update if there are changes
//   if (Object.keys(updates).length > 0) {
//     await db.ref().update(updates);
//     console.log("🔥 Firebase updated with", Object.keys(updates).length, "changes");
//     dataCache.lastUpdated = now;
//   }
// };

// // Periodic synchronization (5 seconds)
// setInterval(async () => {
//   console.log("🔄 Syncing data...");
//   const data = await fetchData();
//   if (data) await updateFirebase(data);
// }, 5000);

// // Initial fetch
// fetchData().then(updateFirebase);

// // Test API Endpoint
// app.get("/", (req, res) => {
//   res.send("🚀 Optimized Zerodha trade tracker running");
// });

// const PORT = 3000;
// app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));





// const express = require("express");
// const admin = require("firebase-admin");
// require("dotenv").config();
// const { KiteConnect } = require("kiteconnect");
// const fs = require("fs");
// const path = require("path");

// const app = express();
// app.use(express.json());

// // ======================
// // Firebase Admin Setup
// // ======================
// admin.initializeApp({
//   credential: admin.credential.cert(require(process.env.FIREBASE_SERVICE_ACCOUNT)),
//   databaseURL: "https://traderapp-7e61b-default-rtdb.firebaseio.com/"
// });
// const db = admin.database();

// // ======================
// // Zerodha Kite Connect Setup
// // ======================
// const kc = new KiteConnect({ api_key: process.env.API_KEY });
// kc.setAccessToken(process.env.ACCESS_TOKEN);

// // ======================
// // Data Caching
// // ======================
// const dataCache = {
//   profile: null,
//   wallet: null,
//   positions: null,
//   orders: null,
//   lastUpdated: Date.now()
// };

// // ======================
// // Data Processors
// // ======================
// const processProfile = (data) => ({
//   name: data.user_name || "",
//   user_id: data.user_id || "",
//   email: data.email || "",
//   broker: data.broker || "ZERODHA",
//   mobile: data.phone_number || "Not Available",
//   timestamp: Date.now()
// });

// const processWallet = (data) => {
//   const equity = data?.equity || {};
//   return {
//     net: equity.net ?? 0,
//     cash: equity.available?.cash ?? 0,
//     invested: equity.used?.margin ?? 0,
//     pnl: equity.pnl ?? 0,
//     timestamp: Date.now()
//   };
// };

// const processPositions = (data) => {
//   return data?.net?.filter(pos => pos.quantity !== 0) || [];
// };

// const processOrders = (data) => {
//   return data
//     .filter(o => o.status === "COMPLETE")
//     .map(o => ({
//       symbol: o.tradingsymbol || "",
//       qty: o.quantity ?? 0,
//       price: o.average_price ?? 0,
//       pnl: o.pnl ?? 0,
//       status: o.status || "",
//       type: o.transaction_type || "",
//       timestamp: Date.now()
//     }))
//     .slice(0, 8);
// };

// // ======================
// // Fetch Data
// // ======================
// const fetchData = async () => {
//   try {
//     const [profile, margins, positions, orders] = await Promise.all([
//       kc.getProfile(),
//       kc.getMargins(),
//       kc.getPositions(),
//       kc.getOrders()
//     ]);
    
//     return {
//       profile: processProfile(profile),
//       wallet: processWallet(margins),
//       positions: processPositions(positions),
//       orders: processOrders(orders)
//     };
//   } catch (error) {
//     console.error("❌ Error fetching data:", error.message);
//     return null;
//   }
// };

// // ======================
// // Backup Trades (Safe before delete)
// // ======================
// const backupTrades = async (trades) => {
//   const backupPath = path.join(__dirname, "trades_backup.json");
//   fs.writeFileSync(backupPath, JSON.stringify(trades, null, 2));
//   console.log(`✅ Backup saved to ${backupPath}`);
// };

// // ======================
// // Trim Old Trades
// // ======================
// const trimTradesIfTooLarge = async () => {
//   try {
//     const tradesSnap = await db.ref("/trades").once("value");
//     const trades = tradesSnap.val();

//     if (!trades) return;

//     const tradeKeys = Object.keys(trades);
//     if (tradeKeys.length > 500) { // keep latest 500 trades
//       console.log(`⚠ Too many trades (${tradeKeys.length}), trimming...`);

//       // sort oldest first
//       const sortedKeys = tradeKeys.sort((a, b) => trades[a].timestamp - trades[b].timestamp);

//       // old trades to backup
//       const keysToRemove = sortedKeys.slice(0, tradeKeys.length - 500);
//       const oldTrades = {};
//       keysToRemove.forEach(key => oldTrades[key] = trades[key]);

//       // backup before deleting
//       await backupTrades(oldTrades);

//       // delete old trades
//       for (const key of keysToRemove) {
//         await db.ref(`/trades/${key}`).remove();
//       }

//       console.log(`✅ Trimmed ${keysToRemove.length} old trades`);
//     }
//   } catch (err) {
//     console.error("❌ Error trimming trades:", err);
//   }
// };

// // ======================
// // Firebase Update
// // ======================
// const updateFirebase = async (data) => {
//   if (!data) return;
  
//   const updates = {};
//   const now = Date.now();
  
//   if (JSON.stringify(data.profile) !== JSON.stringify(dataCache.profile)) {
//     updates['account'] = data.profile;
//     dataCache.profile = data.profile;
//   }
  
//   if (JSON.stringify(data.wallet) !== JSON.stringify(dataCache.wallet)) {
//     updates['wallet'] = data.wallet;
//     dataCache.wallet = data.wallet;
//   }
  
//   if (JSON.stringify(data.positions) !== JSON.stringify(dataCache.positions)) {
//     updates['dashboard/positions'] = data.positions;
//     dataCache.positions = data.positions;
//   }
  
//   if (JSON.stringify(data.orders) !== JSON.stringify(dataCache.orders)) {
//     updates['trades'] = data.orders;
//     dataCache.orders = data.orders;
//   }
  
//   const summary = {
//     portfolioValue: (data.wallet.net || 0),
//     holdingsValue: (data.wallet.invested || 0),
//     funds: (data.wallet.cash || 0),
//     pnlToday: (data.wallet.pnl || 0),
//     timestamp: now
//   };
  
//   if (JSON.stringify(summary) !== JSON.stringify(dataCache.summary)) {
//     updates['dashboard/summary'] = summary;
//     dataCache.summary = summary;
//   }
  
//   if (Object.keys(updates).length > 0) {
//     await db.ref().update(updates);
//     console.log("🔥 Firebase updated with", Object.keys(updates).length, "changes");
//     dataCache.lastUpdated = now;
//   }
// };

// // ======================
// // Periodic Sync (5 sec) + Trim (5 min)
// // ======================
// setInterval(async () => {
//   console.log("🔄 Syncing data...");
//   const data = await fetchData();
//   if (data) await updateFirebase(data);
// }, 5000);

// setInterval(trimTradesIfTooLarge, 5 * 60 * 1000);

// // Initial fetch
// fetchData().then(updateFirebase);

// // ======================
// // API Endpoint
// // ======================
// app.get("/", (req, res) => {
//   res.send("🚀 Optimized Zerodha trade tracker running with auto-backup");
// });

// const PORT = 3000;
// app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));







// const express = require("express");
// const admin = require("firebase-admin");
// require("dotenv").config();
// const { KiteConnect } = require("kiteconnect");
// const cors = require("cors"); // Added for React compatibility

// const app = express();
// app.use(express.json());
// app.use(cors()); // Enable CORS for React frontend

// // Initialize Firebase Admin
// admin.initializeApp({
//   credential: admin.credential.cert(require(process.env.FIREBASE_SERVICE_ACCOUNT)),
//   databaseURL: "https://traderapp-7e61b-default-rtdb.firebaseio.com/"
// });
// const db = admin.database();

// // Zerodha Kite Connect
// const kc = new KiteConnect({ api_key: process.env.API_KEY });
// kc.setAccessToken(process.env.ACCESS_TOKEN);

// // ----------------------
// // Helper functions
// // ----------------------
// const toEpochMs = (ts) => {
//   if (!ts) return 0;
//   if (typeof ts === "number") return ts;
//   const s = String(ts).trim();
//   const d1 = new Date(s);
//   if (!isNaN(d1.getTime())) return d1.getTime();
//   const d2 = new Date(s.replace(" ", "T"));
//   return isNaN(d2.getTime()) ? 0 : d2.getTime();
// };

// // ----------------------
// // Fetch wallet / funds
// // ----------------------
// const fetchFunds = async () => {
//   try {
//     const margins = await kc.getMargins();
//     const equity = margins?.equity || {};
//     const commodity = margins?.commodity || {};

//     const walletData = {
//       net: equity.net ?? 0,
//       available: {
//         cash: equity.available?.cash ?? 0,
//         live_balance: equity.available?.live_balance ?? 0
//       },
//       used: {
//         m2m_unrealised: equity.used?.m2m_unrealised ?? 0
//       },
//       commodity_net: commodity.net ?? 0,
//       timestamp: Date.now()
//     };

//     await db.ref("wallet").set(walletData);
//     console.log("💰 Wallet updated successfully");
//     return walletData;
//   } catch (error) {
//     console.error("❌ Error fetching wallet:", error.message);
//     throw error;
//   }
// };

// // ----------------------
// // Fetch portfolio holdings
// // ----------------------
// const fetchHoldings = async () => {
//   try {
//     const holdings = await kc.getHoldings();

//     const portfolioData = holdings.map(holding => ({
//       tradingsymbol: holding.tradingsymbol || "",
//       quantity: holding.quantity || 0,
//       average_price: holding.average_price || 0,
//       last_price: holding.last_price || 0,
//       pnl: holding.pnl || 0,
//       day_change: holding.day_change || 0,
//       day_change_percentage: holding.day_change_percentage || 0
//     }));

//     await db.ref("portfolio").set(portfolioData);
//     console.log(`📦 Portfolio updated: ${portfolioData.length} items`);
//     return portfolioData;
//   } catch (error) {
//     console.error("❌ Error fetching portfolio:", error.message);
//     throw error;
//   }
// };

// // ----------------------
// // Fetch positions
// // ----------------------
// const fetchPositions = async () => {
//   try {
//     const positions = await kc.getPositions();

//     const openPositions = (positions.net || []).map(position => ({
//       tradingsymbol: position.tradingsymbol || "",
//       quantity: position.quantity || 0,
//       average_price: position.average_price || 0,
//       last_price: position.last_price || 0,
//       pnl: position.pnl || 0,
//       m2m: position.m2m || 0,
//       status: "active"
//     }));

//     const positionsSummary = {
//       total_pnl: openPositions.reduce((sum, p) => sum + p.pnl, 0),
//       total_m2m: openPositions.reduce((sum, p) => sum + p.m2m, 0),
//       timestamp: Date.now()
//     };

//     await db.ref("open_positions").set(openPositions);
//     await db.ref("open_positions_summary").set(positionsSummary);
//     console.log(`📊 Positions updated: ${openPositions.length} items`);
//     return { positions: openPositions, summary: positionsSummary };
//   } catch (error) {
//     console.error("❌ Error fetching positions:", error.message);
//     throw error;
//   }
// };

// // ----------------------
// // Fetch executed trades
// // ----------------------
// const fetchTrades = async () => {
//   try {
//     const trades = await kc.getTrades();

//     const executedTrades = trades.map((trade) => {
//       const price = Number(
//         trade.average_price ?? trade.price ?? 0
//       );
//       const ts = toEpochMs(
//         trade.exchange_timestamp ||
//           trade.trade_timestamp ||
//           trade.order_timestamp ||
//           trade.timestamp
//       );

//       return {
//         tradingsymbol: trade.tradingsymbol || "",
//         type: trade.transaction_type || "",
//         qty: Number(trade.quantity ?? 0),
//         price, // keep for Flutter compatibility
//         avg_price: price,
//         exchange: trade.exchange || "",
//         product: trade.product || "",
//         order_id: trade.order_id || "",
//         timestamp: ts,
//         status: "complete",
//       };
//     });

//     // Sort latest first by numeric epoch
//     executedTrades.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

//     await db.ref("executed_trades").set(executedTrades);
//     console.log(`💱 Executed trades updated: ${executedTrades.length} total`);
//     return executedTrades;
//   } catch (error) {
//     console.error("❌ Error fetching trades:", error.message);
//     throw error;
//   }
// };

// // ----------------------
// // Fetch open orders
// // ----------------------
// const fetchOpenOrders = async () => {
//   try {
//     const orders = await kc.getOrders();

//     const openOrders = orders
//       .filter(order => ["OPEN", "TRIGGER PENDING"].includes(order.status))
//       .map(order => ({
//         order_id: order.order_id,
//         tradingsymbol: order.tradingsymbol || "",
//         status: order.status || "",
//         product: order.product || "",
//         quantity: order.quantity || 0,
//         price: order.price || 0,
//         order_type: order.order_type || "",
//         exchange: order.exchange || "",
//         transaction_type: order.transaction_type || "",
//         variety: order.variety || "",
//         validity: order.validity || "",
//         timestamp: order.order_timestamp || ""
//       }));

//     // Sort by timestamp
//     openOrders.sort((a, b) => 
//       new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
//     );

//     await db.ref("open_orders").set(openOrders);
//     console.log(`📝 Open orders updated: ${openOrders.length} items`);
//     return openOrders;
//   } catch (error) {
//     console.error("❌ Error fetching open orders:", error.message);
//     throw error;
//   }
// };

// // ----------------------
// // Initial Fetch
// // ----------------------
// console.log("🚀 Starting Zerodha Trade Tracker (React-compatible)...");
// Promise.all([
//   fetchFunds(),
//   fetchHoldings(),
//   fetchPositions(),
//   fetchTrades(),
//   fetchOpenOrders()
// ]).catch(err => console.error("Initial fetch error:", err));

// // ----------------------
// // Schedule periodic tasks
// // ----------------------
// setInterval(fetchFunds, 30000);      // every 30 sec
// setInterval(fetchHoldings, 60000);   // every 60 sec
// setInterval(fetchPositions, 20000);  // every 20 sec
// setInterval(fetchTrades, 10000);     // every 10 sec
// setInterval(fetchOpenOrders, 15000); // every 15 sec

// // ----------------------
// // API endpoints
// // ----------------------
// app.get("/", (req, res) => {
//   res.json({
//     status: "🚀 Zerodha Trade Tracker Running (React-compatible)",
//     endpoints: [
//       "/api/wallet",
//       "/api/portfolio",
//       "/api/positions",
//       "/api/trades",
//       "/api/open-orders",
//       "/api/refresh-all" // New endpoint for manual refresh
//     ],
//     timestamp: new Date().toISOString()
//   });
// });

// // Get wallet data
// app.get("/api/wallet", async (req, res) => {
//   try {
//     const snapshot = await db.ref("wallet").once("value");
//     res.json(snapshot.val());
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Get portfolio data
// app.get("/api/portfolio", async (req, res) => {
//   try {
//     const snapshot = await db.ref("portfolio").once("value");
//     res.json(snapshot.val());
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Get positions data
// app.get("/api/positions", async (req, res) => {
//   try {
//     const [positions, summary] = await Promise.all([
//       db.ref("open_positions").once("value"),
//       db.ref("open_positions_summary").once("value")
//     ]);
//     res.json({
//       positions: positions.val(),
//       summary: summary.val()
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Get trades data
// app.get("/api/trades", async (req, res) => {
//   try {
//     const snapshot = await db.ref("executed_trades").once("value");
//     res.json(snapshot.val());
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Get open orders data
// app.get("/api/open-orders", async (req, res) => {
//   try {
//     const snapshot = await db.ref("open_orders").once("value");
//     res.json(snapshot.val());
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // New endpoint to manually refresh all data
// app.get("/api/refresh-all", async (req, res) => {
//   try {
//     const results = await Promise.all([
//       fetchFunds(),
//       fetchHoldings(),
//       fetchPositions(),
//       fetchTrades(),
//       fetchOpenOrders()
//     ]);
    
//     res.json({
//       success: true,
//       results: {
//         wallet: results[0] !== undefined,
//         portfolio: results[1] !== undefined,
//         positions: results[2] !== undefined,
//         trades: results[3] !== undefined,
//         openOrders: results[4] !== undefined
//       }
//     });
//   } catch (error) {
//     res.status(500).json({ 
//       success: false,
//       error: error.message 
//     });
//   }
// });

// // ----------------------
// // Start server
// // ----------------------
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`🌐 Backend running on http://localhost:${PORT}`);
// });












const express = require("express");
const admin = require("firebase-admin");
require("dotenv").config();
const { KiteConnect } = require("kiteconnect");
const cors = require("cors"); // Added for React compatibility

const app = express();
app.use(express.json());
app.use(cors()); // Enable CORS for React frontend

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(require(process.env.FIREBASE_SERVICE_ACCOUNT)),
  databaseURL: "https://traderapp-7e61b-default-rtdb.firebaseio.com/"
});
const db = admin.database();

// Zerodha Kite Connect
const kc = new KiteConnect({ 
  api_key: process.env.API_KEY,
  debug: false // Set to true for development
});

// Set access token if available in env
if (process.env.ACCESS_TOKEN) {
  kc.setAccessToken(process.env.ACCESS_TOKEN);
}

// ----------------------
// Helper functions
// ----------------------
const toEpochMs = (ts) => {
  if (!ts) return 0;
  if (typeof ts === "number") return ts;
  const s = String(ts).trim();
  const d1 = new Date(s);
  if (!isNaN(d1.getTime())) return d1.getTime();
  const d2 = new Date(s.replace(" ", "T"));
  return isNaN(d2.getTime()) ? 0 : d2.getTime();
};

// ----------------------
// Fetch wallet / funds
// ----------------------
const fetchFunds = async () => {
  try {
    const margins = await kc.getMargins();
    const equity = margins?.equity || {};
    const commodity = margins?.commodity || {};

    const walletData = {
      net: equity.net ?? 0,
      available: {
        cash: equity.available?.cash ?? 0,
        live_balance: equity.available?.live_balance ?? 0
      },
      used: {
        m2m_unrealised: equity.used?.m2m_unrealised ?? 0
      },
      commodity_net: commodity.net ?? 0,
      timestamp: Date.now()
    };

    await db.ref("wallet").set(walletData);
    console.log("💰 Wallet updated successfully");
    return walletData;
  } catch (error) {
    console.error("❌ Error fetching wallet:", error.message);
    throw error;
  }
};

// ----------------------
// Fetch portfolio holdings
// ----------------------
const fetchHoldings = async () => {
  try {
    const holdings = await kc.getHoldings();

    const portfolioData = holdings.map(holding => ({
      tradingsymbol: holding.tradingsymbol || "",
      quantity: holding.quantity || 0,
      average_price: holding.average_price || 0,
      last_price: holding.last_price || 0,
      pnl: holding.pnl || 0,
      day_change: holding.day_change || 0,
      day_change_percentage: holding.day_change_percentage || 0
    }));

    await db.ref("portfolio").set(portfolioData);
    console.log(`📦 Portfolio updated: ${portfolioData.length} items`);
    return portfolioData;
  } catch (error) {
    console.error("❌ Error fetching portfolio:", error.message);
    throw error;
  }
};

// ----------------------
// Fetch positions
// ----------------------
const fetchPositions = async () => {
  try {
    const positions = await kc.getPositions();

    const openPositions = (positions.net || []).map(position => ({
      tradingsymbol: position.tradingsymbol || "",
      quantity: position.quantity || 0,
      average_price: position.average_price || 0,
      last_price: position.last_price || 0,
      pnl: position.pnl || 0,
      m2m: position.m2m || 0,
      status: "active"
    }));

    const positionsSummary = {
      total_pnl: openPositions.reduce((sum, p) => sum + p.pnl, 0),
      total_m2m: openPositions.reduce((sum, p) => sum + p.m2m, 0),
      timestamp: Date.now()
    };

    await db.ref("open_positions").set(openPositions);
    await db.ref("open_positions_summary").set(positionsSummary);
    console.log(`📊 Positions updated: ${openPositions.length} items`);
    return { positions: openPositions, summary: positionsSummary };
  } catch (error) {
    console.error("❌ Error fetching positions:", error.message);
    throw error;
  }
};

// ----------------------
// Fetch executed trades
// ----------------------
const fetchTrades = async () => {
  try {
    const trades = await kc.getTrades();

    const executedTrades = trades.map((trade) => {
      const price = Number(
        trade.average_price ?? trade.price ?? 0
      );
      const ts = toEpochMs(
        trade.exchange_timestamp ||
          trade.trade_timestamp ||
          trade.order_timestamp ||
          trade.timestamp
      );

      return {
        tradingsymbol: trade.tradingsymbol || "",
        type: trade.transaction_type || "",
        qty: Number(trade.quantity ?? 0),
        price, // keep for Flutter compatibility
        avg_price: price,
        exchange: trade.exchange || "",
        product: trade.product || "",
        order_id: trade.order_id || "",
        timestamp: ts,
        status: "complete",
      };
    });

    // Sort latest first by numeric epoch
    executedTrades.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

    await db.ref("executed_trades").set(executedTrades);
    console.log(`💱 Executed trades updated: ${executedTrades.length} total`);
    return executedTrades;
  } catch (error) {
    console.error("❌ Error fetching trades:", error.message);
    throw error;
  }
};

// ----------------------
// Fetch open orders
// ----------------------
const fetchOpenOrders = async () => {
  try {
    const orders = await kc.getOrders();

    const openOrders = orders
      .filter(order => ["OPEN", "TRIGGER PENDING"].includes(order.status))
      .map(order => ({
        order_id: order.order_id,
        tradingsymbol: order.tradingsymbol || "",
        status: order.status || "",
        product: order.product || "",
        quantity: order.quantity || 0,
        price: order.price || 0,
        order_type: order.order_type || "",
        exchange: order.exchange || "",
        transaction_type: order.transaction_type || "",
        variety: order.variety || "",
        validity: order.validity || "",
        timestamp: order.order_timestamp || ""
      }));

    // Sort by timestamp
    openOrders.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    await db.ref("open_orders").set(openOrders);
    console.log(`📝 Open orders updated: ${openOrders.length} items`);
    return openOrders;
  } catch (error) {
    console.error("❌ Error fetching open orders:", error.message);
    throw error;
  }
};

// ----------------------
// Initial Fetch
// ----------------------
console.log("🚀 Starting Zerodha Trade Tracker (React-compatible)...");
if (process.env.ACCESS_TOKEN) {
  Promise.all([
    fetchFunds(),
    fetchHoldings(),
    fetchPositions(),
    fetchTrades(),
    fetchOpenOrders()
  ]).catch(err => console.error("Initial fetch error:", err));
}

// ----------------------
// Schedule periodic tasks
// ----------------------
if (process.env.ACCESS_TOKEN) {
  setInterval(fetchFunds, 30000);      // every 30 sec
  setInterval(fetchHoldings, 60000);   // every 60 sec
  setInterval(fetchPositions, 20000);  // every 20 sec
  setInterval(fetchTrades, 10000);     // every 10 sec
  setInterval(fetchOpenOrders, 15000); // every 15 sec
}

// ----------------------
// API endpoints
// ----------------------
app.get("/", (req, res) => {
  res.json({
    status: "🚀 Zerodha Trade Tracker Running (React-compatible)",
    endpoints: [
      "/api/wallet",
      "/api/portfolio",
      "/api/positions",
      "/api/trades",
      "/api/open-orders",
      "/api/refresh-all",
      "/api/login",
      "/api/session",
      "/api/profile"
    ],
    timestamp: new Date().toISOString()
  });
});

// Get wallet data
app.get("/api/wallet", async (req, res) => {
  try {
    const snapshot = await db.ref("wallet").once("value");
    res.json(snapshot.val());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get portfolio data
app.get("/api/portfolio", async (req, res) => {
  try {
    const snapshot = await db.ref("portfolio").once("value");
    res.json(snapshot.val());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get positions data
app.get("/api/positions", async (req, res) => {
  try {
    const [positions, summary] = await Promise.all([
      db.ref("open_positions").once("value"),
      db.ref("open_positions_summary").once("value")
    ]);
    res.json({
      positions: positions.val(),
      summary: summary.val()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get trades data
app.get("/api/trades", async (req, res) => {
  try {
    const snapshot = await db.ref("executed_trades").once("value");
    res.json(snapshot.val());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get open orders data
app.get("/api/open-orders", async (req, res) => {
  try {
    const snapshot = await db.ref("open_orders").once("value");
    res.json(snapshot.val());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// New endpoint to manually refresh all data
app.get("/api/refresh-all", async (req, res) => {
  try {
    const results = await Promise.all([
      fetchFunds(),
      fetchHoldings(),
      fetchPositions(),
      fetchTrades(),
      fetchOpenOrders()
    ]);
    
    res.json({
      success: true,
      results: {
        wallet: results[0] !== undefined,
        portfolio: results[1] !== undefined,
        positions: results[2] !== undefined,
        trades: results[3] !== undefined,
        openOrders: results[4] !== undefined
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

// ----------------------
// Zerodha OAuth endpoints
// ----------------------

// Get login URL
app.get('/api/login', (req, res) => {
  try {
    const loginUrl = kc.getLoginURL();
    res.json({ loginUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Generate session from request token
app.get('/api/session', async (req, res) => {
  try {
    const { request_token } = req.query;
    if (!request_token) {
      return res.status(400).json({ error: 'Request token is required' });
    }

    const session = await kc.generateSession(request_token, process.env.API_SECRET);
    
    // Store the access token for future use
    kc.setAccessToken(session.access_token);
    
    res.json({
      access_token: session.access_token,
      public_token: session.public_token,
      refresh_token: session.refresh_token
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user profile
app.get('/api/profile', async (req, res) => {
  try {
    // Check for access token
    if (!kc.accessToken) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    const profile = await kc.getProfile();
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ----------------------
// Start server
// ----------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🌐 Backend running on http://localhost:${PORT}`);
});