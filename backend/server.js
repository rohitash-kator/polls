const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");

dotenv.config();

const appRoute = require("./src/app");
const { errorHandler } = require("./src/middleware/errorHandler");

const app = express();

app.use(cors()); // Enable CORS
app.use(helmet()); // Add helmet for security headers
app.use(xss()); // Prevent XSS attacks
app.use(express.json());
app.use(morgan("combined"));

// Rate limiting to avoid abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests, please try again later.",
});
app.use(limiter);

// Home route
app.get("/", (req, res) => {
  res.send("Welcome to the API");
});

// main route
app.use("/api", appRoute);

// Centralized error handler
app.use(errorHandler);

mongoose
  .connect(process.env.DB_URI)
  .then((result) => {
    console.log("Connected to database successfully!!");

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error(`Failed to connect to database!!! Error: ${err}`);
  });
