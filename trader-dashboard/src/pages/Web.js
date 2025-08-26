

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

// Floating 3D Cards Component
const FloatingCard3D = ({ children, className = "" }) => {
  return (
    <motion.div
      className={`bg-white/90 backdrop-blur-md rounded-2xl p-4 sm:p-6 shadow-2xl ${className}`}
      whileHover={{
        scale: 1.05,
        rotateY: 5,
        rotateX: -2,
        transition: { duration: 0.3 },
      }}
      style={{
        transformStyle: "preserve-3d",
        perspective: 1000,
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
      className={`relative px-6 py-3 sm:px-8 sm:py-4 rounded-xl font-bold text-white text-sm sm:text-base ${className}`}
      whileHover={{ y: -3 }}
      whileTap={{ y: 0 }}
      style={{
        background: "linear-gradient(145deg, #0d9488, #10b981)",
        boxShadow: "0 8px 0 #047857, 0 12px 20px rgba(0, 0, 0, 0.15)",
        transformStyle: "preserve-3d",
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
      <div className="absolute inset-0 bg-[#151f31] z-0"></div>
      <div
        className="absolute inset-0 z-0 opacity-10"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      ></div>
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-gradient-to-br from-emerald-400/30 to-teal-500/30 opacity-40"
          style={{
            width: Math.random() * 100 + 30,
            height: Math.random() * 100 + 30,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -20, 0],
            x: [0, Math.random() * 30 - 15, 0],
            rotate: [0, Math.random() * 360],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            ease: "easeInOut",
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
      className="group relative bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-white/20 hover:border-emerald-400/30 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
      whileHover={{
        y: -10,
        scale: 1.02,
        rotateY: 5,
      }}
      style={{ transformStyle: "preserve-3d" }}
    >
      <div className="flex flex-col items-center text-center">
        <div className="mb-4 p-3 bg-gradient-to-br from-emerald-400/20 to-teal-500/20 rounded-xl">
          <Icon className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
        </div>
        <h3 className="font-bold text-base sm:text-lg text-white mb-2">{name}</h3>
        <p className="text-xs sm:text-sm text-gray-200">{description}</p>
      </div>
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </motion.div>
  );
};

// Card Carousel Component
const CardCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const cards = [
    {
      title: "Track Your Stocks",
      description: "Monitor your investments with real-time profit/loss updates",
      icon: "📊",
      color: "bg-gradient-to-br from-emerald-500/90 to-teal-600/90",
    },
    {
      title: "Smart Portfolio",
      description: "AI-driven suggestions to optimize your stock picks",
      icon: "🤖",
      color: "bg-gradient-to-br from-purple-500/90 to-pink-600/90",
    },
    {
      title: "Secure Investments",
      description: "Bank-level security for all your transactions",
      icon: "🔒",
      color: "bg-gradient-to-br from-amber-500/90 to-orange-600/90",
    },
    {
      title: "Market Trends",
      description: "Stay updated with the latest stock market trends",
      icon: "📈",
      color: "bg-gradient-to-br from-red-500/90 to-rose-600/90",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % cards.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [cards.length]);

  return (
    <div className="relative w-full h-64 sm:h-80 md:h-96 overflow-hidden">
      {cards.map((card, index) => (
        <motion.div
          key={index}
          className={`absolute w-48 sm:w-56 md:w-64 h-64 sm:h-72 md:h-80 rounded-3xl p-4 sm:p-6 text-white flex flex-col justify-between ${card.color} shadow-2xl backdrop-blur-md border border-white/20`}
          initial={{
            opacity: 0,
            x: index > currentIndex ? 300 : -300,
            scale: 0.8,
            rotate: index > currentIndex ? 10 : -10,
          }}
          animate={{
            opacity: index === currentIndex ? 1 : 0.4,
            x: index === currentIndex ? 0 : index > currentIndex ? 300 : -300,
            scale: index === currentIndex ? 1 : 0.8,
            rotate: index === currentIndex ? 0 : index > currentIndex ? 5 : -5,
            zIndex: index === currentIndex ? 10 : 1,
          }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          style={{
            left: "50%",
            transform: "translateX(-50%)",
            perspective: 1000,
          }}
        >
          <div className="text-3xl sm:text-4xl md:text-5xl mb-4">{card.icon}</div>
          <div>
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2">{card.title}</h3>
            <p className="text-white/90 text-xs sm:text-sm">{card.description}</p>
          </div>
          <div className="flex justify-center mt-4">
            {cards.map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full mx-1 ${i === currentIndex ? "bg-white" : "bg-white/30"}`}
              />
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// Resource Card Component
const ResourceCard = ({ title, description, link, icon, color }) => {
  return (
    <motion.div
      className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-white/20 hover:border-emerald-400/30 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
      whileHover={{ y: -5, scale: 1.02 }}
      style={{ transformStyle: "preserve-3d" }}
    >
      <div className="flex items-start mb-4">
        <div className={`p-3 rounded-xl ${color} mr-4`}>
          <span className="text-xl sm:text-2xl">{icon}</span>
        </div>
        <h3 className="font-bold text-base sm:text-lg text-white">{title}</h3>
      </div>
      <p className="text-xs sm:text-sm text-gray-200 mb-4">{description}</p>
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="text-emerald-400 text-xs sm:text-sm font-medium hover:underline"
      >
        Visit Resource
      </a>
    </motion.div>
  );
};

// Tool Card Component
const ToolCard = ({ title, description, features, icon, color }) => {
  return (
    <motion.div
      className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-white/20 hover:border-emerald-400/30 shadow-lg hover:shadow-xl transition-all duration-300"
      whileHover={{ y: -5, scale: 1.02 }}
      style={{ transformStyle: "preserve-3d" }}
    >
      <div className="flex items-center mb-4">
        <div className={`p-3 rounded-xl ${color} mr-4`}>
          <span className="text-xl sm:text-2xl">{icon}</span>
        </div>
        <h3 className="font-bold text-base sm:text-lg text-white">{title}</h3>
      </div>
      <p className="text-xs sm:text-sm text-gray-200 mb-4">{description}</p>
      <div className="mt-4">
        <h4 className="text-white text-xs sm:text-sm font-semibold mb-2">Key Features:</h4>
        <ul className="text-xs sm:text-sm text-gray-300 space-y-1">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <span className="text-emerald-400 mr-2">•</span>
              {feature}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

// Animated Trading Chart Component
const AnimatedTradingChart = () => {
  const [activePoint, setActivePoint] = useState(0);
  const dataPoints = [
    { value: 40, label: "Jan" },
    { value: 80, label: "Feb" },
    { value: 60, label: "Mar" },
    { value: 120, label: "Apr" },
    { value: 90, label: "May" },
    { value: 150, label: "Jun" },
    { value: 130, label: "Jul" },
    { value: 180, label: "Aug" },
    { value: 160, label: "Sep" },
    { value: 210, label: "Oct" },
    { value: 190, label: "Nov" },
    { value: 240, label: "Dec" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActivePoint((prev) => (prev + 1) % dataPoints.length);
    }, 1500);
    return () => clearInterval(interval);
  }, [dataPoints.length]);

  return (
    <div className="relative w-full h-48 sm:h-64 bg-black/20 rounded-2xl p-4 sm:p-6 border border-emerald-500/30 backdrop-blur-md">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="grid grid-cols-12 gap-1 sm:gap-2 w-full h-32 sm:h-40 items-end px-2 sm:px-4">
          {dataPoints.map((point, index) => (
            <motion.div
              key={index}
              className="relative flex flex-col items-center"
              animate={{
                height: `${point.value * 0.6}px`, // Scaled for mobile
                transition: { duration: 1, ease: "easeOut" },
              }}
              onHoverStart={() => setActivePoint(index)}
            >
              <motion.div
                className={`w-2 sm:w-3 rounded-t ${
                  index === activePoint
                    ? "bg-gradient-to-t from-emerald-400 to-emerald-600"
                    : "bg-gradient-to-t from-emerald-600/40 to-emerald-800/40"
                }`}
                animate={{
                  height: "100%",
                  transition: { duration: 0.5 },
                }}
              />
              <span
                className={`text-[10px] sm:text-xs mt-2 ${
                  index === activePoint ? "text-emerald-400 font-bold" : "text-gray-400"
                }`}
              >
                {point.label}
              </span>
              {index === activePoint && (
                <motion.div
                  className="absolute -top-6 sm:-top-8 bg-emerald-500 text-white text-[10px] sm:text-xs font-bold px-2 py-1 rounded-lg"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                >
                  ₹{point.value * 100}
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
      <div className="absolute bottom-2 sm:bottom-4 left-0 right-0 flex justify-center">
        <div className="bg-black/40 backdrop-blur-sm rounded-lg px-3 sm:px-4 py-1 sm:py-2 border border-emerald-500/20">
          <span className="text-emerald-400 text-xs sm:text-sm">Annual Growth: +42%</span>
        </div>
      </div>
    </div>
  );
};

// Market Trends Component
const MarketTrendsSection = () => {
  const trends = [
    {}, // Placeholder as in original code
    {},
    {},
    {},
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="text-center mb-8 sm:mb-12"
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Market Trends & Analysis</h2>
        <p className="text-gray-200 text-sm sm:text-base max-w-xl sm:max-w-2xl mx-auto">
          Stay ahead of the market with our expert analysis and trend predictions
        </p>
      </motion.div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-white/20"
        >
          <h3 className="text-lg sm:text-xl font-bold text-white mb-4">Live Market Performance</h3>
          <AnimatedTradingChart />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-white/20"
        >
          <h3 className="text-lg sm:text-xl font-bold text-white mb-4">Key Market Indicators</h3>
          <div className="space-y-3 sm:space-y-4">
            {[
              { name: "Nifty 50", value: "+1.8%", change: "up" },
              { name: "Sensex", value: "+1.5%", change: "up" },
              { name: "Bank Nifty", value: "+2.3%", change: "up" },
              { name: "USD/INR", value: "-0.4%", change: "down" },
              { name: "Gold", value: "+0.7%", change: "up" },
              { name: "Crude Oil", value: "-1.2%", change: "down" },
            ].map((indicator, index) => (
              <motion.div
                key={index}
                className="flex justify-between items-center py-2 border-b border-white/10"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <span className="text-gray-200 text-xs sm:text-sm">{indicator.name}</span>
                <span
                  className={`font-bold text-xs sm:text-sm ${
                    indicator.change === "up" ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {indicator.value}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {trends.map((trend, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            viewport={{ once: true }}
          >
            {/* Placeholder for trends */}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Main Component
const Web = () => {
  const navigate = useNavigate();
  const products = [
    {
      name: "Stock Trading",
      icon: (props) => (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
      description: "Buy and sell stocks with real-time market data",
    },
    {
      name: "Portfolio Tracker",
      icon: (props) => (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18M7 6h10M7 18h10" />
        </svg>
      ),
      description: "Monitor your investments and track profits/losses",
    },
    {
      name: "Risk Management",
      icon: (props) => (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
      ),
      description: "Protect your investments with smart risk management tools",
    },
    {
      name: "Dividend Tracking",
      icon: (props) => (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
      description: "Monitor and optimize your dividend income streams",
    },
  ];

  const onboardingSteps = [
    {
      title: "Sign Up",
      description: "Create your Vunathi Capital account in minutes. Just add your details and verify your identity.",
    },
    {
      title: "Add Funds",
      description: "Deposit as little as ₹100 to start. Use UPI, bank transfer, or cards—your choice!",
    },
    {
      title: "Pick Your Stocks",
      description: "Use our tools to explore stocks, check trends, and make smart picks.",
    },
    {
      title: "Track & Trade",
      description: "Monitor your portfolio on the dashboard and trade anytime with real-time data.",
    },
  ];

  const dashboardFeatures = [
    {
      title: "Portfolio Overview",
      description: "See all your stock investments in one place, with total value, gains, and losses.",
    },
    {
      title: "Profit/Loss Tracker",
      description: "Check real-time updates on how your stocks are performing, with clear charts.",
    },
    {
      title: "Market Insights",
      description: "Get daily updates on market trends and stock alerts to stay ahead.",
    },
    {
      title: "Secure Investments",
      description: "Bank-level security for all your transactions",
      icon: "🔒",
    },
  ];

  const investorOnboarding = {
    title: "Welcome to Vunathi Capital",
    pitch:
      "Join Vunathi Capital, where your money works smarter. Invest in the stock market with real-time tracking, AI-driven insights, and expert strategies. Whether you're starting with ₹100 or ₹1,00,000, our platform helps you diversify and grow your wealth with ease. Monitor profits and losses on our user-friendly dashboard and trade with confidence.",
  };

  const newsWebsites = [
    {
      title: "Moneycontrol",
      description:
        "Popular platform for Indian stock investors, offering news, trends, charts, and discussion forums.",
      link: "https://www.moneycontrol.com",
      icon: "📰",
      color: "bg-blue-500/20",
    },
    {
      title: "TradingView",
      description:
        "Widely used globally for charts, screeners, technical analysis tools, and a large community for sharing ideas.",
      link: "https://www.tradingview.com",
      icon: "📊",
      color: "bg-green-500/20",
    },
    {
      title: "NSE India",
      description:
        "Official website of the National Stock Exchange of India, providing reliable market data and financial reports.",
      link: "https://www.nseindia.com",
      icon: "🇮🇳",
      color: "bg-orange-500/20",
    },
    {
      title: "Economic Times Market",
      description:
        "Leading source of up-to-the-minute financial news, analysis, and expert insights for the Indian stock market.",
      link: "https://economictimes.indiatimes.com/markets",
      icon: "📈",
      color: "bg-purple-500/20",
    },
    {
      title: "Investing.com",
      description:
        "Global platform with in-depth insights into various markets, including Indian stocks, featuring charts and technical indicators.",
      link: "https://www.investing.com",
      icon: "🌐",
      color: "bg-red-500/20",
    },
    {
      title: "BSE India",
      description:
        "Official website of the Bombay Stock Exchange, providing market data, financial reports, and corporate governance information.",
      link: "https://www.bseindia.com",
      icon: "💼",
      color: "bg-yellow-500/20",
    },
  ];

  const tradingTools = [
    {
      title: "Stock Screeners",
      description: "Filter stocks based on your specific criteria like sector, market capitalization, P/E ratio, ROE, and CAGR.",
      features: [
        "Sector-based filtering",
        "Fundamental analysis metrics",
        "Technical indicator screening",
        "Customizable parameters",
      ],
      icon: "🔍",
      color: "bg-blue-500/20",
    },
    {
      title: "Real-time News & Sentiment",
      description: "Access real-time financial news and assess market sentiment to make informed trading decisions.",
      features: [
        "Real-time news aggregation",
        "Sentiment analysis",
        "Sector-specific news",
        "Custom alerts and notifications",
      ],
      icon: "📢",
      color: "bg-green-500/20",
    },
    {
      title: "Charting & Technical Analysis",
      description: "Powerful charting capabilities with technical indicators, pattern recognition, and backtesting features.",
      features: [
        "Multiple chart types",
        "Technical indicators library",
        "Pattern recognition",
        "Historical backtesting",
      ],
      icon: "📉",
      color: "bg-purple-500/20",
    },
    {
      title: "Paper Trading",
      description: "Practice trading strategies without risking real capital to build confidence and test approaches.",
      features: [
        "Virtual portfolio management",
        "Real-market conditions",
        "Performance tracking",
        "Strategy testing",
      ],
      icon: "📝",
      color: "bg-yellow-500/20",
    },
  ];

  const educationalResources = [
    {
      title: "Zerodha Varsity",
      description:
        "Comprehensive modules and tutorials covering stock market basics, technical analysis, and trading strategies.",
      link: "https://zerodha.com/varsity",
      icon: "🎓",
      color: "bg-blue-500/20",
    },
    {
      title: "Investopedia",
      description:
        "Extensive resource with definitions and examples of stock market terms and concepts for all experience levels.",
      link: "https://www.investopedia.com",
      icon: "📚",
      color: "bg-green-500/20",
    },
    {
      title: "Market Data APIs",
      description: "Integrate real-time and historical data directly into your applications using financial data APIs.",
      link: "https://www.alphavantage.co",
      icon: "🔌",
      color: "bg-purple-500/20",
    },
    {
      title: "Financial Data Providers",
      description: "Access comprehensive market datasets from various sources including exchanges and news outlets.",
      link: "https://www.datarade.ai",
      icon: "💾",
      color: "bg-yellow-500/20",
    },
  ];

  const contentStrategy = [
    {
      title: "Identify Your Audience",
      description:
        "Understanding your audience (beginners, experienced traders, long-term investors) helps tailor content to their needs.",
      icon: "👥",
      color: "bg-blue-500/20",
    },
    {
      title: "Address Pain Points",
      description: "Research keywords and common questions to identify topics that resonate with your audience.",
      icon: "❓",
      color: "bg-green-500/20",
    },
    {
      title: "Provide Practical Solutions",
      description: "Offer actionable insights and valuable information that helps your audience make informed decisions.",
      icon: "💡",
      color: "bg-purple-500/20",
    },
    {
      title: "Present Data Clearly",
      description: "Use charts, graphs, and simple language to explain complex concepts and data points.",
      icon: "📊",
      color: "bg-yellow-500/20",
    },
    {
      title: "Maintain Objectivity",
      description: "Be transparent about data sources and avoid promoting specific stocks without thorough research.",
      icon: "⚖️",
      color: "bg-red-500/20",
    },
    {
      title: "Regular Updates",
      description: "Keep content fresh with updates on market trends, news, and new strategies.",
      icon: "🔄",
      color: "bg-indigo-500/20",
    },
  ];

  return (
    <div className="min-h-screen text-white font-sans overflow-hidden relative">
      <AnimatedBackground />
      {/* Navbar */}
      <nav className="bg-black/30 backdrop-blur-md py-4 px-4 sm:px-6 flex justify-between items-center sticky top-0 z-50 border-b border-emerald-500/30">
        <div className="flex items-center space-x-6 sm:space-x-10">
          <motion.div
            whileHover={{ scale: 1.05, rotateY: 5 }}
            className="flex items-center cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* LOGO UPDATED HERE */}
            <img 
              src="/Logo2.jpg" 
              alt="Vunathi Capital Logo" 
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-emerald-500/30 shadow-md" 
            />
            <span className="ml-2 sm:ml-3 text-lg sm:text-2xl font-bold text-white">Vunathi Capital</span>
          </motion.div>
        </div>
        <div className="flex items-center space-x-4">
          <Button3D onClick={() => navigate("/login")} className="px-4 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm">
            Login
          </Button3D>
        </div>
      </nav>
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-24 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Grow Your <span className="text-emerald-400">Wealth</span> with Stocks
            </h1>
            <p className="mt-4 sm:mt-6 text-sm sm:text-base md:text-lg text-gray-200 max-w-md sm:max-w-lg">
              Hey there! Vunathi Capital lets you invest in stocks and track your profits and losses easily. Start small, trade smart, and watch your money grow.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotateY: 10 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
            style={{ perspective: 1000 }}
          >
            <FloatingCard3D className="w-full h-64 sm:h-80 md:h-96 flex items-center justify-center bg-black/20">
              <CardCarousel />
            </FloatingCard3D>
          </motion.div>
        </div>
      </div>
      {/* Investment Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-12"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Your Stock Market Toolkit</h2>
          <p className="text-gray-200 text-sm sm:text-base max-w-xl sm:max-w-2xl mx-auto">
            From tracking your portfolio to catching the latest market trends, we've got the tools to help you trade smarter.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20, rotateY: -5 }}
              whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              viewport={{ once: true }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <InvestmentIcon icon={product.icon} name={product.name} description={product.description} />
            </motion.div>
          ))}
        </div>
      </div>
      {/* Market Trends Section */}
      <MarketTrendsSection />
      {/* Content Strategy Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-12"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Content Strategy Approach</h2>
          <p className="text-gray-200 text-sm sm:text-base max-w-xl sm:max-w-2xl mx-auto">
            Our methodology for delivering valuable, relevant content to our investors and traders.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {contentStrategy.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-white/20 hover:border-emerald-400/30 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                <div className="flex items-center mb-4">
                  <div className={`p-3 rounded-xl ${item.color} mr-4`}>
                    <span className="text-xl sm:text-2xl">{item.icon}</span>
                  </div>
                  <h3 className="font-bold text-base sm:text-lg text-white">{item.title}</h3>
                </div>
                <p className="text-xs sm:text-sm text-gray-200">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      {/* Onboarding Guide Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-12"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Get Started in 4 Easy Steps</h2>
          <p className="text-gray-200 text-sm sm:text-base max-w-xl sm:max-w-2xl mx-auto">
            New to Vunathi Capital? No worries! Here's how you can jump into stock market investing.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {onboardingSteps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20, rotateY: -5 }}
              whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              viewport={{ once: true }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-white/20 hover:border-emerald-400/30 shadow-lg hover:shadow-xl transition-all duration-300">
                <h3 className="font-bold text-base sm:text-lg text-white mb-2">{step.title}</h3>
                <p className="text-xs sm:text-sm text-gray-200">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      {/* Dashboard Walkthrough Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-12"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">How Your Dashboard Works</h2>
          <p className="text-gray-200 text-sm sm:text-base max-w-xl sm:max-w-2xl mx-auto">
            Your Vunathi Capital dashboard is your go-to spot for tracking stocks and making trades. Here's a quick guide.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {dashboardFeatures.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20, rotateY: -5 }}
              whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              viewport={{ once: true }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-white/20 hover:border-emerald-400/30 shadow-lg hover:shadow-xl transition-all duration-300">
                <h3 className="font-bold text-base sm:text-lg text-white mb-2">{feature.title}</h3>
                <p className="text-xs sm:text-sm text-gray-200">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      {/* Stats Section */}
      <div className="bg-gradient-to-r from-emerald-600/90 to-teal-700/90 py-12 sm:py-16 mt-12 sm:mt-16 text-white relative overflow-hidden backdrop-blur-md">
        <div className="absolute inset-0 opacity-10">
          {[...Array(16)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                width: Math.random() * 80 + 30,
                height: Math.random() * 80 + 30,
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
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 text-center">
            {[
              { value: "5M+", label: "Active Investors" },
              { value: "₹95,000Cr+", label: "Invested in Stocks" },
              { value: "100+", label: "Stock Options" },
              { value: "24/7", label: "Market Updates" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="p-4 sm:p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20"
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 text-white">{stat.value}</div>
                <div className="text-emerald-100 text-xs sm:text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      {/* Investor Onboarding Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-emerald-500/90 to-teal-600/90 rounded-3xl p-6 sm:p-8 md:p-12 text-center text-white shadow-xl backdrop-blur-md border border-white/20"
          style={{ transformStyle: "preserve-3d" }}
        >
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">{investorOnboarding.title}</h2>
          <p className="text-emerald-100 text-sm sm:text-base max-w-xl sm:max-w-2xl mx-auto mb-6 sm:mb-8">
            {investorOnboarding.pitch}
          </p>
        </motion.div>
      </div>
      {/* Footer */}
      <footer className="bg-black/80 backdrop-blur-md text-white pt-12 sm:pt-16 pb-8 border-t border-emerald-500/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
            <div>
              <div className="flex items-center mb-4 sm:mb-6">
                {/* LOGO UPDATED HERE */}
                <img 
                  src="/Logo2.jpg" 
                  alt="Vunathi Capital Logo" 
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-emerald-500/30 shadow-md" 
                />
                <span className="ml-2 sm:ml-3 text-lg sm:text-2xl font-bold">Vunathi Capital</span>
              </div>
              <p className="text-gray-400 text-xs sm:text-sm mb-4 sm:mb-6">
                Your go-to platform for smart stock market investing and real-time portfolio tracking.
              </p>
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6">Investment Tools</h3>
              <ul className="space-y-2 sm:space-y-3">
                {["Stock Trading", "Portfolio Tracker", "Trading Strategies", "Market News"].map((item, i) => (
                  <li key={i}>
                    <a href="#" className="text-gray-400 hover:text-white text-xs sm:text-sm transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6">Resources</h3>
              <ul className="space-y-2 sm:space-y-3">
                {["Market Insights", "Trading Guides", "Stock Analysis", "Market Trends"].map((item, i) => (
                  <li key={i}>
                    <a href="#" className="text-gray-400 hover:text-white text-xs sm:text-sm transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6">Support</h3>
              <ul className="space-y-2 sm:space-y-3">
                {["Help Center", "FAQ", "Terms of Service", "Privacy Policy"].map((item, i) => (
                  <li key={i}>
                    <a href="#" className="text-gray-400 hover:text-white text-xs sm:text-sm transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 sm:mt-12 pt-6 sm:pt-8 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-gray-400 text-xs sm:text-sm">
              © {new Date().getFullYear()} Vunathi Capital. All rights reserved.
            </p>
            <div className="flex space-x-4 sm:space-x-6 mt-4 sm:mt-0">
              <a href="#" className="text-gray-400 hover:text-white text-xs sm:text-sm transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-xs sm:text-sm transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
          <div className="mt-6 sm:mt-8 p-4 bg-gray-800/50 rounded-lg backdrop-blur-sm">
            <p className="text-gray-400 text-xs text-center">
              Vunathi Capital is a registered trademark. Investments in securities market are subject to market risks,
              read all the related documents carefully before investing.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Web;