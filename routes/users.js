// routes/users.js
const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, getUserListings, getOrderHistory, register, login } = require('../controllers/userController');
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

module.exports = router;
