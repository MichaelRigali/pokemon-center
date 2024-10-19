import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MyListings = ({ token }) => {
  const [listings, setListings] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(''); // Add success state

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

  // Remove listing function
  const removeListing = async (listingId) => {
    if (!token) {
      setError('You are not authorized to perform this action');
      return;
    }
  
    try {
      await axios.delete(`http://localhost:5000/api/listings/${listingId}`, {
        headers: {
          Authorization: `Bearer ${token}` // Ensure the token is sent
        }
      });
  
      setSuccess('Listing removed successfully'); // Use setSuccess to update the success state
      setListings(listings.filter(listing => listing._id !== listingId)); // Remove the listing from the UI
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError('Unauthorized: You must log in to remove this listing');
      } else {
        setError('Failed to remove the listing');
      }
    }
  };
  

  return (
    <div>
      <h1>My Listings</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>} {/* Display success message */}

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

              {/* Remove listing button */}
              <button onClick={() => removeListing(listing._id)}>
                Remove Listing
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyListings;
