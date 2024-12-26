const express = require("express");

const { authMiddleware } = require("../middleware/authMiddleware");
const { upgradeUser } = require("../controllers/userController");

const router = express.Router();

// Upgrading the user role
router.post("/upgrade/:id", authMiddleware, upgradeUser);

module.exports = router;
