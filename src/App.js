import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';

// --- IMPORTS ---
import Header from './components/Header';
import SideDrawer from './components/SideDrawer';

// Pages
import HomePage from './pages/HomePage';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage'; // <--- FIXED: Imported LoginPage
import EducationPage from './pages/EducationPage';
import GovernmentPage from './pages/GovernmentPage';
import MLPage from './pages/MLPage';
import TransportPage from './pages/TransportPage';
import SettingsPage from './pages/SettingsPage';
import EditProfilePage from './pages/EditProfilePage';
import MarketPrice from "./pages/MarketPrice";
import Weather from "./pages/Weather";
import News from "./pages/News";
import Rewards from "./pages/Rewards";

import './App.css';

function App() {
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  
  // --- Auth State ---
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);

  const toggleDrawer = () => setDrawerOpen(!isDrawerOpen);

  const handleAuthClick = () => {
    if (currentUser) {
      // If logged in, log out
      setCurrentUser(null); 
    } else {
      // If logged out, open login modal
      setIsLoginModalOpen(true);
    }
  };

  // --- FIXED: DEFINED HANDLE LOGIN ---
  const handleLogin = async (credentials) => {
    try {
      // 1. Send credentials to your Backend (Node/Express connected to MongoDB)
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (response.ok) {
        // 2. Success: Update React State
        setCurrentUser(data.user); 
        setIsLoginModalOpen(false);
        alert('Login Successful!');
      } else {
        alert(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login Error:', error);
      alert('Could not connect to server.');
    }
  };

  const handleSignup = async (userData) => {
    try {
        // Connects to your backend endpoint
        const response = await fetch('http://localhost:5000/api/signup', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        alert('Signup successful! Please login.');
        setIsSignupModalOpen(false);
        setIsLoginModalOpen(true); // Switch to login after signup
      } else {
        const errorData = await response.json();
        alert(`Signup failed: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Network error:', error);
      alert('An unexpected error occurred.');
    }
  };

  const handleProfileUpdate = (updatedData) => {
    setCurrentUser({ ...currentUser, ...updatedData });
  };

  // Helper to switch between modals
  const switchToSignup = () => {
      setIsLoginModalOpen(false);
      setIsSignupModalOpen(true);
  };

  return (
    <ThemeProvider>
      <Router>
        <div className="app">
          <Header
            onMenuClick={toggleDrawer}
            currentUser={currentUser}
            onAuthClick={handleAuthClick}
          />
          <SideDrawer isOpen={isDrawerOpen} onClose={toggleDrawer} />

          {/* --- MODALS --- */}
          <LoginPage
            isOpen={isLoginModalOpen}
            onClose={() => setIsLoginModalOpen(false)}
            onLogin={handleLogin}
            onSwitchToSignup={switchToSignup}
          />

          <SignupPage 
             isOpen={isSignupModalOpen}
             onClose={() => setIsSignupModalOpen(false)}
             onSignup={handleSignup}
          />

          <nav style={{ background: "#eee", padding: "10px" }}>
            <Link to="/" style={{ margin: "0 10px" }}>Home</Link>
            <Link to="/MarketPrice" style={{ margin: "0 10px" }}>Market</Link>
            <Link to="/weather" style={{ margin: "0 10px" }}>Weather</Link>
            <Link to="/news" style={{ margin: "0 10px" }}>News</Link>
            <Link to="/rewards" style={{ margin: "0 10px" }}>Rewards</Link>
          </nav>

          <main className="main-content">
            <Routes>
              <Route path="/" element={<HomePage currentUser={currentUser} />} />
              <Route path="/education" element={<EducationPage />} />
              <Route path="/government" element={<GovernmentPage />} />
              <Route path="/ml" element={<MLPage />} />
              <Route 
                        path="/transport" 
                        element={<TransportPage currentUser={currentUser} />} 
                    />
              <Route path="/MarketPrice" element={<MarketPrice currentUser={currentUser} />} />
              <Route path="/weather" element={<Weather />} />
              <Route path="/news" element={<News />} />
              <Route path="/rewards" element={<Rewards />} />
              <Route
                path="/settings"
                element={<SettingsPage currentUser={currentUser} />}
              />
              <Route
                path="/edit-profile"
                element={
                  <EditProfilePage
                    currentUser={currentUser}
                    onProfileUpdate={handleProfileUpdate}
                  />
                }
              />
            </Routes>
          </main>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;