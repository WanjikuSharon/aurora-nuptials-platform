import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
  try {
    //console.log('Auth middleware - Headers:', req.headers.authorization);
   // console.log('Auth middleware - Cookies:', req.cookies);
    
    // Try to get token from Authorization header first
    const authHeader = req.headers['authorization'];
    let token = authHeader && authHeader.split(' ')[1];
    
    // If no token in header, try to get from cookies
    if (!token) {
      token = req.cookies?.token;
    }
    
    if (!token) {
      console.log('No token provided in header or cookies');
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token decoded successfully:', decoded);
    
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Token verification error:', error.message);
    res.status(403).json({ error: 'Invalid token', details: error.message });
  }
};

export const requireRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
};