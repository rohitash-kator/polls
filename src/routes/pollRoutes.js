const express = require("express");

const { authMiddleware } = require("../middleware/authMiddleware");
const {
  createPoll,
  closePoll,
  getActivePolls,
  getAllPolls,
  submitPoll,
  getPollResult,
} = require("../controllers/pollController");

const router = express.Router();

// Create Poll
router.post("/", authMiddleware, createPoll);

// Close Poll
router.post("/:id", authMiddleware, closePoll);

// Get Active Polls
router.get("/active", authMiddleware, getActivePolls);

// Get All Polls
router.get("/", authMiddleware, getAllPolls);

// Submit a Poll
router.post("/:id", authMiddleware, submitPoll);

// Poll Result
router.get("/:id/result", authMiddleware, getPollResult);

module.exports = router;
