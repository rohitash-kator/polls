const express = require("express");
const mongoose = require("mongoose");

const appRoute = require("./src/app");

const app = express();

app.use(express.json());

// main route
app.use("/api", appRoute);

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
    console.error(`Failed to connect to database!!! Error: ${err.message}`);
  });
