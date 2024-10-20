const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose'); // Import mongoose for MongoDB connection
const userRoutes = require('./routes/users');
const listingRoutes = require('./routes/listings'); // Added listings route

// Initialize Express app
const app = express();

// Load environment variables
dotenv.config();

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse incoming JSON requests
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded requests

// Static folder to serve uploaded files (profile pics, listing images, etc.)
// Ensures images and other files in '/uploads' can be accessed via URL
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('MongoDB connected successfully');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

// Routes for Users and Listings
app.use('/api/users', userRoutes); // User routes for registration, login, etc.
app.use('/api/listings', listingRoutes); // Added route to handle listings CRUD operations

const orderRoutes = require('./routes/orders'); // Ensure orders route is included
app.use('/api/orders', orderRoutes); // Route handler for orders


// Global Error Handling Middleware (optional but useful for debugging)
// Catches errors and logs them
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Start the server on the specified port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
