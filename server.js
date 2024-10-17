const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Create an instance of express
const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

// Import user, listing, and order routes
const userRoutes = require('./routes/users');  // Ensure correct path
const listingRoutes = require('./routes/listings');
const orderRoutes = require('./routes/orders');

// Use routes for API endpoints
app.use('/api/users', userRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/orders', orderRoutes);

// Root route to check if server is running
app.get('/', (req, res) => {
  res.send('PokeHub API is running!');
});

// Set the server to listen on port 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
