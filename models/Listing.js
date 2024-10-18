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
  status: {
    type: String,
    enum: ['available', 'sold', 'removed'],
    default: 'available'  // Default status for a new listing
  },
  category: {
    type: String,
    default: 'Cards'  // If you want to add categories for listings
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Listing', ListingSchema);
