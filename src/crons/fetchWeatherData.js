require('dotenv').config({ path: '../../../.env'});
const axios = require("axios");
const {
  insertWeatherData,
} = require("../queries/weatherDataQueries");
const {
  insertNewBatchIfNotExists ,
  getOldestActiveBatches,
  isBatchRunning,
  deactivateBatch,
  updateBatchMetadata,
} = require("../queries/batchesQueries");
const batchQueue = require('./queues/batchQueue');
const delay = require('../utils/delay');

const WEATHER_DATA_URL = process.env.WEATHER_DATA_URL;
const MAX_RETRIES = process.env.MAX_RETRIES;
const RETRY_DELAY = process.env.RETRY_DELAY;
const CONCURRENCY_LIMIT = parseInt(process.env.CONCURRENCY_LIMIT, 10) || 5;

// Fetch data for a specific batch with pagination
const fetchWeatherData = async (batch_Id, forecast_time) => {
  let page = 1;
  let totalPages = 1;
  let allData = [];
  let retries = 0;

  while (page <= totalPages ) {
    try {
      const response = await axios.get(`${WEATHER_DATA_URL}/${batch_Id}?page=${page}`);
      totalPages = response.data.metadata.total_pages;
      const weatherData = response.data.data

      if (Array.isArray(weatherData) && weatherData.length > 0) {
        await insertWeatherData(batch_Id, forecast_time, weatherData);
        allData = [...allData, ...weatherData]; 
      } else {
        console.warn(`No data found for batch ${batch_Id}, page ${page}.`);
      }

      page++;
      retries = 0;
    } catch (error) {
      if (retries >= MAX_RETRIES) {
        console.error(`Max retries reached for batch ${batch_Id}, page ${page}.`, error.message);
        break;
      }
      retries++;
      await delay(RETRY_DELAY);
    }
  }
  return allData;
};

// Clean up old batches
const cleanUpOldBatches = async () => {
  try {
    const oldestBatches = await getOldestActiveBatches();
    await Promise.all(
      oldestBatches.map(async (batch) => {
        try {
          const {batch_id} = batch;
          await deactivateBatch(batch_id);
          console.log(`Batch ${batch_id} deactivated.`);
        } catch (err) {
          console.error(`Failed to deactivate batch ${batch.batch_id}:`, err.message);
        }
      })
    );
  } catch (error) {
    console.error("Error cleaning up old batches:", error.message);
  }
};

const fetchAndProcessWeatherData = async (batch) => {
  const { batch_id, forecast_time } = batch;
  try {
    const isBatchCurrentlyRunning  = await isBatchRunning(batch_id);

    if ( isBatchCurrentlyRunning ) {
      console.log(`Starting to fetch weather data for batch: ${batch_id} with forecast time: ${forecast_time}`);
      const weatherData = await fetchWeatherData(batch_id, forecast_time);
      const total_records = weatherData.length

      await updateBatchMetadata(batch_id, total_records);
      await cleanUpOldBatches();
      return;

    } else {
      console.log(`Batch ${batch_id} already Processed.`);
      return;
    }
    
  } catch (error) {
    console.error(`Error processing batch ${batch_id}:`, error.message);
  }
};

// Main function to ingest weather data for batches
const ingestWeatherData = async (batch) => {
  try {
    const { batch_id, forecast_time } = batch;

    await insertNewBatchIfNotExists (batch_id, forecast_time);
    await fetchAndProcessWeatherData(batch);

  } catch (error) {

    console.error("Ingestion process failed:", error.message);
  }
};

batchQueue.process(CONCURRENCY_LIMIT, async (job) => {
  const batch = job.data;

  try {
    await ingestWeatherData(batch);

  } catch (error) {
    const { batch_id } = batch.batch_id;
    console.error(`Error processing batch ${batch_id}`);
    throw error; 
  }
});

batchQueue.on('completed', (job) => {
  const { batch_id } = job.data;
  console.log(`Job for batch ID ${batch_id} completed Successfully!`);
});

batchQueue.on('failed', (err) => {
  console.error(`Job failed with error: ${err}`);
});
