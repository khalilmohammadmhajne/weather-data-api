require('dotenv').config();
const axios = require('axios');
const batchQueue = require('./batchQueue'); // Import the queue

const weatherDataUrl = 'https://us-east1-climacell-platform-production.cloudfunctions.net/weather-data/batches';

// Fetch batches from the external API and add them to the queue
const fetchBatchesAndAddToQueue = async () => {
  try {
    const response = await axios.get(weatherDataUrl);
    const batches = response.data;

    if (batches && batches.length > 0) {
      console.log(`Adding to queue ${batches.length} batches ...`);
      batches.forEach(batch => {
        batchQueue.add(batch); // Add batch to the queue
      });
      console.log(`${batches.length} batches was Added to the queue!`);
    } else {
      console.log('No batches found.');
    }
  } catch (error) {
    console.error('Error fetching batches:', error.message);
  }
};

module.exports = fetchBatchesAndAddToQueue;
