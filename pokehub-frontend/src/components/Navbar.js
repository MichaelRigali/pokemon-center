import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // Import the CSS file for Navbar styling

const Navbar = ({ token, setToken }) => {
  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove the token
    setToken(''); // Clear the token from state
  };

  return (
    <nav className="navbar">
      <h2>Dashboard</h2>
      <ul>
        <li>
          <Link to="/" className="nav-button home">Home</Link>
        </li>
        <li>
          <Link to="/listings" className="nav-button listings">Listings</Link>
        </li>
        {token && (
          <>
            <li>
              <Link to="/add-listing" className="nav-button add-listing">Add Listing</Link>
            </li>
            <li>
              <Link to="/my-listings" className="nav-button my-listings">My Listings</Link>
            </li>
            <li>
              <Link to="/orders" className="nav-button orders">My Orders</Link>
            </li>
            <li>
              <Link to="/wishlist" className="nav-button wishlist">Wishlist</Link>
            </li>
            <li>
              <Link to="/my-collection" className="nav-button collection">My Collection</Link>
            </li>
            <li>
              <Link to="/forum" className="nav-button forum">Forum</Link>
            </li>
            <li>
              <Link to="/profile" className="nav-button profile">Profile</Link>
            </li>
            <li>
  <button onClick={handleLogout} className="nav-button profile2">Logout</button>
</li>
          </>
        )}
        {!token && (
          <>
            <li>
              <Link to="/login" className="nav-button login">Login</Link>
            </li>
            <li>
              <Link to="/register" className="nav-button register">Register</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
