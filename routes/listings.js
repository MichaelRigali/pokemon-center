const express = require('express');
const router = express.Router();
const { addListing, getListings, updateListing, removeListing, getUserListings } = require('../controllers/listingController');
const auth = require('../middlewares/auth');

// POST /api/listings - Create a new listing
router.post('/', auth, addListing);

// GET /api/listings - Get all listings (with auth for ownership check)
router.get('/', auth, getListings);

// Update a listing by ID
router.put('/:id', auth, updateListing);

// Delete a listing by ID
router.delete('/:id', auth, removeListing);

// Route to get the user's own listings
router.get('/my-listings', auth, getUserListings);

module.exports = router;
