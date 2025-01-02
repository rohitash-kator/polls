const { validationResult } = require("express-validator");

const Poll = require("../models/Poll");
const Question = require("../models/Question");
const Option = require("../models/Option");
const PollSubmission = require("../models/PollSubmission");

// Create a Poll Controller
const createPoll = async (title, questions, currentUser) => {
  try {
    const { role } = currentUser;

    if (role !== "Admin") {
      const error = new Error("You are not allowed to create a poll");
      error.statusCode = 403;
      return next(error);
    }

    // Creating a new poll
    const poll = new Poll({
      title,
      createdBy: currentUser,
    });

    // Saving the poll to the database
    for (const question of questions) {
      // Loop through the questions
      const newQuestion = new Question({
        question: question.question,
      });

      for (const option of question.options) {
        // Loop through the options
        const newOption = new Option({ option });

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
  } catch (err) {
    // Handle the error
    const error = new Error(err.message);
    error.statusCode = err.statusCode || 500;
    throw err;
  }
};

// Get a Poll by ID
const getPollById = async (id) => {
  try {
    const poll = await Poll.findById(id)
      .populate({ path: "questions", populate: { path: "options" } })
      .populate({ path: "createdBy", select: "firstName lastName" })
      .populate({ path: "closedBy", select: "firstName lastName" });

    return poll;
  } catch (err) {
    // Handle the error
    const error = new Error(err.message);
    error.statusCode = err.statusCode || 500;
    throw err;
  }
};

// Close a Poll Controller
const closePoll = async (pollId, currentUser) => {
  try {
    const poll = await getPollById(pollId);

    // Check if the poll exists
    if (!poll) {
      const error = new Error("Poll not found");
      error.statusCode = 404;
      throw error;
    }

    // Check if the poll is already closed
    if (!poll.isActive) {
      const error = new Error("Poll is already closed");
      error.statusCode = 400;
      throw error;
    }

    // Close the poll
    poll.isActive = false;
    poll.closedAt = new Date();
    poll.closedBy = currentUser;

    // Save the poll to the database
    await poll.save();
  } catch (err) {
    // Handle the error
    const error = new Error(err.message);
    error.statusCode = err.statusCode || 500;
    throw err;
  }
};

// Get Active Polls Controller
const getActivePolls = async () => {
  try {
    const polls = await Poll.find({ isActive: true })
      .populate({ path: "questions", populate: { path: "options" } })
      .populate({ path: "createdBy", select: "firstName lastName" })
      .populate({ path: "closedBy", select: "firstName lastName" });

    return polls;
  } catch (err) {
    // Handle the error
    const error = new Error(err.message);
    error.statusCode = err.statusCode || 500;
    throw err;
  }
};

// Get All Polls Controller
const getAllPolls = async () => {
  try {
    const polls = await Poll.find()
      .populate({ path: "questions", populate: { path: "options" } })
      .populate({ path: "createdBy", select: "firstName lastName" })
      .populate({ path: "closedBy", select: "firstName lastName" });

    return polls;
  } catch (err) {
    // Handle the error
    const error = new Error(err.message);
    error.statusCode = err.statusCode || 500;
    throw err;
  }
};

// Submit a Poll Controller
const submitPoll = async (pollId, answers, currentUser) => {
  try {
    const poll = await getPollById(pollId);

    // Check if the poll exists
    if (!poll) {
      const error = new Error("Poll not found");
      error.statusCode = 404;
      throw error;
    }

    // Check if the poll is active
    if (!poll.isActive) {
      const error = new Error("Poll is closed");
      error.statusCode = 400;
      throw error;
    }

    const submittedPoll = await PollSubmission.findOne({
      pollId,
      userId: currentUser._id,
    });

    if (submittedPoll) {
      const error = new Error("You have already submitted the poll");
      error.statusCode = 400;
      throw error;
    }

    // Check if the user has answered all the questions
    if (answers.length !== poll.questions.length) {
      const error = new Error("You must answer all the questions");
      error.statusCode = 400;
      throw error;
    }

    // Save the poll submission
    const pollSubmission = new PollSubmission({
      pollId: poll,
      answers: answers.map((answer) => ({
        questionId: answer.questionId,
        optionId: answer.optionId,
      })),
      submittedAt: new Date(),
      userId: currentUser,
    });

    await pollSubmission.save();
  } catch (err) {
    // Handle the error
    const error = new Error(err.message);
    error.statusCode = err.statusCode || 500;
    throw err;
  }
};

// Get Poll Result Controller
const getPollResult = async (pollId) => {
  try {
    const poll = await getPollById(pollId);

    if (!poll) {
      const error = new Error("Poll not found");
      error.statusCode = 404;
      throw error;
    }

    const pollSubmissions = await PollSubmission.find({ pollId });

    const result = poll.questions.map((question) => {
      const questionResult = {
        question: question.question,
        options: getOptionsResult(question, pollSubmissions),
      };

      return questionResult;
    });

    return result;
  } catch (err) {
    // Handle the error
    const error = new Error(err.message);
    error.statusCode = err.statusCode || 500;
    throw err;
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
