const mongoose = require('mongoose');

const ListingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  series: {
    type: String,
    required: true,
  },
  edition: {
    type: String,
    required: true,
  },
  holographic: {
    type: String,
    required: true,
  },
  grade: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  primaryImage: {
    type: String,
    required: true,
  },
  secondaryImages: {
    type: [String],
  },
  openToTrade: {
    type: Boolean,
  },
  tradeDetails: {
    type: String,
  },
  status: {
    type: String,
    default: 'available',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Listing', ListingSchema);
