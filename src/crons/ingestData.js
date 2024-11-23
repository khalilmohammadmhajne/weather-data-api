require("dotenv").config();
const axios = require("axios");
const {
  getCountBatches,
  insertIntoBatches,
  getOldestActiveBatch,
  getActiveBatchCount,
  deactivateBatch,
  updateEndIngestTime,
} = require("../queries/batchesQueries");
const {
  insertWeatherData,
  deleteWeatherData,
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
const fetchBatchData = async (batchId, maxRetries = 5, retryDelay = 1000) => {
  let page = 1;
  let totalPages = 1;
  let allData = [];
  let retries = 0;

  while (page <= totalPages) { // Adjust this loop if you want to handle multiple pages
    try {
      const response = await axios.get(`${weatherDataUrl}/${batchId}?page=${page}`);
      totalPages = response.data.metadata.total_pages;
      allData = [...allData, ...response.data.data];
      page++; // Move to the next page (if needed)

      retries = 0;
    } catch (error) {
      if (retries >= maxRetries) {
        console.error(`Max retries reached for batch ${batchId}, page ${page}.`, error.message);
        break;
      }

      retries++;
      // Wait for the specified delay before retrying
      await new Promise(resolve => setTimeout(resolve, retryDelay));
    }
  }
  return allData;
};


// Store the batch data in the database
const storeBatchData = async (batchId, forecast_time, batchData) => {
  try {
    const existingBatch = await getCountBatches(batchId);

    if (existingBatch[0]?.["COUNT(*)"] > 0) {
      console.log(`Batch ${batchId} already exists. Skipping insert.`);
    } else {
      await insertIntoBatches(batchId, forecast_time, batchData);
    }

    if (batchData.length > 0) {
      await insertWeatherData(batchId, forecast_time, batchData);
    } else {
      console.log(`No weather data to insert for batch ${batchId}.`);
    }

    await updateEndIngestTime(batchId);

    console.log(`Successfully stored data for batch ${batchId}.`);
  } catch (error) {
    console.error(
      `Error storing batch data for batch ${batchId}:`,
      error.message,
    );
  }
};

// Clean up old batches if more than 3 active batches exist
const cleanUpOldBatches = async () => {
  try {
    const activeBatchCount = await getActiveBatchCount();

    if (activeBatchCount > 3) {
      const oldBatch = await getOldestActiveBatch();
      if (oldBatch) {
        const batchIdToDelete = oldBatch[0].batch_id;
        // await deleteWeatherData(batchIdToDelete);
        await deactivateBatch(batchIdToDelete);

        console.log(`Batch ${batchIdToDelete} deactivated and data deleted.`);
      } else {
        console.log("No active batches to deactivate.");
      }
    } else {
      console.log("Active batch count is 3 or less, no cleanup needed.");
    }
  } catch (error) {
    console.error("Error cleaning up old batches:", error.message);
  }
};

// Main function to ingest weather data for batches
exports.ingestWeatherData = async () => {
  try {
    console.log("Ingestion process started...");

    const batches = await fetchBatches();
    if (!batches){
      console.error("There are no batches to ingest");
    }

    console.log(`Found ${batches?.length} batches`);

    for (let batch of batches) {
      const { batch_id, forecast_time } = batch;
      console.log(
        `Processing batch: ${batch_id} with forecast time: ${forecast_time}`,
      );

      const batchData = await fetchBatchData(batch_id);
      console.log(
        `Fetched data for batch: ${batch_id}, total records: ${batchData?.length}`,
      );
      if (forecast_time) {
        await storeBatchData(batch_id, new Date(forecast_time), batchData);
        console.log(`Batch ${batch_id} ingested successfully`);
      }

      await cleanUpOldBatches(); // Ensure only 3 active batches are maintained
    }

    console.log("Ingestion process completed successfully!");
  } catch (error) {
    console.error("Ingestion process failed:", error.message);
  }
};
