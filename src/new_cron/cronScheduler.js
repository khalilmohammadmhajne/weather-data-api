const cron = require('node-cron');
const fetchBatchesAndAddToQueue = require('./fetchBatches'); // Import the fetching logic

console.log("Cron starting ...");

// Schedule the fetch batches job to run every minute
cron.schedule('*/1 * * * *', fetchBatchesAndAddToQueue);


