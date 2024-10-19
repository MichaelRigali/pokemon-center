import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Listings = ({ token }) => {
  const [listings, setListings] = useState([]);
  const [wishlist, setWishlist] = useState([]); // Initialize to an empty array
  const [error, setError] = useState('');

  // Fetch listings and wishlist when the component mounts or when the token changes
  useEffect(() => {
    const fetchListingsAndWishlist = async () => {
      try {
        // Fetch listings
        const listingsRes = await axios.get('http://localhost:5000/api/listings');
        setListings(listingsRes.data);

        // Fetch wishlist if token is available (for logged-in users)
        if (token) {
          const wishlistRes = await axios.get('http://localhost:5000/api/users/wishlist', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setWishlist(wishlistRes.data.wishlist || []); // Fallback to an empty array if wishlist is undefined
        }
      } catch (err) {
        setError('Failed to load listings or wishlist');
      }
    };

    fetchListingsAndWishlist(); // Fetch both listings and wishlist when component mounts
  }, [token]); // Dependency on the token to re-fetch whenever it changes

  // Add item to wishlist
  const addToWishlist = async (listingId) => {
    try {
      const res = await axios.post(
        `http://localhost:5000/api/users/wishlist/${listingId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setWishlist(res.data.wishlist || []); // Update wishlist in the frontend
    } catch (err) {
      setError('Failed to add to wishlist');
    }
  };

  // Remove item from wishlist
  const removeFromWishlist = async (listingId) => {
    try {
      const res = await axios.delete(
        `http://localhost:5000/api/users/wishlist/${listingId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setWishlist(res.data.wishlist || []); // Update wishlist in the frontend
    } catch (err) {
      setError('Failed to remove from wishlist');
    }
  };

  // Check if an item is in the wishlist
  const isInWishlist = (listingId) => {
    return Array.isArray(wishlist) && wishlist.includes(listingId); // Safe check for wishlist
  };

  return (
    <div>
      <h1>Listings</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {listings.length === 0 ? (
        <p>No listings available.</p>
      ) : (
        <ul>
          {listings.map((listing) => (
            <li key={listing._id}>
              <img
                src={`http://localhost:5000${listing.imageUrl}`} // Adjust the URL to point to your server
                alt={listing.cardName}
                style={{ width: '150px' }}
              />
              <h3>
                {listing.cardName} - {listing.cardSet}
              </h3>
              <p>Price: ${listing.price}</p>
              <p>Condition: {listing.condition}</p>
              {isInWishlist(listing._id) ? (
                <button onClick={() => removeFromWishlist(listing._id)}>
                  Remove from Wishlist
                </button>
              ) : (
                <button onClick={() => addToWishlist(listing._id)}>
                  Add to Wishlist
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Listings;
