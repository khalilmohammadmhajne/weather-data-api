require('dotenv').config();
const express = require("express");
const weatherRoutes = require("./routes/weatherRoutes");
const batchesRoutes = require("./routes/batchesRoutes");
const { CustomError } = require('./utils/errors');

const app = express();
app.use(express.json());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("Weather Service API is running!");
});

app.use("/weather", weatherRoutes);
app.use("/batches", batchesRoutes);

//error handling middleware
app.use((err, req, res, next) => {

  const errorMessage = err instanceof CustomError ? err.message : "Internal Server Error";
  const statusCode = err instanceof CustomError ? err.status : 500;

  res.status(statusCode).json({ message: errorMessage });
});

module.exports = app;