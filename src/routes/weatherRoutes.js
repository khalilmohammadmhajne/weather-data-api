const express = require("express");
const {
  getWeatherData,
  getSummarizedWeatherData,
} = require("../queries/weatherDataQueries");
const router = express.Router();
const { BadRequestError, NotFoundError } = require("../utils/errors");

// Route to handle the request to fetch weather data from the database
router.get("/data", async (req, res, next) => {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return next(new BadRequestError("Latitude and Longitude are required."));
  }

  try {
    const weatherData = await getWeatherData(lat, lon);

    if (weatherData?.length === 0) {
      return next(new NotFoundError("No weather data found for the specified location."));
    }

    res.status(200).json(weatherData);
  } catch (error) {
    console.error("Error fetching weather data");
    next(error);
  }
});

// Route to summarize weather data for a specific location
router.get("/summarize", async (req, res, next) => {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return next(new BadRequestError("Latitude and Longitude are required."));
  }

  try {
    const summarizedWeatherData = await getSummarizedWeatherData(lat, lon);

    if (summarizedWeatherData?.length === 0) {
      return next(new NotFoundError("No weather data found for the specified location."));
    }

    const summarizedData = summarizedWeatherData.map((row) => ({
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
    console.error("Error summarizing weather data");
    next(error);
  }
});

module.exports = router;
