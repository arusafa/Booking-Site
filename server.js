require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/userRoutes");
const hotelRoutes = require("./routes/hotelRoutes");
const roomRoutes = require("./routes/roomRoutes");

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to DB"))
  .catch((error) => console.error("DB Connection Error:", error));

// Register routes
app.use("/auth", authRoutes);
app.use("/admin", userRoutes);
app.use("/admin/hotel", hotelRoutes);
app.use("/admin/room", roomRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
