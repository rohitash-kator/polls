const express = require("express");

const { authMiddleware } = require("../middleware/authMiddleware");
const {
  upgradeUser,
  downgradeUser,
  deleteUser,
  getUser,
  getUserById,
  getAllUsers,
} = require("../controllers/user.controller");

const router = express.Router();

// Upgrading the user role
router.post("/upgrade/:id", authMiddleware, upgradeUser);

// Downgrading the user role
router.post("/downgrade/:id", authMiddleware, downgradeUser);

// Getting the user from token
router.get("/currentUser", authMiddleware, getUser);

// Deleting the user
router.delete("/:id", authMiddleware, deleteUser);

// Getting user by ID
router.get("/:id", authMiddleware, getUserById);

// Getting all users
router.get("/", authMiddleware, getAllUsers);

module.exports = router;
