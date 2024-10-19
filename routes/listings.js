// routes/listings.js
const express = require('express');
const router = express.Router();
const { addListing, getListings, updateListing, deleteListing, getUserListings } = require('../controllers/listingController');
const auth = require('../middlewares/auth');

// POST /api/listings - Create a new listing
router.post('/', auth, addListing);

// GET /api/listings - Get all listings
router.get('/', getListings);

// Update a listing by ID
router.put('/:id', auth, updateListing);

// Delete a listing by ID
router.delete('/:id', auth, deleteListing);

// Route to get the user's own listings
router.get('/my-listings', auth, getUserListings);

module.exports = router;
