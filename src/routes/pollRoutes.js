const express = require("express");
const { body } = require("express-validator");

const Question = require("../models/Question");
const Option = require("../models/Option");
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
router.post(
  "/",
  authMiddleware,
  [
    body("title", "Poll title must be at lest 3 characters long")
      .notEmpty()
      .isString()
      .isLength({ min: 3 }),
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

// Submit a Poll
router.post(
  "/:id/submit",
  authMiddleware,
  [
    body("answers", "Answers must be an array of objects")
      .isArray({ min: 1 })
      .custom(async (answers, { req }) => {
        for (const answer of answers) {
          const { questionId, optionId } = answer;
          if (!questionId || !optionId) {
            return Promise.reject(
              "Answers must have a questionId and an optionId"
            );
          }

          if (typeof questionId !== "string") {
            return Promise.reject("QuestionId must be a string");
          }

          if (typeof optionId !== "string") {
            return Promise.reject("OptionId must be a string");
          }

          const question = await Question.findById(questionId);
          if (!question) {
            return Promise.reject("Invalid question");
          }

          const option = await Option.findById(optionId);
          if (!option) {
            return Promise.reject("Invalid option");
          }
        }
      }),
  ],
  submitPoll
);

// Poll Result
router.get("/:id/result", authMiddleware, getPollResult);

module.exports = router;
