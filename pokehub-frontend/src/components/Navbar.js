import React from 'react';

const Navbar = () => {
  return (
    <nav>
      <h2>PokeHub</h2>
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/listings">Listings</a></li>
        <li><a href="/add-listing">Add Listing</a></li>
        <li><a href="/orders">Order History</a></li>
      </ul>
    </nav>
  );
};

export default Navbar;
