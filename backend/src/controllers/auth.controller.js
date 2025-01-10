const { validationResult } = require("express-validator");
const authService = require("../services/auth.service");

// Signup Controller
const signup = async (req, res, next) => {
  // Validating the request body
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error("Validation Error");
    error.statusCode = 400;
    error.errors = errors.array();
    return next(error);
  }

  // Extracting the required fields from the request body
  const { firstName, lastName, email, password } = req.body;
  try {
    const token = await authService.signup(
      firstName,
      lastName,
      email,
      password
    );

    // Send the response
    res.status(200).json({
      message: "User created successfully",
      token,
    });
  } catch (err) {
    // Handle the error
    next(err);
  }
};

// Login Controller
const login = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error("Validation Error");
    error.statusCode = 400;
    error.errors = errors.array();
    return next(error);
  }

  // Extracting the required fields from the request body
  const { email, password } = req.body;

  try {
    const token = await authService.login(email, password);

    // Send the response
    res.status(200).json({
      message: "User logged in successfully",
      token,
    });
  } catch (err) {
    // Handle the error
    next(err);
  }
};

const logout = async (req, res, next) => {
  try {
    const { token } = req;
    await authService.logout(token);

    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    next(err);
  }
};

module.exports = { signup, login, logout };
