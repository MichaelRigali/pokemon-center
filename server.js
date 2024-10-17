// server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(() => {
    console.log('MongoDB connected');
  }).catch((err) => {
    console.error('MongoDB connection error:', err);
  });

const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// Import user routes
const userRoutes = require('./routes/users'); // Ensure this points to the correct path

// Use user routes for any requests to /api/users
app.use('/api/users', userRoutes);

// Root route to check if server is running
app.get('/', (req, res) => {
    res.send('PokeHub API is running!');
});

// Set the server to listen on port 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
