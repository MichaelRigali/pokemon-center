// src/components/Listings.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Listings = () => {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    // Fetch listings from the backend API
    axios.get('/api/listings')
      .then(response => {
        setListings(response.data);
      })
      .catch(error => {
        console.error('Error fetching listings:', error);
      });
  }, []);

  return (
    <div>
      <h1>Available Listings</h1>
      <ul>
        {listings.map(listing => (
          <li key={listing._id}>
            <h3>{listing.cardName}</h3>
            <p>Set: {listing.cardSet}</p>
            <p>Price: ${listing.price}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Listings;
