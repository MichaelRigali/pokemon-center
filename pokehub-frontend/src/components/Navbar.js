import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ token, setToken }) => {
  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove the token
    setToken(''); // Clear the token from state
  };

  return (
    <nav className='navbar'>
      <h2>Pages</h2>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/listings">Listings</Link></li>
        {token && (
          <>
            <li><Link to="/add-listing">Add Listing</Link></li>
            <li><Link to="/my-listings">My Listings</Link></li>
            <li><Link to="/orders">My Orders</Link></li>
            <li><Link to="/wishlist">Wishlist</Link></li>
            <li><Link to="/profile">Profile</Link></li>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><button onClick={handleLogout}>Logout</button></li>
          </>
        )}
        {!token && (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
