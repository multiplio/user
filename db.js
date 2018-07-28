const logger = require('./logger.js');
const mongoose = require('mongoose');

module.exports = function (url, name) {
  const options = {
    reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
    reconnectInterval: 500, // Reconnect every 500ms
    poolSize: 10, // Maintain up to 10 socket connections
    connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    family: 4 // Use IPv4, skip trying IPv6
  };

  const conn = mongoose.createConnection(url, options);

  conn.on('error', function (err) {
    logger.error(err);
    process.exit(0);
  })

  // If the Node process ends, close the Mongoose connection
  process.on('SIGINT', function() {
    conn.close(function () {
      logger.info(`db ${name} disconnected through app termination`);
      process.exit(0);
    });
  });

  logger.info(`created connection to db ${name}`);
  return conn;
};
