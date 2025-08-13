

// // index.js this code is ok

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


const express = require("express");
const admin = require("firebase-admin");
require("dotenv").config();
const { KiteConnect } = require("kiteconnect");

const app = express();
app.use(express.json());

// Firebase Admin Setup
admin.initializeApp({
  credential: admin.credential.cert(require(process.env.FIREBASE_SERVICE_ACCOUNT)),
  databaseURL: "https://traderapp-7e61b-default-rtdb.firebaseio.com/"
});
const db = admin.database();

// Zerodha Kite Connect Setup
const kc = new KiteConnect({ api_key: process.env.API_KEY });
kc.setAccessToken(process.env.ACCESS_TOKEN);

// Data Caching
const dataCache = {
  profile: null,
  wallet: null,
  positions: null,
  orders: null,
  lastUpdated: Date.now()
};

// Data processors
const processProfile = (data) => ({
  name: data.user_name || "",
  user_id: data.user_id || "",
  email: data.email || "",
  broker: data.broker || "ZERODHA",
  mobile: data.phone_number || "Not Available",
  timestamp: Date.now()
});

const processWallet = (data) => {
  const equity = data?.equity || {};
  return {
    net: equity.net ?? 0,
    cash: equity.available?.cash ?? 0,
    invested: equity.used?.margin ?? 0,
    pnl: equity.pnl ?? 0,
    timestamp: Date.now()
  };
};

const processPositions = (data) => {
  return data?.net?.filter(pos => pos.quantity !== 0) || [];
};

const processOrders = (data) => {
  return data
    .filter(o => o.status === "COMPLETE")
    .map(o => ({
      symbol: o.tradingsymbol || "",
      qty: o.quantity ?? 0,
      price: o.average_price ?? 0,
      pnl: o.pnl ?? 0,
      status: o.status || "",
      type: o.transaction_type || "",
      timestamp: Date.now()
    }))
    .slice(0, 8);
};

// Unified data fetcher
const fetchData = async () => {
  try {
    const [profile, margins, positions, orders] = await Promise.all([
      kc.getProfile(),
      kc.getMargins(),
      kc.getPositions(),
      kc.getOrders()
    ]);
    
    return {
      profile: processProfile(profile),
      wallet: processWallet(margins),
      positions: processPositions(positions),
      orders: processOrders(orders)
    };
  } catch (error) {
    console.error("Error fetching data:", error.message);
    return null;
  }
};

// Batched Firebase update
const updateFirebase = async (data) => {
  if (!data) return;
  
  const updates = {};
  const now = Date.now();
  
  // Only update if data has changed
  if (JSON.stringify(data.profile) !== JSON.stringify(dataCache.profile)) {
    updates['account'] = data.profile;
    dataCache.profile = data.profile;
  }
  
  if (JSON.stringify(data.wallet) !== JSON.stringify(dataCache.wallet)) {
    updates['wallet'] = data.wallet;
    dataCache.wallet = data.wallet;
  }
  
  if (JSON.stringify(data.positions) !== JSON.stringify(dataCache.positions)) {
    updates['dashboard/positions'] = data.positions;
    dataCache.positions = data.positions;
  }
  
  if (JSON.stringify(data.orders) !== JSON.stringify(dataCache.orders)) {
    updates['trades'] = data.orders;
    dataCache.orders = data.orders;
  }
  
  // Update dashboard summary
  const summary = {
    portfolioValue: (data.wallet.net || 0),
    holdingsValue: (data.wallet.invested || 0),
    funds: (data.wallet.cash || 0),
    pnlToday: (data.wallet.pnl || 0),
    timestamp: now
  };
  
  if (JSON.stringify(summary) !== JSON.stringify(dataCache.summary)) {
    updates['dashboard/summary'] = summary;
    dataCache.summary = summary;
  }
  
  // Perform batched update if there are changes
  if (Object.keys(updates).length > 0) {
    await db.ref().update(updates);
    console.log("🔥 Firebase updated with", Object.keys(updates).length, "changes");
    dataCache.lastUpdated = now;
  }
};

// Periodic synchronization (5 seconds)
setInterval(async () => {
  console.log("🔄 Syncing data...");
  const data = await fetchData();
  if (data) await updateFirebase(data);
}, 5000);

// Initial fetch
fetchData().then(updateFirebase);

// Test API Endpoint
app.get("/", (req, res) => {
  res.send("🚀 Optimized Zerodha trade tracker running");
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));