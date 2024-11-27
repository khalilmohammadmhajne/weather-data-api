module.exports = {
    apps: [
      {
        name: "start",
        script: "npm run start",
        env: {
          SERVER_PORT: 8080,
          DB_HOST: "localhost",
          DB_USER: "root",
          DB_PASSWORD: "root",
          DB_NAME: "weather_data_db",
          DB_PORT: 3306,
          DB_CONNECTION_LIMIT: 5,
          REDIS_HOST: "localhost",
          REDIS_PORT: 6379,
          WEATHER_DATA_URL: "https://us-east1-climacell-platform-production.cloudfunctions.net/weather-data/batches",
          MAX_RETRIES: 3,
          RETRY_DELAY: 2000,
          CONCURRENCY_LIMIT: 5
        },
        watch: true
      },
      {
        name: "batchesCron",
        script: "npm run batchesCron",
        env: {
          SERVER_PORT: 8080,
          DB_HOST: "localhost",
          DB_USER: "root",
          DB_PASSWORD: "root",
          DB_NAME: "weather_data_db",
          DB_PORT: 3306,
          DB_CONNECTION_LIMIT: 5,
          REDIS_HOST: "localhost",
          REDIS_PORT: 6379,
          WEATHER_DATA_URL: "https://us-east1-climacell-platform-production.cloudfunctions.net/weather-data/batches",
          MAX_RETRIES: 3,
          RETRY_DELAY: 2000,
          CONCURRENCY_LIMIT: 5
        }
      },
      {
        name: "ingest",
        script: "npm run ingest",
        env: {
          SERVER_PORT: 8080,
          DB_HOST: "localhost",
          DB_USER: "root",
          DB_PASSWORD: "root",
          DB_NAME: "weather_data_db",
          DB_PORT: 3306,
          DB_CONNECTION_LIMIT: 5,
          REDIS_HOST: "localhost",
          REDIS_PORT: 6379,
          WEATHER_DATA_URL: "https://us-east1-climacell-platform-production.cloudfunctions.net/weather-data/batches",
          MAX_RETRIES: 3,
          RETRY_DELAY: 2000,
          CONCURRENCY_LIMIT: 5
        }
      }
    ]
  };
  