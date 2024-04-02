const jwt = require('jsonwebtoken');

// Middleware to authenticate token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Middleware to check if the authenticated user is an admin
function isAdmin(req, res, next) {
  if (req.user.role !== 'admin') return res.sendStatus(403);
  next();
}

module.exports = { authenticateToken, isAdmin };