// controllers/listingController.js
const Listing = require('../models/Listing');

// Create a new listing
exports.createListing = async (req, res) => {
  const { cardName, cardSet, price, condition, imageUrl } = req.body;
  const userId = req.user;  // Auth middleware adds this

  try {
    const newListing = new Listing({
      user: userId,
      cardName,
      cardSet,
      price,
      condition,
      imageUrl
    });

    await newListing.save();
    res.json(newListing);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Fetch all listings
exports.getListings = async (req, res) => {
  try {
    const listings = await Listing.find().populate('user', ['name', 'email']);
    res.json(listings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Update a listing
exports.updateListing = async (req, res) => {
    const { id } = req.params;
    const { cardName, cardSet, price, condition, imageUrl } = req.body;
  
    try {
      let listing = await Listing.findById(id);
      
      if (!listing) {
        return res.status(404).json({ msg: 'Listing not found' });
      }
  
      // Check if the logged-in user is the owner of the listing
      if (listing.user.toString() !== req.user) {
        return res.status(401).json({ msg: 'Not authorized' });
      }
  
      // Update listing fields
      listing = await Listing.findByIdAndUpdate(
        id,
        { cardName, cardSet, price, condition, imageUrl },
        { new: true }
      );
  
      res.json(listing);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  };
  
  // Delete a listing
  exports.deleteListing = async (req, res) => {
    const { id } = req.params;
  
    try {
      const listing = await Listing.findById(id);
      
      if (!listing) {
        return res.status(404).json({ msg: 'Listing not found' });
      }
  
      // Check if the logged-in user is the owner of the listing
      if (listing.user.toString() !== req.user) {
        return res.status(401).json({ msg: 'Not authorized' });
      }
  
      await listing.remove();
      res.json({ msg: 'Listing removed' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  };
  