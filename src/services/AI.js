const fs = require('fs');
const WebSocket = require('ws');
const { Configuration, OpenAIApi } = require('openai');
const { pipeline } = require('stream');
const { promisify } = require('util');
const fetch = require('node-fetch');
const cache = require('./cache');
const { OPENAI_API_KEY, logger } = require('../config');

class AI {
  constructor(adjustments = {}) {
    const {
      conversation_id,
      temperature = 0.7,
      amount = 1,
      size = '256x256', // 256, 512, or 1024
    } = adjustments;

    this.conversation_id = conversation_id;
    this.temperature = temperature;
    this.amount = amount;
    this.size = size;
    this.models = {
      chatgpt: 'gpt-3.5-turbo',
    };
    this.OpenAI = new OpenAIApi(
      new Configuration({
        apiKey: OPENAI_API_KEY,
      })
    );
  }

  async gpt(content, stream = false) {
    if (stream) {
      const wss = new WebSocket.Server({ port: 8080 });

      wss.on('connection', async (ws) => {
        const response = await this.OpenAI.createCompletion(
          {
            model: 'text-davinci-003',
            prompt: content,
            max_tokens: 1500,
            temperature: this.temperature,
            stream: true,
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
    } else {
      const response = (
        await this.OpenAI.createCompletion({
          model: 'text-davinci-003',
          prompt: content,
          max_tokens: 1500,
          temperature: this.temperature,
        })
      ).data.choices[0].text;

      return response;
    }
  }

  async chatgpt(content) {
    const history =
      this.conversation_id in cache.data
        ? cache.data[this.conversation_id].messages
        : [{ role: 'user', content }];

    const messages = [
      {
        role: 'system',
        content: 'You are a helpful assistant.',
      },
      ...history,
    ];

    const response = await this.OpenAI.createChatCompletion(
      {
        model: this.models.chatgpt,
        temperature: this.temperature,
        messages,
        stream: true,
      },
      { responseType: 'stream' }
    );

    return response;
  }

  async chatgpt4(content) {
    const history =
      this.conversation_id in cache.data
        ? cache.data[this.conversation_id].messages
        : [{ role: 'user', content }];

    const messages = [
      {
        role: 'system',
        content: 'You are a helpful assistant.',
      },
      ...history,
    ];

    const response = await this.OpenAI.createChatCompletion(
      {
        model: 'gpt-4',
        temperature: this.temperature,
        messages,
        stream: true,
      },
      { responseType: 'stream' }
    );

    return response;
  }

  async dalle(prompt) {
    const images = (await this.OpenAI.createImage({
      prompt,
      n: this.amount,
      size: this.size,
    })).data.data[0].url;

    return images;
  }

  async whisper({ file, url }) {
    if (file) {
      const transcript = (
        await this.OpenAI.createTranscription(
          fs.createReadStream('whisper/' + file),
          'whisper-1'
        )
      ).data.text;

      return transcript;
    } else {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch file from ${url}: ${response.statusText}`
        );
      }

      const streamPipeline = promisify(pipeline);
      const tempFilePath = `temp/${Date.now()}.file`;

      await streamPipeline(response.body, fs.createWriteStream(tempFilePath));

      const transcript = (
        await this.OpenAI.createTranscription(
          fs.createReadStream(tempFilePath),
          'whisper-1'
        )
      ).data.text;

      fs.unlink(tempFilePath, (err) => {
        if (err) {
          logger.error(err, `Error deleting temporary file ${tempFilePath}:`);
        }
      });

      return transcript;
    }
  }
}

module.exports = AI;
