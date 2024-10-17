// routes/users.js
const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/userController');

// Register route
// POST /api/users/register
router.post('/register', register);

// Login route
// POST /api/users/login
router.post('/login', login);

module.exports = router;
