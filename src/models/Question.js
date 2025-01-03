const mongoose = require("mongoose");

// Create a schema for the Question model
const questionSchema = new mongoose.Schema(
  {
    question: String,
    options: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Option",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Question", questionSchema);
