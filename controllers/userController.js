const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Listing = require('../models/Listing');
const Order = require('../models/Order');
const multer = require('multer');
const path = require('path');

// Multer storage configuration for profile picture uploads
const storage = multer.diskStorage({
  destination: './uploads/profile_pics/',
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9); // Add a timestamp and random suffix
    cb(null, req.user.userId + '-' + uniqueSuffix + path.extname(file.originalname)); // Save file with user ID and suffix
  }
});
const upload = multer({ storage });

// Profile picture upload handler
exports.uploadProfilePicture = [upload.single('profilePic'), async (req, res) => {
  try {
    console.log('Uploading profile picture for user:', req.user.userId);
    const user = await User.findById(req.user.userId);

    // Update profilePic in the user model
    user.profilePic = `/uploads/profile_pics/${req.file.filename}`;
    await user.save(); // Save updated user profile with the profilePic path

    console.log('Profile picture saved to user:', user.profilePic);
    res.json({ msg: 'Profile picture updated successfully', profilePic: user.profilePic });
  } catch (err) {
    console.error('Error uploading profile picture:', err.message);
    res.status(500).send('Server error');
  }
}];

// Register a new user
exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // Check if the user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user with default profile picture
    user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      profilePic: '/uploads/profile_pics/default-profile.png' // Assign default profile picture
    });

    // Save the user to the database
    await user.save();

    // Generate a JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Respond with the token
    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Log in an existing user
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Check if the password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Respond with the token
    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Fetch user profile
exports.getProfile = async (req, res) => {
  try {
    console.log('Fetching profile for user:', req.user.userId);
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    console.log('Fetched profile:', user);

    // If profilePic is empty or not defined, assign default profile picture
    if (!user.profilePic) {
      user.profilePic = '/uploads/profile_pics/default-profile.png';
    }

    res.json(user);
  } catch (err) {
    console.error('Error fetching profile:', err.message);
    res.status(500).send('Server error');
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  const { name, email } = req.body;
  try {
    let user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Update the user fields
    user.name = name || user.name;
    user.email = email || user.email;

    await user.save();
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Fetch user-specific listings
exports.getUserListings = async (req, res) => {
  try {
    const listings = await Listing.find({ userId: req.user.userId });
    if (!listings || listings.length === 0) {
      return res.status(404).json({ msg: 'No listings found' });
    }
    res.json(listings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Fetch user's order history
exports.getOrderHistory = async (req, res) => {
  try {
    const orders = await Order.find({ buyerId: req.user.userId });
    if (!orders || orders.length === 0) {
      return res.status(404).json({ msg: 'No orders found' });
    }
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Update password for a logged-in user
exports.updatePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  try {
    // Find the user by ID (decoded from the token)
    const user = await User.findById(req.user.userId);

    // Check if the current password is correct
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Current password is incorrect' });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update the password in the database
    user.password = hashedPassword;
    await user.save();

    res.json({ msg: 'Password updated successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Add a listing to the user's wishlist
exports.addToWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    const { listingId } = req.params;

    // Check if the listing exists
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ msg: 'Listing not found' });
    }

    // Check if the item is already in the wishlist
    if (user.wishlist.includes(listingId)) {
      return res.status(400).json({ msg: 'Listing already in wishlist' });
    }

    // Add the listing to the wishlist
    user.wishlist.push(listingId);
    await user.save();

    // Re-fetch the updated wishlist and send it back
    const updatedWishlist = await User.findById(req.user.userId).populate('wishlist');
    res.status(200).json({ wishlist: updatedWishlist.wishlist });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// Remove item from wishlist
exports.removeFromWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    const { listingId } = req.params;

    user.wishlist = user.wishlist.filter(item => item.toString() !== listingId);
    await user.save();

    // Re-fetch the updated wishlist and send it back
    const updatedWishlist = await User.findById(req.user.userId).populate('wishlist');
    res.status(200).json({ wishlist: updatedWishlist.wishlist });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};



// Get user's wishlist
// controllers/userController.js
exports.getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).populate('wishlist'); // Populate wishlist with listing details
    res.status(200).json(user.wishlist);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

