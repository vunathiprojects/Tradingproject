// import React, { useState, useEffect } from "react";
// import {
//   TrendingUp, TrendingDown, BarChart3, DollarSign, PieChart,
//   Activity, Zap, Target, ArrowUpRight, ArrowDownRight, Coins, CandlestickChart
// } from "lucide-react";
// import { signInWithEmailAndPassword } from "firebase/auth";
// import { auth } from "../firebase";  // your firebase config file
// import { useNavigate } from "react-router-dom";

// export default function LoginPage() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
//   // const { KiteConnect } = require("kiteconnect");

//   const navigate = useNavigate();

//   // Track mouse position for follower effect
//   useEffect(() => {
//     const handleMouseMove = e => setMousePosition({ x: e.clientX, y: e.clientY });
//     window.addEventListener("mousemove", handleMouseMove);
//     return () => window.removeEventListener("mousemove", handleMouseMove);
//   }, []);

//   // Handle login submit
//   const handleSubmit = async e => {
//     e.preventDefault();
//     setError(null);
//     setLoading(true);

//     try {
//       await signInWithEmailAndPassword(auth, email, password);
//       // Redirect to dashboard/home on success
//       navigate("/dashboard");
//     } catch (err) {
//       setError(err.message);
//       setLoading(false);
//     }
//   };

//   // Floating icon component for animated background
//   const FloatingIcon = ({ Icon, delay, duration, x, y, size = 20, opacity = 0.1 }) => (
//     <div
//       className="absolute animate-pulse"
//       style={{
//         left: `${x}%`,
//         top: `${y}%`,
//         animationDelay: `${delay}s`,
//         animationDuration: `${duration}s`,
//         userSelect: "none",
//         pointerEvents: "none",
//       }}
//     >
//       <Icon size={size} className="text-blue-400" style={{ opacity }} />
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-blue-900 flex items-center justify-center relative overflow-hidden">
//       {/* Background Grid */}
//       <div className="absolute inset-0 opacity-20">
//         <div
//           className="w-full h-full"
//           style={{
//             backgroundImage: `
//               linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
//               linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
//             `,
//             backgroundSize: "50px 50px",
//           }}
//         />
//       </div>

//       {/* Floating icons */}
//       <FloatingIcon Icon={TrendingUp} delay={0} duration={4} x={10} y={20} size={24} opacity={0.15} />
//       <FloatingIcon Icon={TrendingDown} delay={1} duration={5} x={85} y={15} size={28} opacity={0.12} />
//       <FloatingIcon Icon={BarChart3} delay={2} duration={3} x={15} y={70} size={22} opacity={0.18} />
//       <FloatingIcon Icon={DollarSign} delay={0.5} duration={4.5} x={80} y={75} size={26} opacity={0.14} />
//       <FloatingIcon Icon={PieChart} delay={1.5} duration={3.5} x={5} y={50} size={20} opacity={0.16} />
//       <FloatingIcon Icon={Activity} delay={2.5} duration={4} x={90} y={45} size={24} opacity={0.13} />
//       <FloatingIcon Icon={Zap} delay={0.8} duration={3.2} x={25} y={25} size={18} opacity={0.17} />
//       <FloatingIcon Icon={Target} delay={1.8} duration={4.8} x={75} y={30} size={22} opacity={0.11} />
//       <FloatingIcon Icon={ArrowUpRight} delay={2.2} duration={3.8} x={12} y={40} size={20} opacity={0.15} />
//       <FloatingIcon Icon={ArrowDownRight} delay={1.2} duration={4.2} x={88} y={60} size={24} opacity={0.12} />
//       <FloatingIcon Icon={Coins} delay={0.3} duration={5.2} x={30} y={80} size={26} opacity={0.14} />
//       <FloatingIcon Icon={CandlestickChart} delay={2.8} duration={3.6} x={70} y={20} size={28} opacity={0.16} />

//       {/* Mouse follower effect */}
//       <div
//         className="fixed pointer-events-none z-10"
//         style={{
//           left: mousePosition.x - 100,
//           top: mousePosition.y - 100,
//           width: 200,
//           height: 200,
//           borderRadius: "50%",
//           background: "radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)",
//           transition: "all 0.3s",
//           userSelect: "none",
//           pointerEvents: "none",
//         }}
//       />

//       {/* Login form */}
//       <div className="relative z-20 w-full max-w-md mx-4">
//         <div className="bg-black/80 backdrop-blur-xl border border-blue-500/30 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
//           <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-transparent to-blue-600/20 rounded-2xl" />

//           <div className="text-center mb-8 relative z-10">
//             <div className="flex justify-center items-center space-x-3 mb-4">
//               <div className="p-3 bg-blue-600/20 rounded-full border border-blue-500/30">
//                 <TrendingUp className="text-blue-400" size={32} />
//               </div>
//               <div className="p-2 bg-blue-600/10 rounded-full border border-blue-500/20 animate-pulse">
//                 <BarChart3 className="text-blue-300" size={24} />
//               </div>
//             </div>

//             <h1 className="text-3xl font-bold text-white mb-2">
//               Trading <span className="text-blue-400">Portal</span>
//             </h1>
//             <p className="text-gray-400">Access your dashboard securely</p>
//           </div>

//           <form className="space-y-6 relative z-10" onSubmit={handleSubmit}>
//             {/* Email */}
//             <div>
//               <label htmlFor="email" className="block text-sm font-semibold text-gray-300 flex items-center">
//                 <DollarSign className="mr-2" size={16} />
//                 Email Address
//               </label>
//               <input
//                 id="email"
//                 type="email"
//                 required
//                 value={email}
//                 placeholder="your.email@example.com"
//                 className="w-full bg-gray-900/50 border border-blue-500/30 rounded-xl px-4 py-3 placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 onChange={e => setEmail(e.target.value)}
//                 disabled={loading}
//               />
//             </div>

//             {/* Password */}
//             <div>
//               <label htmlFor="password" className="block text-sm font-semibold text-gray-300 flex items-center">
//                 <Target className="mr-2" size={16} />
//                 Password
//               </label>
//               <input
//                 id="password"
//                 type="password"
//                 required
//                 value={password}
//                 placeholder="Your secure password"
//                 className="w-full bg-gray-900/50 border border-blue-500/30 rounded-xl px-4 py-3 placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 onChange={e => setPassword(e.target.value)}
//                 disabled={loading}
//               />
//             </div>

//             {/* Error Message */}
//             {error && (
//               <div className="bg-red-600/60 rounded-md p-2 text-center text-red-100 font-medium">
//                 {error}
//               </div>
//             )}

//             {/* Submit Button */}
//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-xl px-6 py-3 flex items-center justify-center space-x-2 disabled:opacity-60"
//             >
//               {loading ? (
//                 <>
//                   <svg className="animate-spin h-5 w-5 mr-2 border-2 border-white border-t-transparent rounded-full" />
//                   Authenticating...
//                 </>
//               ) : (
//                 <>
//                   <TrendingUp size={20} />
//                   <span>Access Dashboard</span>
//                 </>
//               )}
//             </button>
//           </form>

//           {/* Footer */}
//           <div className="mt-8 flex justify-between text-sm text-gray-400">
//             <button
//               type="button"
//               onClick={() => alert("Forgot password not implemented yet")}
//               className="flex items-center space-x-1 hover:text-blue-400"
//             >
//               <ArrowUpRight size={14} />
//               <span>Forgot password?</span>
//             </button>

//             <button
//               type="button"
//               onClick={() => alert("Signup workflow not implemented yet")}
//               className="flex items-center space-x-1 hover:text-blue-400"
//             >
//               <span>Create account</span>
//               <ArrowUpRight size={14} />
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Add your CSS or Tailwind config for animations e.g. pulse */}
//       <style jsx>{`
//         @keyframes pulse {
//           0%, 100% { opacity: 0.8; }
//           50% { opacity: 0.2; }
//         }
//         .animate-pulse {
//           animation: pulse 3s ease-in-out infinite;
//         }
//       `}</style>
//     </div>
//   );
// }


import React, { useState, useEffect } from "react";
import {
  TrendingUp, TrendingDown, BarChart3, DollarSign, PieChart,
  Activity, Zap, Target, ArrowUpRight, ArrowDownRight, Coins, CandlestickChart
} from "lucide-react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";  // your firebase config file
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  // const { KiteConnect } = require("kiteconnect");

  const navigate = useNavigate();

  // Track mouse position for follower effect
  useEffect(() => {
    const handleMouseMove = e => setMousePosition({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Handle login submit
  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Redirect to dashboard/home on success
      navigate("/homepage");
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  // Floating icon component for animated background
  const FloatingIcon = ({ Icon, delay, duration, x, y, size = 20, opacity = 0.1 }) => (
    <div
      className="absolute animate-pulse"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`,
        userSelect: "none",
        pointerEvents: "none",
      }}
    >
      <Icon size={size} className="text-blue-400" style={{ opacity }} />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-blue-900 flex items-center justify-center relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Floating icons */}
      <FloatingIcon Icon={TrendingUp} delay={0} duration={4} x={10} y={20} size={24} opacity={0.15} />
      <FloatingIcon Icon={TrendingDown} delay={1} duration={5} x={85} y={15} size={28} opacity={0.12} />
      <FloatingIcon Icon={BarChart3} delay={2} duration={3} x={15} y={70} size={22} opacity={0.18} />
      <FloatingIcon Icon={DollarSign} delay={0.5} duration={4.5} x={80} y={75} size={26} opacity={0.14} />
      <FloatingIcon Icon={PieChart} delay={1.5} duration={3.5} x={5} y={50} size={20} opacity={0.16} />
      <FloatingIcon Icon={Activity} delay={2.5} duration={4} x={90} y={45} size={24} opacity={0.13} />
      <FloatingIcon Icon={Zap} delay={0.8} duration={3.2} x={25} y={25} size={18} opacity={0.17} />
      <FloatingIcon Icon={Target} delay={1.8} duration={4.8} x={75} y={30} size={22} opacity={0.11} />
      <FloatingIcon Icon={ArrowUpRight} delay={2.2} duration={3.8} x={12} y={40} size={20} opacity={0.15} />
      <FloatingIcon Icon={ArrowDownRight} delay={1.2} duration={4.2} x={88} y={60} size={24} opacity={0.12} />
      <FloatingIcon Icon={Coins} delay={0.3} duration={5.2} x={30} y={80} size={26} opacity={0.14} />
      <FloatingIcon Icon={CandlestickChart} delay={2.8} duration={3.6} x={70} y={20} size={28} opacity={0.16} />

      {/* Mouse follower effect */}
      <div
        className="fixed pointer-events-none z-10"
        style={{
          left: mousePosition.x - 100,
          top: mousePosition.y - 100,
          width: 200,
          height: 200,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)",
          transition: "all 0.3s",
          userSelect: "none",
          pointerEvents: "none",
        }}
      />

      {/* Login form */}
      <div className="relative z-20 w-full max-w-md mx-4">
        <div className="bg-black/80 backdrop-blur-xl border border-blue-500/30 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-transparent to-blue-600/20 rounded-2xl" />

          <div className="text-center mb-8 relative z-10">
            <div className="flex justify-center items-center space-x-3 mb-4">
              <div className="p-3 bg-blue-600/20 rounded-full border border-blue-500/30">
                <TrendingUp className="text-blue-400" size={32} />
              </div>
              <div className="p-2 bg-blue-600/10 rounded-full border border-blue-500/20 animate-pulse">
                <BarChart3 className="text-blue-300" size={24} />
              </div>
            </div>

            <h1 className="text-3xl font-bold text-white mb-2">
              Trading <span className="text-blue-400">Portal</span>
            </h1>
            <p className="text-gray-400">Access your dashboard securely</p>
          </div>

          <form className="space-y-6 relative z-10" onSubmit={handleSubmit}>
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-300 flex items-center">
                <DollarSign className="mr-2" size={16} />
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                placeholder="your.email@example.com"
                className="w-full bg-gray-900/50 border border-blue-500/30 rounded-xl px-4 py-3 placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={e => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-300 flex items-center">
                <Target className="mr-2" size={16} />
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                placeholder="Your secure password"
                className="w-full bg-gray-900/50 border border-blue-500/30 rounded-xl px-4 py-3 placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={e => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-600/60 rounded-md p-2 text-center text-red-100 font-medium">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-xl px-6 py-3 flex items-center justify-center space-x-2 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 mr-2 border-2 border-white border-t-transparent rounded-full" />
                  Authenticating...
                </>
              ) : (
                <>
                  <TrendingUp size={20} />
                  <span>Access Dashboard</span>
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 flex justify-between text-sm text-gray-400">
            <button
              type="button"
              onClick={() => alert("Forgot password not implemented yet")}
              className="flex items-center space-x-1 hover:text-blue-400"
            >
              <ArrowUpRight size={14} />
              <span>Forgot password?</span>
            </button>

            <button
              type="button"
              onClick={() => alert("Signup workflow not implemented yet")}
              className="flex items-center space-x-1 hover:text-blue-400"
            >
              <span>Create account</span>
              <ArrowUpRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Add your CSS or Tailwind config for animations e.g. pulse */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 0.2; }
        }
        .animate-pulse {
          animation: pulse 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}













