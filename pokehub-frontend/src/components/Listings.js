import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Listings = ({ token }) => {
  const [listings, setListings] = useState([]);
  const [wishlist, setWishlist] = useState([]); // Initialize to an empty array
  const [orders, setOrders] = useState([]); // Initialize for tracking orders
  const [error, setError] = useState('');

  // Fetch listings and wishlist when the component mounts or the user navigates back
  useEffect(() => {
    const fetchListingsAndWishlist = async () => {
      try {
        // Fetch all listings
        const listingsRes = await axios.get('http://localhost:5000/api/listings', {
          headers: {
            Authorization: `Bearer ${token}`, // Ensure the token is passed
          }
        });
        setListings(listingsRes.data); // Listings should now include the `isOwner` flag from the backend

        // Fetch the user's wishlist if they are logged in
        if (token) {
          const wishlistRes = await axios.get('http://localhost:5000/api/users/wishlist', {
            headers: {
              Authorization: `Bearer ${token}`, // Use token for fetching wishlist
            },
          });
          setWishlist(wishlistRes.data || []); // Fallback to an empty array

          // Fetch the user's orders as well
          const ordersRes = await axios.get('http://localhost:5000/api/orders', {
            headers: {
              Authorization: `Bearer ${token}`, // Use token for fetching orders
            },
          });
          setOrders(ordersRes.data || []); // Fallback to an empty array
        }
      } catch (err) {
        setError('Failed to load listings or wishlist');
      }
    };

    fetchListingsAndWishlist(); // Fetch both listings and wishlist when component mounts
  }, [token]);

  // Add item to wishlist
  const addToWishlist = async (listingId) => {
    try {
      const res = await axios.post(
        `http://localhost:5000/api/users/wishlist/${listingId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`, // Ensure the token is passed
          }
        }
      );
      setWishlist(res.data.wishlist || []); // Update wishlist in the frontend
    } catch (err) {
      setError('Failed to add to wishlist');
    }
  };

  // Check if an item is in the wishlist
  const isInWishlist = (listingId) => {
    return wishlist.some(item => item._id === listingId); // Compare by `_id`
  };

  // Check if an order for the listing is already pending
  const isOrderPending = (listingId) => {
    return orders.some(order => order.listing && order.listing._id === listingId && order.status === 'pending');
  };

  // Place an order
  const placeOrder = async (listingId, sellerId) => {
    if (!listingId || !sellerId) {
      console.error('Missing listingId or sellerId:', { listingId, sellerId });
      return;
    }

    try {
      const res = await axios.post(
        'http://localhost:5000/api/orders',
        { listingId, sellerId },  // Send correct listingId and sellerId
        {
          headers: {
            Authorization: `Bearer ${token}`,  // Ensure the token is passed
          }
        }
      );
      alert('Order placed successfully!');
    } catch (err) {
      console.error('Error placing order:', err.response ? err.response.data : err.message);  // Log error details
      alert('Failed to place order.');
    }
  };

  return (
    <div className='content'>
      <h1>Listings</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {listings.length === 0 ? (
        <p>No listings available.</p>
      ) : (
        <ul>
          {listings.map((listing) => (
            <li key={listing._id}>
              <img
                src={`http://localhost:5000${listing.primaryImage}`} // Adjust the URL to point to your server
                alt={listing.name}
                style={{ width: '150px' }}
              />
              <h3>{listing.name} - {listing.series}</h3>
              <p>Edition: {listing.edition}</p>
              <p>Holographic: {listing.holographic}</p>
              <p>Grade: {listing.grade}</p>
              <p>Price: ${listing.price}</p>

              {listing.user && listing.user._id ? (
                listing.isOwner ? (
                  <button disabled>Currently owned</button>
                ) : (
                  <>
                    {isOrderPending(listing._id) ? (
                      <button disabled>Pending Order</button>
                    ) : (
                      <button onClick={() => placeOrder(listing._id, listing.user._id)}>
                        Place Order
                      </button>
                    )}

                    {isInWishlist(listing._id) ? (
                      <button disabled>Item on Wishlist</button>
                    ) : (
                      <button onClick={() => addToWishlist(listing._id)}>
                        Add to Wishlist
                      </button>
                    )}
                  </>
                )
              ) : (
                <p>Owner information not available</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Listings;
