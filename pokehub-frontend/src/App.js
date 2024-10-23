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
import MyWishlist from './components/MyWishlist'; // Wishlist component
import MyListings from './components/MyListings'; // My Listings page component
import Forum from './components/Forum'; // New Forum component
import MyCollection from './components/MyCollection'; // New My Collection component
import { AnimatePresence, motion } from 'framer-motion'; // Import motion components
import './retro-style.css';

function App() {
  const [token, setToken] = useState('');
  const location = useLocation(); // Get the current location for route transitions

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  // Define a reusable transition
  const pageTransition = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.35 }, // Set the transition duration to 0.35 seconds
  };

  return (
    <div>
      <Navbar token={token} setToken={setToken} />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Home Route */}
          <Route
            path="/"
            element={
              <motion.div {...pageTransition}>
                <Home />
              </motion.div>
            }
          />
          {/* Listings Route */}
          <Route
            path="/listings"
            element={
              <motion.div {...pageTransition}>
                <Listings token={token} />
              </motion.div>
            }
          />
          {/* Forum Route */}
          <Route
            path="/forum"
            element={
              <motion.div {...pageTransition}>
                <Forum />
              </motion.div>
            }
          />
          {/* My Collection Route */}
          <Route
            path="/my-collection"
            element={
              <motion.div {...pageTransition}>
                <PrivateRoute element={<MyCollection token={token} />} token={token} />
              </motion.div>
            }
          />
          {/* Login Route */}
          <Route
            path="/login"
            element={
              <motion.div {...pageTransition}>
                <Login setToken={setToken} />
              </motion.div>
            }
          />
          {/* Register Route */}
          <Route
            path="/register"
            element={
              <motion.div {...pageTransition}>
                <Register />
              </motion.div>
            }
          />
          {/* Add Listing Route */}
          <Route
            path="/add-listing"
            element={
              <motion.div {...pageTransition}>
                <PrivateRoute element={<AddListing />} token={token} />
              </motion.div>
            }
          />
          {/* Orders Route */}
          <Route
            path="/orders"
            element={
              <motion.div {...pageTransition}>
                <PrivateRoute element={<OrderHistory />} token={token} />
              </motion.div>
            }
          />
          {/* Profile Route */}
          <Route
            path="/profile"
            element={
              <motion.div {...pageTransition}>
                <PrivateRoute element={<Profile />} token={token} />
              </motion.div>
            }
          />
          {/* My Listings Route */}
          <Route
            path="/my-listings"
            element={
              <motion.div {...pageTransition}>
                <PrivateRoute element={<MyListings />} token={token} />
              </motion.div>
            }
          />
          {/* Wishlist Route */}
          <Route
            path="/wishlist"
            element={
              <motion.div {...pageTransition}>
                <PrivateRoute element={<MyWishlist />} token={token} />
              </motion.div>
            }
          />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default App;
