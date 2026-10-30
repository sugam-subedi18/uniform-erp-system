const jwt = require('jsonwebtoken');

// Checks the token sent by the frontend and attaches the logged-in user to req.user
function authenticate(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'Please log in first' });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET); // { id, name, role }
    next();
  } catch {
    return res.status(401).json({ message: 'Your session has expired, please log in again' });
  }
}

// Allows only the listed roles, e.g. authorize('admin', 'store_manager')
const authorize = (...roles) => (req, res, next) =>
  roles.includes(req.user.role) ? next() : res.status(403).json({ message: 'You do not have access to this' });

module.exports = { authenticate, authorize };
