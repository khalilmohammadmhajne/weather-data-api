const axios = require('axios');
const batchQueue = require('./queues/batchQueue');
const delay = require('../utils/delay');
require('dotenv').config();

const WEATHER_DATA_URL = process.env.WEATHER_DATA_URL;
const MAX_RETRIES = process.env.MAX_RETRIES;
const RETRY_DELAY = process.env.RETRY_DELAY;

const fetchBatchesAndAddToQueue = async () => {
  for (let retries = 0; retries < MAX_RETRIES; retries++) {
    try {
      const response = await axios.get(WEATHER_DATA_URL);
      const batches = response.data;

      if (batches?.length > 0) {
        console.log(`Adding ${batches.length} batches to the queue.`);
        batches.forEach(batch => batchQueue.add(batch));
        return;
      } else {
        console.log('No batches found.');
        return;
      }
    } catch (error) {
      console.error(`Error fetching batches: ${error.message}`);
      if (retries < MAX_RETRIES - 1) {
        console.log(`Retrying in ${RETRY_DELAY / 1000} seconds...`);
        await delay(RETRY_DELAY);
      } else {
        console.log('Max retries reached. Failed to fetch batches.');
      }
    }
  }
};

module.exports = fetchBatchesAndAddToQueue;
