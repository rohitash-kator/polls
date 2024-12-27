const express = require("express");

const { authMiddleware } = require("../middleware/authMiddleware");
const {
  upgradeUser,
  downgradeUser,
  deleteUser,
  getUser,
  getAllUsers,
} = require("../controllers/userController");

const router = express.Router();

// Upgrading the user role
router.post("/upgrade/:id", authMiddleware, upgradeUser);

// Downgrading the user role
router.post("/downgrade/:id", authMiddleware, downgradeUser);

// Deleting the user
router.delete("/:id", authMiddleware, deleteUser);

// Getting the user
router.get("/:id", authMiddleware, getUser);

// Getting all users
router.get("/", authMiddleware, getAllUsers);

module.exports = router;
