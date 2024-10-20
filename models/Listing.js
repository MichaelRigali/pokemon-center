const mongoose = require('mongoose');

const ListingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // Reference to the User who created the listing
    required: true
  },
  name: {  // Updated to reflect "name" instead of cardName
    type: String,
    required: true
  },
  series: {  // Added series field
    type: String,
    required: true
  },
  edition: {  // Added edition field (First or Non-First)
    type: String,
    required: true
  },
  holographic: {  // Added holographic field (True/False)
    type: String,
    required: true
  },
  grade: {  // Added grade field (Mint, Near Mint, etc.)
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['available', 'sold', 'removed'],
    default: 'available'  // Default status for a new listing
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Listing', ListingSchema);
