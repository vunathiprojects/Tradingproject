
import React, { useState, useEffect, useRef } from "react";
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  DollarSign,
  PieChart,
  Activity,
  Zap,
  Target,
  ArrowUpRight,
  ArrowDownRight,

  Coins,
  CandlestickChart,
  X,
  Eye,
  EyeOff,
  Shield,
  LogIn,
  Send,
} from "lucide-react";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import emailjs from "@emailjs/browser";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAGLKy-2I2-qi3UrJUU7KmrN663wYLjh9w",
  authDomain: "traderapp-7e61b.firebaseapp.com",
  databaseURL: "https://traderapp-7e61b-default-rtdb.firebaseio.com/",
  projectId: "traderapp-7e61b",
  storageBucket: "traderapp-7e61b.appspot.com",
  messagingSenderId: "122732936809",
  appId: "1:122732936809:web:6e514da168467d5291acf8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// EmailJS configuration
const emailServiceConfig = {
  serviceId: "service_zlah9di",
  templateId: "template_zt76qhi",
  publicKey: "V6g6pFlt-FFdQmlad",
};

// Function to send password reset email using Firebase and a confirmation via EmailJS
const sendPasswordResetEmailCustom = async (email) => {
  try {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Invalid email format");
    }

    // Send Firebase password reset email
    const actionCodeSettings = {
      url: window.location.origin, // Redirect URL after reset
      handleCodeInApp: true,
    };
    await sendPasswordResetEmail(auth, email, actionCodeSettings);
    console.log("Firebase password reset email sent successfully to:", email);

    // Send confirmation email via EmailJS
    try {
      const templateParams = {
        to_email: email,
        message: "A password reset link has been sent to your email. Please check your inbox (and spam/junk folder) to reset your password.",
      };

      const response = await emailjs.send(
        emailServiceConfig.serviceId,
        emailServiceConfig.templateId,
        templateParams,
        emailServiceConfig.publicKey
      );
      console.log("EmailJS confirmation email sent successfully:", response);
      return "Password reset email sent successfully.";
    } catch (emailjsError) {
      console.error("EmailJS failed:", {
        error: emailjsError.message,
        status: emailjsError.status,
        
        response: emailjsError.text,
        serviceId: emailServiceConfig.serviceId,
        templateId: emailServiceConfig.templateId,
        publicKey: emailServiceConfig.publicKey,
      });
      return "Firebase reset email sent, but confirmation email failed. Check your inbox.";
    }
  } catch (error) {
    console.error("error:", {
      code: error.code,
      message: error.message,
    });
    if (error.code === "auth/user-not-found") {
      throw new Error("No account found with this email address.");
    } else if (error.code === "auth/invalid-email") {
      throw new Error("Invalid email address.");
    } else if (error.code === "auth/too-many-requests") {
      throw new Error("Too many requests. Please try again later.");
    } else {
      throw new Error(`Failed to send password reset email: ${error.message}`);
    }
  }
};

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef(null);

  // Check if device is mobile
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);

  // Track mouse position for follower effect (desktop only)
  useEffect(() => {
    if (isMobile) return;
    
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isMobile]);

  // Set resetEmail to login email when opening forgot password modal
  useEffect(() => {
    if (showForgotPassword) {
      setResetEmail(email);
    }
  }, [showForgotPassword, email]);

  // Initialize EmailJS
  useEffect(() => {
    emailjs.init(emailServiceConfig.publicKey);
  }, []);

  // Handle login submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setSuccess("Login successful! Redirecting to dashboard...");
      setLoading(false);
      // In a real app, navigate to dashboard here
    } catch (err) {
      // Handle specific Firebase authentication errors
      if (err.code === "auth/invalid-email") {
        setError("Invalid email address format.");
      } else if (err.code === "auth/user-not-found") {
        setError("No account found with this email address.");
      } else if (err.code === "auth/wrong-password") {
        setError("Incorrect password. Please try again.");
      } else if (err.code === "auth/invalid-credential") {
        setError("Invalid email or password. Please check your credentials.");
      } else if (err.code === "auth/too-many-requests") {
        setError("Too many failed login attempts. Please try again later.");
      } else {
        setError("An error occurred during login. Please try again.");
      }
      console.error("Login error:", { code: err.code, message: err.message });
      setLoading(false);
    }
  };

  // Handle forgot password submission
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!resetEmail) {
      setError("Please enter your email address");
      return;
    }

    setResetLoading(true);
    try {
      const message = await sendPasswordResetEmailCustom(resetEmail);
      setSuccess(message);
      setTimeout(() => {
        setShowForgotPassword(false);
        setSuccess(null);
        setResetEmail("");
      }, 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setResetLoading(false);
    }
  };

  // Handle opening forgot password modal
  const handleForgotPasswordClick = () => {
    setShowForgotPassword(true);
    setError(null);
    setSuccess(null);
  };

  // Floating icon component for animated background
  const FloatingIcon = ({ Icon, delay, duration, x, y, size = 20, opacity = 0.1 }) => (
    <div
      className="absolute animate-float"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`,
        userSelect: "none",
        pointerEvents: "none",
        opacity: 0,
      }}
    >
      <Icon size={size} className="text-blue-400" style={{ opacity }} />
    </div>
  );

  // Particle component for background animation
  const Particle = ({ size, position, duration, delay }) => (
    <div
      className="absolute rounded-full bg-gradient-to-r from-blue-400/10 to-cyan-400/10"
      style={{
        width: size,
        height: size,
        left: `${position.x}%`,
        top: `${position.y}%`,
        animation: `floatParticle ${duration}s ease-in-out ${delay}s infinite`,
      }}
    />
  );

  // Generate random particles for background
  const particles = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    size: Math.random() * 20 + 5,
    position: {
      x: Math.random() * 100,
      y: Math.random() * 100,
    },
    duration: Math.random() * 10 + 10,
    delay: Math.random() * 5,
  }));

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-blue-900 flex items-center justify-center relative overflow-hidden"
      ref={containerRef}
    >
      {/* Animated background particles */}
      {particles.map(particle => (
        <Particle
          key={particle.id}
          size={particle.size}
          position={particle.position}
          duration={particle.duration}
          delay={particle.delay}
        />
      ))}
      
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
      <FloatingIcon Icon={TrendingUp} delay={0} duration={8} x={10} y={20} size={24} opacity={0.15} />
      <FloatingIcon Icon={TrendingDown} delay={2} duration={10} x={85} y={15} size={28} opacity={0.12} />
      <FloatingIcon Icon={BarChart3} delay={4} duration={6} x={15} y={70} size={22} opacity={0.18} />
      <FloatingIcon Icon={DollarSign} delay={1} duration={9} x={80} y={75} size={26} opacity={0.14} />
      <FloatingIcon Icon={PieChart} delay={3} duration={7} x={5} y={50} size={20} opacity={0.16} />
      <FloatingIcon Icon={Activity} delay={5} duration={8} x={90} y={45} size={24} opacity={0.13} />
      <FloatingIcon Icon={Zap} delay={1.5} duration={6.5} x={25} y={25} size={18} opacity={0.17} />
      <FloatingIcon Icon={Target} delay={3.5} duration={9.5} x={75} y={30} size={22} opacity={0.11} />
      <FloatingIcon Icon={ArrowUpRight} delay={4.5} duration={7.5} x={12} y={40} size={20} opacity={0.15} />
      <FloatingIcon Icon={ArrowDownRight} delay={2.5} duration={8.5} x={88} y={60} size={24} opacity={0.12} />
      <FloatingIcon Icon={Coins} delay={0.5} duration={10.5} x={30} y={80} size={26} opacity={0.14} />
      <FloatingIcon Icon={CandlestickChart} delay={5.5} duration={7.2} x={70} y={20} size={28} opacity={0.16} />
      
      {/* Mouse follower effect (desktop only) */}
      {!isMobile && (
        <>
          <div
            className="fixed pointer-events-none z-10"
            style={{
              left: mousePosition.x - 100,
              top: mousePosition.y - 100,
              width: 200,
              height: 200,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)",
              transition: "all 0.1s ease-out",
              userSelect: "none",
              pointerEvents: "none",
            }}
          />
          <div
            className="fixed pointer-events-none z-10"
            style={{
              left: mousePosition.x - 20,
              top: mousePosition.y - 20,
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, transparent 70%)",
              transition: "all 0.2s ease-out",
              userSelect: "none",
              pointerEvents: "none",
            }}
          />
        </>
      )}
      
      {/* Login form */}
      <div className="relative z-20 w-full max-w-md mx-4">
        <div className="bg-black/80 backdrop-blur-xl border border-blue-500/30 rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden transform transition-all duration-500 hover:border-blue-500/50">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-transparent to-blue-600/20 rounded-2xl" />
          <div className="text-center mb-6 md:mb-8 relative z-10">
            {/* Logo Added Here */}
            <div className="flex justify-center mb-4">
              <img 
                src="/Logo2.jpg" 
                alt="Vunathi Capital Logo" 
                className="w-16 h-16 rounded-full border-2 border-blue-500/30 shadow-lg" 
              />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
              Vunathi <span className="text-blue-400 animate-pulse-text">Capital</span>
            </h1>
            <p className="text-gray-400 text-sm md:text-base">Access your dashboard securely</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6 relative z-10">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-300 flex items-center mb-2">
                <DollarSign className="mr-2" size={16} />
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                placeholder="your.email@example.com"
                className="w-full bg-gray-900/50 border border-blue-500/30 rounded-xl px-4 py-3 placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 focus:scale-[1.02]"
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-300 flex items-center mb-2">
                <Target className="mr-2" size={16} />
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  placeholder="Your secure password"
                  className="w-full bg-gray-900/50 border border-blue-500/30 rounded-xl px-4 py-3 placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12 transition-all duration-300 focus:scale-[1.02]"
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-white transition-colors duration-200"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div className="text-right">
              <button
                type="button"
                onClick={handleForgotPasswordClick}
                className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-all duration-200 hover:underline"
                disabled={loading}
              >
                Forgot Password?
              </button>
            </div>
            {error && !showForgotPassword && (
              <div className="bg-red-600/60 rounded-xl p-3 text-center text-red-100 font-medium animate-shake">
                <div className="flex items-center justify-center">
                  <Shield className="mr-2" size={18} />
                  {error}
                </div>
              </div>
            )}
            {success && !showForgotPassword && (
              <div className="bg-green-600/60 rounded-xl p-3 text-center text-green-100 font-medium animate-fade-in">
                <div className="flex items-center justify-center">
                  <Shield className="mr-2" size={18} />
                  {success}
                </div>
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-xl px-6 py-3 flex items-center justify-center space-x-2 disabled:opacity-60 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-blue-500/20"
            >
              {loading ? (
                <>
                  <div className="animate-spin h-5 w-5 mr-2 border-2 border-white border-t-transparent rounded-full" />
                  <span className="animate-pulse">Authenticating...</span>
                </>
              ) : (
                <>
                  <LogIn size={20} />
                  <span>Access Dashboard</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
      
      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => {
              setShowForgotPassword(false);
              setError(null);
              setSuccess(null);
            }}
          ></div>
          <div className="bg-gray-900/95 border border-blue-500/30 rounded-2xl p-6 w-full max-w-md relative z-50 backdrop-blur-xl transform transition-all duration-300 scale-95 animate-scale-in">
            <button
              onClick={() => {
                setShowForgotPassword(false);
                setError(null);
                setSuccess(null);
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors duration-200 p-1 rounded-full hover:bg-gray-800"
            >
              <X size={24} />
            </button>
            <div className="text-center mb-6">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-blue-600/20 rounded-full border border-blue-500/30 animate-pulse-slow">
                  <Target className="text-blue-400" size={32} />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-white">Reset Password</h2>
              <p className="text-gray-400 mt-2">Enter your email to receive a password reset link</p>
            </div>
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                  <DollarSign className="mr-2" size={16} />
                  Email Address
                </label>
                <input
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="w-full bg-gray-800/50 border border-blue-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500 transition-all duration-300 focus:scale-[1.02]"
                  placeholder="your.email@example.com"
                  required
                />
              </div>
              {error && (
                <div className="bg-red-600/60 rounded-xl p-3 text-center text-red-100 font-medium animate-shake">
                  <div className="flex items-center justify-center">
                    <Shield className="mr-2" size={18} />
                    {error}
                  </div>
                </div>
              )}
              {success && (
                <div className="bg-green-600/60 rounded-xl p-3 text-center text-green-100 font-medium animate-fade-in">
                  <div className="flex items-center justify-center">
                    <Shield className="mr-2" size={18} />
                    {success}
                  </div>
                </div>
              )}
              <div className="flex space-x-4 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotPassword(false);
                    setError(null);
                    setSuccess(null);
                  }}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-xl px-6 py-3 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={resetLoading}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-xl px-6 py-3 flex items-center justify-center space-x-2 disabled:opacity-60 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-blue-500/20"
                >
                  {resetLoading ? (
                    <>
                      <div className="animate-spin h-5 w-5 mr-2 border-2 border-white border-t-transparent rounded-full" />
                      <span className="animate-pulse">Processing...</span>
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      <span>Send Reset Link</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
          }
          50% {
            opacity: 0.5;
          }
          100% {
            transform: translateY(-20px) rotate(10deg);
            opacity: 0;
          }
        }
        
        @keyframes floatParticle {
          0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          10% {
            opacity: 0.1;
          }
          50% {
            opacity: 0.3;
            transform: translateY(-100px) translateX(20px);
          }
          90% {
            opacity: 0.1;
          }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes scaleIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        
        @keyframes pulseSlow {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 0.3; }
        }
        
        @keyframes pingSlow {
          0% { transform: scale(1); opacity: 1; }
          75%, 100% { transform: scale(1.5); opacity: 0; }
        }
        
        @keyframes pulseText {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-scale-in {
          animation: scaleIn 0.3s ease-out;
        }
        
        .animate-pulse-slow {
          animation: pulseSlow 3s ease-in-out infinite;
        }
        
        .animate-ping-slow {
          animation: pingSlow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        
        .animate-pulse-text {
          animation: pulseText 2s ease-in-out infinite;
        }
        
        @media (max-width: 768px) {
          .animate-float {
            animation-duration: 12s;
          }
        }
      `}</style>
    </div>
  );
};

export default LoginPage;