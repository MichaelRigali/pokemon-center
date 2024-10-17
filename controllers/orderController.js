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

// Update order status
exports.updateOrderStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
  
    try {
      let order = await Order.findById(id);
  
      if (!order) {
        return res.status(404).json({ msg: 'Order not found' });
      }
  
      // Only the seller can update the status
      if (order.seller.toString() !== req.user) {
        return res.status(401).json({ msg: 'Not authorized' });
      }
  
      order.status = status;
      await order.save();
  
      res.json(order);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  };
  