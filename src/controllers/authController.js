const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const User = require("../models/User");

// Signup Controller
const signup = async (req, res, next) => {
  // Validating the request body
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error("Validation Error");
    error.statusCode = 400;
    error.errors = errors.array();
    next(error);
    return;
  }

  // Extracting the required fields from the request body
  const { firstName, lastName, email, password } = req.body;
  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const error = new Error("User already exists");
      error.statusCode = 400;
      next(error);
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create a new user instance
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    // Save the user to the database
    await user.save();

    // Send the response
    res.status(201).json({
      message: "User created successfully",
      user,
    });
  } catch (error) {
    // Handle the error
    next(error);
  }
};

// Login Controller
const login = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error("Validation Error");
    error.statusCode = 400;
    error.errors = errors.array();
    next(error);
    return;
  }

  // Extracting the required fields from the request body
  const { email, password } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      next(error);
      return;
    }

    // Compare the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const error = new Error("Invalid password");
      error.statusCode = 401;
      next(error);
      return;
    }

    // Generate the JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Send the response
    res.status(200).json({
      message: "User logged in successfully",
      token,
    });
  } catch (error) {
    // Handle the error
    next(error);
  }
};

module.exports = { signup, login };
