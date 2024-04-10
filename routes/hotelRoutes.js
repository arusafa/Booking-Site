const express = require("express");
const { authenticateToken, isAdmin } = require("../middleware/authMiddleware");
const router = express.Router();

const Hotel = require("../models/Hotel_Model");
const Room = require("../models/Room_Model");

// Create a new hotel
router.post("/newHotel", authenticateToken, isAdmin, async (req, res) => {
  const hotelData = req.body;
  try {
    const hotel = new Hotel(hotelData);
    const newHotel = await hotel.save();
    res.status(201).json(newHotel);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Fetch all hotels
router.get("/allHotels", async (req, res) => {
  try {
    const hotels = await Hotel.find();
    res.json(hotels);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a room to a hotel - Requires authentication and admin role
router.post(
  "/addRoom/:hotelId",
  authenticateToken,
  isAdmin,
  async (req, res) => {
    const { hotelId } = req.params;
    const roomData = req.body;

    try {
      const newRoom = await Room.create(roomData);
      const updatedHotel = await Hotel.findByIdAndUpdate(
        hotelId,
        { $push: { Rooms: newRoom._id } },
        { new: true, useFindAndModify: false }
      );

      if (!updatedHotel) {
        return res
          .status(404)
          .json({ message: "Hotel not found or failed to add room." });
      }

      res
        .status(201)
        .json({ message: "Room added successfully", updatedHotel });
    } catch (error) {
      console.error(error);
      res.status(400).json({ message: error.message });
    }
  }
);

// Retrieve rooms for a specific hotel
router.get("/hotel-rooms/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const hotelWithRooms = await Hotel.findById(id).populate("Rooms");
    if (!hotelWithRooms) {
      return res.status(404).json({ message: "Hotel not found." });
    }
    const rooms = hotelWithRooms.Rooms;
    res.json(rooms); // This will return the populated room details
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// search hotels by Name - Open to all users
router.get("/searchHotelByName", async (req, res) => {
  const name = req.query.name;

  if (!name) {
    return res
      .status(400)
      .json({ message: "Please provide a hotel name for the search." });
  }

  try {
    const hotels = await Hotel.find({
      HotelName: { $regex: name, $options: "i" },
    });
    if (hotels.length === 0) {
      return res
        .status(404)
        .json({ message: "No hotels found with the specified name." });
    }
    res.json(hotels);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// search hotels by Country - Open to all users
router.get("/searchHotelByCountry", async (req, res) => {
  const country = req.query.country;

  if (!country) {
    return res
      .status(400)
      .json({ message: "Please provide a country name for the search." });
  }

  try {
    const hotels = await Hotel.find({ "HotelAddress.Country": country });
    if (hotels.length === 0) {
      return res
        .status(404)
        .json({ message: "No hotels found in the specified country." });
    }
    res.json(hotels);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// search hotels by City - Open to all users
router.get("/searchHotelByCity", async (req, res) => {
  const city = req.query.city;

  if (!city) {
    return res
      .status(400)
      .json({ message: "Please provide a city name for the search." });
  }

  try {
    const hotels = await Hotel.find({ "HotelAddress.City": city });
    if (hotels.length === 0) {
      return res
        .status(404)
        .json({ message: "No hotels found in the specified city." });
    }
    res.json(hotels);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// search hotels by Province - Open to all users
router.get("/searchHotelByProvince", async (req, res) => {
  const province = req.query.province;

  if (!province) {
    return res
      .status(400)
      .json({ message: "Please provide a province name for the search." });
  }

  try {
    const hotels = await Hotel.find({ "HotelAddress.Province": province });
    if (hotels.length === 0) {
      return res
        .status(404)
        .json({ message: "No hotels found in the specified province." });
    }
    res.json(hotels);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a specific hotel by ID
router.get("/:hotelId", async (req, res) => {
  const { hotelId } = req.params;
  try {
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found." });
    }
    res.json(hotel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a hotel by ID - Requires authentication and admin role
router.put("/:id", [authenticateToken, isAdmin], async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (hotel == null) {
      return res.status(404).json({ message: "Cannot find hotel" });
    }

    // Update only fields that were actually passed...
    if (req.body.HotelName) hotel.HotelName = req.body.HotelName;
    if (req.body.HotelAddress) hotel.HotelAddress = req.body.HotelAddress;
    if (req.body.HotelRating) hotel.HotelRating = req.body.HotelRating;
    if (req.body.HotelAmenities) hotel.HotelAmenities = req.body.HotelAmenities;
    if (req.body.HotelDescription)
      hotel.HotelDescription = req.body.HotelDescription;
    if (req.body.HotelReviews) hotel.HotelReviews = req.body.HotelReviews;
    if (req.body.HotelDetails) hotel.HotelDetails = req.body.HotelDetails;

    const updatedHotel = await hotel.save();
    res.json(updatedHotel);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a hotel by ID - Requires authentication and admin role
router.delete("/:id", [authenticateToken, isAdmin], async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) {
      return res.status(404).json({ message: "Cannot find hotel" });
    }

    await hotel.deleteOne(); // Using deleteOne() method to delete the document
    res.json({ message: "Deleted Hotel" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Delete a room by ID AND by hotel ID - Requires authentication and admin role
router.delete(
  "/:hotelId/:roomId",
  [authenticateToken, isAdmin],
  async (req, res) => {
    try {
      const hotel = await Hotel.findById(req.params.hotelId);
      if (hotel == null) {
        return res.status(404).json({ message: "Cannot find hotel" });
      }

      const room = await Room.findById(req.params.roomId);
      if (room == null) {
        return res.status(404).json({ message: "Cannot find room" });
      }

      await room.remove();
      res.json({ message: "Deleted Room" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

module.exports = router;
