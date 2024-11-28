const { execQuery, simpleQuery } = require("../db/queryExecutor");

// Function to insert weather data into the database
exports.insertWeatherData = async function (batchId, forecast_time, batchData) {
  const query =
    "INSERT IGNORE INTO weather_data (latitude, longitude, temperature, humidity, precipitation_rate, forecast_time, batch_id) VALUES ?";
  const bindings = batchData.map((item) => [
    item.latitude,
    item.longitude,
    item.temperature,
    item.humidity,
    item.precipitation_rate,
    new Date(forecast_time),
    batchId,
  ]);

  try {
    return await execQuery(query, [bindings]);
  } catch (err) {
    console.error("Error inserting weather data:", err.message);
    throw err;
  }
};

// Fetching weather data from the database by lat and long
exports.getWeatherData = async function (latitude, longitude) {
  const query =
    "SELECT forecast_time, temperature, precipitation_rate, humidity FROM weather_data WHERE latitude = ? AND longitude = ?";
  const bindings = [latitude, longitude];
  try {
    return await simpleQuery(query, bindings);
  } catch (err) {
    console.error("Error fetching weather data:", err);
  }
};

// Fetching weather data from the database by lat and long
exports.getSummarizedWeatherData = async function (latitude, longitude) {
  const query = `SELECT 
                    MAX(temperature) AS max_temperature,
                    MIN(temperature) AS min_temperature,
                    AVG(temperature) AS avg_temperature,
                    MAX(precipitation_rate) AS max_precipitation_rate,
                    MIN(precipitation_rate) AS min_precipitation_rate,
                    AVG(precipitation_rate) AS avg_precipitation_rate,
                    MAX(humidity) AS max_humidity,
                    MIN(humidity) AS min_humidity,
                    AVG(humidity) AS avg_humidity
                FROM weather_data
                WHERE latitude = ? AND longitude = ?
                ORDER BY day DESC;
                `;
  const bindings = [latitude, longitude];

  try {
    return await simpleQuery(query, bindings);
  } catch (err) {
    console.error("Error fetching weather data:", err);
  }
};
