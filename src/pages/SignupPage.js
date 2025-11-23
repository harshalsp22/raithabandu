import React, { useState } from 'react';
import styles from './LoginPage.module.css'; // Reusing the same CSS file for modal styling

const SignupPage = ({ isOpen, onClose, onSignup }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevents the page from reloading
    if (name.trim() && phone.trim() && password.trim()) {
      // Pass the user data up to the parent component (App.js) to handle the API call
      onSignup({ name, phone, password });
      // Optionally clear the form after submission
      // setName(''); 
      // setPhone('');
      // setPassword('');
    } else {
      alert('Please fill out all fields.');
    }
  };

  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter your phone number"
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <input
              type="password" // Use type="password" to mask the input
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              required
            />
          </div>
          <button type="submit" className={styles.loginButton}>Sign Up</button>
        </form>
        <button className={styles.closeButton} onClick={onClose}>×</button>
      </div>
    </div>
  );
};

export default SignupPage;