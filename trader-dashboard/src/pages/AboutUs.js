import React, { useState, useEffect, useRef } from 'react';

const AboutUs = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isVisible, setIsVisible] = useState(false);
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    setIsVisible(true);
    
    // Canvas animation for background
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    
    let animationFrameId;
    const particles = [];
    const particleCount = 80;
    
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 1.5 - 0.75;
        this.speedY = Math.random() * 1.5 - 0.75;
        this.color = `hsla(${Math.random() * 60 + 190}, 70%, 60%, ${Math.random() * 0.4})`;
        this.angle = 0;
        this.angleSpeed = Math.random() * 0.05;
        this.waveAmplitude = Math.random() * 2 + 1;
      }
      
      update() {
        this.angle += this.angleSpeed;
        this.x += this.speedX + Math.sin(this.angle) * 0.5;
        this.y += this.speedY + Math.cos(this.angle) * 0.5;
        
        if (this.x > canvas.width + 10 || this.x < -10) {
          this.speedX = -this.speedX;
        }
        if (this.y > canvas.height + 10 || this.y < -10) {
          this.speedY = -this.speedY;
        }
      }
      
      draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Add a glow effect
        ctx.shadowBlur = 15;
        ctx.shadowColor = this.color;
      }
    }
    
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        
        // Draw connections between particles
        for (let j = i; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `hsla(210, 70%, 60%, ${0.2 * (1 - distance/120)})`;
            ctx.lineWidth = 0.8;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
            ctx.closePath();
          }
        }
      }
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();
    
    window.addEventListener('resize', resizeCanvas);
    
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  // Stats data
  const stats = [
    { value: 250, suffix: '+', label: 'Projects Completed' },
    { value: 98.7, suffix: '%', label: 'Client Satisfaction' },
    { value: 65, suffix: '+', label: 'Team Members' },
    { value: 14, suffix: '+', label: 'Years Experience' },
  ];

  // Values data
  const values = [
    {
      icon: 'fas fa-rocket',
      title: 'Innovation',
      description: 'We constantly push boundaries to develop cutting-edge trading solutions that give our clients a competitive edge.'
    },
    {
      icon: 'fas fa-shield-alt',
      title: 'Security',
      description: 'Enterprise-grade security protocols to ensure client data protection and system integrity at all times.'
    },
    {
      icon: 'fas fa-bolt',
      title: 'Agility',
      description: 'Rapid adaptation to market changes and emerging technologies to keep our clients ahead of the curve.'
    },
    {
      icon: 'fas fa-handshake',
      title: 'Partnership',
      description: 'We work as an extension of our clients teams to achieve their strategic business objectives.'
    }
  ];

  // Services data
  const services = [
    {
      icon: 'fas fa-chart-line',
      title: 'Algorithmic Trading',
      description: 'Advanced algorithmic trading systems that execute trades at optimal prices and timings.'
    },
    {
      icon: 'fas fa-brain',
      title: 'AI Analytics',
      description: 'Machine learning-powered analytics that predict market movements with unprecedented accuracy.'
    },
    {
      icon: 'fas fa-bolt',
      title: 'Real-time Execution',
      description: 'Ultra-low latency trading execution systems for high-frequency trading environments.'
    },
    {
      icon: 'fas fa-lock',
      title: 'Risk Management',
      description: 'Comprehensive risk management solutions to protect investments and maximize returns.'
    },
    {
      icon: 'fas fa-mobile-alt',
      title: 'Mobile Trading',
      description: 'Seamless mobile trading experiences with full functionality across all devices.'
    },
    {
      icon: 'fas fa-cloud',
      title: 'Cloud Solutions',
      description: 'Scalable cloud-based trading infrastructure that grows with your business needs.'
    }
  ];

  // Team members
  const team = [
    {
      name: 'Rajesh Kumar',
      role: 'CEO & Founder',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80',
      bio: 'Former head of trading at Global Bank with 20+ years experience in financial technology.'
    },
    {
      name: 'Priya Sharma',
      role: 'CTO',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1888&q=80',
      bio: 'Ph.D in Computer Science with expertise in distributed systems and high-frequency trading architectures.'
    },
    {
      name: 'Arjun Patel',
      role: 'Lead Developer',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80',
      bio: 'Full-stack developer specializing in real-time data processing and visualization.'
    },
    {
      name: 'Neha Gupta',
      role: 'UX Director',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1961&q=80',
      bio: 'Award-winning designer focused on creating intuitive trading interfaces for complex financial data.'
    }
  ];

  // Client testimonials
  const testimonials = [
    {
      name: 'Global Investments Inc.',
      role: 'Head of Trading',
      text: 'Vunathi\'s algorithmic trading platform has increased our execution efficiency by 37% while reducing latency to unprecedented levels.',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80'
    },
    {
      name: 'Alpha Capital',
      role: 'CTO',
      text: 'The risk management solutions provided by Vunathi have fundamentally transformed how we protect our investments in volatile markets.',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80'
    },
    {
      name: 'Summit Financial',
      role: 'Portfolio Manager',
      text: 'Their real-time analytics dashboard gives us insights we simply didn\'t have access to before, creating significant alpha for our clients.',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80'
    }
  ];

  // Inline styles
  const styles = {
    container: {
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
      color: "#1a202c",
      lineHeight: 1.6,
      maxWidth: 1400,
      margin: "0 auto",
      padding: "0 20px",
      position: "relative",
      overflow: "hidden",
    },
    canvas: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      zIndex: -1,
    },
    hero: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      textAlign: "center",
      padding: "150px 0 100px",
      borderRadius: "24px",
      margin: "60px 0",
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? "translateY(0) rotateX(0)" : "translateY(50px) rotateX(5deg)",
      transition: "opacity 1s ease, transform 1s ease",
      position: "relative",
      background: "rgba(255, 255, 255, 0.85)",
      backdropFilter: "blur(12px)",
      boxShadow: "0 25px 50px rgba(0, 0, 0, 0.15)",
      border: "1px solid rgba(255, 255, 255, 0.4)",
      perspective: "1000px",
    },
    heroTitle: {
      fontSize: "4rem",
      fontWeight: 800,
      marginBottom: "25px",
      color: "#0a2463",
      background: "linear-gradient(135deg, #0a2463, #3b82f6, #61a0af)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
      textShadow: "0 4px 10px rgba(10, 36, 99, 0.2)",
      transform: "translateZ(30px)",
    },
    heroSubtitle: {
      fontSize: "1.5rem",
      maxWidth: 800,
      margin: "0 auto 40px",
      color: "#4a5568",
      fontWeight: 400,
      lineHeight: 1.7,
    },
    heroVisual: {
      marginTop: 50,
      width: "100%",
      maxWidth: 800,
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? "scale(1) rotateY(0deg)" : "scale(0.9) rotateY(10deg)",
      transition: "opacity 1s ease 0.3s, transform 1s ease 0.3s",
      perspective: "1000px",
    },
    dataVisualization: {
      display: "flex",
      justifyContent: "space-around",
      alignItems: "flex-end",
      height: 250,
      background: "rgba(255, 255, 255, 0.6)",
      borderRadius: "16px",
      padding: "30px",
      boxShadow: "0 15px 35px rgba(0, 0, 0, 0.1)",
      backdropFilter: "blur(8px)",
      border: "1px solid rgba(255, 255, 255, 0.5)",
      transformStyle: "preserve-3d",
      transform: "rotateX(5deg)",
    },
    chartBar: {
      width: 50,
      background: "linear-gradient(to top, #3b82f6, #0a2463)",
      borderRadius: "8px 8px 0 0",
      animation: "grow 1.5s ease-out, pulse 2s infinite 1.5s",
      animationFillMode: "both",
      boxShadow: "0 5px 15px rgba(10, 36, 99, 0.3)",
      transform: "translateZ(20px)",
    },
    statsSection: {
      margin: "120px 0",
      position: "relative",
    },
    statsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
      gap: 40,
    },
    statItem: {
      textAlign: "center",
      padding: "50px 30px",
      background: "rgba(255, 255, 255, 0.7)",
      borderRadius: "20px",
      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
      transition: "all 0.5s ease",
      backdropFilter: "blur(8px)",
      border: "1px solid rgba(255, 255, 255, 0.4)",
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? "translateY(0) rotateY(0)" : "translateY(30px) rotateY(5deg)",
      transformStyle: "preserve-3d",
    },
    statValue: {
      fontSize: "3.5rem",
      fontWeight: 800,
      color: "#0a2463",
      marginBottom: 15,
      background: "linear-gradient(135deg, #0a2463, #3b82f6)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
      textShadow: "0 3px 8px rgba(10, 36, 99, 0.2)",
    },
    statLabel: {
      color: "#4a5568",
      fontWeight: 600,
      fontSize: "1.2rem",
    },
    tabsSection: {
      margin: "120px 0",
      background: "rgba(255, 255, 255, 0.7)",
      borderRadius: "24px",
      padding: "50px",
      boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
      backdropFilter: "blur(10px)",
      border: "1px solid rgba(255, 255, 255, 0.4)",
      transformStyle: "preserve-3d",
    },
    tabsHeader: {
      display: "flex",
      borderBottom: "2px solid rgba(226, 232, 240, 0.7)",
      marginBottom: 50,
    },
    tabBtn: {
      padding: "18px 35px",
      background: "none",
      border: "none",
      fontSize: "1.2rem",
      fontWeight: 600,
      color: "#718096",
      cursor: "pointer",
      position: "relative",
      transition: "all 0.3s ease",
      transformStyle: "preserve-3d",
      transform: "translateZ(0)",
    },
    activeTab: {
      color: "#0a2463",
    },
    activeTabAfter: {
      content: "''",
      position: "absolute",
      bottom: -2,
      left: 0,
      width: "100%",
      height: 4,
      background: "linear-gradient(90deg, #0a2463, #3b82f6)",
      borderRadius: "4px 4px 0 0",
      transform: "translateZ(10px)",
    },
    tabContent: {
      minHeight: 300,
    },
    tabPanel: {
      opacity: 1,
      transform: "translateX(0)",
      transition: "opacity 0.4s ease, transform 0.4s ease",
    },
    tabTitle: {
      fontSize: "2.5rem",
      marginBottom: "30px",
      color: "#0a2463",
      fontWeight: 700,
      transform: "translateZ(20px)",
    },
    tabText: {
      marginBottom: 25,
      color: "#4a5568",
      lineHeight: 1.8,
      fontSize: "1.2rem",
    },
    valuesSection: {
      margin: "120px 0",
    },
    sectionTitle: {
      fontSize: "3.2rem",
      textAlign: "center",
      marginBottom: "70px",
      color: "#0a2463",
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? "translateY(0) rotateX(0)" : "translateY(30px) rotateX(5deg)",
      transition: "opacity 0.7s ease, transform 0.7s ease",
      fontWeight: 800,
      background: "linear-gradient(135deg, #0a2463, #3b82f6)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
      textShadow: "0 4px 12px rgba(10, 36, 99, 0.2)",
      transformStyle: "preserve-3d",
    },
    valuesGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
      gap: 40,
    },
    valueCard: {
      background: "rgba(255, 255, 255, 0.7)",
      padding: "50px 30px",
      borderRadius: "20px",
      textAlign: "center",
      boxShadow: "0 15px 35px rgba(0, 0, 0, 0.1)",
      transition: "all 0.5s ease",
      backdropFilter: "blur(8px)",
      border: "1px solid rgba(255, 255, 255, 0.4)",
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? "translateY(0) rotateY(0)" : "translateY(30px) rotateY(5deg)",
      transformStyle: "preserve-3d",
    },
    valueIcon: {
      fontSize: "3.5rem",
      color: "#61a0af",
      marginBottom: "30px",
      background: "linear-gradient(135deg, #0a2463, #3b82f6)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
      filter: "drop-shadow(0 5px 10px rgba(10, 36, 99, 0.2))",
      transform: "translateZ(20px)",
    },
    valueCardTitle: {
      fontSize: "1.7rem",
      marginBottom: "20px",
      color: "#0a2463",
      fontWeight: 700,
    },
    servicesSection: {
      margin: "120px 0",
    },
    servicesGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
      gap: 40,
    },
    serviceCard: {
      background: "rgba(255, 255, 255, 0.7)",
      padding: "40px 30px",
      borderRadius: "20px",
      textAlign: "center",
      boxShadow: "0 15px 35px rgba(0, 0, 0, 0.1)",
      transition: "all 0.5s ease",
      backdropFilter: "blur(8px)",
      border: "1px solid rgba(255, 255, 255, 0.4)",
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? "translateY(0) rotateX(0)" : "translateY(30px) rotateX(5deg)",
      transformStyle: "preserve-3d",
    },
    serviceIcon: {
      fontSize: "3rem",
      marginBottom: "25px",
      background: "linear-gradient(135deg, #0a2463, #3b82f6)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
      filter: "drop-shadow(0 5px 10px rgba(10, 36, 99, 0.2))",
      transform: "translateZ(20px)",
    },
    serviceCardTitle: {
      fontSize: "1.5rem",
      marginBottom: "15px",
      color: "#0a2463",
      fontWeight: 700,
    },
    teamSection: {
      margin: "120px 0",
    },
    teamGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
      gap: 50,
    },
    teamMember: {
      textAlign: "center",
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? "scale(1) rotateY(0)" : "scale(0.9) rotateY(5deg)",
      transition: "all 0.6s ease",
      transformStyle: "preserve-3d",
    },
    memberImage: {
      position: "relative",
      width: 240,
      height: 240,
      margin: "0 auto 30px",
      borderRadius: "50%",
      overflow: "hidden",
      boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
      transition: "all 0.5s ease",
      transform: "translateZ(30px)",
    },
    memberImg: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      transition: "all 0.5s ease",
    },
    imageOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "linear-gradient(to bottom, transparent 0%, rgba(10, 36, 99, 0.7) 100%)",
      opacity: 0,
      transition: "all 0.4s ease",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    socialIcons: {
      display: "flex",
      gap: 20,
    },
    socialIcon: {
      color: "white",
      fontSize: "1.5rem",
      opacity: 0,
      transform: "translateY(20px) rotateY(180deg)",
      transition: "all 0.3s ease",
      filter: "drop-shadow(0 2px 5px rgba(0, 0, 0, 0.3))",
    },
    teamMemberName: {
      fontSize: "1.6rem",
      marginBottom: 10,
      color: "#0a2463",
      fontWeight: 700,
    },
    teamMemberRole: {
      color: "#3b82f6",
      fontSize: "1.2rem",
      fontWeight: 600,
      marginBottom: 15,
    },
    teamMemberBio: {
      color: "#718096",
      fontSize: "1rem",
      lineHeight: 1.6,
    },
    testimonialsSection: {
      margin: "120px 0",
    },
    testimonialsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
      gap: 40,
    },
    testimonialCard: {
      background: "rgba(255, 255, 255, 0.7)",
      padding: "40px 30px",
      borderRadius: "20px",
      boxShadow: "0 15px 35px rgba(0, 0, 0, 0.1)",
      transition: "all 0.5s ease",
      backdropFilter: "blur(8px)",
      border: "1px solid rgba(255, 255, 255, 0.4)",
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? "translateY(0) rotateX(0)" : "translateY(30px) rotateX(5deg)",
      transformStyle: "preserve-3d",
      position: "relative",
    },
    quoteIcon: {
      position: "absolute",
      top: 20,
      right: 30,
      fontSize: "3rem",
      color: "rgba(10, 36, 99, 0.1)",
    },
    testimonialText: {
      fontSize: "1.1rem",
      lineHeight: 1.7,
      color: "#4a5568",
      marginBottom: 25,
      fontStyle: "italic",
    },
    testimonialAuthor: {
      display: "flex",
      alignItems: "center",
    },
    testimonialAvatar: {
      width: 60,
      height: 60,
      borderRadius: "50%",
      marginRight: 15,
      objectFit: "cover",
    },
    testimonialInfo: {
      display: "flex",
      flexDirection: "column",
    },
    testimonialName: {
      fontWeight: 700,
      color: "#0a2463",
    },
    testimonialRole: {
      color: "#718096",
      fontSize: "0.9rem",
    },
    ctaSection: {
      textAlign: "center",
      padding: "120px 50px",
      background: "linear-gradient(135deg, rgba(10, 36, 99, 0.9) 0%, rgba(59, 130, 246, 0.9) 100%)",
      color: "white",
      borderRadius: "24px",
      margin: "120px 0",
      opacity: isVisible ? 1 : 0,
      transition: "all 1s ease",
      boxShadow: "0 25px 50px rgba(0, 0, 0, 0.2)",
      backdropFilter: "blur(8px)",
      border: "1px solid rgba(255, 255, 255, 0.2)",
      transformStyle: "preserve-3d",
      position: "relative",
      overflow: "hidden",
    },
    ctaPattern: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      opacity: 0.1,
      backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
      backgroundSize: "30px 30px",
    },
    ctaTitle: {
      fontSize: "3rem",
      marginBottom: "25px",
      fontWeight: 800,
      transform: "translateZ(40px)",
    },
    ctaText: {
      fontSize: "1.3rem",
      maxWidth: 700,
      margin: "0 auto 50px",
      opacity: 0.9,
      lineHeight: 1.7,
      transform: "translateZ(30px)",
    },
    ctaButton: {
      padding: "20px 60px",
      fontSize: "1.3rem",
      fontWeight: 700,
      background: "white",
      color: "#0a2463",
      border: "none",
      borderRadius: 50,
      cursor: "pointer",
      transition: "all 0.4s ease",
      boxShadow: "0 15px 35px rgba(0, 0, 0, 0.2)",
      transform: "translateZ(50px)",
    },
    // Keyframes for animation
    keyframes: `
      @keyframes grow {
        from { height: 0%; }
      }
      
      @keyframes float {
        0% { transform: translateY(0px) rotate(0deg); }
        50% { transform: translateY(-15px) rotate(2deg); }
        100% { transform: translateY(0px) rotate(0deg); }
      }
      
      @keyframes pulse {
        0% { transform: scale(1); box-shadow: 0 5px 15px rgba(10, 36, 99, 0.3); }
        50% { transform: scale(1.05); box-shadow: 0 10px 25px rgba(10, 36, 99, 0.5); }
        100% { transform: scale(1); box-shadow: 0 5px 15px rgba(10, 36, 99, 0.3); }
      }
      
      @keyframes glow {
        0% { filter: drop-shadow(0 0 5px rgba(59, 130, 246, 0.5)); }
        50% { filter: drop-shadow(0 0 20px rgba(59, 130, 246, 0.8)); }
        100% { filter: drop-shadow(0 0 5px rgba(59, 130, 246, 0.5)); }
      }
    `,
  };

  // Apply animation delays for stats and values
  const getStatItemStyle = (index) => ({
    ...styles.statItem,
    transitionDelay: `${index * 0.1}s`
  });

  const getValueCardStyle = (index) => ({
    ...styles.valueCard,
    transitionDelay: `${index * 0.1}s`,
    animation: "float 8s ease-in-out infinite",
    animationDelay: `${index * 0.5}s`,
  });

  const getServiceCardStyle = (index) => ({
    ...styles.serviceCard,
    transitionDelay: `${index * 0.1}s`,
    animation: "float 6s ease-in-out infinite",
    animationDelay: `${index * 0.4}s`,
  });

  const getTeamMemberStyle = (index) => ({
    ...styles.teamMember,
    transitionDelay: `${index * 0.1}s`,
  });

  const getTestimonialCardStyle = (index) => ({
    ...styles.testimonialCard,
    transitionDelay: `${index * 0.1}s`,
    animation: "float 7s ease-in-out infinite",
    animationDelay: `${index * 0.3}s`,
  });

  // Hover effects for cards
  const handleMouseEnter = (e) => {
    e.currentTarget.style.transform = "translateY(-15px) rotateY(5deg) rotateX(5deg) scale(1.05)";
    e.currentTarget.style.boxShadow = "0 20px 40px rgba(0, 0, 0, 0.2)";
    e.currentTarget.style.zIndex = 10;
  };

  const handleMouseLeave = (e) => {
    e.currentTarget.style.transform = "translateY(0) rotateY(0) rotateX(0) scale(1)";
    e.currentTarget.style.boxShadow = "0 15px 35px rgba(0, 0, 0, 0.1)";
    e.currentTarget.style.zIndex = 1;
  };

  const handleTeamMouseEnter = (e) => {
    const overlay = e.currentTarget.querySelector('[data-overlay]');
    const icons = e.currentTarget.querySelectorAll('[data-icon]');
    const image = e.currentTarget.querySelector('[data-image]');
    
    e.currentTarget.style.transform = "scale(1.05) rotateY(0)";
    
    if (overlay) overlay.style.opacity = 1;
    if (image) image.style.transform = "scale(1.2)";
    
    icons.forEach((icon, i) => {
      icon.style.opacity = 1;
      icon.style.transform = "translateY(0) rotateY(0)";
      icon.style.transitionDelay = `${i * 0.1}s`;
    });
  };

  const handleTeamMouseLeave = (e) => {
    const overlay = e.currentTarget.querySelector('[data-overlay]');
    const icons = e.currentTarget.querySelectorAll('[data-icon]');
    const image = e.currentTarget.querySelector('[data-image]');
    
    e.currentTarget.style.transform = "scale(1) rotateY(0)";
    
    if (overlay) overlay.style.opacity = 0;
    if (image) image.style.transform = "scale(1)";
    
    icons.forEach(icon => {
      icon.style.opacity = 0;
      icon.style.transform = "translateY(20px) rotateY(180deg)";
    });
  };

  const handleCtaMouseEnter = (e) => {
    e.currentTarget.style.transform = "translateY(-8px) translateZ(60px) scale(1.1)";
    e.currentTarget.style.boxShadow = "0 20px 40px rgba(0, 0, 0, 0.3)";
    e.currentTarget.style.animation = "glow 1.5s infinite";
  };

  const handleCtaMouseLeave = (e) => {
    e.currentTarget.style.transform = "translateY(0) translateZ(50px) scale(1)";
    e.currentTarget.style.boxShadow = "0 15px 35px rgba(0, 0, 0, 0.2)";
    e.currentTarget.style.animation = "none";
  };

  return (
    <div style={styles.container} ref={containerRef}>
      <canvas ref={canvasRef} style={styles.canvas}></canvas>
      <style>{styles.keyframes}</style>
      
      {/* Hero Section */}
      <section style={styles.hero}>
        <div>
          <h1 style={styles.heroTitle}>About Vunathi Technologies</h1>
          <p style={styles.heroSubtitle}>
            Pioneering the future of trading technology since 2010. We empower financial institutions 
            with cutting-edge software that drives performance, maximizes efficiency, and transforms 
            how trading operates in global markets.
          </p>
        </div>
        <div style={styles.heroVisual}>
          <div style={styles.dataVisualization}>
            <div style={{...styles.chartBar, height: '60%', animationDelay: '0.1s'}}></div>
            <div style={{...styles.chartBar, height: '80%', animationDelay: '0.2s'}}></div>
            <div style={{...styles.chartBar, height: '40%', animationDelay: '0.3s'}}></div>
            <div style={{...styles.chartBar, height: '70%', animationDelay: '0.4s'}}></div>
            <div style={{...styles.chartBar, height: '90%', animationDelay: '0.5s'}}></div>
            <div style={{...styles.chartBar, height: '50%', animationDelay: '0.6s'}}></div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section style={styles.statsSection}>
        <div style={styles.statsGrid}>
          {stats.map((stat, index) => (
            <div 
              key={index} 
              style={getStatItemStyle(index)}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <h3 style={styles.statValue}>{stat.value}{stat.suffix}</h3>
              <p style={styles.statLabel}>{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tabs Section */}
      <section style={styles.tabsSection}>
        <div style={styles.tabsHeader}>
          <button 
            style={{
              ...styles.tabBtn,
              ...(activeTab === 'overview' ? styles.activeTab : {})
            }}
            onClick={() => setActiveTab('overview')}
          >
            Overview
            {activeTab === 'overview' && <span style={styles.activeTabAfter}></span>}
          </button>
          <button 
            style={{
              ...styles.tabBtn,
              ...(activeTab === 'mission' ? styles.activeTab : {})
            }}
            onClick={() => setActiveTab('mission')}
          >
            Mission
            {activeTab === 'mission' && <span style={styles.activeTabAfter}></span>}
          </button>
          <button 
            style={{
              ...styles.tabBtn,
              ...(activeTab === 'approach' ? styles.activeTab : {})
            }}
            onClick={() => setActiveTab('approach')}
          >
            Approach
            {activeTab === 'approach' && <span style={styles.activeTabAfter}></span>}
          </button>
        </div>

        <div style={styles.tabContent}>
          {activeTab === 'overview' && (
            <div style={styles.tabPanel}>
              <h2 style={styles.tabTitle}>Company Overview</h2>
              <p style={styles.tabText}>
                Vunathi Technologies is a premier provider of trading software solutions, 
                serving financial institutions worldwide. Founded in 2010 by a team of Wall Street 
                veterans and Silicon Valley technologists, we've consistently delivered innovative 
                products that empower traders, analysts, and fund managers to outperform the market.
              </p>
              <p style={styles.tabText}>
                Our flagship products include real-time analytics platforms, algorithmic trading 
                systems, and risk management solutions that are trusted by leading financial firms 
                across 35 countries. We process over $50 billion in transactions daily through our 
                platforms, providing unparalleled reliability and performance.
              </p>
            </div>
          )}

          {activeTab === 'mission' && (
            <div style={styles.tabPanel}>
              <h2 style={styles.tabTitle}>Our Mission</h2>
              <p style={styles.tabText}>
                To revolutionize the trading technology landscape by creating software that is 
                both powerful and intuitive, enabling our clients to make better decisions faster 
                and capitalize on market opportunities before competitors.
              </p>
              <p style={styles.tabText}>
                We believe that technology should empower financial professionals, not complicate 
                their workflows. Our solutions are designed to streamline operations, reduce risk, 
                and maximize returns through cutting-edge AI, machine learning, and predictive analytics 
                that transform raw market data into actionable intelligence.
              </p>
            </div>
          )}

          {activeTab === 'approach' && (
            <div style={styles.tabPanel}>
              <h2 style={styles.tabTitle}>Our Approach</h2>
              <p style={styles.tabText}>
                We combine deep financial expertise with cutting-edge technology to deliver 
                solutions that address real-world trading challenges. Our agile development 
                process ensures we can quickly adapt to changing market conditions and regulatory 
                requirements, delivering updates and new features in weeks, not months.
              </p>
              <p style={styles.tabText}>
                Client collaboration is at the heart of our process. We work closely with 
                traders and analysts to understand their needs and incorporate their feedback 
                into every product we build. Our dedicated client success team ensures smooth 
                implementation and provides ongoing support and training.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Values Section */}
      <section style={styles.valuesSection}>
        <h2 style={styles.sectionTitle}>Our Core Values</h2>
        <div style={styles.valuesGrid}>
          {values.map((value, index) => (
            <div 
              key={index} 
              style={getValueCardStyle(index)}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <div style={styles.valueIcon}>
                <i className={value.icon}></i>
              </div>
              <h3 style={styles.valueCardTitle}>{value.title}</h3>
              <p>{value.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Services Section */}
      <section style={styles.servicesSection}>
        <h2 style={styles.sectionTitle}>Our Services</h2>
        <div style={styles.servicesGrid}>
          {services.map((service, index) => (
            <div 
              key={index} 
              style={getServiceCardStyle(index)}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <div style={styles.serviceIcon}>
                <i className={service.icon}></i>
              </div>
              <h3 style={styles.serviceCardTitle}>{service.title}</h3>
              <p>{service.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section style={styles.teamSection}>
        <h2 style={styles.sectionTitle}>Leadership Team</h2>
        <div style={styles.teamGrid}>
          {team.map((member, index) => (
            <div 
              key={index} 
              style={getTeamMemberStyle(index)}
              onMouseEnter={handleTeamMouseEnter}
              onMouseLeave={handleTeamMouseLeave}
            >
              <div style={styles.memberImage}>
                <img src={member.image} alt={member.name} style={styles.memberImg} data-image />
                <div style={styles.imageOverlay} data-overlay>
                  <div style={styles.socialIcons}>
                    <a href="#" style={styles.socialIcon} data-icon><i className="fab fa-linkedin"></i></a>
                    <a href="#" style={styles.socialIcon} data-icon><i className="fab fa-twitter"></i></a>
                    <a href="#" style={styles.socialIcon} data-icon><i className="fas fa-envelope"></i></a>
                  </div>
                </div>
              </div>
              <h3 style={styles.teamMemberName}>{member.name}</h3>
              <p style={styles.teamMemberRole}>{member.role}</p>
              <p style={styles.teamMemberBio}>{member.bio}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section style={styles.testimonialsSection}>
        <h2 style={styles.sectionTitle}>Client Testimonials</h2>
        <div style={styles.testimonialsGrid}>
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              style={getTestimonialCardStyle(index)}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <div style={styles.quoteIcon}>
                <i className="fas fa-quote-right"></i>
              </div>
              <p style={styles.testimonialText}>"{testimonial.text}"</p>
              <div style={styles.testimonialAuthor}>
                <img src={testimonial.avatar} alt={testimonial.name} style={styles.testimonialAvatar} />
                <div style={styles.testimonialInfo}>
                  <span style={styles.testimonialName}>{testimonial.name}</span>
                  <span style={styles.testimonialRole}>{testimonial.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section style={styles.ctaSection}>
        <div style={styles.ctaPattern}></div>
        <h2 style={styles.ctaTitle}>Ready to Transform Your Trading Operations?</h2>
        <p style={styles.ctaText}>
          Join hundreds of financial institutions that trust Vunathi Technologies with their 
          trading infrastructure. Schedule a personalized demo to see how our solutions can 
          drive efficiency, reduce risk, and increase returns for your organization.
        </p>
        <button 
          style={styles.ctaButton}
          onMouseEnter={handleCtaMouseEnter}
          onMouseLeave={handleCtaMouseLeave}
        >
          Schedule a Demo
        </button>
      </section>
    </div>
  );
};

export default AboutUs;