// src/components/Dashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = ({ token }) => {
  const [listings, setListings] = useState([]);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');

  // Fetch listings and orders when the component mounts
  useEffect(() => {
    if (!token) {
      setError('No token provided');
      return;
    }

    const fetchListings = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/users/my-listings', {
          headers: {
            Authorization: `Bearer ${token}`, // Send token in request header
          },
        });
        setListings(res.data);
      } catch (err) {
        console.error('Failed to load listings:', err);
        setError('Failed to load listings');
      }
    };

    const fetchOrders = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/users/order-history', {
          headers: {
            Authorization: `Bearer ${token}`, // Send token in request header
          },
        });
        setOrders(res.data);
      } catch (err) {
        console.error('Failed to load orders:', err);
        setError('Failed to load orders');
      }
    };

    // Fetch both listings and orders
    fetchListings();
    fetchOrders();
  }, [token]);

  return (
    <div>
      <h1>Dashboard</h1>
      
      <h2>Your Listings</h2>
      {listings.length === 0 ? (
        <p>You have no listings yet.</p>
      ) : (
        <ul>
          {listings.map((listing) => (
            <li key={listing._id}>
              {listing.cardName} - {listing.status}
            </li>
          ))}
        </ul>
      )}

      <h2>Your Orders</h2>
      {orders.length === 0 ? (
        <p>You haven't made any purchases yet.</p>
      ) : (
        <ul>
          {orders.map((order) => (
            <li key={order._id}>
              {order.cardName} - {order.status}
            </li>
          ))}
        </ul>
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default Dashboard;
