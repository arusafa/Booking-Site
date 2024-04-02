const express = require("express");
const Hotel = require("../models/Hotel_Model");
const { authenticateToken, isAdmin } = require("../middleware/authMiddleware");
const Room = require("../models/Room_Model");
const User = require("../models/User_Model");

const router = express.Router();

// Fetch all hotels - Open to all users
router.get("/all-hotels", async (req, res) => {
  try {
    const hotels = await Hotel.find();
    res.json(hotels);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new hotel - Requires authentication and admin role
router.post("/newHotel", async (req, res) => {
  try {
    const hotelData = req.body;
    const hotel = new Hotel(hotelData);
    // Save the hotel to the database
    const newHotel = await hotel.save();

    res.status(201).json(newHotel);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// POST route to post a review on a hotel
router.post("/:hotelId/reviews", async (req, res) => {
  try {
    const { userId, rating, reviewText } = req.body;
    const hotelId = req.params.hotelId;

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Check if the hotel exists
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found." });
    }

    // Create the review object
    const review = {
      userId: userId,
      rating: rating,
      reviewText: reviewText
    };

    // Add the review to the hotel's reviews
    hotel.HotelReviews.push(review);

    // Save the updated hotel
    await hotel.save();

    res.status(201).json({ message: "Review posted successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// search hotels by Name - Open to all users
router.get("/searchByName", async (req, res) => {
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
router.get("/searchByCountry", async (req, res) => {
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
router.get("/searchByCity", async (req, res) => {
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
router.get("/searchByProvince", async (req, res) => {
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

// Fetch a single hotel by ID - Open to signed-up users
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (hotel == null) {
      return res.status(404).json({ message: "Cannot find hotel" });
    }
    res.json(hotel);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// Update a hotel by ID - Requires authentication and admin role
router.patch("/:id", [authenticateToken, isAdmin], async (req, res) => {
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
    if (hotel == null) {
      return res.status(404).json({ message: "Cannot find hotel" });
    }

    await hotel.remove();
    res.json({ message: "Deleted Hotel" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
