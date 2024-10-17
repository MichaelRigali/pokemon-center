const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Assuming you have a User model
const Listing = require('../models/Listing'); // Assuming you have a Listing model
const Order = require('../models/Order'); // Assuming you have an Order model
const multer = require('multer');
const path = require('path');

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: './uploads/profile_pics/',
  filename: (req, file, cb) => {
    cb(null, req.user.userId + path.extname(file.originalname)); // Save the file with the user ID
  }
});
const upload = multer({ storage });

// Profile picture upload handler
exports.uploadProfilePicture = [
  upload.single('profilePic'),
  async (req, res) => {
    try {
      if (!req.file) {
        console.log("No file received");
        return res.status(400).send('No file uploaded');
      }

      const user = await User.findById(req.user.userId);
      if (!user) {
        console.log("User not found");
        return res.status(404).json({ msg: 'User not found' });
      }

      user.profilePic = `/uploads/profile_pics/${req.file.filename}`;
      await user.save();

      console.log("Profile picture updated successfully");
      res.json({ msg: 'Profile picture updated successfully', profilePic: user.profilePic });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
];


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

    // Create a new user
    user = new User({
      name,
      email,
      password: hashedPassword,
      role // Assuming roles like "buyer" or "seller"
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
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
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
