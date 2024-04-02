const express = require('express');
const { authenticateToken, isAdmin } = require('../middleware/authMiddleware');
const router = express.Router();

// GET route to the admin dashboard
router.get('/admin/dashboard', authenticateToken, isAdmin, (req, res) => {
  res.send('Admin Dashboard - Access Granted');
});

module.exports = router;