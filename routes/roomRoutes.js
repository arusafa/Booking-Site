const express = require("express");
const Room = require("../models/Room_Model");
const Hotel = require("../models/Hotel_Model");
const { authenticateToken, isAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

// Create a new room (Unattached to any hotel)
router.post("/newRoom", authenticateToken, isAdmin, async (req, res) => {
  const roomData = req.body;
  try {
    const room = new Room(roomData);
    const newRoom = await room.save();
    res.status(201).json(newRoom);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Fetch all rooms
router.get("/allRooms", async (req, res) => {
  try {
    const rooms = await Room.find();
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Search rooms by RoomName
router.get("/searchRoomByName", async (req, res) => {
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
router.get("/searchRoomByPrice", async (req, res) => {
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
router.get("/searchRoomByAmenities", async (req, res) => {
  let query = {};
  Object.keys(req.query).forEach((key) => {
    // This will match keys like "roomAmenities.Wifi"
    if (key.startsWith("roomAmenities.")) {
      let amenity = key.split(".")[1]; // Get the actual amenity name
      query[`RoomOptions.RoomAmenities.${amenity}`] = req.query[key] === "true";
    }
  });

  try {
    const rooms = await Room.find(query); // Use the `query` object here
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
router.get("/searchRoomByBedType", async (req, res) => {
  let query = {};
  // Expected query parameters could be "SingleBed", "QueenBed", etc.
  Object.keys(req.query).forEach((key) => {
    // If the key matches one of the BedType schema keys and the value is "true"
    if (
      ["SingleBed", "TwinBed", "QueenBed", "KingBed"].includes(key) &&
      req.query[key] === "true"
    ) {
      query[`RoomOptions.BedType.${key}`] = true;
    }
  });

  // If no query was built, return an error
  if (Object.keys(query).length === 0) {
    return res.status(400).json({ message: "Invalid bed type provided." });
  }

  try {
    const rooms = await Room.find(query);
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

// Fetch a room by ID
router.get("/:roomId", async (req, res) => {
  const { roomId } = req.params;
  try {
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: "Room not found." });
    }
    res.json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Fetch a room by Hotel ID
router.get("/byHotel/:id", async (req, res) => {
  const { hotelId } = req.params;
  try {
    const rooms = await Room.find({ HotelId: hotelId });
    if (rooms.length === 0) {
      return res.status(404).json({ message: "No rooms found for this hotel." });
    }
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a room by ID
router.patch("/:id", authenticateToken, isAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const room = await Room.findById(id);
    if (!room) {
      return res.status(404).json({ message: "Room not found." });
    }

    // Update only fields that were actually passed...
    if (req.body.RoomOptions) room.RoomOptions = req.body.RoomOptions;
    if (req.body.RoomAmenities) room.RoomAmenities = req.body.RoomAmenities;
    if (req.body.RoomDescription)
      room.RoomDescription = req.body.RoomDescription;

    const updatedRoom = await room.save();
    res.json(updatedRoom);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a room by ID
router.delete("/:id", authenticateToken, isAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const room = await Room.findById(id);
    if (!room) {
      return res.status(404).json({ message: "Room not found." });
    }

    await room.remove();
    res.json({ message: "Deleted Room" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
