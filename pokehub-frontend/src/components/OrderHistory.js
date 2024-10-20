import React, { useEffect, useState } from 'react';
import axios from 'axios';

const OrderHistory = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');

  // Fetch orders when component mounts
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/orders', {
          headers: {
            Authorization: `Bearer ${token}`,  // Ensure the token is passed
          },
        });
  
        console.log('Fetched Orders:', res.data);  // Log the response to ensure data is fetched
        setOrders(res.data || []);  // Update state with fetched orders
      } catch (err) {
        console.error('Error fetching orders:', err.response ? err.response.data : err.message);
        setError('Failed to fetch orders');
      }
    };
  
    fetchOrders();
  }, [token]);


  return (
    <div className="content">
      <h1>Order History</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
  
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <ul>
          {orders.map((order) => (
            <li key={order._id}>
              <h3>Order for: {order.listing.cardName}</h3>  {/* Display the card name */}
              <p>Seller: {order.seller.name}</p>  {/* Display seller information */}
              <p>Status: {order.status}</p>  {/* Display order status */}
              <p>Total Price: ${order.totalPrice}</p>  {/* Display total price */}
              <p>Created At: {new Date(order.createdAt).toLocaleString()}</p>  {/* Display creation date */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
  
};

export default OrderHistory;
