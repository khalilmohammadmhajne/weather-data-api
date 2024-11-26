const Bull = require('bull');
require('dotenv').config({ path: '../../../.env' });

const REDIS_HOST = process.env.REDIS_HOST;
const REDIS_PORT = process.env.REDIS_PORT;

const batchQueue = new Bull('batchQueue', {
  redis: { host: REDIS_HOST, port: REDIS_PORT }
});

module.exports = batchQueue;
