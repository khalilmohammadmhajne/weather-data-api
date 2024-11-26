const connection = require('./dbConnection'); // Import the connection logic

// General query execution function that ensures transactional integrity
exports.execQuery = async function (query, bindings = []) {
  const conn = await connection();
  try {
    await conn.query(query, bindings);
  } catch (err) {
    await conn.query("ROLLBACK");
    throw err;
  } finally {
    await conn.release();
  }
};

// Simpler query execution function for non-transactional queries
exports.simpleQuery = async function (query, bindings = []) {
  try {
    const conn = await connection();
    const result = await conn.query(query, bindings);
    await conn.release();
    return result;
  } catch (err) {
    console.error("Error executing query:", err);
    throw err;
  }
};
