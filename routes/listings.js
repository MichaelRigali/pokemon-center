// routes/listings.js
const express = require('express');
const router = express.Router();
const { createListing, getListings } = require('../controllers/listingController');
const auth = require('../middlewares/auth');

// POST /api/listings - Create a new listing
router.post('/', auth, createListing);

// GET /api/listings - Get all listings
router.get('/', getListings);

// Update a listing by ID
router.put('/:id', auth, updateListing);

// Delete a listing by ID
router.delete('/:id', auth, deleteListing);

module.exports = router;
