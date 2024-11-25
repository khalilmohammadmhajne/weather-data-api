const Bull = require('bull');

const batchQueue = new Bull('batchQueue', {
  redis: { host: 'localhost', port: 6379 }  // Connection to Redis
});

module.exports = batchQueue;
