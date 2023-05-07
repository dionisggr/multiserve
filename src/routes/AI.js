const express = require('express');
const { logger } = require('../config');
const schemas = require('../schemas');
const Service = {
  DB: require('../services/DB'),
  AI: require('../services/AI'),
}

const Router = express.Router();

async function gpt(req, res, next) {
  const { prompt = req.params.prompt, ...adjustments } = req.body;
  const { shouldStream } = !!req.query.stream;
  const AI = new Service.AI(adjustments);

  try {
    const response = await AI.gpt(prompt, shouldStream);

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

    res.json(message.trim());
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

    res.json(message.trim());
  } catch (error) {
    next(error);
  }
};

async function dalle(req, res, next) {
  const {
    prompt = req.params.prompt || req.body.event?.text,
    ...adjustments
  } = req.body;
  const { amount } = adjustments;
  
  try {
    const AI = new Service.AI(adjustments);
    const images = await AI.dalle(prompt);

    logger.info({ user_id: req.user.id }, 'DALL-E prompted.');

    if (amount && amount > 1) {
      return res.json(images);
    } else {
      return res.json(images[0]);
    }
  } catch (error) {
    next(error);
  }
};

async function whisper(req, res, next) {
  const { file = req.params.file, ...adjustments } = req.body;

  try {
    const AI = new Service.AI(adjustments);
    const transcript = await AI.whisper(file);

    logger.info({ user_id: req.user.id }, 'Whisper prompted.');

    res.json(transcript)
  } catch (error) {
    next(error);
  }
};

Router
  .post('/chatgpt', chatgpt)
  .post('/chatgpt4', chatgpt4)
  .post('/gpt/:prompt?', gpt)
  .post('/dalle/:prompt?', dalle)
  .post('/whisper/:url?', whisper)
 
module.exports = Router;
