const mongoose = require("mongoose");

// Create a schema for the PollSubmission model
const pollSubmissionSchema = new mongoose.Schema({
  pollId: { type: mongoose.Schema.Types.ObjectId, ref: "Poll", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  answers: [
    {
      questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Poll.questions",
      },
      optionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Poll.questions.options",
      },
    },
  ],
  submittedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("PollSubmission", pollSubmissionSchema);
