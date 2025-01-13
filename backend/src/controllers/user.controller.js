const userService = require("../services/user.service");

const upgradeUser = async (req, res, next) => {
  const { id } = req.params;
  try {
    const { user } = req;
    await userService.upgradeUser(id, user);
    res.status(200).json({ message: "User upgraded successfully" });
  } catch (err) {
    next(err);
  }
};

const downgradeUser = async (req, res, next) => {
  const { id } = req.params;
  try {
    const { user } = req;
    await userService.downgradeUser(id, user);
    res.status(200).json({ message: "User downgraded successfully" });
  } catch (err) {
    next(err);
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

    const user = await userService.findUserById(id);

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    await userService.deleteUserById(id);

    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    next(err);
  }
};

const getUser = async (req, res, next) => {
  const { id } = req.params;

  try {
    const user = await userService.findUserById(id);
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({ user });
  } catch (err) {
    next(err);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const users = await userService.findAll();
    res.status(200).json({ users });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  upgradeUser,
  downgradeUser,
  deleteUser,
  getUser,
  getAllUsers,
};
