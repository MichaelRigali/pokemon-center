// models/Listing.js
const mongoose = require('mongoose');

const ListingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // Reference to the User who created the listing
    required: true
  },
  cardName: {
    type: String,
    required: true
  },
  cardSet: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  condition: {
    type: String,
    enum: ['mint', 'near-mint', 'lightly played', 'moderately played', 'heavily played'],
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Listing', ListingSchema);