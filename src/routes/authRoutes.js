const express = require("express");
const { login, signup } = require("../controllers/authController");

const router = express.Router();

// Signup
router.post("/signup", signup);

// Login
router.post("/login", login);

module.exports = router;
