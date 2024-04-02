const express = require("express");
const router = express.Router();
const Room = require("../models/Room_Model");
const { authenticateToken, isAdmin } = require("../middleware/authMiddleware");
const Hotel = require("../models/Hotel_Model");

// POST route to create a new room
router.post("/newRoom", async (req, res) => {
  try {
    const roomData = req.body;
    const room = new Room(roomData);
    // Save the room to the database
    const newRoom = await room.save();

    res.status(201).json(newRoom);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET route to fetch all rooms
router.get("/all-rooms", async (req, res) => {
  try {
    // Fetch all rooms from the database
    const rooms = await Room.find();

    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Search rooms by RoomName
router.get("/searchByRoomName", async (req, res) => {
  const roomName = req.query.roomName;

  if (!roomName) {
    return res
      .status(400)
      .json({ message: "Please provide a room name for the search." });
  }

  try {
    const rooms = await Room.find({
      "RoomOptions.RoomName": { $regex: roomName, $options: "i" },
    });
    if (rooms.length === 0) {
      return res
        .status(404)
        .json({ message: "No rooms found with the specified name." });
    }
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Search rooms by Price
router.get("/searchByPrice", async (req, res) => {
  const price = req.query.price;

  if (!price) {
    return res
      .status(400)
      .json({ message: "Please provide a price for the search." });
  }

  try {
    const rooms = await Room.find({
      "RoomOptions.Price": price,
    });
    if (rooms.length === 0) {
      return res
        .status(404)
        .json({ message: "No rooms found with the specified price." });
    }
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Search rooms by RoomAmenities
router.get("/searchByRoomAmenities", async (req, res) => {
  const roomAmenities = req.query.roomAmenities;

  if (!roomAmenities) {
    return res
      .status(400)
      .json({ message: "Please provide room amenities for the search." });
  }

  try {
    const rooms = await Room.find({
      "RoomOptions.RoomAmenities": roomAmenities,
    });
    if (rooms.length === 0) {
      return res
        .status(404)
        .json({ message: "No rooms found with the specified amenities." });
    }
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Search rooms by BedType
router.get("/searchByBedType", async (req, res) => {
  const bedType = req.query.bedType;

  if (!bedType) {
    return res
      .status(400)
      .json({ message: "Please provide a bed type for the search." });
  }

  try {
    const rooms = await Room.find({
      "RoomOptions.BedType": bedType,
    });
    if (rooms.length === 0) {
      return res
        .status(404)
        .json({ message: "No rooms found with the specified bed type." });
    }
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
