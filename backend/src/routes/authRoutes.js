const express = require("express");
const { body } = require("express-validator");

const { authMiddleware } = require("../middleware/authMiddleware");
const { login, signup, logout } = require("../controllers/auth.controller");

const router = express.Router();

// Signup Route
router.post(
  "/signup",
  [
    body("firstName", "First name is required at least 3 characters")
      .notEmpty()
      .isLength({ min: 3 }),
    body("lastName", "Last name is required at least 3 characters")
      .notEmpty()
      .isLength({ min: 3 }),
    body("email", "A valid email is required").notEmpty().isEmail(),
    body(
      "password",
      "Password must be at least 6 characters long and include a number, an uppercase letter, a lowercase letter, and a special character"
    )
      .notEmpty()
      .isLength({ min: 6 })
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).+$/,
        "i"
      ),
    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
  ],
  signup
);

// Login Route
router.post(
  "/login",
  [
    body("email", "Please provide a valid email").notEmpty().isEmail(),
    body(
      "password",
      "Password must be at least 6 characters long and include a number, an uppercase letter, a lowercase letter, and a special character"
    )
      .notEmpty()
      .isLength({ min: 6 })
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).+$/,
        "i"
      ),
  ],
  login
);

router.post("/logout", authMiddleware, logout);

module.exports = router;
