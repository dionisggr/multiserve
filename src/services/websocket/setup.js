const WebSocket = require('ws');
const url = require('url');
const { NODE_ENV } = require('../../config');

class WebSocketManager {
  constructor({ port }) {
    if (!port) {
      throw new Error('Missing port for WebSocketManager.');
    }
    
    this.wss = new WebSocket.Server({ port, handleProtocols: this.handleProtocols.bind(this) });
    this.appConversationClients = new Map();
    this.baseUrl = {
      development: 'http://localhost:3000',
      production: 'https://chatterai-phi.vercel.app',
    }[NODE_ENV];

    this.wss.on('connection', this._handleConnection.bind(this));
  }

  handleProtocols(protocols, request) {
    const parsedUrl = new url.URL(request.url, this.baseUrl);
    const conversation_id = parsedUrl.searchParams.get('conversation_id');

    return conversation_id || null;
  }

  _handleConnection(ws, request) {
    const key = request.headers['sec-websocket-protocol']; // conversation_id
  
    if (!this.appConversationClients.has(key)) {
      this.appConversationClients.set(key, new Set());
    }
    
    this.appConversationClients.get(key).add(ws);
    
    ws.on('message', (data) => {
      this.sendMessage(JSON.parse(data));
    });
  
    ws.on('close', () => {
      this.appConversationClients.get(key).delete(ws);
    });
  }

  sendMessage(data) {
    const clients = this.appConversationClients.get(data?.conversation_id);
    
    if (!clients) return;
  
    for (const client of clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    }
  }
  
}

module.exports = WebSocketManager;
