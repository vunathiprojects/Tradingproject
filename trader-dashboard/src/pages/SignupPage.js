import React, { useState } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { ref, set } from "firebase/database";
import { motion } from "framer-motion";
import { FiUser, FiPhone, FiMail, FiLock, FiKey, FiHash, FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function SignupPage({ onSignupSuccess }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    phone: "",
    email: "",
    password: "",
    apiKey: "",
    apiSecret: "",
    accessToken: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        formData.email, 
        formData.password
      );
      
      const user = userCredential.user;
      await updateProfile(user, { displayName: formData.username });

      await set(ref(db, `users/${user.uid}`), {
        name: formData.username,
        phone: formData.phone,
        email: formData.email,
        apiKey: formData.apiKey,
        apiSecret: formData.apiSecret,
        accessToken: formData.accessToken,
      });

      setLoading(false);
      if (onSignupSuccess) onSignupSuccess();
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };

  return (
    <div className="signup-bg">
      <motion.div
        className="signup-glass"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="header-container">
          <button 
            onClick={() => navigate('/login')} 
            className="back-button"
            aria-label="Back to login"
          >
            <FiArrowLeft />
          </button>
          <div className="title-wrapper">
            <h2 className="signup-title">Create Your Account</h2>
            <p className="signup-desc">Sign up to access your trading dashboard</p>
          </div>
        </div>

        <form onSubmit={handleSignup} className="signup-form">
          {[
            { name: "username", placeholder: "Username", icon: <FiUser /> },
            { name: "phone", placeholder: "Phone Number", icon: <FiPhone /> },
            { name: "email", placeholder: "Email Address", icon: <FiMail /> },
            { name: "password", placeholder: "Password", icon: <FiLock />, type: "password" },
            { name: "apiKey", placeholder: "Zerodha API Key", icon: <FiKey /> },
            { name: "apiSecret", placeholder: "Zerodha API Secret", icon: <FiKey /> },
            { name: "accessToken", placeholder: "Zerodha Access Token", icon: <FiHash /> }
          ].map((field, index) => (
            <div className="input-group" key={field.name}>
              <span className="input-icon">{field.icon}</span>
              <input
                type={field.type || "text"}
                name={field.name}
                placeholder={field.placeholder}
                value={formData[field.name]}
                onChange={handleChange}
                required
              />
            </div>
          ))}

          {error && <div className="form-error">{error}</div>}
          
          <button type="submit" disabled={loading} className="signup-btn">
            {loading ? (
              <span className="loading-text">Creating Account...</span>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>
      </motion.div>

      <style jsx>{`
        .signup-bg {
          min-height: 100vh;
          background: linear-gradient(130deg, #040d1dff 0%, #0f1537 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Inter', sans-serif;
          padding: 20px;
          box-sizing: border-box;
          overflow: hidden;
        }
        
        .signup-glass {
          background: rgba(16,28,59,0.83);
          border-radius: clamp(1rem, 3vw, 2rem);
          box-shadow: 0 8px 40px 8px #27418050;
          padding: clamp(1.5rem, 4vw, 2rem) clamp(1.5rem, 4vw, 2rem);
          width: 100%;
          max-width: 450px;
          display: flex;
          flex-direction: column;
          backdrop-filter: blur(17px);
          position: relative;
        }
        
        .header-container {
          position: relative;
          margin-bottom: 1.5rem;
        }
        
        .back-button {
          position: absolute;
          left: 0;
          top: 0;
          background: transparent;
          border: none;
          color: #70c6ff;
          font-size: 1.4rem;
          cursor: pointer;
          padding: 0.5rem;
          transition: transform 0.2s;
          z-index: 1;
        }
        
        .back-button:hover {
          transform: translateX(-3px);
        }
        
        .title-wrapper {
          text-align: center;
          padding: 0 2rem;
        }
        
        .signup-title {
          font-size: clamp(1.5rem, 5vw, 2rem);
          font-weight: 800;
          color: #70c6ff;
          margin-bottom: 8px;
          letter-spacing: 0.5px;
        }
        
        .signup-desc {
          color: #c0ddff;
          font-size: clamp(0.8rem, 3vw, 0.95rem);
          margin-bottom: 0;
          font-weight: 400;
          line-height: 1.4;
        }
        
        .signup-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          max-height: 60vh;
          overflow-y: auto;
          padding-right: 0.5rem;
          scrollbar-width: thin;
          scrollbar-color: #70c6ff rgba(16,28,59,0.5);
        }
        
        /* Custom scrollbar for Webkit browsers */
        .signup-form::-webkit-scrollbar {
          width: 6px;
        }
        
        .signup-form::-webkit-scrollbar-track {
          background: rgba(16,28,59,0.5);
          border-radius: 10px;
        }
        
        .signup-form::-webkit-scrollbar-thumb {
          background-color: #70c6ff;
          border-radius: 10px;
        }
        
        .input-group {
          position: relative;
          width: 100%;
          margin-bottom: 0.5rem;
        }
        
        .input-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #70c6ff;
          font-size: 1.15rem;
          opacity: 0.7;
        }
        
        input {
          width: 100%;
          padding: 0.9rem 1rem 0.9rem 2.8rem;
          border-radius: 0.8rem;
          border: none;
          background: rgba(130,230,255,0.10);
          color: #dbefff;
          font-size: 0.95rem;
          outline: none;
          transition: all 0.2s;
          box-sizing: border-box;
        }
        
        input:focus {
          background: rgba(130, 230, 255, 0.22);
          box-shadow: 0 0 0 2px #70c6ff;
        }
        
        input::placeholder {
          color: #aee6ff;
          letter-spacing: 0.2px;
          font-size: 0.9rem;
        }
        
        .signup-btn {
          padding: 1rem;
          background: linear-gradient(90deg, #70c6ff 0%, #1aa3ff 100%);
          color: white;
          font-weight: 700;
          border: none;
          font-size: 1rem;
          border-radius: 0.8rem;
          box-shadow: 0 4px 19px #70c6ff44;
          cursor: pointer;
          margin-top: 1rem;
          transition: all 0.2s;
        }
        
        .signup-btn:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }
        
        .signup-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 36px #70c6ff77;
        }
        
        .form-error {
          background: rgba(255,80,80,0.15);
          color: #ff5277;
          border-radius: 0.6rem;
          padding: 0.8rem;
          font-size: 0.9rem;
          text-align: center;
          margin: 0.5rem 0;
          border: 1px solid rgba(255, 82, 119, 0.2);
        }
        
        .loading-text {
          display: inline-block;
        }
        
        @media (max-width: 600px) {
          .signup-glass {
            padding: 1.5rem 1.2rem;
          }
          
          .title-wrapper {
            padding: 0 1.5rem;
          }
          
          input {
            padding: 0.8rem 0.9rem 0.8rem 2.5rem;
            font-size: 0.9rem;
          }
          
          .input-icon {
            font-size: 1rem;
            left: 12px;
          }
          
          .signup-btn {
            padding: 0.9rem;
          }
        }
        
        @media (max-width: 400px) {
          .signup-glass {
            padding: 1.3rem 1rem;
          }
          
          .title-wrapper {
            padding: 0 1rem;
          }
          
          input {
            padding: 0.7rem 0.8rem 0.7rem 2.3rem;
          }
        }
      `}</style>
    </div>
  );
}