const mongoose = require("mongoose");

// Create a schema for the Option model
const optionSchema = new mongoose.Schema(
  {
    option: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Option", optionSchema);
