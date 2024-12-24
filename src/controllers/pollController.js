const Poll = require("../models/Poll");
const PollSchema = require("../models/Poll");
const Question = require("../models/Question");
const Option = require("../models/Option");
const User = require("../models/User");

// const ErrorResponse = require('../utils/errorResponse');

// Create a Poll Controller
const createPoll = async (req, res, next) => {};

// Close a Poll Controller
const closePoll = async (req, res, next) => {};

// Get Active Polls Controller
const getActivePolls = async (req, res, next) => {};

// Get All Polls Controller
const getAllPolls = async (req, res, next) => {};

// Submit a Poll Controller
const submitPoll = async (req, res, next) => {};

// Get Poll Result Controller
const getPollResult = async (req, res, next) => {};

module.exports = {
  createPoll,
  closePoll,
  getActivePolls,
  getAllPolls,
  submitPoll,
  getPollResult,
};
