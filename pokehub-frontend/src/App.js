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
import MyWishlist from './components/MyWishlist'; // Wishlist component
import MyListings from './components/MyListings'; // My Listings page component
import Forum from './components/Forum'; // New Forum component
import MyCollection from './components/MyCollection'; // New My Collection component
import './retro-style.css';

function App() {
  const [token, setToken] = useState('');

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  return (
    <Router>
      <Navbar token={token} setToken={setToken} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/listings" element={<Listings token={token} />} />
        <Route path="/forum" element={<Forum />} /> {/* Forum route */}
        <Route path="/my-collection" element={<PrivateRoute element={<MyCollection token={token} />} token={token} />} /> {/* My Collection route */}
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/add-listing" element={<PrivateRoute element={<AddListing />} token={token} />} />
        <Route path="/orders" element={<PrivateRoute element={<OrderHistory />} token={token} />} />

        <Route path="/profile" element={<PrivateRoute element={<Profile />} token={token} />} />
        <Route path="/my-listings" element={<PrivateRoute element={<MyListings />} token={token} />} />
        <Route path="/wishlist" element={<PrivateRoute element={<MyWishlist />} token={token} />} />
      </Routes>
    </Router>
  );
}

export default App;
