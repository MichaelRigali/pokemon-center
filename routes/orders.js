// routes/orders.js
const express = require('express');
const router = express.Router();
const { createOrder, getOrders } = require('../controllers/orderController');
const auth = require('../middlewares/auth');

// POST /api/orders - Create a new order
router.post('/', auth, createOrder);

// GET /api/orders - Get all orders for the logged-in buyer
router.get('/', auth, getOrders);

// Update the order status
router.put('/:id/status', auth, updateOrderStatus);

module.exports = router;
