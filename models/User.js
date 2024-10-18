// models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['buyer', 'seller'],
    default: 'buyer',
  },
  profilePic: {
    type: String,
    default: '/uploads/profile_pics/default-profile.png', // Default profile picture path
  },
  wishlist: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Listing', 
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('User', UserSchema);
