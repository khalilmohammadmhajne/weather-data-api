require("dotenv").config();
const mysql = require("mysql2");

const config = {
  connectionLimit: 4,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

const pool = mysql.createPool(config);

// This function is used to get a new connection from the pool
const connection = () => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject(err);
      } else {
        console.log("MySQL pool connected: threadId " + connection.threadId);
        const query = (sql, bindings = []) => {
          return new Promise((resolve, reject) => {
            connection.query(sql, bindings, (err, result) => {
              if (err) reject(err);
              resolve(result);
            });
          });
        };

        const release = () => {
          return new Promise((resolve) => {
            connection.release();
            console.log("MySQL pool released: threadId " + connection.threadId);
            resolve();
          });
        };

        resolve({ query, release });
      }
    });
  });
};

// General query execution function that can be used across the app
exports.execQuery = async function (query, bindings = []) {
  const conn = await connection();
  try {
    // Start a transaction
    await conn.query("START TRANSACTION");

    // Execute the provided query
    await conn.query(query, bindings);

    // Commit transaction if successful
    await conn.query("COMMIT");
  } catch (err) {
    // Rollback transaction on error
    await conn.query("ROLLBACK");
    console.error("ROLLBACK at query execution:", err);
    throw err; // Rethrow the error after rollback
  } finally {
    // Always release the connection back to the pool
    await conn.release();
  }
};

// Optionally, expose a simpler function for non-transaction queries
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
