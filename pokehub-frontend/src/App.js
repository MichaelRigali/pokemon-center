import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar'; // Navigation bar component
import Home from './components/Home'; // Home page component
import Listings from './components/Listings'; // Listings page component
import AddListing from './components/AddListing'; // Component for adding a new listing
import OrderHistory from './components/OrderHistory'; // Component to view order history
import Login from './components/Login'; // Login component for user authentication
import Register from './components/Register'; // Register component for new users
import PrivateRoute from './components/PrivateRoute'; // PrivateRoute for protected routes
import Profile from './components/Profile'; // Profile page for the logged-in user
import Dashboard from './components/Dashboard'; // Dashboard page for the logged-in user
import MyWishlist from './components/MyWishlist'; // My Wishlist page component
import MyListings from './components/MyListings'; // My Listings page component
import { AnimatePresence, motion } from 'framer-motion'; // Import Framer Motion for animations
import './retro-style.css';

function App() {
  const [token, setToken] = useState('');

  // Retrieve token from localStorage when the app loads
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  return (
    <Router>
      <div className="app-container">
        {/* Navbar stays static and outside the transitions */}
        <Navbar token={token} setToken={setToken} />
        
        {/* Main app content wrapped in a container */}
        <div className="app-content">
          <AnimatedRoutes token={token} setToken={setToken} />
        </div>
      </div>
    </Router>
  );
}

// AnimatedRoutes component to apply animations to the page content
const AnimatedRoutes = ({ token, setToken }) => {
  const location = useLocation(); // Get current location for animation key

  // Animation variants for page transitions
  const pageVariants = {
    initial: { opacity: 0, y: 50 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -50 },
  };

  const pageTransition = {
    duration: 0.5,
    ease: 'easeInOut',
  };

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public routes */}
        <Route
          path="/"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <Home />
            </motion.div>
          }
        />
        <Route
          path="/listings"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <Listings token={token} />
            </motion.div>
          }
        />
        <Route
          path="/login"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <Login setToken={setToken} />
            </motion.div>
          }
        />
        <Route
          path="/register"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <Register />
            </motion.div>
          }
        />

        {/* Protected routes */}
        <Route
          path="/add-listing"
          element={
            <PrivateRoute
              element={
                <motion.div
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <AddListing />
                </motion.div>
              }
              token={token}
            />
          }
        />
        <Route
          path="/orders"
          element={
            <PrivateRoute
              element={
                <motion.div
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <OrderHistory />
                </motion.div>
              }
              token={token}
            />
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute
              element={
                <motion.div
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <Dashboard />
                </motion.div>
              }
              token={token}
            />
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute
              element={
                <motion.div
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <Profile />
                </motion.div>
              }
              token={token}
            />
          }
        />
        <Route
          path="/my-listings"
          element={
            <PrivateRoute
              element={
                <motion.div
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <MyListings />
                </motion.div>
              }
              token={token}
            />
          }
        />
        <Route
          path="/wishlist"
          element={
            <PrivateRoute
              element={
                <motion.div
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <MyWishlist />
                </motion.div>
              }
              token={token}
            />
          }
        />
      </Routes>
    </AnimatePresence>
  );
};

export default App;
