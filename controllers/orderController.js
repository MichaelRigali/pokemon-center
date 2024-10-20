const Order = require('../models/Order');
const Listing = require('../models/Listing');

// Create a new order
exports.createOrder = async (req, res) => {
  const { listingId, sellerId } = req.body;  // Destructure listingId and sellerId from the request body
  const userId = req.user.userId;  // Get the authenticated user ID (buyer)

  console.log('Order creation request received with:', { listingId, sellerId, userId });

  if (!userId || !sellerId || !listingId) {
    return res.status(400).json({ msg: 'Missing required data (listingId, sellerId, or userId)' });
  }

  try {
    // Ensure the listing exists
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ msg: 'Listing not found' });
    }

    // Create the new order
    const newOrder = new Order({
      buyer: userId,          // Buyer is the authenticated user
      seller: sellerId,       // Seller is the provided sellerId (listing.user._id)
      listing: listingId,     // Reference to the listing
      totalPrice: listing.price,
      status: 'pending',
    });

    // Save the new order
    await newOrder.save();

    console.log('Order saved successfully:', newOrder);
    res.json(newOrder);  // Return the saved order
  } catch (err) {
    console.error('Error while saving order:', err.message);  // Log any error
    res.status(500).json({ msg: 'Server error' });
  }
};


// Route to get the orders for the logged-in user
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.user.userId })  // Use req.user.userId, not req.user.id
      .populate('listing')  // Populate listing details
      .populate('seller', 'name email');  // Populate seller details

    res.json(orders);  // Send orders to frontend
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};


// Update order status
exports.updateOrderStatus = async (req, res) => {
  const { id } = req.params;  // Get order ID from URL
  const { status } = req.body;  // New status in request body

  try {
    let order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ msg: 'Order not found' });
    }

    // Only the seller can update the status
    if (order.seller.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized to update status' });
    }

    order.status = status;  // Update the status
    await order.save();

    res.json(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
