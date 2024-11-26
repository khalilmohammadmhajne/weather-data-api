require('dotenv').config();
const express = require("express");
const weatherRoutes = require("./routes/weatherRoutes");
const batchesRoutes = require("./routes/batchesRoutes");

const SERVER_PORT = process.env.SERVER_PORT || 8080;

const app = express();

// Middleware to parse incoming JSON requests
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("Weather Service API is running!");
});

app.use("/weather", weatherRoutes);
app.use("/batches", batchesRoutes);

//error handling middleware
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ message: err.message || "Internal Server Error" });
});

// Start the server
app.listen(SERVER_PORT, () => {
  console.log(`Server is running on http://localhost:${SERVER_PORT}`);
});
