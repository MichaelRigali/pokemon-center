const multer = require('multer');
const path = require('path');
const Listing = require('../models/Listing');

// Multer storage configuration for multiple image uploads
const storage = multer.diskStorage({
  destination: './uploads/listing_images/', // Directory for listing images
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Save file with unique name
  }
});

// Allow multiple file uploads: primaryImage and up to 3 secondary images
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB size limit per file
}).fields([
  { name: 'primaryImage', maxCount: 1 }, // Handle primary image upload
  { name: 'secondaryImage_1', maxCount: 1 }, // Handle secondary image 1
  { name: 'secondaryImage_2', maxCount: 1 }, // Handle secondary image 2
  { name: 'secondaryImage_3', maxCount: 1 } // Handle secondary image 3
]);

// Create a new listing with multiple image uploads
exports.addListing = [
  upload, // Use multer.fields() middleware for handling image uploads
  async (req, res) => {
    console.log("Received request to create a listing"); // Log when the request is received
    const { name, series, edition, holographic, grade, price, openToTrade, tradeDetails } = req.body;

    try {
      console.log("Request body:", req.body); // Log the body of the request to verify that all fields are received correctly
      console.log("Request files:", req.files); // Log the files to check if the primary and secondary images are received

      // Get the path for the uploaded primary image
      const primaryImage = req.files['primaryImage'] ? `/uploads/listing_images/${req.files['primaryImage'][0].filename}` : null;

      if (!primaryImage) {
        return res.status(400).json({ msg: 'Primary image is required.' });
      }

      console.log("Primary Image Path:", primaryImage); // Log the primary image path

      // Create a new listing
      // Create a new listing
const newListing = new Listing({
  user: req.user.userId, // User ID from authenticated request
  name,
  series,
  edition,
  holographic,
  grade,
  price,
  primaryImage: primaryImage, // Explicitly assign the primaryImage field here
  secondaryImages: [], // If there are no secondary images, initialize as an empty array
  openToTrade: openToTrade === 'yes', // Convert string to boolean
  tradeDetails: openToTrade === 'yes' ? tradeDetails : null, // Only store trade details if applicable
});


      console.log("New Listing Data:", newListing); // Log the listing data to verify

      await newListing.save(); // Attempt to save the listing

      console.log("Listing saved successfully:", newListing); // Log success when saved
      res.status(201).json({ msg: 'Listing created successfully', listing: newListing });
    } catch (err) {
      console.error("Error saving listing:", err.message); // Log the error if saving fails
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
  upload, // Middleware for image upload
  async (req, res) => {
    const { id } = req.params;
    const { name, series, setNumber, edition, holographic, grade, price, openToTrade, tradeDetails } = req.body;

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
      const primaryImage = req.files['primaryImage'] ? `/uploads/listing_images/${req.files['primaryImage'][0].filename}` : listing.imageUrl;
      const secondaryImages = ['secondaryImage_1', 'secondaryImage_2', 'secondaryImage_3'].map(imageKey => {
        return req.files[imageKey] ? `/uploads/listing_images/${req.files[imageKey][0].filename}` : listing.secondaryImages[imageKey];
      }).filter(Boolean);

      // Update listing fields
      listing = await Listing.findByIdAndUpdate(
        id,
        {
          name,
          series,
          setNumber,
          edition,
          holographic,
          grade,
          price,
          primaryImage,
          secondaryImages,
          openToTrade: openToTrade === 'yes',
          tradeDetails: openToTrade === 'yes' ? tradeDetails : null
        },
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
