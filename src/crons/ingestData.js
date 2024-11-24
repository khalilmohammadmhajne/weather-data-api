require("dotenv").config();
const axios = require("axios");
const {
  getBatch,
  insertIntoBatches,
  getOldestActiveBatches,
  getRunningBatch,
  deactivateBatch,
  updateEndIngestTime,
} = require("../queries/batchesQueries");
const {
  insertWeatherData,
} = require("../queries/weatherDataQueries");

const weatherDataUrl = process.env.BATCHES_WEATHER_DATA_URL;

// Fetch the list of batches
const fetchBatches = async () => {
  try {
    const response = await axios.get(`${weatherDataUrl}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching batches:", error.message);
  }
};

// Fetch data for a specific batch with pagination
const fetchWeatherData = async (batchId, forecast_time, maxRetries = 5, retryDelay = 1000) => {
  let page = 1;
  let totalPages = 1;
  let allData = [];
  let retries = 0;

  while (page <= totalPages  ) {
    try {
      const response = await axios.get(`${weatherDataUrl}/${batchId}?page=${page}`);
      totalPages = response.data.metadata.total_pages;
      const weatherData = response.data.data

      
      if (Array.isArray(weatherData) && weatherData.length > 0) {
        await insertWeatherData(batchId, forecast_time, weatherData);
        console.log(`Inserted data for batch ${batchId}, page ${page}.`);
        allData = [...allData, ...weatherData]; 
      } else {
        console.warn(`No data found for batch ${batchId}, page ${page}.`);
      }

      page++;
      retries = 0;
    } catch (error) {
      if (retries >= maxRetries) {
        console.error(`Max retries reached for batch ${batchId}, page ${page}.`, error.message);
        break;
      }
      retries++;
      await new Promise(resolve => setTimeout(resolve, retryDelay));
    }
  }
  return allData;
};

// Store the batch data in the database
const storeBatch = async (batchId, forecast_time) => {
  try {
    const existingBatch = await getBatch(batchId);

    if (existingBatch.length == 0) {
      await insertIntoBatches(batchId, forecast_time);
      console.log(`Successfully stored batch ${batchId}.`);
    } else {
      console.log(`Batch ${batchId} already exists. Skipping insert.`);
    }

  } catch (error) {
    console.error(
      `Error storing batch data for batch ${batchId}:`,
      error.message,
    );
  }
};

// Clean up old batches
const cleanUpOldBatches = async () => {
  try {
    const oldBatches = await getOldestActiveBatches();

    for (const batch of oldBatches) {
      try {
        const batchIdToDelete = batch.batch_id;
        await deactivateBatch(batchIdToDelete);
        console.log(`Batch ${batchIdToDelete} deactivated and data deleted.`);
      } catch (err) {
        console.error(`Failed to deactivate batch ${batch.batch_id}:`, err.message);
      }
    }
  } catch (error) {
    console.error("Error cleaning up old batches:", error.message);
  }
};


const processBatches = async (batches) => {
  const batchInsertPromises = batches.map(async (batch) => {
    const { batch_id, forecast_time } = batch;
    console.log(`Inserting batch: ${batch_id} with forecast time: ${forecast_time}`);
    await storeBatch(batch_id, forecast_time);
  });

  await Promise.all(batchInsertPromises);
};

const fetchAndProcessWeatherData = async (batches) => {
  const weatherDataFetchPromises = batches.map(async (batch) => {
    const { batch_id, forecast_time } = batch;
    try {
      const runningBatch = await getRunningBatch(batch_id);

      if (runningBatch.length === 0) {
        console.log(`Batch ${batch_id} already exists. Skipping insert.`);
        return;
      }

      console.log(`Fetching data for batch: ${batch_id} with forecast time: ${forecast_time}`);
      const weatherData = await fetchWeatherData(batch_id, forecast_time);

      console.log(`Fetched data for batch ${batch_id}, total records: ${weatherData.length}`);

      await updateEndIngestTime(batch_id);
      await cleanUpOldBatches();
    } catch (error) {
      console.error(`Error processing batch ${batch_id}:`, error.message);
    }
  });

  await Promise.all(weatherDataFetchPromises);
};


// Main function to ingest weather data for batches
exports.ingestWeatherData = async () => {
  try {
    console.log("Ingestion process started...");

    const batches = await fetchBatches();
    if (!batches || batches.length === 0) {
      console.error("There are no batches to ingest");
      return;
    }

    console.log(`Found ${batches.length} batches`);

    await processBatches(batches);
    await fetchAndProcessWeatherData(batches);

    console.log("Ingestion process completed successfully!");
  } catch (error) {
    console.error("Ingestion process failed:", error.message);
  }
};

