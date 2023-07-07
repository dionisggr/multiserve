const WebSocket = require('ws');
const url = require('url');
const { NODE_ENV } = require('../../config');

class WebSocketManager {
  constructor({ port }) {
    if (!port) {
      throw new Error('Missing port for WebSocketManager.');
    }
    
    this.wss = new WebSocket.Server({ port, handleProtocols: this.handleProtocols.bind(this) });
    this.appClients = new Map();
    this.baseUrl = {
      development: 'http://localhost:3000',
      production: 'https://chatterai-phi.vercel.app',
    }[NODE_ENV];

    this.wss.on('connection', this._handleConnection.bind(this));
  }

  handleProtocols(protocols, request) {
    const parsedUrl = new url.URL(request.url, this.baseUrl);
    const id = parsedUrl.searchParams.get('id');

    return id || null;
  }

  _handleConnection(ws, request) {
    const key = request.headers['sec-websocket-protocol']; // id
  
    if (!this.appClients.has(key)) {
      this.appClients.set(key, new Set());
    }
    
    this.appClients.get(key).add(ws);
    
    ws.on('message', (data) => {
      this.sendMessage(JSON.parse(data));
    });

    ws.on('close', () => {
      this.appClients.get(key).delete(ws);
    });
  }

  sendMessage(data) {
    const clients = this.appClients.get(data?.id);
    
    if (!clients) return;

    for (const client of clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    }
  }

  disconnect(id) {
    const clients = this.appClients.get(id);
    
    if (!clients) return;
  
    for (const client of clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.close();
      }
    }
  }
}

module.exports = WebSocketManager;
