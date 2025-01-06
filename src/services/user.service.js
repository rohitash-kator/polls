const User = require("../models/User");
const { isEncrypted } = require("../utils/checkEncryption");

const createUser = async (firstName, lastName, email, password) => {
  try {
    if (!isEncrypted(password)) {
      const error = new Error("Password must be encrypted before saving");
      error.statusCode = 400;
      throw error;
    }

    const user = new User({
      firstName,
      lastName,
      email,
      password,
    });

    // Save the user to the database
    await user.save();

    return user;
  } catch (err) {
    // Handle the error
    const error = new Error(err.message);
    error.statusCode = err.statusCode || 500;
    throw error;
  }
};

const findUserByEmail = async (email) => {
  try {
    const user = await User.findOne({ email }).select("-password");
    return user;
  } catch (err) {
    // Handle the error
    const error = new Error(err.message);
    error.statusCode = err.statusCode || 500;
    throw error;
  }
};

const findUserById = async (id) => {
  try {
    const user = await User.findById(id).select("-password");
    return user;
  } catch (err) {
    // Handle the error
    const error = new Error(err.message);
    error.statusCode = err.statusCode || 500;
    throw error;
  }
};

const deleteUserById = async (id) => {
  try {
    await User.findOneAndDelete(id);
  } catch (err) {
    // Handle the error
    const error = new Error(err.message);
    error.statusCode = err.statusCode || 500;
    throw error;
  }
};

const upgradeUser = async (userId, currentUser) => {
  try {
    const { role } = currentUser;

    if (role !== "Admin") {
      const error = new Error("You are not authorized to perform this action");
      error.statusCode = 403;
      throw error;
    }

    const user = await findUserById(userId);
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    user.role = "Admin";
    await user.save();
  } catch (err) {
    // Handle the error
    const error = new Error(err.message);
    error.statusCode = err.statusCode || 500;
    throw error;
  }
};

const downgradeUser = async (userId, currentUser) => {
  try {
    const { role } = currentUser;

    if (userId === currentUser._id.toString()) {
      const error = new Error("You cannot downgrade yourself");
      error.statusCode = 403;
      throw error;
    }

    if (role !== "Admin") {
      const error = new Error("You are not authorized to perform this action");
      error.statusCode = 403;
      throw error;
    }

    const user = await findUserById(userId);
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    user.role = "User";
    await user.save();
  } catch (err) {
    // Handle the error
    const error = new Error(err.message);
    error.statusCode = err.statusCode || 500;
    throw error;
  }
};

const findAll = async () => {
  try {
    const users = await User.find().select("-password");

    return users;
  } catch (err) {
    // Handle the error
    const error = new Error(err.message);
    error.statusCode = err.statusCode || 500;
    throw error;
  }
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  findAll,
  deleteUserById,
  upgradeUser,
  downgradeUser,
};
