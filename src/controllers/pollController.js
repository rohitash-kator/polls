const { validationResult } = require("express-validator");

const Poll = require("../models/Poll");
const Question = require("../models/Question");
const Option = require("../models/Option");
const User = require("../models/User");
const PollSubmission = require("../models/pollSubmission");

// Create a Poll Controller
const createPoll = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error("Validation failed");
    error.statusCode = 422;
    error.errors = errors.array();
    return next(error);
  }

  const { role } = req.user;

  if (role !== "Admin") {
    const error = new Error("You are not allowed to create a poll");
    error.statusCode = 403;
    return next(error);
  }

  const { title, questions } = req.body;

  // Creating a new poll
  const poll = new Poll({
    title,
    createdBy: req.user,
  });

  try {
    // Saving the poll to the database
    for (const question of questions) {
      // Loop through the questions
      const newQuestion = new Question({
        question: question.question,
        poll: poll._id,
      });

      for (const option of question.options) {
        // Loop through the options
        const newOption = new Option({ option, question: newQuestion._id });

        // Save the option to the database
        await newOption.save();

        // Add the option to the question
        newQuestion.options.push(newOption);
      }

      // Save the question to the database
      await newQuestion.save();

      // Add the question to the poll
      poll.questions.push(newQuestion);
    }

    // Save the poll to the database
    await poll.save();

    res.status(201).json({ message: "Poll created successfully" });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
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

  try {
    const poll = await Poll.findById(id);

    // Check if the poll exists
    if (!poll) {
      const error = new Error("Poll not found");
      error.statusCode = 404;
      return next(error);
    }

    // Check if the poll is already closed
    if (!poll.isActive) {
      const error = new Error("Poll is already closed");
      error.statusCode = 400;
      return next(error);
    }

    // Close the poll
    poll.isActive = false;
    poll.closedAt = new Date();
    poll.closedBy = req.user;

    // Save the poll to the database
    await poll.save();

    res.status(200).json({ message: "Poll closed successfully" });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

// Get Active Polls Controller
const getActivePolls = async (req, res, next) => {
  try {
    const polls = await Poll.find({ isActive: true })
      .populate({ path: "questions", populate: { path: "options" } })
      .populate({ path: "createdBy", select: "name" })
      .populate({ path: "closedBy", select: "name" });

    console.log(polls);
    res.status(200).json({ polls });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

// Get All Polls Controller
const getAllPolls = async (req, res, next) => {
  try {
    const polls = await Poll.find()
      .populate()
      .populate({ path: "questions", populate: { path: "options" } })
      .populate({ path: "createdBy", select: "name" })
      .populate({ path: "closedBy", select: "name" });

    res.status(200).json({ polls });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
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

  try {
    const poll = await Poll.findById(id);

    // Check if the poll exists
    if (!poll) {
      const error = new Error("Poll not found");
      error.statusCode = 404;
      return next(error);
    }

    // Check if the poll is active
    if (!poll.isActive) {
      const error = new Error("Poll is closed");
      error.statusCode = 400;
      return next(error);
    }

    // Check if the user has already submitted the poll
    const user = req.user;

    const submittedPoll = await Poll.findOne({
      _id: id,
      "answers.user": user._id,
    });

    if (submittedPoll) {
      const error = new Error("You have already submitted the poll");
      error.statusCode = 400;
      return next(error);
    }

    // Check if the user has answered all the questions
    if (answers.length !== poll.questions.length) {
      const error = new Error("You must answer all the questions");
      error.statusCode = 400;
      return next(error);
    }

    // Save the poll submission
    const pollSubmission = new PollSubmission({
      pollId: poll,
      answers: answers.map((answer) => ({
        questionId: answer.questionId,
        optionId: answer.optionId,
      })),
      submittedAt: new Date(),
      userId: user,
    });

    await pollSubmission.save();

    res.status(200).json({ message: "Poll submitted successfully" });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

// Get Poll Result Controller
const getPollResult = async (req, res, next) => {
  const { id } = req.params;

  try {
    const poll = await Poll.findById(id)
      .populate({ path: "questions", populate: { path: "options" } })
      .populate({ path: "createdBy", select: "name" });

    if (!poll) {
      const error = new Error("Poll not found");
      error.statusCode = 404;
      return next(error);
    }

    const pollSubmissions = await PollSubmission.find({ pollId: id });

    const result = poll.questions.map((question) => {
      const questionResult = {
        question: question.question,
        options: getOptionsResult(question, pollSubmissions),
      };

      return questionResult;
    });

    res.status(200).json({ result });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

const getOptionsResult = (question, pollSubmissions) => {
  return question.options.map((option) => ({
    option: option.option,
    count: getOptionCount(option, question, pollSubmissions),
  }));
};

const getOptionCount = (option, question, pollSubmissions) => {
  return pollSubmissions.filter((submission) =>
    submission.answers.find(
      (answer) =>
        answer.questionId.toString() === question._id.toString() &&
        answer.optionId.toString() === option._id.toString()
    )
  ).length;
};

module.exports = {
  createPoll,
  closePoll,
  getActivePolls,
  getAllPolls,
  submitPoll,
  getPollResult,
};
