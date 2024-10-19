import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MyListings = ({ token }) => {
  const [listings, setListings] = useState([]);
  const [error, setError] = useState('');

  // Fetch user's listings when the component mounts
  useEffect(() => {
    const fetchUserListings = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/listings/my-listings', {
          headers: {
            Authorization: `Bearer ${token}` // Send token in the request header
          }
        });
        setListings(res.data); // Set listings with the user's listings
      } catch (err) {
        setError('Failed to load your listings');
      }
    };

    fetchUserListings();
  }, [token]);

  return (
    <div>
      <h1>My Listings</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {listings.length === 0 ? (
        <p>You have no listings.</p>
      ) : (
        <ul>
          {listings.map((listing) => (
            <li key={listing._id}>
              {/* Ensure the image is displayed with the correct path */}
              <img
                src={`http://localhost:5000${listing.imageUrl}`} // Display the image using the correct path
                alt={listing.cardName}
                style={{ width: '150px' }}
              />
              <h3>{listing.cardName} - {listing.cardSet}</h3>
              <p>Price: ${listing.price}</p>
              <p>Condition: {listing.condition}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyListings;
