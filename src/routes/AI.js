const express = require('express');
const { logger } = require('../config');
const schemas = require('../schemas');
const Service = {
  DB: require('../services/DB'),
  AI: require('../services/AI'),
}

const Router = express.Router();

async function gpt(req, res, next) {
  const { prompt, ...adjustments } = req.body;
  const AI = new Service.AI(adjustments);

  try {
    const response = await AI.gpt(prompt);

    logger.info({ user_id: req.user.id }, 'Text-Davinci-003 prompted.');

    res.json(response);
  } catch (error) {
    next(error);
  }
};

async function chatgpt(req, res, next) {
  const { prompt, app_id, ...adjustments } = req.body;
  const { conversation_id } = adjustments;
  
  try {
    await schemas.apps.validateAsync({ app_id });
    await schemas.conversations.existing.validateAsync({ conversation_id });

    const AI = new Service.AI(adjustments);
    const DB = new Service.DB(app_id);

    DB.conversations.update({
      filters: { id: conversation_id },
      data: { updated_at: new Date() },
    });
    DB.messages.create({
      data: { conversation_id, content: prompt, user_id: req.user.id },
    });

    const response = await AI.chatgpt(prompt);

    logger.info({ user_id: req.user.id }, 'GPT-3.5-Turbo prompted.');

    const data = { conversation_id, content: response, user_id: 'gpt' };
    const message = await DB.messages.create({ data });

    res.json(message);
  } catch (error) {
    next(error);
  }
};

async function chatgpt4(req, res, next) {
  const { prompt, app_id, ...adjustments } = req.body;
  const { conversation_id } = adjustments;
  
  try {
    await schemas.apps.validateAsync({ app_id });
    await schemas.conversations.existing.validateAsync({ conversation_id });

    const AI = new Service.AI(adjustments);
    const DB = new Service.DB(app_id);

    DB.conversations.update({
      filters: { id: conversation_id },
      data: { updated_at: new Date() },
    });
    DB.messages.create({
      data: { conversation_id, content: prompt, user_id: req.user.id },
    });

    const response = await AI.chatgpt4(prompt);

    logger.info({ user_id: req.user.id }, 'GPT-4 prompted.');

    const data = { conversation_id, content: response, user_id: 'gpt' };
    const message = await DB.messages.create({ data });

    res.json(message);
  } catch (error) {
    next(error);
  }
};

Router
  .post('/gpt', gpt)
  .post('/chatgpt', chatgpt)
  .post('/chatgpt4', chatgpt4);
 
module.exports = Router;
