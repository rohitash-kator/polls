const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");

dotenv.config();

const appRoute = require("./src/app");
const { errorHandler } = require("./src/controllers/errorHandler");

const app = express();

app.use(express.json());

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
