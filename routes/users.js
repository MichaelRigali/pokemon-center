// routes/users.js
const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, getUserListings, getOrderHistory, register, login, uploadProfilePicture, updatePassword, addToWishlist, removeFromWishlist, getWishlist } = require('../controllers/userController');
const auth = require('../middlewares/auth');

// Fetch user profile
router.get('/profile', auth, getProfile);

// Update user profile
router.put('/profile', auth, updateProfile);

// Get user's listings
router.get('/my-listings', auth, getUserListings);

// Get order history
router.get('/order-history', auth, getOrderHistory);

// Register route
router.post('/register', register);

// Login route
router.post('/login', login);

// Route to update the password
router.put('/update-password', auth, updatePassword);

// Profile picture upload
router.put('/upload-profile-pic', auth, uploadProfilePicture);

// Add a listing to wishlist
router.post('/wishlist/:listingId', auth, addToWishlist);

// Remove a listing from wishlist
router.delete('/wishlist/:listingId', auth, removeFromWishlist);

// Get user's wishlist
router.get('/wishlist', auth, getWishlist);

module.exports = router;
