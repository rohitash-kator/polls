const User = require("../models/User");

const upgradeUser = async (req, res, next) => {
  const { id } = req.params;
  try {
    const role = req.user.role;

    if (role !== "Admin") {
      const error = new Error("You are not authorized to perform this action");
      error.statusCode = 403;
      next(error);
      return;
    }

    const user = await User.findById(id);
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      next(error);
      return;
    }

    user.role = "Admin";
    await user.save();

    res.status(200).json({ message: "User upgraded successfully" });
  } catch (error) {
    next(error);
  }
};

const downgradeUser = async (req, res, next) => {
  const { id } = req.params;

  try {
    const role = req.user.role;

    if (id === req.user.id) {
      const error = new Error("You cannot downgrade yourself");
      error.statusCode = 403;
      next(error);
      return;
    }

    if (role !== "Admin") {
      const error = new Error("You are not authorized to perform this action");
      error.statusCode = 403;
      next(error);
      return;
    }

    const user = await User.findById(id);
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      next(error);
      return;
    }

    user.role = "User";
    await user.save();

    res.status(200).json({ message: "User downgraded successfully" });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  const { id } = req.params;

  try {
    const role = req.user.role;

    if (id !== req.user.id && role !== "Admin") {
      const error = new Error("You are not authorized to perform this action");
      error.statusCode = 403;
      next(error);
      return;
    }

    const user = await User.findById(id);

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      next(error);
      return;
    }

    await user.remove();

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};

const getUser = async (req, res, next) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id).select("-password");

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      next(error);
      return;
    }

    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password -email");
    res.status(200).json({ users });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  upgradeUser,
  downgradeUser,
  deleteUser,
  getUser,
  getAllUsers,
};
