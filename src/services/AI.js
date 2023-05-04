const fs = require('fs');
const { Configuration, OpenAIApi } = require('openai');
const { isBrowserRequest } = require('../utils');
const { OPENAI_API_KEY, logger } = require('../config');
const cache = require('./cache');

class AI {
  constructor(adjustments = {}) {
    const {
      conversation_id,
      temperature = 0.7,
      amount = 1,
      size = '256x256',  // 256, 512, or 1024
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
      }),
    );
  }

  async gpt(content) {
    const response = await this.OpenAI.createCompletion({
      model: "text-davinci-003",
      prompt: content,
      max_tokens: 1500,
      temperature: this.temperature,
    });

    return response;
  }

  async chatgpt(content) {
    const history = cache.data[this.conversation_id] || [];
    const messages = [
      {
        role: 'system',
        content: 'You are a helpful assistant.',
      },
      ...history,
      {
        role: 'user',
        content,
      },
    ];

    if (this.conversation_id) {
      cache.upsert(this.conversation_id, messages);

      logger.info(`User message cache for conversation: ${this.conversation_id}`);
    }

    const response = (await this.OpenAI.createChatCompletion({
      model: this.models.chatgpt,
      temperature: this.temperature,
      messages,
    })).data.choices[0].message.content;

    if (this.conversation_id) {
      cache.upsert(
        this.conversation_id,
        [...messages, { role: 'assistant', content: response }]
      );

      logger.info(`${this.model} response cache for conversation: ${this.conversation_id}`);
    }

    return response;
  };

  async chatgpt4(content) {
    this.models.chatgpt = 'gpt-4';

    this.prompt(content);
  }

  async dalle(prompt) {
    const images = await openai.createImage({
      prompt,
      n: this.amount,
      size: this.size,
    }).data.data.map(({ url }) => url);

    return images;
  }

  async whisper({ file, URL }) {
    const target = URL || file;
    let audio_file;
  
    if (URL) {
      try {
        audio_file = await fetchRemoteFile(URL);
      } catch (error) {
        console.error('Error fetching remote file:', error);
        return;
      }
    } else {
      try {
        const directory = 'whisper/';
        const files = await fs.readdir(directory);
        const file = files.find((f) => !f.startsWith('.')); // Ignore hidden files (files starting with a dot)
  
        if (!file) {
          console.error('No files found in the whisper/ directory');
          return;
        }
  
        audio_file = await fs.readFile(path.join(directory, file));
      } catch (error) {
        console.error('Error reading local file:', error);
        return;
      }
    }
  
    const { text: transcript } = await openai.Audio.transcribe("whisper-1", audio_file);

    return transcript;
  }
}

module.exports = AI;
