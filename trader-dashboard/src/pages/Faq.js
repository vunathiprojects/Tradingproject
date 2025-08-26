// import React, { useState } from 'react';

// const Faq = () => {
//   const [activeIndex, setActiveIndex] = useState(null);

//   const toggleFaq = (index) => {
//     setActiveIndex(activeIndex === index ? null : index);
//   };

//   const faqData = [
//     {
//       question: "What services does Vunathi Capital Technologies provide?",
//       answer: "Vunathi Capital Technologies offers comprehensive financial technology solutions including investment analytics, portfolio management systems, algorithmic trading platforms, and customized fintech software development for capital markets."
//     },
//     {
//       question: "How can I contact your support team?",
//       answer: "You can reach our support team via email at support@vunathicapital.com, through our website contact form, or by calling our helpline at +1-800-VUNATHI from 9 AM to 6 PM EST, Monday through Friday."
//     },
//     {
//       question: "Do you offer custom software development?",
//       answer: "Yes, we specialize in custom fintech solutions tailored to your specific business needs. Our team works closely with clients to develop bespoke trading algorithms, risk management systems, and financial analytics platforms."
//     },
//     {
//       question: "What industries do you primarily serve?",
//       answer: "We primarily serve investment firms, hedge funds, brokerage houses, banks, and financial institutions looking to enhance their technological capabilities in capital markets and investment management."
//     },
//     {
//       question: "How secure are your technology solutions?",
//       answer: "Security is our top priority. All our solutions implement bank-grade encryption, multi-factor authentication, regular security audits, and comply with financial industry regulations including SOC 2, GDPR, and ISO 27001 standards."
//     },
//     {
//       question: "Do you provide API integration services?",
//       answer: "Yes, we offer comprehensive API integration services with major financial data providers, trading platforms, and banking systems to create seamless workflows and data synchronization for our clients."
//     }
//   ];

//   return (
//     <div style={styles.container}>
//       <div style={styles.header}>
//         <h2 style={styles.title}>Frequently Asked Questions</h2>
//         <p style={styles.subtitle}>Find answers to common questions about Vunathi Capital Technologies</p>
//       </div>
      
//       <div style={styles.faqContainer}>
//         {faqData.map((faq, index) => (
//           <div 
//             key={index} 
//             style={{
//               ...styles.faqItem,
//               transform: activeIndex === index ? 'translateZ(20px)' : 'translateZ(0)',
//               boxShadow: activeIndex === index ? '0 15px 30px rgba(0, 0, 0, 0.15)' : '0 5px 15px rgba(0, 0, 0, 0.05)'
//             }}
//             className="faq-item"
//           >
//             <div 
//               style={styles.question} 
//               onClick={() => toggleFaq(index)}
//             >
//               <span>{faq.question}</span>
//               <span style={styles.icon}>
//                 {activeIndex === index ? 
//                   <i className="fas fa-minus"></i> : 
//                   <i className="fas fa-plus"></i>
//                 }
//               </span>
//             </div>
//             <div 
//               style={{
//                 ...styles.answer,
//                 maxHeight: activeIndex === index ? '500px' : '0',
//                 opacity: activeIndex === index ? '1' : '0',
//                 padding: activeIndex === index ? '20px' : '0 20px'
//               }}
//             >
//               {faq.answer}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// const styles = {
//   container: {
//     fontFamily: "'Poppins', sans-serif",
//     maxWidth: '800px',
//     margin: '0 auto',
//     padding: '40px 20px',
//     background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
//     minHeight: '100vh'
//   },
//   header: {
//     textAlign: 'center',
//     marginBottom: '40px'
//   },
//   title: {
//     fontSize: '2.5rem',
//     fontWeight: '700',
//     background: 'linear-gradient(45deg, #2c3e50, #3498db)',
//     WebkitBackgroundClip: 'text',
//     WebkitTextFillColor: 'transparent',
//     marginBottom: '10px',
//     textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
//   },
//   subtitle: {
//     fontSize: '1.1rem',
//     color: '#555',
//     maxWidth: '600px',
//     margin: '0 auto'
//   },
//   faqContainer: {
//     perspective: '1000px'
//   },
//   faqItem: {
//     background: 'white',
//     borderRadius: '12px',
//     marginBottom: '20px',
//     overflow: 'hidden',
//     transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
//     transformStyle: 'preserve-3d',
//     border: '1px solid rgba(255, 255, 255, 0.5)',
//     backdropFilter: 'blur(10px)'
//   },
//   question: {
//     padding: '20px',
//     fontSize: '1.2rem',
//     fontWeight: '600',
//     cursor: 'pointer',
//     display: 'flex',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     background: 'linear-gradient(90deg, rgba(52, 152, 219, 0.1) 0%, rgba(255, 255, 255, 0.1) 100%)',
//     color: '#2c3e50',
//     transition: 'all 0.3s ease'
//   },
//   icon: {
//     fontSize: '1rem',
//     color: '#3498db',
//     transition: 'transform 0.3s ease'
//   },
//   answer: {
//     fontSize: '1rem',
//     lineHeight: '1.6',
//     color: '#555',
//     overflow: 'hidden',
//     transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
//     background: 'rgba(245, 247, 250, 0.5)'
//   }
// };

// // Media queries for responsiveness
// const mediaQueries = `
//   @media (max-width: 768px) {
//     .faq-item {
//       margin-bottom: 15px;
//     }
    
//     .faq-item > div:first-child {
//       padding: 15px;
//       font-size: 1.1rem;
//     }
    
//     .faq-item > div:last-child {
//       padding: 15px !important;
//     }
//   }
  
//   @media (max-width: 480px) {
//     .faq-item > div:first-child {
//       padding: 12px;
//       font-size: 1rem;
//     }
    
//     .faq-item > div:last-child {
//       padding: 12px !important;
//       font-size: 0.9rem;
//     }
//   }
// `;

// // Add styles to the document
// const styleSheet = document.createElement("style");
// styleSheet.innerText = mediaQueries;
// document.head.appendChild(styleSheet);

// export default Faq;






















// add more eefftaces


import React, { useState } from 'react';

const Faq = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFaq = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqData = [
    {
      question: "What services does Vunathi Capital Technologies provide?",
      answer: "Vunathi Capital Technologies offers comprehensive financial technology solutions including investment analytics, portfolio management systems, algorithmic trading platforms, and customized fintech software development for capital markets."
    },
    {
      question: "How can I contact your support team?",
      answer: "You can reach our support team via email at support@vunathicapital.com, through our website contact form, or by calling our helpline at +1-800-VUNATHI from 9 AM to 6 PM EST, Monday through Friday."
    },
    {
      question: "Do you offer custom software development?",
      answer: "Yes, we specialize in custom fintech solutions tailored to your specific business needs. Our team works closely with clients to develop bespoke trading algorithms, risk management systems, and financial analytics platforms."
    },
    {
      question: "What industries do you primarily serve?",
      answer: "We primarily serve investment firms, hedge funds, brokerage houses, banks, and financial institutions looking to enhance their technological capabilities in capital markets and investment management."
    },
    {
      question: "How secure are your technology solutions?",
      answer: "Security is our top priority. All our solutions implement bank-grade encryption, multi-factor authentication, regular security audits, and comply with financial industry regulations including SOC 2, GDPR, and ISO 27001 standards."
    },
    {
      question: "Do you provide API integration services?",
      answer: "Yes, we offer comprehensive API integration services with major financial data providers, trading platforms, and banking systems to create seamless workflows and data synchronization for our clients."
    },
    {
      question: "What is your typical project timeline?",
      answer: "Project timelines vary based on complexity, but most implementations range from 3-9 months. We follow an agile methodology with regular milestones and deliverables to ensure projects stay on track."
    },
    {
      question: "Do you offer training for your solutions?",
      answer: "Yes, we provide comprehensive training programs for all our solutions, including administrator training, end-user workshops, and detailed documentation to ensure smooth adoption of our technologies."
    }
  ];

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Frequently Asked Questions</h2>
        <p style={styles.subtitle}>Find answers to common questions about Vunathi Capital Technologies</p>
      </div>
      
      <div style={styles.faqContainer}>
        {faqData.map((faq, index) => (
          <div 
            key={index} 
            style={{
              ...styles.faqItem,
              transform: activeIndex === index ? 'translateZ(20px) rotateX(5deg)' : 'translateZ(0)',
              boxShadow: activeIndex === index ? 
                '0 25px 50px rgba(52, 152, 219, 0.25), 0 5px 10px rgba(0, 0, 0, 0.1)' : 
                '0 10px 20px rgba(0, 0, 0, 0.05), 0 2px 5px rgba(0, 0, 0, 0.03)'
            }}
            className="faq-item"
            onMouseEnter={(e) => {
              if (activeIndex !== index) {
                e.currentTarget.style.transform = 'translateZ(10px) rotateX(2deg)';
                e.currentTarget.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.1)';
              }
            }}
            onMouseLeave={(e) => {
              if (activeIndex !== index) {
                e.currentTarget.style.transform = 'translateZ(0)';
                e.currentTarget.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.05), 0 2px 5px rgba(0, 0, 0, 0.03)';
              }
            }}
          >
            <div 
              style={{
                ...styles.question,
                background: activeIndex === index ? 
                  'linear-gradient(90deg, rgba(52, 152, 219, 0.15) 0%, rgba(41, 128, 185, 0.1) 100%)' : 
                  'linear-gradient(90deg, rgba(52, 152, 219, 0.1) 0%, rgba(255, 255, 255, 0.1) 100%)'
              }} 
              onClick={() => toggleFaq(index)}
            >
              <span>{faq.question}</span>
              <span style={{
                ...styles.icon,
                transform: activeIndex === index ? 'rotate(180deg)' : 'rotate(0)'
              }}>
                <i className="fas fa-chevron-down"></i>
              </span>
            </div>
            <div 
              style={{
                ...styles.answer,
                maxHeight: activeIndex === index ? '500px' : '0',
                opacity: activeIndex === index ? '1' : '0',
                padding: activeIndex === index ? '25px' : '0 25px',
                transform: activeIndex === index ? 'translateZ(10px)' : 'translateZ(0)'
              }}
            >
              {faq.answer}
            </div>
          </div>
        ))}
      </div>
      
      <div style={styles.contactSection}>
        <h3 style={styles.contactTitle}>Still have questions?</h3>
        <p style={styles.contactText}>Contact our team for more information</p>
        <button style={styles.contactButton}>Get in Touch</button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: "'Poppins', sans-serif",
    maxWidth: '900px',
    margin: '0 auto',
    padding: '60px 20px',
    background: 'linear-gradient(135deg, #f5f7fa 0%, #e4efe9 100%)',
    minHeight: '100vh',
    boxSizing: 'border-box'
  },
  header: {
    textAlign: 'center',
    marginBottom: '50px'
  },
  title: {
    fontSize: '2.8rem',
    fontWeight: '800',
    background: 'linear-gradient(45deg, #2c3e50, #3498db, #2c3e50)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '15px',
    textShadow: '2px 2px 8px rgba(0,0,0,0.1)',
    letterSpacing: '0.5px'
  },
  subtitle: {
    fontSize: '1.2rem',
    color: '#555',
    maxWidth: '600px',
    margin: '0 auto',
    lineHeight: '1.6'
  },
  faqContainer: {
    perspective: '1000px',
    marginBottom: '50px'
  },
  faqItem: {
    background: 'rgba(255, 255, 255, 0.9)',
    borderRadius: '16px',
    marginBottom: '25px',
    overflow: 'hidden',
    transition: 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    transformStyle: 'preserve-3d',
    border: '1px solid rgba(255, 255, 255, 0.7)',
    backdropFilter: 'blur(10px)',
    position: 'relative'
  },
  question: {
    padding: '25px',
    fontSize: '1.25rem',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: '#2c3e50',
    transition: 'all 0.3s ease',
    position: 'relative',
    zIndex: '2'
  },
  icon: {
    fontSize: '1.1rem',
    color: '#3498db',
    transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    background: 'rgba(255, 255, 255, 0.9)',
    borderRadius: '50%',
    width: '30px',
    height: '30px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  answer: {
    fontSize: '1.05rem',
    lineHeight: '1.7',
    color: '#444',
    overflow: 'hidden',
    transition: 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    background: 'rgba(245, 247, 250, 0.7)',
    borderTop: '1px solid rgba(52, 152, 219, 0.1)'
  },
  contactSection: {
    textAlign: 'center',
    padding: '40px',
    background: 'rgba(255, 255, 255, 0.8)',
    borderRadius: '16px',
    boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
    transform: 'translateZ(0)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    marginTop: '30px'
  },
  contactTitle: {
    fontSize: '1.8rem',
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: '15px'
  },
  contactText: {
    fontSize: '1.1rem',
    color: '#555',
    marginBottom: '25px'
  },
  contactButton: {
    padding: '15px 35px',
    fontSize: '1.1rem',
    fontWeight: '600',
    background: 'linear-gradient(45deg, #3498db, #2980b9)',
    color: 'white',
    border: 'none',
    borderRadius: '50px',
    cursor: 'pointer',
    boxShadow: '0 8px 20px rgba(52, 152, 219, 0.3)',
    transition: 'all 0.3s ease',
    transform: 'translateZ(0)'
  }
};

// Media queries for responsiveness
const mediaQueries = `
  @media (max-width: 768px) {
    .faq-item {
      margin-bottom: 20px;
    }
    
    .faq-item > div:first-child {
      padding: 20px;
      font-size: 1.15rem;
    }
    
    .faq-item > div:last-child {
      padding: 20px !important;
    }
  }
  
  @media (max-width: 480px) {
    .faq-item > div:first-child {
      padding: 18px;
      font-size: 1.05rem;
    }
    
    .faq-item > div:last-child {
      padding: 18px !important;
      font-size: 0.95rem;
    }
  }
`;

// Add styles to the document
const styleSheet = document.createElement("style");
styleSheet.innerText = mediaQueries;
document.head.appendChild(styleSheet);

export default Faq;