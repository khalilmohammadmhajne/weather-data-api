const { execQuery, simpleQuery } = require("../db/queryExecutor");

// Function to check if a batch exists
exports.getBatch = async function (batchId) {
  const query = "SELECT * FROM batches WHERE batch_id = ?";
  const bindings = [batchId];
  try {
    const result = await simpleQuery(query, bindings);
    return result;
  } catch (err) {
    console.error("Error checking batch existence:", err.message);
    throw err;
  }
};

exports.isBatchRunning = async function (batchId) {
  const query = "SELECT * FROM batches WHERE batch_id = ? and status = 'RUNNING'";
  const bindings = [batchId];
  try {
    const result = await simpleQuery(query, bindings);
    return result.length > 0; // If there are rows, return true, else false
  } catch (err) {
    console.error("Error checking batch existence:", err.message);
    throw err;
  }
};


// Function to check if a batch exists
exports.getAllBatches = async function () {
  const query = "SELECT * FROM batches";
  try {
    const result = await simpleQuery(query);
    return result;
  } catch (err) {
    console.error("Error getting all batches:", err.message);
    throw err;
  }
};

// Function to insert a new batch
exports.insertNewBatchIfNotExists  = async function (batchId, forecast_time) {
  const query =
    "INSERT IGNORE INTO batches (batch_id, forecast_time, number_of_rows, status) VALUES (?, ?, ?, ?)";
  const bindings = [batchId, new Date(forecast_time), 0, "RUNNING"];
  try {
    return await execQuery(query, bindings);
  } catch (err) {
    console.error("Error inserting batch:", err.message);
    throw err;
  }
};

// Function to get the oldest active batch
exports.getOldestActiveBatches = async function () {
  const query =
    "SELECT batch_id FROM batches WHERE status = 'ACTIVE' ORDER BY start_ingest_time desc LIMIT 100 OFFSET 3;";
  try {
    const result = await simpleQuery(query);
    return result;
  } catch (err) {
    console.error("Error fetching oldest active batch:", err.message);
    throw err;
  }
};

// Function to deactivate a batch
exports.deactivateBatch = async function (batchId) {
  const query = "UPDATE batches SET status = 'INACTIVE' WHERE batch_id = ?";
  const bindings = [batchId];
  try {
    return await execQuery(query, bindings);
  } catch (err) {
    console.error("Error deactivating batch:", err.message);
    throw err;
  }
};

// Function to get the count of active batches
exports.getActiveBatchCount = async function () {
  const query = "SELECT COUNT(*) FROM batches WHERE status = 'ACTIVE'";
  try {
    const result = await simpleQuery(query);
    return result[0]["COUNT(*)"]; // Ensure the correct field is returned
  } catch (err) {
    console.error("Error fetching active batch count:", err.message);
    throw err;
  }
};

// Function to get the count of inactive batches
exports.getInactiveBatchCount = async function () {
  const query = "SELECT COUNT(*) FROM batches WHERE status = 'INACTIVE'";
  try {
    const result = await simpleQuery(query);
    return result[0]["COUNT(*)"]; // Ensure the correct field is returned
  } catch (err) {
    console.error("Error fetching inactive batch count:", err.message);
    throw err;
  }
};

exports.updateBatchMetadata = async function (batchId, total_records) {
  const query =
    "UPDATE batches SET number_of_rows = ?, end_ingest_time = NOW(), status = 'ACTIVE' WHERE batch_id = ?";
  const bindings = [total_records,batchId];

  try {
    await execQuery(query, bindings);
  } catch (err) {
    console.error("Error updating batch metadata:", err.message);
    throw err;
  }
};
