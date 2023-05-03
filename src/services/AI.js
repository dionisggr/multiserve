const { Configuration, OpenAIApi } = require('openai');
const { OPENAI_API_KEY, logger } = require('../config');
const cache = require('./cache');

class AI {
  constructor(adjustments = {}) {
    const { temperature, conversation_id } = adjustments;

    this.temperature = temperature || 0.7;
    this.conversation_id = conversation_id;
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
}

module.exports = AI;
