const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // Get the token from the request headers
  const token = req.header('Authorization')?.replace('Bearer ', ''); // Safely access and remove "Bearer " prefix

  // Check if the token is provided
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    // Verify the token using the secret key from environment variables
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach the user information from the decoded token to the request object
    req.user = decoded;
    
    // Continue to the next middleware or route handler
    next();
  } catch (err) {
    // If token verification fails, respond with a 401 Unauthorized status
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

