const mongoose = require("mongoose");

// Create a schema for the Poll model
const pollSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    totalSubmissions: { type: Number, default: 0 },
    questions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
      },
    ],
    isActive: { type: Boolean, default: true },
    closedAt: { type: Date },
    expiresAt: { type: Date },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    closedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Poll", pollSchema);
