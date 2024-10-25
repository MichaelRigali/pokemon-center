import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MyWishlist = ({ token }) => {
  const [wishlist, setWishlist] = useState([]);
  const [error, setError] = useState('');

  // Fetch wishlist when the component mounts
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/users/wishlist', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setWishlist(res.data); // Set the fetched wishlist
      } catch (err) {
        setError('Failed to load wishlist');
      }
    };

    if (token) {
      fetchWishlist(); // Fetch wishlist if token exists
    }
  }, [token]);

  // Remove item from wishlist
  const removeFromWishlist = async (listingId) => {
    try {
      const res = await axios.delete(`http://localhost:5000/api/users/wishlist/${listingId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setWishlist(res.data.wishlist); // Update wishlist after removal
    } catch (err) {
      setError('Failed to remove from wishlist');
    }
  };

  return (
    <div className='content'>
      <h1>My Wishlist</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {wishlist.length === 0 ? (
        <p>Your wishlist is empty.</p>
      ) : (
        <ul>
          {wishlist.map((listing) => (
            <li key={listing._id} style={{ listStyleType: 'none', marginBottom: '20px' }}>
              {/* Display the image */}
              <img
                src={`http://localhost:5000${listing.primaryImage}`}
                alt={listing.name} // Change from listing.cardName to listing.name
                style={{ width: '150px', height: '150px', objectFit: 'cover' }}
              />
              <h3>{listing.name} - {listing.series}</h3> {/* Updated to name and series */}
              <p>Edition: {listing.edition}</p> {/* New field for edition */}
              <p>Holographic: {listing.holographic}</p> {/* New field for holographic */}
              <p>Grade: {listing.grade}</p> {/* New field for grade */}
              <p>Price: ${listing.price}</p>
              <p>Condition: {listing.condition}</p>
              <button onClick={() => removeFromWishlist(listing._id)}>
                Remove from Wishlist
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyWishlist;
