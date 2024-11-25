require("dotenv").config();
const axios = require("axios");
const {
  insertWeatherData,
} = require("../queries/weatherDataQueries");
const {
  insertNewBatchIfNotExists ,
  getOldestActiveBatches,
  getRunningBatch,
  deactivateBatch,
  updateBatchMetadata,
} = require("../queries/batchesQueries");
const batchQueue = require('./batchQueue'); 

const weatherDataUrl = `https://us-east1-climacell-platform-production.cloudfunctions.net/weather-data/batches`;

// Fetch data for a specific batch with pagination
const fetchWeatherData = async (batch_Id, forecast_time, maxRetries = 5, retryDelay = 1000) => {
  let page = 1;
  let totalPages = 1;
  let allData = [];
  let retries = 0;

  while (page <= totalPages ) {
    try {
      const response = await axios.get(`${weatherDataUrl}/${batch_Id}?page=${page}`);
      totalPages = response.data.metadata.total_pages;
      const weatherData = response.data.data

      
      if (Array.isArray(weatherData) && weatherData.length > 0) {
        await insertWeatherData(batch_Id, forecast_time, weatherData);
        console.log(`Inserted data for batch ${batch_Id}, page ${page}.`);
        allData = [...allData, ...weatherData]; 
      } else {
        console.warn(`No data found for batch ${batch_Id}, page ${page}.`);
      }

      page++;
      retries = 0;
    } catch (error) {
      if (retries >= maxRetries) {
        console.error(`Max retries reached for batch ${batch_Id}, page ${page}.`, error.message);
        break;
      }
      retries++;
      await new Promise(resolve => setTimeout(resolve, retryDelay));
    }
  }
  return allData;
};


// Clean up old batches
const cleanUpOldBatches = async () => {
  try {
    const oldBatches = await getOldestActiveBatches();
    await Promise.all(
      oldBatches.map(async (batch) => {
        try {
          await deactivateBatch(batch.batch_id);
          console.log(`Batch ${batch.batch_id} deactivated.`);
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
    const runningBatch = await getRunningBatch(batch_id);

    if (runningBatch.length === 0) {
      console.log(`Batch ${batch_id} already Processed.`);
      return;
    }

    console.log(`Fetching weather data for batch: ${batch_id} with forecast time: ${forecast_time}`);
    const weatherData = await fetchWeatherData(batch_id, forecast_time);
    const total_records = weatherData.length
    console.log(`Fetched data for batch ${batch_id}, total records: ${total_records}`);

    await updateBatchMetadata(batch_id, total_records);
    await cleanUpOldBatches();
  } catch (error) {
    console.error(`Error processing batch ${batch_id}:`, error.message);
  }
};


// Main function to ingest weather data for batches
const ingestWeatherData = async (batch) => {
  try {
    const { batch_id, forecast_time } = batch;

    await insertNewBatchIfNotExists (batch_id, forecast_time);
    console.log(`Successfully processed batch ${batch_id}.`);

    await fetchAndProcessWeatherData(batch);
    console.log("Ingestion process completed successfully!");

  } catch (error) {
    console.error("Ingestion process failed:", error.message);
  }
};



// Process jobs in the queue
const CONCURRENCY_LIMIT = parseInt(process.env.CONCURRENCY_LIMIT, 10) || 5;
batchQueue.process(CONCURRENCY_LIMIT, async (job) => {
  const batch = job.data;

  try {
    await ingestWeatherData(batch);

  } catch (error) {
    console.error(`Error processing batch ${batch.batch_id}:`, error.message);
    throw error; 
  }
});

// Handle completion of jobs
batchQueue.on('completed', (job) => {
  const batch_Id = job.data.batch_id
  console.log(`Job for batch Id ${batch_Id} completed!`);
});

// Handle failed jobs
batchQueue.on('failed', (err) => {
  console.error(`Job failed with error: ${err}`);
});
