const express = require("express");

const authRoutes = require("./routes/authRoutes");
const pollRoutes = require("./routes/pollRoutes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/polls", pollRoutes);

module.exports = router;
