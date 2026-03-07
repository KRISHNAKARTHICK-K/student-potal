const jwt = require('jsonwebtoken');

// Authentication middleware
const authenticate = (req, res, next) => {
  try {
    console.log("Incoming Authorization Header:", req.headers.authorization);

    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'Authorization header is missing'
      });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token is missing'
      });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.log("JWT Verify Error:", err.message);
        return res.status(401).json({
          success: false,
          message: 'Invalid or expired token'
        });
      }

      req.user = {
        id: decoded.id,
        role: decoded.role
      };

      req.role = decoded.role;

      next();
    });

  } catch (error) {
    console.error('Authentication middleware error:', error);
    return res.status(401).json({
      success: false,
      message: 'Authentication failed'
    });
  }
};

// Role-based authorization middleware
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    // Check if role exists on request
    if (!req.role) {
      return res.status(401).json({
        success: false,
        message: 'User role not found. Authentication required.'
      });
    }

    // Check if user role is in allowed roles
    if (!allowedRoles.includes(req.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Insufficient permissions.'
      });
    }

    // User has required role, continue to next middleware/route
    next();
  };
};

module.exports = { authenticate, authorize };
