import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WishlistPage = ({ token }) => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch user's wishlist
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/users/wishlist', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWishlist(res.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load wishlist');
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [token]);

  if (loading) return <p>Loading wishlist...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Your Wishlist</h1>
      {wishlist.length === 0 ? (
        <p>Your wishlist is empty.</p>
      ) : (
        <ul>
          {wishlist.map((item) => (
            <li key={item._id}>
              <h3>{item.cardName}</h3>
              <p>Set: {item.cardSet}</p>
              <p>Price: ${item.price}</p>
              <img src={item.imageUrl} alt={item.cardName} style={{ width: '100px', height: '100px' }} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default WishlistPage;
