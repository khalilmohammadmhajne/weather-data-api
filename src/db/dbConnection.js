require('dotenv').config();
const mysql = require("mysql2");

const config = {
  connectionLimit: process.env.DB_CONNECTION_LIMIT,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

const pool = mysql.createPool(config);

// Retrieves a new connection from the database connection pool
const connection = () => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject(err);
      } else {
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
            resolve();
          });
        };

        resolve({ query, release });
      }
    });
  });
};

module.exports = connection;
