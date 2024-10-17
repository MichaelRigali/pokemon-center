import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Listings from './components/Listings';
import AddListing from './components/AddListing';
import OrderHistory from './components/OrderHistory';
import Login from './components/Login';
import Register from './components/Register';
import PrivateRoute from './components/PrivateRoute';
import Profile from './components/Profile'; // Import the Profile component
import Dashboard from './components/Dashboard'; // Import the Dashboard component

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');

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
        <Route path="/listings" element={<Listings />} />
        <Route path="/add-listing" element={<PrivateRoute element={<AddListing />} token={token} />} />
        <Route path="/orders" element={<PrivateRoute element={<OrderHistory />} token={token} />} />
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route path="/profile" element={<PrivateRoute element={<Profile />} token={token} />} />
        <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} token={token} />} />
      </Routes>
    </Router>
  );
}

export default App;
