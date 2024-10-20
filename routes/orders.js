const express = require('express');
const router = express.Router();
const { createOrder, getOrders, updateOrderStatus } = require('../controllers/orderController');
const auth = require('../middlewares/auth');

// POST /api/orders - Create a new order
router.post('/', auth, createOrder);

// GET /api/orders - Get all orders for the logged-in buyer
router.get('/', auth, getOrders);

// PUT /api/orders/:id/status - Update the order status by seller
router.put('/:id/status', auth, updateOrderStatus);

module.exports = router;
