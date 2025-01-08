const mongoose = require("mongoose");

// Create a schema for the User model
const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: {
      type: String,
      required: true,
      default: "User",
      enum: ["User", "Admin"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
