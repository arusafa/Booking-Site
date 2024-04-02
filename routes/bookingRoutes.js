const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking_Model");
const { authenticateToken } = require("../middleware/authMiddleware");

// GET route to fetch all bookings
router.get("/allBookings", authenticateToken, async (req, res) => {
  try {
    const bookings = await Booking.find().populate("User Hotel Room");
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST route to create a new booking
router.post("/newBooking", authenticateToken, async (req, res) => {
  try {
    const {
      User,
      Hotel,
      Room,
      CheckInDate,
      CheckOutDate,
      NumberOfGuests,
      TotalPrice,
    } = req.body;

    // Here you might want to add some business logic to calculate TotalPrice
    // and check if Room is available for the given date range , etc...

    const newBooking = new Booking({
      User,
      Hotel,
      Room,
      CheckInDate,
      CheckOutDate,
      NumberOfGuests,
      TotalPrice,
    });

    await newBooking.save();
    res.status(201).json(newBooking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET route to fetch all bookings for a user
router.get("/user/:userId", authenticateToken, async (req, res) => {
  try {
    const userId = req.params.userId;
    const bookings = await Booking.find({ User: userId }).populate(
      "Hotel Room"
    );
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET route to fetch a specific booking by ID
router.get("/:bookingId", authenticateToken, async (req, res) => {
  try {
    const bookingId = req.params.bookingId;
    const booking = await Booking.findById(bookingId).populate(
      "User Hotel Room"
    );

    if (!booking) {
      return res.status(404).json({ message: "Booking not found." });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PATCH route to update an existing booking
router.patch("/updateBooking/:bookingId", authenticateToken, async (req, res) => {
  try {
    const bookingId = req.params.bookingId;
    const updateData = req.body;

    // Additional logic can be added to handle specific updates, 
    // validate date changes, recalculate TotalPrice, etc...

    const booking = await Booking.findByIdAndUpdate(bookingId, updateData, { new: true }).populate("User Hotel Room");
    
    if (!booking) {
      return res.status(404).json({ message: "Booking not found." });
    }

    res.json({ message: "Booking updated successfully.", booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE route to cancel a booking
router.delete("/cancelBooking/:bookingId", authenticateToken, async (req, res) => {
  try {
    const bookingId = req.params.bookingId;

    // Business logic for cancellation could be added here
    // e.g., check if cancellation is allowed, apply fees, etc...

    const booking = await Booking.findById(bookingId);
    
    if (!booking) {
      return res.status(404).json({ message: "Booking not found." });
    }

    await booking.remove();
    
    res.json({ message: "Booking cancelled successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;
