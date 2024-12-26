const Poll = require("../models/Poll");
const PollSchema = require("../models/Poll");
const Question = require("../models/Question");
const Option = require("../models/Option");
const User = require("../models/User");

// Create a Poll Controller
const createPoll = async (req, res, next) => {
  res.status(201).json({ message: "Poll creation successful" });
};

// Close a Poll Controller
const closePoll = async (req, res, next) => {
  res.status(200).json({ message: "Poll closing successful" });
};

// Get Active Polls Controller
const getActivePolls = async (req, res, next) => {
  res.status(200).json({ message: "Getting active polls successful" });
};

// Get All Polls Controller
const getAllPolls = async (req, res, next) => {
  res.status(200).json({ message: "Getting all polls successful" });
};

// Submit a Poll Controller
const submitPoll = async (req, res, next) => {
  res.status(200).json({ message: "Poll submission successful" });
};

// Get Poll Result Controller
const getPollResult = async (req, res, next) => {
  res.status(200).json({ message: "Getting poll result successful" });
};

module.exports = {
  createPoll,
  closePoll,
  getActivePolls,
  getAllPolls,
  submitPoll,
  getPollResult,
};
