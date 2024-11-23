require("dotenv").config();
const express = require("express");
const weatherRoutes = require("./routes/weatherRoutes");
const batchesRoutes = require("./routes/batchesRoutes");

const app = express();

// Middleware
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("Weather Service API is running!");
});
app.use("/weather", weatherRoutes);
app.use("/batches", batchesRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
