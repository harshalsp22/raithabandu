// src/pages/LoginPage.js
import React, { useState } from 'react';
import styles from './LoginPage.module.css'; // Assuming you use the same CSS module

const LoginPage = ({ isOpen, onClose, onLogin, onSwitchToSignup }) => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    // Pass credentials up to App.js
    onLogin({ phone, password });
  };

  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label htmlFor="login-phone">Phone Number</label>
            <input
              type="tel"
              id="login-phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter your phone number"
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="login-password">Password</label>
            <input
              type="password"
              id="login-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          <button type="submit" className={styles.loginButton}>Login</button>
        </form>
        
        <p style={{marginTop: '15px', fontSize: '0.9rem'}}>
            Don't have an account?{' '}
            <span 
                style={{color: 'blue', cursor: 'pointer', textDecoration: 'underline'}} 
                onClick={onSwitchToSignup}
            >
                Sign Up here
            </span>
        </p>

        <button className={styles.closeButton} onClick={onClose}>×</button>
      </div>
    </div>
  );
};

export default LoginPage;