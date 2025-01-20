const { validationResult } = require("express-validator");

const pollService = require("../services/poll.service");

// Create a Poll Controller
const createPoll = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error("Validation failed");
    error.statusCode = 422;
    error.errors = errors.array();
    return next(error);
  }

  const { user } = req;
  const { title, questions, expiresAt } = req.body;

  try {
    const { pollId } = await pollService.createPoll(
      title,
      questions,
      expiresAt,
      user
    );

    res.status(201).json({ message: "Poll created successfully", pollId });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// Close a Poll Controller
const closePoll = async (req, res, next) => {
  const { role } = req.user;

  // Check if the user is an admin
  if (role !== "Admin") {
    const error = new Error("You are not allowed to close a poll");
    error.statusCode = 403;
    return next(error);
  }

  const { id } = req.params;
  const { user } = req;

  try {
    await pollService.closePoll(id, user);

    res.status(200).json({ message: "Poll closed successfully" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// Get Active Polls Controller
const getActivePolls = async (req, res, next) => {
  try {
    const polls = await pollService.getActivePolls();
    res.status(200).json({ polls });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// Get All Polls Controller
const getAllPolls = async (req, res, next) => {
  try {
    const { role } = req.user;

    // Check if the user is an admin
    if (role !== "Admin") {
      const error = new Error("You are not allowed to perform this operation");
      error.statusCode = 403;
      return next(error);
    }

    const polls = await pollService.getAllPolls();
    res.status(200).json({ polls });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// Get Poll by ID
const getPollById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const poll = await pollService.getPollById(id, {
      questions: 1,
      createdBy: 1,
      closedBy: 1,
    });

    // Check if the poll exists
    if (!poll) {
      const error = new Error("Poll not found");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({ poll });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// Submit a Poll Controller
const submitPoll = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error("Validation failed");
    error.statusCode = 422;
    error.errors = errors.array();
    return next(error);
  }

  const { id } = req.params;
  const { answers } = req.body;
  const { user } = req;

  try {
    await pollService.submitPoll(id, answers, user);

    res.status(200).json({ message: "Poll submitted successfully" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// Get Poll Result Controller
const getPollResult = async (req, res, next) => {
  const { id } = req.params;

  try {
    const result = await pollService.getPollResult(id);

    res.status(200).json({ result });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

module.exports = {
  createPoll,
  closePoll,
  getActivePolls,
  getAllPolls,
  getPollById,
  submitPoll,
  getPollResult,
};
