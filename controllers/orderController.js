// controllers/orderController.js
const Order = require('../models/Order');
const Listing = require('../models/Listing');

// Create a new order
exports.createOrder = async (req, res) => {
  const { listingId, sellerId } = req.body;
  const buyerId = req.user;

  try {
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ msg: 'Listing not found' });
    }

    const newOrder = new Order({
      buyer: buyerId,
      seller: sellerId,
      listing: listingId,
      totalPrice: listing.price
    });

    await newOrder.save();
    res.json(newOrder);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Fetch all orders for a buyer
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.user }).populate('listing');
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
