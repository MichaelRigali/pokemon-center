const multer = require('multer');
const path = require('path');
const Listing = require('../models/Listing');

// Multer storage configuration for listing image uploads
const storage = multer.diskStorage({
  destination: './uploads/listing_images/', // Directory for listing images
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Save file with unique name
  }
});
const upload = multer({ storage });

// Create a new listing with image upload
exports.addListing = [
  upload.single('image'), // Handle image upload
  async (req, res) => {
    const { name, series, edition, holographic, grade, price } = req.body;
    const imageUrl = `/uploads/listing_images/${req.file.filename}`; // Path to the image file

    try {
      const newListing = new Listing({
        user: req.user.userId, // Use req.user.userId
        name,
        series,
        edition,
        holographic,
        grade,
        price,
        imageUrl // Save the image path in the database
      });

      await newListing.save();
      res.status(201).json({ msg: 'Listing created successfully', listing: newListing });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
];


// Fetch all listings
exports.getListings = async (req, res) => {
  try {
    const listings = await Listing.find().populate('user', ['name', 'email']);

    // Check if the logged-in user owns each listing
    const listingsWithOwnership = listings.map((listing) => {
      return {
        ...listing._doc, // Spread existing listing details
        isOwner: req.user ? listing.user._id.toString() === req.user.userId : false // Add isOwner flag
      };
    });

    res.json(listingsWithOwnership);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};





// Update a listing
exports.updateListing = [
  upload.single('image'), // Middleware for image upload
  async (req, res) => {
    const { id } = req.params;
    const { cardName, cardSet, price, condition } = req.body;
    
    try {
      let listing = await Listing.findById(id);
      
      if (!listing) {
        return res.status(404).json({ msg: 'Listing not found' });
      }

      // Check if the logged-in user is the owner of the listing
      if (listing.user.toString() !== req.user.userId) { // Compare with req.user.userId
        return res.status(401).json({ msg: 'Not authorized' });
      }

      // If a new image is uploaded, update the imageUrl
      const imageUrl = req.file ? `/uploads/listing_images/${req.file.filename}` : listing.imageUrl;

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
  }
];

// Delete a listing
exports.removeListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ msg: 'Listing not found' });
    }

    // Check if the logged-in user is the owner of the listing
    if (listing.user.toString() !== req.user.userId) { // Compare with req.user.userId
      return res.status(401).json({ msg: 'Not authorized' });
    }

    // Use findByIdAndDelete instead of listing.remove()
    await Listing.findByIdAndDelete(req.params.id);

    res.json({ msg: 'Listing removed successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};


// Fetch listings for the logged-in user
exports.getUserListings = async (req, res) => {
  try {
    const listings = await Listing.find({ user: req.user.userId }); // Find listings where user is the logged-in user
    res.json(listings); // Send listings as JSON
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
