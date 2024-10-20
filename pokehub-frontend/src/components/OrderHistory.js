import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../retro-style.css';  // Import your retro style here

const OrderHistory = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');

  // Fetch orders when component mounts
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Fetch the user's orders from the API
        const res = await axios.get('http://localhost:5000/api/orders', {
          headers: {
            Authorization: `Bearer ${token}`,  // Ensure the token is passed
          },
        });

        // Log the fetched orders to verify
        console.log('Fetched Orders:', res.data);

        // Set the orders to the response data
        setOrders(res.data || []);  
      } catch (err) {
        console.error('Error fetching orders:', err.response ? err.response.data : err.message);
        setError('Failed to fetch orders');
      }
    };

    // Call the function to fetch orders
    fetchOrders();
  }, [token]);  // Re-fetch orders if the token changes

  return (
    <div className="content">
      <h1>Order History</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <table className="order-history-table">
          <thead>
            <tr>
              <th>Card Name</th>
              <th>Seller</th>
              <th>Status</th>
              <th>Total Price</th>
              <th>Transaction Details</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order.listing.cardName}</td>
                <td>{order.seller.name}</td>
                <td><span className={`order-status ${order.status}`}>{order.status}</span></td>
                <td>${order.totalPrice}</td>
                <td>{new Date(order.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default OrderHistory;
