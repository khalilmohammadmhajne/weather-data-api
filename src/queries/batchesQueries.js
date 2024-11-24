const { execQuery, simpleQuery } = require("../db/dbPool");

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

exports.getRunningBatch = async function (batchId) {
  const query = "SELECT * FROM batches WHERE batch_id = ? and status = 'RUNNING'";
  const bindings = [batchId];
  try {
    const result = await simpleQuery(query, bindings);
    return result;
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
exports.insertIntoBatches = async function (batchId, forecast_time, batchData) {
  const query =
    "INSERT INTO batches (batch_id, forecast_time, number_of_rows, status) VALUES (?, ?, ?, ?)";
  const bindings = [batchId, new Date(forecast_time), batchData?.length || 0, "RUNNING"];
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

exports.updateEndIngestTime = async function (batchId) {
  const query =
    "UPDATE batches SET end_ingest_time = NOW(), status = 'ACTIVE' WHERE batch_id = ?";
  const bindings = [batchId];

  try {
    await execQuery(query, bindings);
  } catch (err) {
    console.error("Error updating end_ingest_time:", err.message);
    throw err;
  }
};
