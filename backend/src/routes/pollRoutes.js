const express = require("express");
const mongoose = require("mongoose");
const { body } = require("express-validator");

const Question = require("../models/Question");
const { authMiddleware } = require("../middleware/authMiddleware");
const {
  createPoll,
  closePoll,
  getActivePolls,
  getAllPolls,
  submitPoll,
  getPollResult,
  getPollById,
} = require("../controllers/poll.controller");

const router = express.Router();

// Create Poll
router.post(
  "/",
  authMiddleware,
  [
    body("title", "Poll title must be at lest 3 characters long")
      .notEmpty()
      .isString()
      .isLength({ min: 3 }),
    body(
      "expiresAt",
      "Please provide a valid date in MM-DD-YYYY, MM/DD/YYYY, or MM.DD.YYYY format."
    )
      .notEmpty()
      .isDate({
        format: "MM-DD-YYYY",
        strictMode: true,
        delimiters: ["-", "/", "."], // Allow multiple delimiters: '-', '/', and '.'
      })
      .custom((expiresAt, { req }) => {
        if (new Date(expiresAt) <= new Date()) {
          throw new Error("Poll expiry date must be in future");
        }
        return true;
      }),
    body("questions", "Poll must have at least one question")
      .isArray({ min: 1 })
      .custom((questions, { req }) => {
        for (const question of questions) {
          if (!question.question || question.options.length < 2) {
            throw new Error(
              "Question must have a question text and at least two options"
            );
          }
        }
        return true;
      }),
  ],
  createPoll
);

// Close Poll
router.post("/:id/close", authMiddleware, closePoll);

// Get Active Polls
router.get("/active", authMiddleware, getActivePolls);

// Get All Polls
router.get("/", authMiddleware, getAllPolls);

// Get All Polls
router.get("/:id", authMiddleware, getPollById);

// Submit a Poll
router.post(
  "/:id/submit",
  authMiddleware,
  [
    body("answers", "Answers must be an array of objects").custom(
      async (answers, { req }) => {
        for (const answer of answers) {
          const { questionId, optionId } = answer;
          if (
            !mongoose.Types.ObjectId.isValid(questionId) ||
            !mongoose.Types.ObjectId.isValid(optionId)
          ) {
            return Promise.reject("Invalid questionId or optionId");
          }

          const question = await Question.findById(questionId).populate(
            "options"
          );
          if (!question) {
            return Promise.reject("Invalid question");
          }

          const option = question.options.find(
            (option) => option._id.toString() === optionId
          );
          if (!option) {
            return Promise.reject("Invalid option");
          }
        }
      }
    ),
  ],
  submitPoll
);

// Poll Result
router.get("/:id/result", authMiddleware, getPollResult);

module.exports = router;
