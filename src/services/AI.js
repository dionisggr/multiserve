const WebSocket = require('ws');
const { Configuration, OpenAIApi } = require('openai');

const wss = new WebSocket.Server({ port: 8080 });

class AI {
  constructor(adjustments = {}) {
    const {
      conversation_id,
      openai_api_key,
      temperature = 0.7,
      amount = 1,
      stream = false,
      history = [],
      model = 'gpt-3.5-turbo',
      size = '256x256', // 256, 512, or 1024
    } = adjustments;

    this.conversation_id = conversation_id;
    this.temperature = temperature;
    this.amount = amount;
    this.size = size;
    this.stream = stream;
    this.model = model;
    this.wss = wss;
    this.history = history;
    this.openai_api_key = openai_api_key;
    this.OpenAI = new OpenAIApi(
      new Configuration({
        apiKey: this.openai_api_key,
      })
    );
  }

  async chatgpt(content) {
    const messages = [
      {
        role: 'system',
        content: 'You are a helpful assistant.',
      },
      ...this.history,
      {
        role: 'user',
        content,
      }
    ];

    if (this.stream) {
      return this.streamChatGPTResponse(messages);
    }

    const response = await this.OpenAI.createChatCompletion({
      model: this.model,
      temperature: this.temperature,
      messages,
    });

    return response.data.choices[0].message.content;
  }

  async dalle(prompt) {
    const images = (await this.OpenAI.createImage({
      prompt,
      n: this.amount,
      size: this.size,
    })).data.data[0].url;

    return images;
  }

  async whisper(audio) {
    const response = await this.OpenAI.createTranscription(
      audio, 'whisper-1'
    );

    return response.data.text;
  }

  streamChatGPTResponse(messages) {
    this.wss.on('connection', async (ws) => {
      const response = await this.OpenAI.createChatCompletion(
        {
          model: this.model,
          temperature: this.temperature,
          stream: true,
          messages,
        },
        { responseType: 'stream' }
      );
  
      response.data.on('data', (data) => {
        const lines = data
          .toString()
          .split('\n')
          .filter((line) => line.trim() !== '');
        for (const line of lines) {
          const message = line.replace(/^data: /, '');
  
          if (message.choices[0].finish_reason) {
            ws.close();
  
            return { stream: 'successful' }; // Stream finished
          }
  
          ws.send(JSON.stringify(message.choices[0].text));
        }
      });
    });
  }
}

module.exports = AI;
