const express = require("express");
const { login, signup } = require("../controllers/authController");
const { body } = require("express-validator");

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
    body("email", "A valid email is required").notEmpty().isLength({ min: 3 }),
    body("password", "Password is required at least 6 alphanumeric characters")
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
    body("email", "A valid email is required").isEmail().isLength({ min: 3 }),
    body("password", "Password is required at least 6 alphanumeric characters")
      .notEmpty()
      .isLength({ min: 6 })
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).+$/,
        "i"
      ),
  ],
  login
);

module.exports = router;
