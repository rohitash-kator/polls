const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const userService = require("../services/user.service");
const Blacklist = require("../models/Blacklist");

// Signup Controller
const signup = async (firstName, lastName, email, password) => {
  try {
    // Check if the user already exists
    const existingUser = await userService.findUserByEmail(email);
    if (existingUser) {
      const error = new Error("User already exists");
      error.statusCode = 400;
      throw error;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create a new user instance
    const user = await userService.createUser(
      firstName,
      lastName,
      email,
      hashedPassword
    );

    // Generate the JWT token
    const token = jwt.sign(
      { id: user._id.toString() },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRY }
    );

    // Send the response
    return token;
  } catch (err) {
    // Handle the error
    const error = new Error(err.message);
    error.statusCode = err.statusCode || 500;
    throw error;
  }
};

// Login Controller
const login = async (email, password) => {
  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    // Compare the password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      const error = new Error("Invalid password");
      error.statusCode = 401;
      throw error;
    }

    // Generate the JWT token
    const token = jwt.sign(
      { id: user._id.toString() },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRY }
    );

    return token;
  } catch (err) {
    // Handle the error
    const error = new Error(err.message);
    error.statusCode = err.statusCode || 500;
    throw error;
  }
};

const logout = async (token) => {
  try {
    if (!token) {
      const error = new Error("Please provide a valid token");
      error.statusCode = 400;
      throw error;
    }

    const blacklistedToken = new Blacklist({ token });
    await blacklistedToken.save();
  } catch (err) {
    // Handle the error
    const error = new Error(err.message);
    error.statusCode = err.statusCode || 500;
    throw error;
  }
};

module.exports = { signup, login, logout };
