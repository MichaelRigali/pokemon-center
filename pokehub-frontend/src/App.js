// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar'; // Make sure this path is correct
import Home from './components/Home';     // Make sure this path is correct
import Listings from './components/Listings'; // Ensure all imports are correct
import AddListing from './components/AddListing';
import OrderHistory from './components/OrderHistory';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/listings" element={<Listings />} />
          <Route path="/add-listing" element={<AddListing />} />
          <Route path="/orders" element={<OrderHistory />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
