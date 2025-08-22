


import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

// Floating 3D Cards Component
const FloatingCard3D = ({ children, className = "" }) => {
  return (
    <motion.div
      className={`bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-2xl ${className}`}
      whileHover={{ 
        scale: 1.05,
        rotateY: 5,
        rotateX: -2,
        transition: { duration: 0.3 }
      }}
      style={{
        transformStyle: 'preserve-3d',
        perspective: 1000
      }}
    >
      {children}
    </motion.div>
  );
};

// 3D Button Component
const Button3D = ({ children, onClick, className = "" }) => {
  return (
    <motion.button
      onClick={onClick}
      className={`relative px-8 py-4 rounded-xl font-bold text-white ${className}`}
      whileHover={{ y: -3 }}
      whileTap={{ y: 0 }}
      style={{
        background: 'linear-gradient(145deg, #0d9488, #10b981)',
        boxShadow: '0 8px 0 #047857, 0 12px 20px rgba(0, 0, 0, 0.15)',
        transformStyle: 'preserve-3d'
      }}
    >
      {children}
      <span className="absolute inset-0 rounded-xl bg-black opacity-0 transition-opacity hover:opacity-10"></span>
    </motion.button>
  );
};

// Animated Background Component
const AnimatedBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden -z-10">
      {/* Main background with RGB(21, 31, 49) */}
      <div className="absolute inset-0 bg-[#151f31] z-0"></div>
      
      {/* Background image with overlay */}
      <div 
        className="absolute inset-0 z-0 opacity-10"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat"
        }}
      ></div>
      
      {/* Floating elements */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-gradient-to-br from-emerald-400/30 to-teal-500/30 opacity-40"
          style={{
            width: Math.random() * 200 + 50,
            height: Math.random() * 200 + 50,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 40 - 20, 0],
            rotate: [0, Math.random() * 360],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
};

// Investment Product Icons
const InvestmentIcon = ({ icon: Icon, name, description }) => {
  return (
    <motion.div
      className="group relative bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:border-emerald-400/30 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
      whileHover={{ 
        y: -10,
        scale: 1.02,
        rotateY: 5
      }}
      style={{ transformStyle: 'preserve-3d' }}
    >
      <div className="flex flex-col items-center text-center">
        <div className="mb-4 p-3 bg-gradient-to-br from-emerald-400/20 to-teal-500/20 rounded-xl">
          <Icon className="h-10 w-10 text-white" />
        </div>
        <h3 className="font-bold text-lg text-white mb-2">{name}</h3>
        <p className="text-sm text-gray-200">{description}</p>
      </div>
      
      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </motion.div>
  );
};

// Card Carousel Component
const CardCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const cards = [
    {
      title: "Zero Commission",
      description: "Invest in stocks with zero brokerage fees",
      icon: "📈",
      color: "bg-gradient-to-br from-emerald-500/90 to-teal-600/90"
    },
    {
      title: "Expert Research",
      description: "Access curated research reports from top analysts",
      icon: "🔍",
      color: "bg-gradient-to-br from-blue-500/90 to-indigo-600/90"
    },
    {
      title: "Smart Portfolio",
      description: "AI-powered portfolio recommendations",
      icon: "🤖",
      color: "bg-gradient-to-br from-purple-500/90 to-pink-600/90"
    },
    {
      title: "Instant Settlements",
      description: "Fastest fund transfers in the industry",
      icon: "⚡",
      color: "bg-gradient-to-br from-amber-500/90 to-orange-600/90"
    },
    {
      title: "Secure Investments",
      description: "Bank-level security for all your transactions",
      icon: "🔒",
      color: "bg-gradient-to-br from-red-500/90 to-rose-600/90"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % cards.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [cards.length]);

  return (
    <div className="relative w-full h-96 overflow-hidden">
      {cards.map((card, index) => (
        <motion.div
          key={index}
          className={`absolute w-64 h-80 rounded-3xl p-6 text-white flex flex-col justify-between ${card.color} shadow-2xl backdrop-blur-md border border-white/20`}
          initial={{ 
            opacity: 0, 
            x: index > currentIndex ? 300 : -300,
            scale: 0.8,
            rotate: index > currentIndex ? 10 : -10
          }}
          animate={{ 
            opacity: index === currentIndex ? 1 : 0.4,
            x: index === currentIndex ? 0 : (index > currentIndex ? 300 : -300),
            scale: index === currentIndex ? 1 : 0.8,
            rotate: index === currentIndex ? 0 : (index > currentIndex ? 5 : -5),
            zIndex: index === currentIndex ? 10 : 1
          }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          style={{ 
            left: '50%', 
            transform: 'translateX(-50%)',
            perspective: 1000
          }}
        >
          <div className="text-5xl mb-4">{card.icon}</div>
          <div>
            <h3 className="text-2xl font-bold mb-2">{card.title}</h3>
            <p className="text-white/90">{card.description}</p>
          </div>
          <div className="flex justify-center mt-4">
            {cards.map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full mx-1 ${i === currentIndex ? 'bg-white' : 'bg-white/30'}`}
              />
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// Social Media Icons
const FacebookIcon = (props) => (
  <svg {...props} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
  </svg>
);

const TwitterIcon = (props) => (
  <svg {...props} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
  </svg>
);

const InstagramIcon = (props) => (
  <svg {...props} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
  </svg>
);

const LinkedInIcon = (props) => (
  <svg {...props} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
  </svg>
);

// Main Component
const Web = () => {
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const navigate = useNavigate();

  // Investment products data
  const products = [
    {
      name: "Stocks",
      icon: (props) => (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      description: "Invest in shares of publicly traded companies"
    },
    {
      name: "Mutual Funds",
      icon: (props) => (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      description: "Diversified portfolios managed by professionals"
    },
    {
      name: "US Stocks",
      icon: (props) => (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      description: "Access to international markets and companies"
    },
    {
      name: "Fixed Deposits",
      icon: (props) => (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      description: "Secure investments with guaranteed returns"
    },
    {
      name: "IPO",
      icon: (props) => (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 11l3-3m0 0l3 3m-3-3v8m0-13a9 9 0 110 18 9 9 0 010-18z" />
        </svg>
      ),
      description: "Invest in companies going public for the first time"
    },
    {
      name: "Gold",
      icon: (props) => (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          <circle cx="12" cy="12" r="3" stroke="none" fill="currentColor" />
        </svg>
      ),
      description: "Digital gold investments with high liquidity"
    },
    {
      name: "ETFs",
      icon: (props) => (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      ),
      description: "Exchange Traded Funds for diversified exposure"
    },
    {
      name: "Crypto",
      icon: (props) => (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
        </svg>
      ),
      description: "Digital currency investments with high growth potential"
    }
  ];

  return (
    <div className="min-h-screen text-white font-sans overflow-hidden relative">
      <AnimatedBackground />
      
      {/* Navbar */}
      <nav className="bg-black/30 backdrop-blur-md py-4 px-6 flex justify-between items-center sticky top-0 z-50 border-b border-emerald-500/30">
        <div className="flex items-center space-x-10">
          <motion.div 
            whileHover={{ scale: 1.05, rotateY: 5 }} 
            className="flex items-center cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 w-10 h-10 rounded-xl flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-sm">VC</span>
            </div>
            <span className="ml-3 text-2xl font-bold text-white">Vunathi Capital</span>
          </motion.div>

          <div className="hidden md:flex space-x-8">
            <a href="#" className="text-gray-200 hover:text-emerald-400 transition-colors">Home</a>
            <a href="#" className="text-gray-200 hover:text-emerald-400 transition-colors">About Us</a>
            <a href="#" className="text-gray-200 hover:text-emerald-400 transition-colors">FAQ</a>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative hidden md:block">
            <input 
              type="text" 
              placeholder="Search stocks, funds..." 
              className="pl-10 pr-4 py-2.5 rounded-xl bg-black/30 backdrop-blur-sm border border-emerald-500/30 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all w-64 text-white placeholder:text-gray-400"
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-2.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </div>

          <Button3D onClick={() => navigate("/login")} className="px-5 py-2.5 text-sm">
            Login
          </Button3D>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }} 
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight">
              Grow Your <span className="text-emerald-400">Wealth</span><br/>
              Like Never Before
            </h1>
            <p className="mt-6 text-lg text-gray-200 max-w-lg">
              India's fastest growing investment platform with over 5 million users. 
              Join today and start your financial journey with expert guidance.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Button3D className="px-8 py-4 text-lg">
                Start Investing
              </Button3D>
              <motion.button 
                whileHover={{ y: -3, scale: 1.02 }}
                whileTap={{ y: 0 }}
                className="bg-transparent text-white border-2 border-emerald-400 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-emerald-400/10 shadow-md transition-all"
              >
                Learn More
              </motion.button>
            </div>
          </motion.div>

          {/* Card Carousel */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, rotateY: 10 }} 
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
            style={{ perspective: 1000 }}
          >
            <FloatingCard3D className="w-full h-96 flex items-center justify-center bg-black/20">
              <CardCarousel />
            </FloatingCard3D>
          </motion.div>
        </div>
      </div>

      {/* Products Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-white mb-4">Investment Products</h2>
          <p className="text-gray-200 max-w-2xl mx-auto">
            Explore our wide range of investment options to build a diversified portfolio 
            tailored to your financial goals.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20, rotateY: -5 }}
              whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              viewport={{ once: true }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              <InvestmentIcon 
                icon={product.icon} 
                name={product.name} 
                description={product.description} 
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-r from-emerald-600/90 to-teal-700/90 py-16 mt-16 text-white relative overflow-hidden backdrop-blur-md">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-10">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                width: Math.random() * 100 + 50,
                height: Math.random() * 100 + 50,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -20, 0],
                x: [0, Math.random() * 30 - 15, 0],
                rotate: [0, Math.random() * 360],
              }}
              transition={{
                duration: Math.random() * 15 + 15,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "5M+", label: "Happy Investors" },
              { value: "₹95,000Cr+", label: "Assets Managed" },
              { value: "200+", label: "Investment Options" },
              { value: "24/7", label: "Customer Support" }
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div className="text-4xl font-bold mb-2 text-white">{stat.value}</div>
                <div className="text-emerald-100">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonial Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-white mb-4">What Our Investors Say</h2>
          <p className="text-gray-200 max-w-2xl mx-auto">
            Hear from our community of successful investors who have achieved their financial goals with us.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              name: "Rahul Sharma",
              role: "Software Engineer",
              comment: "Vunathi Capital made investing so simple. I've seen 25% returns in just one year!",
              avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80"
            },
            {
              name: "Priya Patel",
              role: "Marketing Manager",
              comment: "The research tools and insights helped me make informed decisions for my portfolio.",
              avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80"
            },
            {
              name: "Amit Kumar",
              role: "Business Owner",
              comment: "Excellent platform with zero commission on direct mutual funds. Saved me thousands!",
              avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80"
            }
          ].map((testimonial, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20, rotateY: -5 }}
              whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:border-emerald-400/30 shadow-lg hover:shadow-xl transition-all duration-300"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div className="flex items-center mb-4">
                <img src={testimonial.avatar} alt={testimonial.name} className="w-12 h-12 rounded-full object-cover border-2 border-emerald-400/30" />
                <div className="ml-4">
                  <h4 className="font-bold text-white">{testimonial.name}</h4>
                  <p className="text-sm text-emerald-300">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-gray-200">"{testimonial.comment}"</p>
              <div className="mt-4 flex">
                {[...Array(5)].map((_, star) => (
                  <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-emerald-500/90 to-teal-600/90 rounded-3xl p-8 md:p-12 text-center text-white shadow-xl backdrop-blur-md border border-white/20"
          style={{ transformStyle: 'preserve-3d' }}
        >
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Investment Journey?</h2>
          <p className="text-emerald-100 max-w-2xl mx-auto mb-8">
            Join millions of Indians who trust Vunathi Capital with their financial goals. 
            Start with as little as ₹100 and build wealth over time.
          </p>
          <Button3D className="px-8 py-4 text-lg bg-white text-emerald-600 hover:text-emerald-700">
            Create Account Now
          </Button3D>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="bg-black/80 backdrop-blur-md text-white pt-16 pb-8 border-t border-emerald-500/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Company Info */}
            <div>
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-600 w-10 h-10 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-sm">VC</span>
                </div>
                <span className="ml-3 text-2xl font-bold">Vunathi Capital</span>
              </div>
              <p className="text-gray-400 mb-6">
                Making wealth creation accessible to everyone through technology and expertise.
              </p>
              <div className="flex space-x-4">
                <motion.a
                  href="https://facebook.com/vunathitech"
                  className="bg-gray-800 text-gray-400 hover:text-white hover:bg-emerald-600 w-10 h-10 rounded-lg flex items-center justify-center transition-colors"
                  whileHover={{ y: -3, rotate: 5 }}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FacebookIcon className="w-5 h-5" />
                </motion.a>
                <motion.a
                  href="https://twitter.com/vunathitech"
                  className="bg-gray-800 text-gray-400 hover:text-white hover:bg-emerald-600 w-10 h-10 rounded-lg flex items-center justify-center transition-colors"
                  whileHover={{ y: -3, rotate: 5 }}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <TwitterIcon className="w-5 h-5" />
                </motion.a>
                <motion.a
                  href="https://instagram.com/vunathitech"
                  className="bg-gray-800 text-gray-400 hover:text-white hover:bg-emerald-600 w-10 h-10 rounded-lg flex items-center justify-center transition-colors"
                  whileHover={{ y: -3, rotate: 5 }}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <InstagramIcon className="w-5 h-5" />
                </motion.a>
                <motion.a
                  href="https://linkedin.com/company/vunathi-technologies"
                  className="bg-gray-800 text-gray-400 hover:text-white hover:bg-emerald-600 w-10 h-10 rounded-lg flex items-center justify-center transition-colors"
                  whileHover={{ y: -3, rotate: 5 }}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <LinkedInIcon className="w-5 h-5" />
                </motion.a>
              </div>
            </div>

            {/* Products */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Products</h3>
              <ul className="space-y-3">
                {["Stocks", "Mutual Funds", "US Stocks", "Fixed Deposits", "IPO", "Gold"].map((item, i) => (
                  <li key={i}>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Company</h3>
              <ul className="space-y-3">
                {["About Us", "Pricing", "Careers", "Blog", "Press", "Contact Us"].map((item, i) => (
                  <li key={i}>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Support</h3>
              <ul className="space-y-3">
                {["Help Center", "FAQ", "Terms of Service", "Privacy Policy", "Security", "Complaints"].map((item, i) => (
                  <li key={i}>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Vunathi Capital. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Disclosure</a>
            </div>
          </div>

          {/* Regulatory Info */}
          <div className="mt-8 p-4 bg-gray-800/50 rounded-lg backdrop-blur-sm">
            <p className="text-gray-400 text-xs text-center">
              Vunathi Capital is a registered trademark. Investments in securities market are subject to market risks, 
              read all the related documents carefully before investing. Registration granted by SEBI, membership of BASL 
              and certification from NISM in no way guarantee performance of the intermediary or provide any assurance of 
              returns to investors.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Web;










// import React, { useState, useRef, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { motion } from "framer-motion";

// // Floating 3D Cards Component
// const FloatingCard3D = ({ children, className = "" }) => {
//   return (
//     <motion.div
//       className={`bg-gray-800/90 backdrop-blur-md rounded-2xl p-6 shadow-2xl ${className}`}
//       whileHover={{ 
//         scale: 1.05,
//         rotateY: 5,
//         rotateX: -2,
//         transition: { duration: 0.3 }
//       }}
//       style={{
//         transformStyle: 'preserve-3d',
//         perspective: 1000
//       }}
//     >
//       {children}
//     </motion.div>
//   );
// };

// // 3D Button Component
// const Button3D = ({ children, onClick, className = "" }) => {
//   return (
//     <motion.button
//       onClick={onClick}
//       className={`relative px-8 py-4 rounded-xl font-bold text-white ${className}`}
//       whileHover={{ y: -3 }}
//       whileTap={{ y: 0 }}
//       style={{
//         background: 'linear-gradient(145deg, #0d9488, #10b981)',
//         boxShadow: '0 8px 0 #047857, 0 12px 20px rgba(0, 0, 0, 0.15)',
//         transformStyle: 'preserve-3d'
//       }}
//     >
//       {children}
//       <span className="absolute inset-0 rounded-xl bg-black opacity-0 transition-opacity hover:opacity-10"></span>
//     </motion.button>
//   );
// };

// // Animated Background Component
// const AnimatedBackground = () => {
//   return (
//     <div className="absolute inset-0 overflow-hidden -z-10">
//       {/* Main background with RGB(21, 31, 49) */}
//       <div className="absolute inset-0 bg-[#151f31] z-0"></div>
      
//       {/* Background image with overlay */}
//       <div 
//         className="absolute inset-0 z-0 opacity-10"
//         style={{
//           backgroundImage: "url('https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80')",
//           backgroundSize: "cover",
//           backgroundPosition: "center",
//           backgroundRepeat: "no-repeat"
//         }}
//       ></div>
      
//       {/* Floating elements */}
//       {[...Array(15)].map((_, i) => (
//         <motion.div
//           key={i}
//           className="absolute rounded-full bg-gradient-to-br from-emerald-400/30 to-teal-500/30 opacity-40"
//           style={{
//             width: Math.random() * 200 + 50,
//             height: Math.random() * 200 + 50,
//             top: `${Math.random() * 100}%`,
//             left: `${Math.random() * 100}%`,
//           }}
//           animate={{
//             y: [0, -30, 0],
//             x: [0, Math.random() * 40 - 20, 0],
//             rotate: [0, Math.random() * 360],
//           }}
//           transition={{
//             duration: Math.random() * 10 + 10,
//             repeat: Infinity,
//             ease: "easeInOut"
//           }}
//         />
//       ))}
//     </div>
//   );
// };

// // Dashboard Mockup Component
// const DashboardMockup = () => {
//   return (
//     <div className="dashboard-mockup">
//       <div className="dashboard-header">
//         <div className="header-controls">
//           <div className="control-dot red" />
//           <div className="control-dot yellow" />
//           <div className="control-dot green" />
//         </div>
//         <div className="header-title">Trading Dashboard</div>
//       </div>

//       <div className="dashboard-content">
//         <div className="chart-area">
//           <div className="chart-line" />
//           <div className="chart-bars">
//             {[...Array(12)].map((_, i) => (
//               <div key={i} className={`bar bar-${i}`} />
//             ))}
//           </div>
//         </div>

//         <div className="data-panels">
//           <div className="data-panel">
//             <div className="panel-title">Portfolio</div>
//             <div className="panel-value">₹124,567</div>
//             <div className="panel-change positive">+12.4%</div>
//           </div>
//           <div className="data-panel">
//             <div className="panel-title">P&L Today</div>
//             <div className="panel-value">₹3,421</div>
//             <div className="panel-change positive">+2.8%</div>
//           </div>
//         </div>
//       </div>
      
//       <style jsx>{`
//         .dashboard-mockup {
//           width: 100%;
//           height: 400px;
//           background: rgba(255, 255, 255, 0.05);
//           backdrop-filter: blur(20px);
//           border: 1px solid rgba(255, 255, 255, 0.1);
//           border-radius: 20px;
//           overflow: hidden;
//           transform: perspective(1000px) rotateY(-15deg) rotateX(5deg);
//           animation: dashboard-float 6s ease-in-out infinite;
//         }

//         .dashboard-header {
//           background: rgba(255, 255, 255, 0.1);
//           padding: 1rem;
//           display: flex;
//           align-items: center;
//           gap: 1rem;
//         }

//         .header-controls {
//           display: flex;
//           gap: 0.5rem;
//         }

//         .control-dot {
//           width: 12px;
//           height: 12px;
//           border-radius: 50%;
//         }

//         .control-dot.red { background: #ef4444; }
//         .control-dot.yellow { background: #f59e0b; }
//         .control-dot.green { background: #10b981; }

//         .header-title {
//           font-weight: 600;
//           font-size: 0.9rem;
//           color: white;
//         }

//         .dashboard-content {
//           padding: 2rem;
//           height: calc(100% - 80px);
//         }

//         .chart-area {
//           position: relative;
//           height: 60%;
//           margin-bottom: 2rem;
//         }

//         .chart-line {
//           position: absolute;
//           top: 20%;
//           left: 0;
//           width: 100%;
//           height: 2px;
//           background: linear-gradient(90deg, #3b82f6, #8b5cf6, #06b6d4);
//           animation: chart-draw 3s ease-in-out infinite;
//         }

//         .chart-bars {
//           position: absolute;
//           bottom: 0;
//           left: 0;
//           right: 0;
//           height: 60%;
//           display: flex;
//           align-items: end;
//           gap: 4px;
//         }

//         .bar {
//           flex: 1;
//           background: linear-gradient(to top, #3b82f6, rgba(59, 130, 246, 0.3));
//           border-radius: 2px 2px 0 0;
//           animation: bar-grow 2s ease-out infinite;
//         }

//         .bar-0 { height: 30%; animation-delay: 0s; }
//         .bar-1 { height: 60%; animation-delay: 0.1s; }
//         .bar-2 { height: 45%; animation-delay: 0.2s; }
//         .bar-3 { height: 80%; animation-delay: 0.3s; }
//         .bar-4 { height: 35%; animation-delay: 0.4s; }
//         .bar-5 { height: 70%; animation-delay: 0.5s; }
//         .bar-6 { height: 55%; animation-delay: 0.6s; }
//         .bar-7 { height: 90%; animation-delay: 0.7s; }
//         .bar-8 { height: 40%; animation-delay: 0.8s; }
//         .bar-9 { height: 65%; animation-delay: 0.9s; }
//         .bar-10 { height: 50%; animation-delay: 1s; }
//         .bar-11 { height: 75%; animation-delay: 1.1s; }

//         .data-panels {
//           display: flex;
//           gap: 1rem;
//         }

//         .data-panel {
//           flex: 1;
//           background: rgba(255, 255, 255, 0.05);
//           border-radius: 8px;
//           padding: 1rem;
//         }

//         .panel-title {
//           font-size: 0.8rem;
//           color: rgba(255, 255, 255, 0.6);
//           margin-bottom: 0.5rem;
//         }

//         .panel-value {
//           font-size: 1.2rem;
//           font-weight: 700;
//           margin-bottom: 0.25rem;
//           color: white;
//         }

//         .panel-change {
//           font-size: 0.8rem;
//           font-weight: 600;
//         }

//         .panel-change.positive {
//           color: #10b981;
//         }

//         @keyframes dashboard-float {
//           0%, 100% { transform: perspective(1000px) rotateY(-15deg) rotateX(5deg) translateY(0px); }
//           50% { transform: perspective(1000px) rotateY(-15deg) rotateX(5deg) translateY(-10px); }
//         }

//         @keyframes chart-draw {
//           0% { transform: scaleX(0); transform-origin: left; }
//           50% { transform: scaleX(1); transform-origin: left; }
//           51% { transform: scaleX(1); transform-origin: right; }
//           100% { transform: scaleX(0); transform-origin: right; }
//         }

//         @keyframes bar-grow {
//           0% { transform: scaleY(0); }
//           50% { transform: scaleY(1); }
//           100% { transform: scaleY(0); }
//         }
//       `}</style>
//     </div>
//   );
// };

// // Investment Product Icons
// const InvestmentIcon = ({ icon: Icon, name, description }) => {
//   return (
//     <motion.div
//       className="group relative bg-gray-800/80 backdrop-blur-md rounded-2xl p-6 border border-gray-700/50 hover:border-emerald-400/30 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
//       whileHover={{ 
//         y: -10,
//         scale: 1.02,
//         rotateY: 5
//       }}
//       style={{ transformStyle: 'preserve-3d' }}
//     >
//       <div className="flex flex-col items-center text-center">
//         <div className="mb-4 p-3 bg-gradient-to-br from-emerald-400/20 to-teal-500/20 rounded-xl">
//           <Icon className="h-10 w-10 text-white" />
//         </div>
//         <h3 className="font-bold text-lg text-white mb-2">{name}</h3>
//         <p className="text-sm text-gray-300">{description}</p>
//       </div>
      
//       {/* Hover effect overlay */}
//       <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
//     </motion.div>
//   );
// };

// // Social Media Icons
// const FacebookIcon = (props) => (
//   <svg {...props} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
//     <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
//   </svg>
// );

// const TwitterIcon = (props) => (
//   <svg {...props} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
//     <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.850A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
//   </svg>
// );

// const InstagramIcon = (props) => (
//   <svg {...props} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
//     <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
//   </svg>
// );

// const LinkedInIcon = (props) => (
//   <svg {...props} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
//     <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.790-1.75-1.764s.784-1.764 1.75-1.764 1.75.790 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
//   </svg>
// );

// // Main Component
// const Web = () => {
//   const [showMoreMenu, setShowMoreMenu] = useState(false);
//   const navigate = useNavigate();

//   // Investment products data
//   const products = [
//     {
//       name: "Stocks",
//       icon: (props) => (
//         <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
//         </svg>
//       ),
//       description: "Invest in shares of publicly traded companies"
//     },
//     {
//       name: "Mutual Funds",
//       icon: (props) => (
//         <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
//         </svg>
//       ),
//       description: "Diversified portfolios managed by professionals"
//     },
//     {
//       name: "US Stocks",
//       icon: (props) => (
//         <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//         </svg>
//       ),
//       description: "Access to international markets and companies"
//     },
//     {
//       name: "Fixed Deposits",
//       icon: (props) => (
//         <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//         </svg>
//       ),
//       description: "Secure investments with guaranteed returns"
//     },
//     {
//       name: "IPO",
//       icon: (props) => (
//         <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 11l3-3m0 0l3 3m-3-3v8m0-13a9 9 0 110 18 9 9 0 010-18z" />
//         </svg>
//       ),
//       description: "Invest in companies going public for the first time"
//     },
//     {
//       name: "Gold",
//       icon: (props) => (
//         <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 01118 0z" />
//           <circle cx="12" cy="12" r="3" stroke="none" fill="currentColor" />
//         </svg>
//       ),
//       description: "Digital gold investments with high liquidity"
//     },
//     {
//       name: "ETFs",
//       icon: (props) => (
//         <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
//         </svg>
//       ),
//       description: "Exchange Traded Funds for diversified exposure"
//     },
//     {
//       name: "Crypto",
//       icon: (props) => (
//         <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
//         </svg>
//       ),
//       description: "Digital currency investments with high growth potential"
//     }
//   ];

//   return (
//     <div className="min-h-screen text-white font-sans overflow-hidden relative">
//       <AnimatedBackground />
      
//       {/* Navbar */}
//       <nav className="bg-black/30 backdrop-blur-md py-4 px-6 flex justify-between items-center sticky top-0 z-50 border-b border-emerald-500/30">
//         <div className="flex items-center space-x-10">
//           <motion.div 
//             whileHover={{ scale: 1.05, rotateY: 5 }} 
//             className="flex items-center cursor-pointer"
//             onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
//             style={{ transformStyle: 'preserve-3d' }}
//           >
//             <div className="bg-gradient-to-r from-emerald-500 to-teal-600 w-10 h-10 rounded-xl flex items-center justify-center shadow-md">
//               <span className="text-white font-bold text-sm">VC</span>
//             </div>
//             <span className="ml-3 text-2xl font-bold text-white">Vunathi Capital</span>
//           </motion.div>

//           <div className="hidden md:flex space-x-8">
//             <a href="#" className="text-gray-200 hover:text-emerald-400 transition-colors">Home</a>
//             <a href="#" className="text-gray-200 hover:text-emerald-400 transition-colors">About Us</a>
//             <a href="#" className="text-gray-200 hover:text-emerald-400 transition-colors">FAQ</a>
//           </div>
//         </div>

//         <div className="flex items-center space-x-4">
//           <div className="relative hidden md:block">
//             <input 
//               type="text" 
//               placeholder="Search stocks, funds..." 
//               className="pl-10 pr-4 py-2.5 rounded-xl bg-black/30 backdrop-blur-sm border border-emerald-500/30 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all w-64 text-white placeholder:text-gray-400"
//             />
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-2.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
//             </svg>
//           </div>

//           <Button3D onClick={() => navigate("/login")} className="px-5 py-2.5 text-sm">
//             Login
//           </Button3D>
//         </div>
//       </nav>

//       {/* Hero Section - Updated to match screenshot */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
//           <motion.div 
//             initial={{ opacity: 0, x: -50 }} 
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.7 }}
//             className="text-center md:text-left"
//           >
//             {/* <h2 className="text-emerald-400 text-lg font-semibold mb-4">New: AI Trading Assistant Available</h2> */}
//             <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
//               The Future of Trading<br/>
//               <span className="text-emerald-400">Starts Here</span>
//             </h1>
//             <p className="mt-6 text-lg text-gray-300 max-w-lg mb-8">
//               Experience next-generation trading with AI-powered insights, institutional-grade execution, 
//               and a platform designed for the modern investor.
//             </p>
            
//             {/* Trading Dashboard Section
//             <div className="mb-8">
//               <h3 className="text-xl font-bold text-white mb-4">Trading Dashboard</h3>
//               <div className="grid grid-cols-4 gap-4 max-w-xs mx-auto md:mx-0">
//                 <div className="bg-gray-800/80 backdrop-blur-sm rounded-lg p-3 text-center border border-gray-700/50">
//                   <span className="text-white font-bold">A+</span>
//                 </div>
//                 <div className="bg-gray-800/80 backdrop-blur-sm rounded-lg p-3 text-center border border-gray-700/50">
//                   <span className="text-white font-bold">B</span>
//                 </div>
//                 <div className="bg-gray-800/80 backdrop-blur-sm rounded-lg p-3 text-center border border-gray-700/50">
//                   <span className="text-white font-bold">C</span>
//                 </div>
//                 <div className="bg-gray-800/80 backdrop-blur-sm rounded-lg p-3 text-center border border-gray-700/50">
//                   <span className="text-white font-bold">D</span>
//                 </div>
//               </div>
//             </div> */}
            
//             {/* Portfolio Stats */}
//             <div className="grid grid-cols-2 gap-6 max-w-md">
//               <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
//                 <div className="text-gray-400 text-sm mb-1">Portfolio</div>
//                 <div className="text-white font-bold text-xl">₹124,567</div>
//                 <div className="text-emerald-400 text-sm font-semibold">+12.4%</div>
//               </div>
//               <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
//                 <div className="text-gray-400 text-sm mb-1">P&L Today</div>
//                 <div className="text-white font-bold text-xl">₹3,421</div>
//                 <div className="text-emerald-400 text-sm font-semibold">+2.6%</div>
//               </div>
//             </div>
            
//             <div className="mt-10 flex flex-col sm:flex-row gap-4">
//               <Button3D className="px-8 py-4 text-lg">
//                 Start Investing
//               </Button3D>
//               <motion.button 
//                 whileHover={{ y: -3, scale: 1.02 }}
//                 whileTap={{ y: 0 }}
//                 className="bg-transparent text-white border-2 border-emerald-400 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-emerald-400/10 shadow-md transition-all"
//               >
//                 Learn More
//               </motion.button>
//             </div>
//           </motion.div>

//           {/* Dashboard Mockup */}
//           <motion.div 
//             initial={{ opacity: 0, scale: 0.8, rotateY: 10 }} 
//             animate={{ opacity: 1, scale: 1, rotateY: 0 }}
//             transition={{ duration: 0.7, delay: 0.2 }}
//             className="relative"
//             style={{ perspective: 1000 }}
//           >
//             <FloatingCard3D className="w-full h-96 flex items-center justify-center bg-black/20">
//               <DashboardMockup />
//             </FloatingCard3D>
//           </motion.div>
//         </div>
//       </div>

//       {/* Products Section */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
//         <motion.div 
//           initial={{ opacity: 0, y: 20 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//           viewport={{ once: true }}
//           className="text-center mb-12"
//         >
//           <h2 className="text-3xl font-bold text-white mb-4">Investment Products</h2>
//           <p className="text-gray-300 max-w-2xl mx-auto">
//             Explore our wide range of investment options to build a diversified portfolio 
//             tailored to your financial goals.
//           </p>
//         </motion.div>
        
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//           {products.map((product, i) => (
//             <motion.div
//               key={i}
//               initial={{ opacity: 0, y: 20, rotateY: -5 }}
//               whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
//               transition={{ duration: 0.4, delay: i * 0.1 }}
//               viewport={{ once: true }}
//               style={{ transformStyle: 'preserve-3d' }}
//             >
//               <InvestmentIcon 
//                 icon={product.icon} 
//                 name={product.name} 
//                 description={product.description} 
//               />
//             </motion.div>
//           ))}
//         </div>
//       </div>

//       {/* Stats Section */}
//       <div className="bg-gradient-to-r from-emerald-600/90 to-teal-700/90 py-16 mt-16 text-white relative overflow-hidden backdrop-blur-md">
//         {/* Animated background elements */}
//         <div className="absolute inset-0 opacity-10">
//           {[...Array(8)].map((_, i) => (
//             <motion.div
//               key={i}
//               className="absolute rounded-full bg-white"
//               style={{
//                 width: Math.random() * 100 + 50,
//                 height: Math.random() * 100 + 50,
//                 top: `${Math.random() * 100}%`,
//                 left: `${Math.random() * 100}%`,
//               }}
//               animate={{
//                 y: [0, -20, 0],
//                 x: [0, Math.random() * 30 - 15, 0],
//                 rotate: [0, Math.random() * 360],
//               }}
//               transition={{
//                 duration: Math.random() * 15 + 15,
//                 repeat: Infinity,
//                 ease: "easeInOut"
//               }}
//             />
//           ))}
//         </div>
        
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
//             {[
//               { value: "5M+", label: "Happy Investors" },
//               { value: "₹95,000Cr+", label: "Assets Managed" },
//               { value: "200+", label: "Investment Options" },
//               { value: "24/7", label: "Customer Support" }
//             ].map((stat, i) => (
//               <motion.div
//                 key={i}
//                 initial={{ opacity: 0, y: 20, scale: 0.8 }}
//                 whileInView={{ opacity: 1, y: 0, scale: 1 }}
//                 transition={{ duration: 0.5, delay: i * 0.1 }}
//                 viewport={{ once: true }}
//                 className="p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20"
//                 style={{ transformStyle: 'preserve-3d' }}
//               >
//                 <div className="text-4xl font-bold mb-2 text-white">{stat.value}</div>
//                 <div className="text-emerald-100">{stat.label}</div>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Testimonial Section */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
//         <motion.div 
//           initial={{ opacity: 0, y: 20 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//           viewport={{ once: true }}
//           className="text-center mb-12"
//         >
//           <h2 className="text-3xl font-bold text-white mb-4">What Our Investors Say</h2>
//           <p className="text-gray-300 max-w-2xl mx-auto">
//             Hear from our community of successful investors who have achieved their financial goals with us.
//           </p>
//         </motion.div>
        
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//           {[
//             {
//               name: "Rahul Sharma",
//               role: "Software Engineer",
//               comment: "Vunathi Capital made investing so simple. I've seen 25% returns in just one year!",
//               avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80"
//             },
//             {
//               name: "Priya Patel",
//               role: "Marketing Manager",
//               comment: "The research tools and insights helped me make informed decisions for my portfolio.",
//               avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80"
//             },
//             {
//               name: "Amit Kumar",
//               role: "Business Owner",
//               comment: "Excellent platform with zero commission on direct mutual funds. Saved me thousands!",
//               avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80"
//             }
//           ].map((testimonial, i) => (
//             <motion.div
//               key={i}
//               initial={{ opacity: 0, y: 20, rotateY: -5 }}
//               whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
//               transition={{ duration: 0.5, delay: i * 0.1 }}
//               viewport={{ once: true }}
//               className="bg-gray-800/80 backdrop-blur-md rounded-2xl p-6 border border-gray-700/50 hover:border-emerald-400/30 shadow-lg hover:shadow-xl transition-all duration-300"
//               style={{ transformStyle: 'preserve-3d' }}
//             >
//               <div className="flex items-center mb-4">
//                 <img src={testimonial.avatar} alt={testimonial.name} className="w-12 h-12 rounded-full object-cover border-2 border-emerald-400/30" />
//                 <div className="ml-4">
//                   <h4 className="font-bold text-white">{testimonial.name}</h4>
//                   <p className="text-sm text-emerald-300">{testimonial.role}</p>
//                 </div>
//               </div>
//               <p className="text-gray-300">"{testimonial.comment}"</p>
//               <div className="mt-4 flex">
//                 {[...Array(5)].map((_, star) => (
//                   <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
//                     <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//                   </svg>
//                 ))}
//               </div>
//             </motion.div>
//           ))}
//         </div>
//       </div>

//       {/* CTA Section */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
//         <motion.div 
//           initial={{ opacity: 0, y: 20 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//           viewport={{ once: true }}
//           className="bg-gradient-to-r from-emerald-500/90 to-teal-600/90 rounded-3xl p-8 md:p-12 text-center text-white shadow-xl backdrop-blur-md border border-white/20"
//           style={{ transformStyle: 'preserve-3d' }}
//         >
//           <h2 className="text-3xl font-bold mb-4">Ready to Start Your Investment Journey?</h2>
//           <p className="text-emerald-100 max-w-2xl mx-auto mb-8">
//             Join millions of Indians who trust Vunathi Capital with their financial goals. 
//             Start with as little as ₹100 and build wealth over time.
//           </p>
//           <Button3D className="px-8 py-4 text-lg bg-white text-emerald-600 hover:text-emerald-700">
//             Create Account Now
//           </Button3D>
//         </motion.div>
//       </div>

//       {/* Footer */}
//       <footer className="bg-black/80 backdrop-blur-md text-white pt-16 pb-8 border-t border-emerald-500/30">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
//             {/* Company Info */}
//             <div>
//               <div className="flex items-center mb-6">
//                 <div className="bg-gradient-to-r from-emerald-500 to-teal-600 w-10 h-10 rounded-xl flex items-center justify-center">
//                   <span className="text-white font-bold text-sm">VC</span>
//                 </div>
//                 <span className="ml-3 text-2xl font-bold">Vunathi Capital</span>
//               </div>
//               <p className="text-gray-400 mb-6">
//                 Making wealth creation accessible to everyone through technology and expertise.
//               </p>
//               <div className="flex space-x-4">
//                 <motion.a
//                   href="https://facebook.com/vunathitech"
//                   className="bg-gray-800 text-gray-400 hover:text-white hover:bg-emerald-600 w-10 h-10 rounded-lg flex items-center justify-center transition-colors"
//                   whileHover={{ y: -3, rotate: 5 }}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                 >
//                   <FacebookIcon className="w-5 h-5" />
//                 </motion.a>
//                 <motion.a
//                   href="https://twitter.com/vunathitech"
//                   className="bg-gray-800 text-gray-400 hover:text-white hover:bg-emerald-600 w-10 h-10 rounded-lg flex items-center justify-center transition-colors"
//                   whileHover={{ y: -3, rotate: 5 }}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                 >
//                   <TwitterIcon className="w-5 h-5" />
//                 </motion.a>
//                 <motion.a
//                   href="https://instagram.com/vunathitech"
//                   className="bg-gray-800 text-gray-400 hover:text-white hover:bg-emerald-600 w-10 h-10 rounded-lg flex items-center justify-center transition-colors"
//                   whileHover={{ y: -3, rotate: 5 }}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                 >
//                   <InstagramIcon className="w-5 h-5" />
//                 </motion.a>
//                 <motion.a
//                   href="https://linkedin.com/company/vunathi-technologies"
//                   className="bg-gray-800 text-gray-400 hover:text-white hover:bg-emerald-600 w-10 h-10 rounded-lg flex items-center justify-center transition-colors"
//                   whileHover={{ y: -3, rotate: 5 }}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                 >
//                   <LinkedInIcon className="w-5 h-5" />
//                 </motion.a>
//               </div>
//             </div>

//             {/* Products */}
//             <div>
//               <h3 className="text-lg font-semibold mb-6">Products</h3>
//               <ul className="space-y-3">
//                 {["Stocks", "Mutual Funds", "US Stocks", "Fixed Deposits", "IPO", "Gold"].map((item, i) => (
//                   <li key={i}>
//                     <a href="#" className="text-gray-400 hover:text-white transition-colors">{item}</a>
//                   </li>
//                 ))}
//               </ul>
//             </div>

//             {/* Company */}
//             <div>
//               <h3 className="text-lg font-semibold mb-6">Company</h3>
//               <ul className="space-y-3">
//                 {["About Us", "Pricing", "Careers", "Blog", "Press", "Contact Us"].map((item, i) => (
//                   <li key={i}>
//                     <a href="#" className="text-gray-400 hover:text-white transition-colors">{item}</a>
//                   </li>
//                 ))}
//               </ul>
//             </div>

//             {/* Support */}
//             <div>
//               <h3 className="text-lg font-semibold mb-6">Support</h3>
//               <ul className="space-y-3">
//                 {["Help Center", "FAQ", "Terms of Service", "Privacy Policy", "Security", "Complaints"].map((item, i) => (
//                   <li key={i}>
//                     <a href="#" className="text-gray-400 hover:text-white transition-colors">{item}</a>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           </div>

//           {/* Divider */}
//           <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
//             <p className="text-gray-400 text-sm">
//               © {new Date().getFullYear()} Vunathi Capital. All rights reserved.
//             </p>
//             <div className="flex space-x-6 mt-4 md:mt-0">
//               <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy Policy</a>
//               <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Terms of Service</a>
//               <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Disclosure</a>
//             </div>
//           </div>

//           {/* Regulatory Info */}
//           <div className="mt-8 p-4 bg-gray-800/50 rounded-lg backdrop-blur-sm">
//             <p className="text-gray-400 text-xs text-center">
//               Vunathi Capital is a registered trademark. Investments in securities market are subject to market risks, 
//               read all the related documents carefully before investing. Registration granted by SEBI, membership of BASL 
//               and certification from NISM in no way guarantee performance of the intermediary or provide any assurance of 
//               returns to investors.
//             </p>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default Web;