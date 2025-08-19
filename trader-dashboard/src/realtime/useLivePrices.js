// // // src/realtime/useLivePrices.js
// // import { useEffect, useMemo, useRef, useState } from "react";

// // /**
// //  * Live price hook
// //  * - Connects to a WebSocket feed that sends messages like: { symbol: "ICICIBANK", ltp: 1447.2 }
// //  * - Auto-reconnects with backoff.
// //  * - If no WS is available, it runs a harmless mock "random-walk" so you can see the UI update.
// //  *
// //  * Set REACT_APP_FEED_URL to your relay, e.g. ws://localhost:7001
// //  */
// // export default function useLivePrices(symbols = []) {
// //   const FEED_URL = process.env.REACT_APP_FEED_URL || ""; // empty => mock mode
// //   const [livePrices, setLivePrices] = useState({});
// //   const [status, setStatus] = useState(FEED_URL ? "connecting" : "mock mode");
// //   const wsRef = useRef(null);
// //   const subSentRef = useRef(false);
// //   const mockTimerRef = useRef(null);

// //   const symSet = useMemo(() => Array.from(new Set(symbols.filter(Boolean))), [symbols]);

// //   // Helper: send subscription list when socket is open
// //   const sendSubscription = () => {
// //     if (!wsRef.current || wsRef.current.readyState !== 1) return;
// //     if (!subSentRef.current && symSet.length) {
// //       wsRef.current.send(JSON.stringify({ action: "subscribe", symbols: symSet }));
// //       subSentRef.current = true;
// //     }
// //   };

// //   useEffect(() => {
// //     // If no URL, start mock mode
// //     if (!FEED_URL) {
// //       setStatus("mock mode");
// //       // Initialize base prices
// //       const base = {};
// //       symSet.forEach(s => { base[s] = base[s] || 100 + Math.random() * 100; });
// //       setLivePrices(base);

// //       if (mockTimerRef.current) clearInterval(mockTimerRef.current);
// //       mockTimerRef.current = setInterval(() => {
// //         setLivePrices(prev => {
// //           const next = { ...prev };
// //           symSet.forEach(s => {
// //             const cur = next[s] ?? (100 + Math.random() * 100);
// //             // tiny random walk so P&L wiggles
// //             next[s] = Number((cur + (Math.random() - 0.5) * 0.6).toFixed(2));
// //           });
// //           return next;
// //         });
// //       }, 1000);

// //       return () => {
// //         if (mockTimerRef.current) clearInterval(mockTimerRef.current);
// //       };
// //     }

// //     // Real WS mode
// //     let retry = 0;
// //     let closedByUser = false;

// //     const connect = () => {
// //       try {
// //         setStatus("connecting");
// //         const ws = new WebSocket(FEED_URL);
// //         wsRef.current = ws;

// //         ws.onopen = () => {
// //           setStatus("live");
// //           retry = 0;
// //           subSentRef.current = false;
// //           sendSubscription();
// //         };

// //         ws.onmessage = (evt) => {
// //           try {
// //             const msg = JSON.parse(evt.data);
// //             // Accept single or batched messages
// //             const list = Array.isArray(msg) ? msg : [msg];
// //             setLivePrices(prev => {
// //               const next = { ...prev };
// //               list.forEach(t => {
// //                 if (t && t.symbol && Number.isFinite(Number(t.ltp))) {
// //                   next[t.symbol] = Number(t.ltp);
// //                 }
// //               });
// //               return next;
// //             });
// //           } catch {
// //             // ignore malformed messages
// //           }
// //         };

// //         ws.onclose = () => {
// //           wsRef.current = null;
// //           if (closedByUser) return;
// //           retry++;
// //           const delay = Math.min(1000 * 2 ** retry, 15000);
// //           setStatus(`reconnecting (${retry})`);
// //           setTimeout(connect, delay);
// //         };

// //         ws.onerror = () => {
// //           // let onclose handle retry
// //         };
// //       } catch {
// //         // try again later
// //         retry++;
// //         const delay = Math.min(1000 * 2 ** retry, 15000);
// //         setStatus(`reconnecting (${retry})`);
// //         setTimeout(connect, delay);
// //       }
// //     };

// //     connect();
// //     return () => {
// //       const ws = wsRef.current;
// //       if (ws && ws.readyState <= 1) {
// //         // 0 = connecting, 1 = open
// //         ws.close();
// //       }
// //       wsRef.current = null;
// //     };
// //     // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, [FEED_URL, JSON.stringify(symSet)]);

// //   // If socket opens later, send subscription then
// //   useEffect(() => {
// //     const id = setInterval(sendSubscription, 500);
// //     return () => clearInterval(id);
// //     // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, [symSet.length]);

// //   return { livePrices, status };
// // }


// // src/realtime/useLivePrices.js
// import { useEffect, useMemo, useRef, useState } from "react";

// /**
//  * useLivePrices(instruments, options?)
//  *
//  * instruments: Array<string | { key: string, token?: number|string, exchange?: string }>
//  *    - string form: "ICICIBANK"
//  *    - object form: { key: "ICICIBANK", token: 1270529, exchange: "NSE" }
//  *
//  * options:
//  *    - unit: "auto" | "rupees" | "paise"  (default: auto)
//  *    - throttleMs: number (default: 200)
//  *
//  * Returns: { livePrices: Record<string, number>, status: "idle"|"connecting"|"connected"|"fallback"|"disconnected" }
//  *
//  * How to feed ticks:
//  *  A) Zerodha example (pseudo, put this in your app bootstrap once):
//  *     const ticker = new KiteTicker({ api_key, access_token });
//  *     window.__attachTickSource((emit) => {
//  *       ticker.connect();
//  *       ticker.on('connect', () => {
//  *         // subscribe tokens
//  *         emit({ type: 'status', value: 'connected' });
//  *       });
//  *       ticker.on('ticks', (ticks) => {
//  *         ticks.forEach(t => emit({ type: 'tick', symbolKey: t.instrument_token, ltp: t.last_price, meta: { provider: 'kite' } }));
//  *       });
//  *       return () => ticker.disconnect();
//  *     });
//  *
//  *  B) You can also push your own ticks anywhere:
//  *     window.__pushTick({ symbolKey: "ICICIBANK", ltp: 1447.25 }); // symbolKey must match instruments[i].key
//  */

// const DEFAULT_OPTS = {
//   unit: "auto",
//   throttleMs: 200,
// };

// function normalizeInput(instruments) {
//   // Normalize to { key, token, exchange }
//   return (instruments || [])
//     .filter(Boolean)
//     .map((it) =>
//       typeof it === "string"
//         ? { key: normalizeSymbol(it), token: undefined, exchange: "NSE" }
//         : {
//             key: normalizeSymbol(it.key || it.tradingsymbol || it.symbol || ""),
//             token: it.token ?? it.instrument_token ?? it.instrumentToken ?? it.tokenId,
//             exchange: it.exchange || "NSE",
//           }
//     )
//     .filter((x) => x.key);
// }

// function normalizeSymbol(sym) {
//   if (!sym || typeof sym !== "string") return "";
//   // Remove common suffixes like -EQ, .NS, space variants
//   return sym
//     .replace(/(\.NS|\.NSE|\.BSE)$/i, "")
//     .replace(/-EQ$/i, "")
//     .replace(/\s+/g, "")
//     .toUpperCase();
// }

// function autoScaleRupees(raw, unitHint) {
//   if (raw == null || !isFinite(raw)) return undefined;

//   if (unitHint === "rupees") return Number(raw);
//   if (unitHint === "paise") return Number(raw) / 100;

//   // AUTO: detect paise (commonly whole numbers like 144725 for ₹1447.25)
//   const n = Number(raw);
//   // Heuristics:
//   // - If n > 20000 and divisible by 5 or 10 frequently -> likely paise
//   // - Or if n is integer and > 5000 -> likely paise
//   if (n > 5000 && Number.isInteger(n)) return n / 100;

//   // If value is extremely large and multiple of 100 -> divide
//   if (n > 100000 && n % 100 === 0) return n / 100;

//   return n;
// }

// export default function useLivePrices(instruments, options = {}) {
//   const opts = { ...DEFAULT_OPTS, ...options };
//   const [status, setStatus] = useState("idle");
//   const [livePrices, setLivePrices] = useState({});
//   const norm = useMemo(() => normalizeInput(instruments), [instruments]);

//   const lastFlushRef = useRef(0);
//   const bufferRef = useRef({}); // { key: ltpRupees }
//   const unsubRef = useRef(null);

//   // Emit function that any source can use to push ticks
//   const emitRef = useRef(null);
//   if (!emitRef.current) {
//     emitRef.current = (evt) => {
//       if (!evt || typeof evt !== "object") return;

//       if (evt.type === "status") {
//         setStatus(String(evt.value || ""));
//         return;
//       }

//       if (evt.type === "tick") {
//         // evt.symbolKey can be token or normalized symbol, try to map
//         const key = normalizeSymbol(evt.symbolKey);
//         const scaled = autoScaleRupees(evt.ltp, opts.unit);
//         if (!isFinite(scaled)) return;

//         bufferRef.current[key] = scaled;
//         // throttle flush
//         const now = Date.now();
//         if (now - lastFlushRef.current > opts.throttleMs) {
//           lastFlushRef.current = now;
//           setLivePrices((prev) => ({ ...prev, ...bufferRef.current }));
//           bufferRef.current = {};
//         }
//       }
//     };
//   }

//   // Attach a global helper so you can push ticks without touching this hook:
//   useEffect(() => {
//     const oldPush = window.__pushTick;
//     window.__pushTick = function (payload) {
//       emitRef.current?.({ type: "tick", ...payload });
//     };

//     const oldAttach = window.__attachTickSource;
//     window.__attachTickSource = function (attachFn) {
//       // attachFn(emit) => returns unsubscribe
//       try {
//         setStatus("connecting");
//         const unsub = attachFn(emitRef.current);
//         unsubRef.current = typeof unsub === "function" ? unsub : null;
//       } catch (e) {
//         setStatus("fallback");
//       }
//     };

//     return () => {
//       window.__pushTick = oldPush;
//       window.__attachTickSource = oldAttach;
//     };
//   }, []);

//   // (Optional) Try to auto-attach if a provider is already exposed globally.
//   // We don't hard-code any provider here; you (the app) should call window.__attachTickSource(...)
//   useEffect(() => {
//     // If no external attach was called, we stay idle/fallback and simply not override anything.
//     // You can display 'Live feed: fallback' in UI in that case.
//     // We still mark connected if someone is pushing via __pushTick.
//     if (status === "idle") setStatus("fallback");
//   }, [status]);

//   // Build a map from different symbols/tokens to our keys so __pushTick can match by either
//   const aliasMap = useMemo(() => {
//     const map = new Map();
//     norm.forEach(({ key, token }) => {
//       if (key) map.set(normalizeSymbol(key), key);
//       if (token != null) map.set(normalizeSymbol(String(token)), key);
//     });
//     return map;
//   }, [norm]);

//   // Remap buffered updates that arrived with token to the position key
//   useEffect(() => {
//     const id = setInterval(() => {
//       const buf = bufferRef.current;
//       const remapped = {};
//       let changed = false;
//       Object.keys(buf).forEach((k) => {
//         const targetKey = aliasMap.get(k) || k;
//         const val = buf[k];
//         if (isFinite(val)) {
//           remapped[targetKey] = val;
//           changed = true;
//         }
//       });
//       if (changed) {
//         setLivePrices((prev) => ({ ...prev, ...remapped }));
//         bufferRef.current = {};
//       }
//     }, Math.max(250, opts.throttleMs));
//     return () => clearInterval(id);
//   }, [aliasMap, opts.throttleMs]);

//   // Cleanup external source if it registered one
//   useEffect(() => {
//     return () => {
//       if (unsubRef.current) {
//         try {
//           unsubRef.current();
//         } catch {}
//       }
//       setStatus("disconnected");
//     };
//   }, []);

//   return { livePrices, status };
// }
