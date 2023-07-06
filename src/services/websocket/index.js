const WebSocket = require('./setup');

const websocket = {
  chatterai: new WebSocket({ port: 8001 }),
};

module.exports = websocket;
