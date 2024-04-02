const express = require("express");
const User = require("../models/User_Model");
const { authenticateToken, isAdmin } = require("../middleware/authMiddleware");
const router = express.Router();

// Fetch all users
router.get("/allUsers", authenticateToken, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Fetch a single user by ID
router.get("/:id", authenticateToken, isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.json(user);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Update a user by ID
router.put("/:id", authenticateToken, isAdmin, async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).select("-password");
    res.json(updatedUser);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Delete a user by ID
router.delete("/:id", authenticateToken, isAdmin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.send("User deleted successfully");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
