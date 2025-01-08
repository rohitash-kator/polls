const express = require("express");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const pollRoutes = require("./routes/pollRoutes");

const router = express.Router();

// Routes
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/polls", pollRoutes);

module.exports = router;
