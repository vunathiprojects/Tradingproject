



// // src/App.js
// import React, { useEffect, useState } from "react";
// import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
// import { db, auth } from "./firebase";
// import { ref, onValue } from "firebase/database";
// import { onAuthStateChanged } from "firebase/auth";

// // Pages
// import Web from "./pages/Web"; // Landing page
// import HomePage from "./pages/HomePage";
// import DashboardPage from "./pages/DashboardPage";
// import AccountPage from "./pages/AccountPage";
// import WalletPage from "./pages/WalletPage";
// import LiveTradesPage from "./pages/LiveTradesPage";
// import Navbar from "./pages/Navbar";
// import LoginPage from "./pages/LoginPage";

// // Layout for authenticated users
// const AuthenticatedLayout = () => {
//   return (
//     <>
//       <Navbar />
//       <div style={{ maxWidth: 1400, margin: "0 auto", padding: 20, marginTop: "80px" }}>
//         <Outlet />
//       </div>
//     </>
//   );
// };

// export default function App() {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // User data states
//   const [account, setAccount] = useState({});
//   const [wallet, setWallet] = useState({});
//   const [trades, setTrades] = useState([]);
//   const [positions, setPositions] = useState([]);
//   const [holdings, setHoldings] = useState([]);
//   const [summary, setSummary] = useState({});

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       setUser(user);
//       setLoading(false);
//     });
//     return () => unsubscribe();
//   }, []);

//   useEffect(() => {
//     if (!user) return;

//     const BASE_PATH = `users/${user.uid}`;
//     const accountRef = ref(db, `${BASE_PATH}/profile`);
//     const walletRef = ref(db, `${BASE_PATH}/wallet`);
//     const tradesRef = ref(db, `${BASE_PATH}/trades`);
//     const positionsRef = ref(db, `${BASE_PATH}/positions`);
//     const holdingsRef = ref(db, `${BASE_PATH}/holdings`);
//     const summaryRef = ref(db, `${BASE_PATH}/summary`);

//     const unsubAccount = onValue(accountRef, (snap) => snap.exists() && setAccount(snap.val()));
//     const unsubWallet = onValue(walletRef, (snap) => snap.exists() && setWallet(snap.val()));
//     const unsubTrades = onValue(tradesRef, (snap) => {
//       const data = snap.val();
//       setTrades(data ? Object.values(data).reverse() : []);
//     });
//     const unsubPositions = onValue(positionsRef, (snap) => {
//       setPositions(snap.exists() ? Object.values(snap.val()) : []);
//     });
//     const unsubHoldings = onValue(holdingsRef, (snap) => {
//       setHoldings(snap.exists() ? Object.values(snap.val()) : []);
//     });
//     const unsubSummary = onValue(summaryRef, (snap) => {
//       setSummary(snap.exists() ? snap.val() : {});
//     });

//     return () => {
//       unsubAccount();
//       unsubWallet();
//       unsubTrades();
//       unsubPositions();
//       unsubHoldings();
//       unsubSummary();
//     };
//   }, [user]);

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <Router>
//       <Routes>
//         {user ? (
//           // Authenticated routes
//           <Route element={<AuthenticatedLayout />}>
//             <Route
//               path="/"
//               element={<HomePage wallet={wallet} accessTokenTimestamp={wallet.timestamp} />}
//             />
//             <Route
//               path="/dashboard"
//               element={
//                 <DashboardPage
//                   summary={summary}
//                   positions={positions}
//                   holdings={holdings}
//                   orders={trades}
//                 />
//               }
//             />
//             <Route path="/account" element={<AccountPage account={account} />} />
//             <Route path="/wallet" element={<WalletPage wallet={wallet} />} />
//             <Route path="/trades" element={<LiveTradesPage trades={trades} />} />
//             <Route path="*" element={<Navigate to="/" replace />} />
//           </Route>
//         ) : (
//           // Public routes
//           <>
//             <Route path="/" element={<Web />} /> {/* Landing page */}
//             <Route path="/login" element={<LoginPage />} />
//             <Route path="*" element={<Navigate to="/" replace />} />
//           </>
//         )}
//       </Routes>
//     </Router>
//   );
// }



// src/App.js
import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { db, auth } from "./firebase";
import { ref, onValue } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";

// Pages
import Web from "./pages/Web"; // Landing page
import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/DashboardPage";
import AccountPage from "./pages/AccountPage";
import WalletPage from "./pages/WalletPage";
import LiveTradesPage from "./pages/LiveTradesPage";
import Navbar from "./pages/Navbar";
import LoginPage from "./pages/LoginPage";

// A wrapper component to set the document title
const Page = ({ title, children }) => {
  useEffect(() => {
    document.title = `${title} | Vunathi Capital-Trading Platform`;
  }, [title]);
  return children;
};


// Layout for authenticated users
const AuthenticatedLayout = () => {
  return (
    <>
      <Navbar />
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: 20, marginTop: "80px" }}>
        <Outlet />
      </div>
    </>
  );
};

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // User data states
  const [account, setAccount] = useState({});
  const [wallet, setWallet] = useState({});
  const [trades, setTrades] = useState([]);
  const [positions, setPositions] = useState([]);
  const [holdings, setHoldings] = useState([]);
  const [summary, setSummary] = useState({});

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;

    const BASE_PATH = `users/${user.uid}`;
    const accountRef = ref(db, `${BASE_PATH}/profile`);
    const walletRef = ref(db, `${BASE_PATH}/wallet`);
    const tradesRef = ref(db, `${BASE_PATH}/trades`);
    const positionsRef = ref(db, `${BASE_PATH}/positions`);
    const holdingsRef = ref(db, `${BASE_PATH}/holdings`);
    const summaryRef = ref(db, `${BASE_PATH}/summary`);

    const unsubAccount = onValue(accountRef, (snap) => snap.exists() && setAccount(snap.val()));
    const unsubWallet = onValue(walletRef, (snap) => snap.exists() && setWallet(snap.val()));
    const unsubTrades = onValue(tradesRef, (snap) => {
      const data = snap.val();
      setTrades(data ? Object.values(data).reverse() : []);
    });
    const unsubPositions = onValue(positionsRef, (snap) => {
      setPositions(snap.exists() ? Object.values(snap.val()) : []);
    });
    const unsubHoldings = onValue(holdingsRef, (snap) => {
      setHoldings(snap.exists() ? Object.values(snap.val()) : []);
    });
    const unsubSummary = onValue(summaryRef, (snap) => {
      setSummary(snap.exists() ? snap.val() : {});
    });

    return () => {
      unsubAccount();
      unsubWallet();
      unsubTrades();
      unsubPositions();
      unsubHoldings();
      unsubSummary();
    };
  }, [user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        {user ? (
          // Authenticated routes
          <Route element={<AuthenticatedLayout />}>
            <Route
              path="/"
              element={
                <Page title="Home">
                  <HomePage wallet={wallet} accessTokenTimestamp={wallet.timestamp} />
                </Page>
              }
            />
            <Route
              path="/dashboard"
              element={
                <Page title="Dashboard">
                  <DashboardPage
                    summary={summary}
                    positions={positions}
                    holdings={holdings}
                    orders={trades}
                  />
                </Page>
              }
            />
            <Route
              path="/account"
              element={
                <Page title="Account">
                  <AccountPage account={account} />
                </Page>
              }
            />
            <Route
              path="/wallet"
              element={
                <Page title="Wallet">
                  <WalletPage wallet={wallet} />
                </Page>
              }
            />
            <Route
              path="/trades"
              element={
                <Page title="Live Trades">
                  <LiveTradesPage trades={trades} />
                </Page>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        ) : (
          // Public routes
          <>
            <Route
              path="/"
              element={
                <Page title="Landing Website">
                  <Web />
                </Page>
              }
            />
            <Route
              path="/login"
              element={
                <Page title="Login">
                  <LoginPage />
                </Page>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        )}
      </Routes>
    </Router>
  );
}





