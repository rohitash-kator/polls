const mongoose = require("mongoose");

// Create a schema for the Option model
const optionSchema = new mongoose.Schema(
  {
    option: String,
    votes: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Option", optionSchema);
