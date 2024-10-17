// middlewares/auth.js
const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // Get token from header
  const token = req.header('x-auth-token');

  // Check if token exists
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};


// NOTE TO SELF:

// const auth = require('../middlewares/auth');

// // Example of a protected route
// router.get('/profile', auth, (req, res) => {
//   res.json({ msg: 'This is a protected route', userId: req.user });
// });
