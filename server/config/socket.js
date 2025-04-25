const socketService = require('../services/socketService');

module.exports = (server) => {
  const io = require('socket.io')(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  socketService.initialize(io);
};