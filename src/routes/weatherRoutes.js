const express = require("express");
const {
  getWeatherData,
  getSummarizedWeatherData,
} = require("../queries/weatherDataQueries");
const router = express.Router();

// Route to handle the request to fetch weather data from the database
router.get("/data", async (req, res) => {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res
      .status(400)
      .json({ message: "Latitude and Longitude are required." });
  }

  try {
    const weatherData = await getWeatherData(lat, lon);

    if (weatherData?.length === 0) {
      return res
        .status(404)
        .json({ message: "No weather data found for the specified location." });
    }
    res.status(200).json(weatherData);
  } catch (error) {
    console.error("Error fetching and inserting weather data:", error.message);
    res
      .status(500)
      .json({ message: "Failed to fetch and insert weather data." });
  }
});

// Route to summarize weather data for a specific location
router.get("/summarize", async (req, res) => {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res
      .status(400)
      .json({ message: "Latitude and Longitude are required." });
  }

  try {
    const summerizedWeatherData = await getSummarizedWeatherData(lat, lon);

    if (summerizedWeatherData?.length === 0) {
      return res
        .status(404)
        .json({ message: "No weather data found for the specified location." });
    }

    const summarizedData = summerizedWeatherData.map((row) => ({
      max: {
        Temperature: row.max_temperature,
        Precipitation_rate: row.max_precipitation_rate,
        Humidity: row.max_humidity,
      },
      min: {
        Temperature: row.min_temperature,
        Precipitation_rate: row.min_precipitation_rate,
        Humidity: row.min_humidity,
      },
      avg: {
        Temperature: row.avg_temperature,
        Precipitation_rate: row.avg_precipitation_rate,
        Humidity: row.avg_humidity,
      },
    }));

    res.status(200).json(summarizedData);
  } catch (error) {
    console.error("Error summarizing weather data:", error.message);
    res.status(500).json({ message: "Failed to summarize weather data." });
  }
});

module.exports = router;
