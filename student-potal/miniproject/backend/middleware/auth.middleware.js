const jwt = require('jsonwebtoken');

// Authentication middleware
const authenticate = (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    // Check if Authorization header exists
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'Authorization header is missing'
      });
    }

    // Extract token from "Bearer <token>" format
    const token = authHeader.split(' ')[1];

    // Check if token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token is missing'
      });
    }

    // Verify JWT token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({
          success: false,
          message: 'Invalid or expired token'
        });
      }

      // Attach user id and role to request object
      req.user = {
        id: decoded.id,
        role: decoded.role
      };
      req.role = decoded.role;

      // Continue to next middleware/route
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
