const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach user information to request object
    req.user = decoded;
    
    console.log(req.user); // Add this line to check the decoded token

    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
