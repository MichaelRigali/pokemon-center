import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
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
import WishlistPage from './components/WishlistPage'; // Wishlist page component

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
      {/* Navbar with token and setToken props to handle logout */}
      <Navbar token={token} setToken={setToken} />
      <Routes>
        {/* Public routes */}
        <Route path='/' element={<Home />} />
        <Route path='/listings' element={<Listings token={token} />} />
        <Route path='/login' element={<Login setToken={setToken} />} />
        <Route path='/register' element={<Register />} />

        {/* Protected routes (PrivateRoute ensures authentication) */}
        <Route
          path='/add-listing'
          element={<PrivateRoute element={<AddListing />} token={token} />}
        />
        <Route
          path='/orders'
          element={<PrivateRoute element={<OrderHistory />} token={token} />}
        />
        <Route
          path='/dashboard'
          element={<PrivateRoute element={<Dashboard />} token={token} />}
        />
        <Route
          path='/profile'
          element={<PrivateRoute element={<Profile />} token={token} />}
        />
        <Route
          path='/wishlist'
          element={<PrivateRoute element={<WishlistPage />} token={token} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
